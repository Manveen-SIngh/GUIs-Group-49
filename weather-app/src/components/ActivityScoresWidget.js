// ActivityScoresWidget.js
// Shows a compact list of all four activities with their current weather scores.
// Each row is clickable and navigates to that activity's OdAPage detail view.
// The currently active activity (if any) is highlighted and not clickable.
//
// This widget lives in the top-right of the main weather dashboard.

import React from "react";
import { useNavigate } from "react-router-dom";
// ACTIVITIES contains the metadata (key, label, icon, route, default colour)
// for each activity 
import { ACTIVITIES } from "./ActivityScoresBox";
import { scoreColor } from "../services/weatherApi";
import "./ActivityScoresWidget.css";

// Props:
//   activeKey — key string of the currently selected activity (optional,
//               only set when this widget is rendered inside an OdAPage)
//   scores — object like { cycling: 7, hiking: 5, running: 8, camping: 3 }
//               (null/undefined while weather data is loading)
function ActivityScoresWidget({ activeKey, scores }) {
  const navigate = useNavigate();

  return (
    <div className="activity-scores-widget">
      {ACTIVITIES.map((activity, i) => {
        const isActive = activity.key === activeKey;
        return (
          // React.Fragment renders the row + divider without an extra wrapper div
          <React.Fragment key={activity.key}>
            <div
              className={`activity-scores-widget__row${isActive ? " activity-scores-widget__row--active" : ""}`}
              // Active row is not clickable (you're already on that page)
              onClick={isActive ? undefined : () => navigate(activity.route)}
            >
              {/* Colour: green/orange/red based on score, or the activity's
                  default colour if scores haven't loaded yet */}
              <div
                className="activity-scores-widget__swatch"
                style={{ background: scores?.[activity.key] ? scoreColor(scores[activity.key]) : activity.colour }}
              />

              {/* Activity icon */}
              <img
                className="activity-scores-widget__icon"
                src={activity.icon}
                alt={activity.label}
              />

              {/* Activity name label */}
              <span className="activity-scores-widget__label">{activity.label}</span>

              {/* Numeric score out of 10; falls back to the static default score
                  from the ACTIVITIES config if real data isn't available yet */}
              <span className="activity-scores-widget__score">{(scores?.[activity.key] ?? activity.score)}/10</span>
            </div>

            {/* Divider line between rows, but not after the last one */}
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
