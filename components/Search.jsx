"use-client"
import React, {useState} from "react";


const Search = (props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    props.onSearch(event.target.value)
  }
  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search</span>
        {/* <span className="absolute inset-y-0 left-0 flex items-center pl-2">
    <svg className="h-5 w-5 fill-slate-300" viewBox="0 0 20 20"><!-- ... --></svg>
  </span> */}
        <input
          className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          placeholder="Search by name, email or role"
          type="text"
          name="search"
          value={searchQuery}
          onChange={handleSearchChange}
      
        />
      </label>
    </div>
  );
};

export default Search;
