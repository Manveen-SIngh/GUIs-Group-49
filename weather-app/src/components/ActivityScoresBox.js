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
 * @param {{ activeKey?: string }} props
 * activeKey — the activity key of the current page (highlights that row). Omit on non-activity pages.
 */
/**
 * @param {{ activeKey?: string, scores?: Record<string,number> }} props
 * scores — live scores from the weather API; falls back to defaults when absent.
 */
function ActivityScoresBox({ activeKey, scores }) {
  const navigate = useNavigate();

  return (
    <div className="layer layer--shadow">
      <div className="scores-box" />

      {ACTIVITIES.map((activity, i) => {
        const isActive     = activity.key === activeKey;
        const rowKey       = activity.key;
        const liveScore    = scores?.[rowKey];
        const displayScore = liveScore ?? activity.score;
        const colour       = liveScore ? scoreColor(liveScore) : activity.colour;

        return (
          <React.Fragment key={rowKey}>
            <div
              className={`activity-label activity-label--${rowKey}${isActive ? " activity-label--active" : ""}`}
              onClick={isActive ? undefined : () => navigate(activity.route)}
            >
              {activity.label}
            </div>
            <div
              className={`activity-swatch activity-swatch--${rowKey}${isActive ? " activity-swatch--active" : ""}`}
              style={{ background: colour }}
              onClick={isActive ? undefined : () => navigate(activity.route)}
            />
            <img
              className={`activity-icon activity-icon--${rowKey}${isActive ? " activity-icon--active" : ""}`}
              src={activity.icon}
              alt={activity.label}
              onClick={isActive ? undefined : () => navigate(activity.route)}
            />
            <div
              className={`activity-score activity-score--${rowKey}${isActive ? " activity-score--active" : ""}`}
              onClick={isActive ? undefined : () => navigate(activity.route)}
            >
              {displayScore}/10
            </div>
            <div className={`activity-divider activity-divider--${i + 1}`} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ActivityScoresBox;
