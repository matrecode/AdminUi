"use client";
import React, { useState, useEffect } from "react";
import { BiEdit, BiSave } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import Search from "./Search";
import axios from "axios";
import Pagination from "./Pagination.jsx";

const Table = () => {
  const headings = ["Name", "Email", "Role", "Actions"];
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // to prevent automatic save
  const [tempData, setTempData] = useState(null);
  const isRowSelected = (rowId) => selectedRecords.includes(rowId);
  //   Search functionality
  const filteredRecords = data.filter((record) => {
    const searchRegex = new RegExp(searchQuery, "i");
    return (
      searchRegex.test(record.name) ||
      searchRegex.test(record.email) ||
      searchRegex.test(record.role)
    );
  });

  const handleSearch = (query) => {
    setSearchQuery(query);

    // setCurrentPage(1)
  };

  //   Pagination functionality

  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  var currentUsers = filteredRecords.slice(startIndex, endIndex);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log(currentPage);
  };

  const handlePageChangeFirst = (pageNumber) => {
    setCurrentPage((pageNumber = 1));
  };

  const handlePageChangePrevious = (pageNumber) => {
    if (pageNumber > 1) setCurrentPage(pageNumber - 1);
  };

  const handlePageChangeLast = (pageNumber) => {
    setCurrentPage((pageNumber = totalPages));
  };
  const handlePageChangeNext = (pageNumber) => {
    if (pageNumber < totalPages) {
      setCurrentPage(pageNumber + 1);
    }
  };

  // delete functionality
  const handleCheckboxChange = (recordId) => {
    if (selectedRecords.includes(recordId)) {
      setSelectedRecords(selectedRecords.filter((id) => id !== recordId));
    } else {
      setSelectedRecords([...selectedRecords, recordId]);
    }
  };

  const handleDelete = () => {
    const updatedData = [...data];
    selectedRecords.forEach((recordId) => {
      const index = updatedData.findIndex((record) => record.id === recordId);
      if (index !== -1) {
        updatedData.splice(index, 1);
      }
    });
    setData(updatedData);
    setSelectedRecords([]);
  };

  // delete all funcionality
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allRecordIds = currentUsers.map((record) => record.id);
      setSelectedRecords(allRecordIds);
    } else {
      setSelectedRecords([]);
    }
  };

  // delete manually
  const handleDeleteManually = (recordId) => {
    const recordIndex = data.findIndex((record) => record.id === recordId);
    if (recordIndex !== -1) {
      const updatedData = [...data];
      updatedData.splice(recordIndex, 1);
      setData(updatedData);
    }
  };

  // edit functionality

  const handleEdit = (index) => {
    setTempData(data[index]);
    setEditMode(index);
  };

  const handleInputChange = (index, field, value) => {
    setTempData((prevData) => {
      if (prevData) {
        const updatedData = { ...prevData };
        updatedData[field] = value; // Update the specific field
        return updatedData;
      }
      return null;
    });
  };

  const handleUpdate = (index) => {
    if (tempData) {
      setData((prevData) => {
        const newData = [...prevData];
        newData[index] = tempData;
        return newData;
      });
      setTempData(null);
    }
    setEditMode(null);
  };

  // Getting data from an api using axios
  useEffect(() => {
    document.title = "Admin UI Coding Challenge";
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setData(response.data);
      } catch (error) {
        console.log("Error in fetching data: ", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div>
        {currentPage == 1 ? <Search onSearch={handleSearch} /> : <p></p>}
      </div>
      <div className="relative overflow-x-auto mt-3">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    checked={selectedRecords.length === currentUsers.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </th>
              {headings.map((heading, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                className={
                  isRowSelected(user.id)
                    ? "bg-gray-300"
                    : " bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                }
                key={user.id}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="flex items-center">
                    <input
                      id="link-checkbox"
                      type="checkbox"
                      checked={selectedRecords.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </th>

                <td className="px-6 py-4 text-black">
                  {editMode === index ? (
                    <input
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      value={tempData ? tempData.name : ""}
                      onChange={(e) =>
                        handleInputChange(index, "name", e.target.value)
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="px-6 py-4 text-black ">
                  {editMode === index ? (
                    <input
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      value={tempData ? tempData.email : ""}
                      onChange={(e) =>
                        handleInputChange(index, "email", e.target.value)
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-6 py-4 text-black">
                  {editMode === index ? (
                    <input
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      value={tempData ? tempData.role : ""}
                      onChange={(e) =>
                        handleInputChange(index, "role", e.target.value)
                      }
                    />
                  ) : (
                    user.role
                  )}
                </td>

                <td className="px-6 py-4 flex gap-3">
                  <p>
                    {editMode === index ? (
                      <BiSave
                        onClick={() => handleUpdate(index)}
                        size="18px"
                        style={{ color: "black" }}
                      />
                    ) : (
                      <BiEdit
                        onClick={() => handleEdit(index)}
                        size="18px"
                        style={{ color: "blue" }}
                      />
                    )}
                  </p>
                  <p>
                    <AiOutlineDelete
                      size="18px"
                      onClick={() => handleDeleteManually(user.id)}
                      style={{ color: "red" }}
                    />
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex md:flex-row sm:flex-col sm:gap-3 sm:items-center md:justify-between mt-3">
        <div>
          {selectedRecords.length > 0 && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Delete Selected
              <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                {selectedRecords.length}
              </span>
            </button>
          )}
        </div>
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageChangeFirst={handlePageChangeFirst}
            onPageChangeLast={handlePageChangeLast}
            onPageChangePrevious={handlePageChangePrevious}
            onPageChangeNext={handlePageChangeNext}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
