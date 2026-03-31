function TempPill({ value = "C", onChange }) {
  return (
    <div className="top-bar__pill">
      <div
        className={`top-bar__pill-opt${value === "C" ? " top-bar__pill-opt--active" : ""}`}
        onClick={() => onChange?.("C")}
      >
        °C
      </div>
      <div
        className={`top-bar__pill-opt${value === "F" ? " top-bar__pill-opt--active" : ""}`}
        onClick={() => onChange?.("F")}
      >
        °F
      </div>
    </div>
  );
}

export default TempPill;
