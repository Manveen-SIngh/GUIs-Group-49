import React from "react";
import { useNavigate } from "react-router-dom";
import { ACTIVITIES } from "./ActivityScoresBox";
import "./ActivityScoresWidget.css";

function ActivityScoresWidget({ activeKey }) {
  const navigate = useNavigate();

  return (
    <div className="activity-scores-widget">
      {ACTIVITIES.map((activity, i) => {
        const isActive = activity.key === activeKey;
        return (
          <React.Fragment key={activity.key}>
            <div
              className={`activity-scores-widget__row${isActive ? " activity-scores-widget__row--active" : ""}`}
              onClick={isActive ? undefined : () => navigate(activity.route)}
            >
              <div
                className="activity-scores-widget__swatch"
                style={{ background: activity.colour }}
              />
              <img
                className="activity-scores-widget__icon"
                src={activity.icon}
                alt={activity.label}
              />
              <span className="activity-scores-widget__label">{activity.label}</span>
              <span className="activity-scores-widget__score">{activity.score}/10</span>
            </div>
            {i < ACTIVITIES.length - 1 && (
              <div className="activity-scores-widget__divider" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ActivityScoresWidget;
