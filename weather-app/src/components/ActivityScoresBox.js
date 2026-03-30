import React from "react";
import { useNavigate } from "react-router-dom";

import hikingIcon  from "../assets/Activity-icons/hiking.svg";
import runningIcon from "../assets/Activity-icons/running.svg";
import cyclingIcon from "../assets/Activity-icons/cycling.svg";
import campingIcon from "../assets/Activity-icons/camping.svg";

export const ACTIVITIES = [
  { key: "cycling", label: "Cycling", icon: cyclingIcon, score: 6, colour: "#FFAB1C", route: "/OdACycling" },
  { key: "hiking",  label: "Hiking",  icon: hikingIcon,  score: 9, colour: "#3BC50F", route: "/OdAHiking"  },
  { key: "camping", label: "Camping", icon: campingIcon, score: 5, colour: "#FFAB1C", route: "/OdACamping" },
  { key: "running", label: "Running", icon: runningIcon, score: 8, colour: "#3BC50F", route: "/OdARunning" },
];

function ActivityScoresBox({ activeKey }) {
  const navigate = useNavigate();

  return (
    <div className="oda-card oda-scores-card">
      {ACTIVITIES.map((activity, i) => {
        const isActive = activity.key === activeKey;
        return (
          <React.Fragment key={activity.key}>
            <div
              className={`oda-activity-row${isActive ? " active" : ""}`}
              onClick={isActive ? undefined : () => navigate(activity.route)}
            >
              <div className="oda-activity-swatch" style={{ background: activity.colour }} />
              <span className="oda-activity-label">{activity.label}</span>
              <img src={activity.icon} alt={activity.label} className="oda-activity-icon" />
              <span className="oda-activity-score">{activity.score}/10</span>
            </div>
            {i < ACTIVITIES.length - 1 && <div className="oda-activity-divider" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ActivityScoresBox;
