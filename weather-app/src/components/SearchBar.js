import React from "react";
import "./SearchBar.css";

function SearchBar({
  query = "",
  onQueryChange,
  placeholder = "Search Location...",
  onSearch
})
{
  const handleChange = (e) =>
  {
    if (onQueryChange)
    {
      onQueryChange(e.target.value);
    }
  };

  const handleKeyDown = (e) =>
  {
    if (e.key === "Enter" && onSearch)
    {
      onSearch();
    }
  };

  const handleSearchClick = () =>
  {
    if (onSearch)
    {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        className="search-bar__input"
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      <button
        className="search-bar__button"
        type="button"
        onClick={handleSearchClick}
        aria-label="Search"
      >
        🔍
      </button>
    </div>
  );
}

export default SearchBar;