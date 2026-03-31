import React from "react";
import { useNavigate } from "react-router-dom";
import { scoreColor } from "../services/weatherApi";

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

/**
 * @param {{ activeKey?: string, scores?: Record<string,number> }} props
 */
function ActivityScoresBox({ activeKey, scores }) {
  const navigate = useNavigate();

  return (
    <div className="scores-box">
      {ACTIVITIES.map((activity, i) => {
        const isActive     = activity.key === activeKey;
        const liveScore    = scores?.[activity.key];
        const displayScore = liveScore ?? activity.score;
        const colour       = liveScore ? scoreColor(liveScore) : activity.colour;

        return (
          <React.Fragment key={activity.key}>
            <div
              className={`activity-row${isActive ? " activity-row--active" : ""}`}
              onClick={isActive ? undefined : () => navigate(activity.route)}
            >
              <div className="activity-swatch" style={{ background: colour }} />
              <span className="activity-label">{activity.label}</span>
              <img className="activity-icon" src={activity.icon} alt={activity.label} />
              <span className="activity-score">{displayScore}/10</span>
            </div>
            {i < ACTIVITIES.length - 1 && <div className="activity-divider" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ActivityScoresBox;
