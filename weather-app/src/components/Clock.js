import React, { useState, useEffect } from "react";
import "./Clock.css";

function Clock()
{
  const [time, setTime] = useState("");

  useEffect(() =>
  {
    const updateTime = () =>
    {
      const now = new Date();

      const formatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      setTime(formatted);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock">
      {time}
    </div>
  );
}

export default Clock;
