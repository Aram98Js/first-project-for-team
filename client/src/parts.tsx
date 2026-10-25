import type { ReactNode } from "react";
import type { Day } from "./tripData";
import { CATEGORY_ICONS, formatDate, money } from "./tripData";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="tp-page">
      <div className="tp">{children}</div>
    </div>
  );
}

export function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="tp-stepper">
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label="Меньше">
        −
      </button>
      <span>{value}</span>
      <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="Больше">
        +
      </button>
    </div>
  );
}

export function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="tp-seg">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={value === o.value ? "on" : ""}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function DayView({
  day,
  startDate,
  currency,
}: {
  day: Day;
  startDate?: string;
  currency: string;
}) {
  const total = day.activities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const date = formatDate(startDate, day.day - 1);
  return (
    <div className="tp-card tp-day">
      <div className="tp-day-head">
        <div>
          <h3>
            День {day.day}: {day.title}
          </h3>
          {date && <span className="tp-muted">{date}</span>}
        </div>
        {total > 0 && <span className="tp-pill">≈ {money(total, currency)}</span>}
      </div>
      {day.summary && <p className="tp-muted">{day.summary}</p>}
      <ol className="tp-timeline">
        {day.activities.map((a, i) => (
          <li key={i}>
            <div className="tp-dot">{CATEGORY_ICONS[a.category || "other"] || "📍"}</div>
            <div className="tp-act">
              <div className="tp-act-top">
                <span className="tp-time">{a.time}</span>
                {!!a.cost && <span className="tp-cost">{money(a.cost, currency)}</span>}
              </div>
              <strong>{a.title}</strong>
              {a.place && <div className="tp-place">📍 {a.place}</div>}
              <p>{a.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}