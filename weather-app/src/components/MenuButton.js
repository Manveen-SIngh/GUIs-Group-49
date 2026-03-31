import menuIcon from "../assets/menu.svg";
import { useSidebar } from "../Sidebar";

function MenuButton() {
  const { open } = useSidebar();

  return (
    <div className="top-bar__menu-btn" onClick={open}>
      <img src={menuIcon} alt="Menu" className="top-bar__menu-icon" />
    </div>
  );
}

export default MenuButton;
