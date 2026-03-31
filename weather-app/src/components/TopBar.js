import MenuButton from "./MenuButton";
import TempPill from "./TempPill";
import DistPill from "./DistPill";
import SearchBar from "./SearchBar";
import Clock from "./Clock";
import "./TopBar.css";

function TopBar({
  query = "",
  onQueryChange,
  onSearch,
  tempUnit = "C",
  onTempToggle,
  distUnit = "km",
  onDistToggle,
}) {
  return (
    <div className="top-bar">
      <MenuButton />
      <TempPill value={tempUnit} onChange={onTempToggle} />
      <DistPill value={distUnit} onChange={onDistToggle} />
      <SearchBar query={query} onQueryChange={onQueryChange} onSearch={onSearch} />
      <Clock />
    </div>
  );
}

export default TopBar;
