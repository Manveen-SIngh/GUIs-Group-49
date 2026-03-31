import React from "react";
import "./WeeklyDayCard.css";

function WeeklyDayCard({ data, expanded, onClick, tempUnit = "°C" })
{
  if (expanded)
  {
    return (
      <div
        className="weekly-day-card weekly-day-card--expanded"
        onClick={onClick}
      >
        <div className="weekly-day-card__expanded-top">
          <div className="weekly-day-card__expanded-left">
            <div className="weekly-day-card__date-block weekly-day-card__date-block--expanded">
              <span className="weekly-day-card__day">{data.day}</span>
              <span className="weekly-day-card__date">{data.date}</span>
            </div>

            <img
              src={data.icon}
              alt={data.condition}
              className="weekly-day-card__icon weekly-day-card__icon--expanded"
            />
          </div>

          <div className="weekly-day-card__expanded-right">
            <div className="weekly-day-card__expanded-summary">
              <div className="weekly-day-card__condition weekly-day-card__condition--expanded">
                {data.condition}
              </div>

              <div className="weekly-day-card__temps">
                <span className="weekly-day-card__low">{data.low}{tempUnit} ↓</span>
                <span className="weekly-day-card__high">{data.high}{tempUnit} ↑</span>
              </div>
            </div>

            <div className="weekly-day-card__details">
              <div className="weekly-day-card__labels">
                <div>Humidity</div>
                <div>Rain %</div>
                <div>Wind speed</div>
              </div>

              <div className="weekly-day-card__values">
                <div>{data.humidity}</div>
                <div>{data.rain}</div>
                <div>{data.wind}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="weekly-day-card weekly-day-card--collapsed"
      onClick={onClick}
    >
      <div className="weekly-day-card__main">
        <div className="weekly-day-card__date-block">
          <span className="weekly-day-card__day">{data.day}</span>
          <span className="weekly-day-card__date">{data.date}</span>
        </div>

        <img
          src={data.icon}
          alt={data.condition}
          className="weekly-day-card__icon"
        />

        <div className="weekly-day-card__condition">
          {data.condition}
        </div>

        <div className="weekly-day-card__temps">
          <span className="weekly-day-card__low">{data.low}°C ↓</span>
          <span className="weekly-day-card__high">{data.high}°C ↑</span>
        </div>
      </div>
    </div>
  );
}

export default WeeklyDayCard;