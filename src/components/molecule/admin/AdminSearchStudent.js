import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//API service
import authService from "./../../../api/authService";
//React search autocomplete
import { ReactSearchAutocomplete } from "react-search-autocomplete";
//utils
import { notify } from "./../../../utils/Notification";

function AdminSearchStudent() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  //Search all users to be admitted
  const handleSearch = async (query) => {
    if (query.length < 1) return ""; // Prevent search for empty
    try {
      const response =
        await authService.getSearchAdmittedCurrentStudents(query);
      if (response.status === 201) {
        const results = response.result.map((item) => ({
          id: item.id,
          name: item.firstname + " " + item.surname,
        }));
        setItems(results);
      } else {
        notify(
          "error",
          "Error",
          response.message || "An unexpected error occurred"
        );
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  const handleOnSelect = (item) => {
    navigate(`/admin/registered-user-info/${item.id}`);
    // Handle what happens when an item is selected (e.g., redirect to a page)
  };

  const styling = {
    borderRadius: "5px",
    height: "35px",
    fontFamily: "Roboto",
    searchIconMargin: "0 0 0 4px",
  };

  return (
    <div className="students-search-input-container">
      <ReactSearchAutocomplete
        items={items}
        onSearch={handleSearch}
        onSelect={handleOnSelect}
        placeholder="Search current students"
        className="students-credentials-autosearch"
        styling={styling}
      />
    </div>
  );
}

export default AdminSearchStudent;
