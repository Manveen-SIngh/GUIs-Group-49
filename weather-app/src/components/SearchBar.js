// SearchBar.js
// A controlled search input with a magnifying glass button.
// Supports both clicking the button and pressing Enter to trigger a search.

import React from "react";
import "./SearchBar.css";
import search from "../assets/search.svg"

// Props:
//   query — current text value of the input (controlled by parent)
//   onQueryChange — called with the new string every time the input changes
//   placeholder — grey placeholder text inside the empty input
//   onSearch — called when the user submits (Enter key or button click)
function SearchBar({
  query = "",
  onQueryChange,
  placeholder = "Search Location...",
  onSearch
})
{
  // called on every keystroke; passes the new value up to the parent
  const handleChange = (e) =>
  {
    if (onQueryChange)
    {
      onQueryChange(e.target.value);
    }
  };

  // called on keydown; only triggers a search if the key pressed was Enter
  const handleKeyDown = (e) =>
  {
    if (e.key === "Enter" && onSearch)
    {
      onSearch();
    }
  };

  // Fires when the magnifying glass button is clicked
  const handleSearchClick = () =>
  {
    if (onSearch)
    {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      {/* Controlled text input — value always reflects the parent's query state */}
      <input
        className="search-bar__input"
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {/* Search button with an icon image. aria label makes it accessible
          to screen readers since the button has no visible text */}
      <button
        className="search-bar__button"
        type="button"
        onClick={handleSearchClick}
        aria-label="Search"
      >
      <img
        src={search}
        alt="search"
      />
      </button>
    </div>
  );
}

export default SearchBar;
