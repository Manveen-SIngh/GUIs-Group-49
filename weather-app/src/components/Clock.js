// Clock.js
// A simple live clock component that shows the current local time in HH:MM
// format. It updates every second using setInterval and cleans up after
// itself when unmounted so we don't leave orphaned timers running.

import React, { useState, useEffect } from "react";
import "./Clock.css";

function Clock()
{
  // time holds the formatted time string shown in the UI.
  // We initialise it as an empty string so nothing flickers on first render.
  const [time, setTime] = useState("");

  useEffect(() =>
  {
    // updateTime reads the current time and formats it as "HH:MM" using the
    // browser's locale — this respects 12/24-hour preference automatically.
    const updateTime = () =>
    {
      const now = new Date();

      const formatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
        // Deliberately omitting seconds so the display stays clean
      });

      setTime(formatted);
    };

    // Call immediately so the clock shows a time right away (no 1-second delay)
    updateTime();

    // Then update every 1000ms (1 second) to keep it current
    const interval = setInterval(updateTime, 1000);

    // Cleanup: clear the interval when this component unmounts (e.g. on page change)
    // so we don't keep ticking in the background after the clock is gone
    return () => clearInterval(interval);
  }, []); // empty dependency array — this effect only runs once on mount

  return (
    <div className="clock">
      {time}
    </div>
  );
}

export default Clock;
