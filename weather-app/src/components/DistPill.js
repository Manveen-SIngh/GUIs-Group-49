function DistPill({ value = "km", onChange }) {
  return (
    <div className="top-bar__pill">
      <div
        className={`top-bar__pill-opt${value === "mi" ? " top-bar__pill-opt--active" : ""}`}
        onClick={() => onChange?.("mi")}
      >
        mi
      </div>
      <div
        className={`top-bar__pill-opt${value === "km" ? " top-bar__pill-opt--active" : ""}`}
        onClick={() => onChange?.("km")}
      >
        km
      </div>
    </div>
  );
}

export default DistPill;
