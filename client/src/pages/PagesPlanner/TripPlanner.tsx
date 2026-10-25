import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./TripPlanner.module.scss";

/* ---------- settings ---------- */
const API = "http://localhost:5000";
const PATHS = {
  create: "/api/createTrip", // POST
  list: "/api/getMyTrip", // GET
  one: (id: string) => `/api/getTrip/${id}`, // GET
};
// Фон как на Register: импортируй ту же картинку и вставь сюда,
// например: import bg from "../../assets/santorini.jpg"; const BG_IMAGE = bg;
const BG_IMAGE = "";

/* ---------- helpers ---------- */
const cx = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).map((n) => styles[n as string]).join(" ");

const money = (n: number, cur: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);

const formatDate = (start: string, offset: number) => {
  if (!start) return "";
  const d = new Date(start);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

async function request<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || data.error || "Server error") as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

/* ---------- data ---------- */
const COUNTRIES = ["Armenia", "Georgia", "Turkey", "UAE", "Italy", "Spain", "France", "Greece", "Japan", "Thailand"];
const CURRENCIES = ["USD", "EUR", "RUB", "AMD"];
const DAY_STARTS = ["07:00", "08:00", "09:00", "10:00", "11:00"];
const PACES = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "active", label: "Active" },
];
const TRANSPORTS = [
  { value: "walk", label: "On foot" },
  { value: "public", label: "Public" },
  { value: "car", label: "Car" },
];
const BUDGETS = [
  { value: "economy", icon: "🎒", title: "Economy", hint: "Hostels, street food" },
  { value: "comfort", icon: "🏨", title: "Comfort", hint: "3–4★ hotels, cafés" },
  { value: "premium", icon: "✨", title: "Premium", hint: "5★ hotels, fine dining" },
];
const DIETS = ["No restrictions", "Vegetarian", "Halal", "Gluten-free", "Lactose-free"];
const INTERESTS = ["Museums", "Nature", "Food", "Shopping", "History", "Nightlife", "Beaches", "Mountains", "Photography", "With kids"];
const LOADING_MESSAGES = [
  "Exploring the destination…",
  "Picking places and routes…",
  "Calculating the budget…",
  "Building your day-by-day plan…",
  "Almost ready…",
];
const STEP_TITLES = ["Where & when", "Travelers & budget", "Preferences"];

/* ---------- types ---------- */
type Form = {
  country: string;
  city: string;
  startDate: string;
  days: number;
  adults: number;
  children: number;
  budget: string;
  dailyBudget: string;
  currency: string;
  interests: string[];
  pace: string;
  transport: string;
  diet: string;
  dayStart: string;
  mustSee: string;
  notes: string;
};
type Activity = {
  time?: string;
  title?: string;
  name?: string;
  description?: string;
  place?: string;
  cost?: number;
  icon?: string;
};
type DayPlan = { day: number; title?: string; activities?: Activity[]; items?: Activity[] };
type Overview = {
  summary?: string;
  estimatedTotal?: number;
  bestTime?: string;
  currency?: string;
  tips?: string[];
  packing?: string[];
  phrases?: { local: string; meaning: string }[];
};
type Questionnaire = Partial<Form> & { destination?: string };
type Trip = { _id: string; questionnaire: Questionnaire; overview?: Overview; plan: DayPlan[] };

const DEFAULT_FORM: Form = {
  country: "",
  city: "",
  startDate: "",
  days: 3,
  adults: 2,
  children: 0,
  budget: "comfort",
  dailyBudget: "",
  currency: "USD",
  interests: [],
  pace: "balanced",
  transport: "public",
  diet: DIETS[0],
  dayStart: "09:00",
  mustSee: "",
  notes: "",
};

/* ---------- small components ---------- */
const Stepper = ({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) => (
  <div className={cx("stepper")}>
    <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
    <span>{value}</span>
    <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
  </div>
);

const Segmented = ({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) => (
  <div className={cx("seg")}>
    {options.map((o) => (
      <button key={o.value} type="button" className={cx(value === o.value && "on")} onClick={() => onChange(o.value)}>
        {o.label}
      </button>
    ))}
  </div>
);

const DayView = ({ day, currency }: { day: DayPlan; currency: string }) => {
  const list = day.activities || day.items || [];
  return (
    <div className={cx("card")}>
      <div className={cx("dayHead")}>
        <h3 className={cx("h3")}>Day {day.day}{day.title ? `: ${day.title}` : ""}</h3>
      </div>
      <ul className={cx("timeline")}>
        {list.map((a, i) => (
          <li key={i}>
            <div className={cx("dot")}>{a.icon || "📍"}</div>
            <div className={cx("act")}>
              <div className={cx("actTop")}>
                {a.time && <span className={cx("time")}>{a.time}</span>}
                {!!a.cost && <span className={cx("cost")}>≈ {money(a.cost, currency)}</span>}
              </div>
              <strong>{a.title || a.name}</strong>
              {a.description && <p>{a.description}</p>}
              {a.place && <span className={cx("place")}>📍 {a.place}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Shell = ({ children }: { children: ReactNode }) => (
  <div className={cx("page")} style={{ "--bg": BG_IMAGE ? `url(${BG_IMAGE})` : "none" } as CSSProperties}>
    <header className={cx("nav", "noprint")}>
      <Link to="/" className={cx("logo")}>
        <span className={cx("logoMark")}>✦</span> TripGenius
      </Link>
      <nav className={cx("navLinks")}>
        <Link to="/">Destinations</Link>
        <Link to="/">How It Works</Link>
        <Link to="/">About</Link>
        <Link to="/">Blog</Link>
      </nav>
      <div className={cx("navRight")}>
        <Link to="/login">Sign In</Link>
        <Link to="/trip-planner" className={cx("navCta")}>Plan My Trip →</Link>
      </div>
    </header>
    {children}
  </div>
);

const Field = ({ label, icon, children }: { label: string; icon?: string; children: ReactNode }) => (
  <label className={cx("field")}>
    {label}
    <span className={cx("control", icon && "withIcon")}>
      {icon && <span className={cx("ic")}>{icon}</span>}
      {children}
    </span>
  </label>
);

const HeroText = () => (
  <div className={cx("hero")}>
    <p className={cx("eyebrow")}>Plan with AI</p>
    <h1 className={cx("heroTitle")}>
      Plan Your <span>Perfect Trip</span>
    </h1>
    <p className={cx("heroText")}>
      Answer a few questions and TripGenius builds a day-by-day itinerary with budget, tips and local phrases.
    </p>
    <div className={cx("features")}>
      <div className={cx("feature")}>
        <span className={cx("featureIc")}>⚡</span>
        <div><strong>Personalized Itineraries</strong><small>Trips tailored to your style</small></div>
      </div>
      <div className={cx("feature")}>
        <span className={cx("featureIc")}>💳</span>
        <div><strong>Smart Budget</strong><small>Know the cost before you go</small></div>
      </div>
      <div className={cx("feature")}>
        <span className={cx("featureIc")}>🗺</span>
        <div><strong>Day-by-Day Plan</strong><small>Print it or save as PDF</small></div>
      </div>
    </div>
  </div>
);

/* ---------- main ---------- */
const TripPlanner = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState("");

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const toggleInterest = (label: string) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(label) ? f.interests.filter((i) => i !== label) : [...f.interests, label],
    }));

  const handleError = (e: unknown) => {
    if ((e as { status?: number }).status === 401) {
      localStorage.removeItem("accessToken");
      setToken("");
      setError("Session expired, please sign in again");
      return;
    }
    setError(e instanceof Error ? e.message : "Something went wrong");
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    request<Trip[] | { trips: Trip[] }>(PATHS.list, token)
      .then((d) => {
        if (!cancelled) setTrips(Array.isArray(d) ? d : d.trips || []);
      })
      .catch(() => {
        if (!cancelled) setTrips([]);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 5000);
    return () => clearInterval(id);
  }, [loading]);

  const createTrip = async () => {
    setError("");
    setLoading(true);
    setMsgIdx(0);
    try {
      const created = await request<Trip>(PATHS.create, token, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          country: form.country.trim(),
          city: form.city.trim(),
          dailyBudget: form.dailyBudget ? Number(form.dailyBudget) : null,
          mustSee: form.mustSee.trim(),
          notes: form.notes.trim(),
        }),
      });
      setTrip(created);
      setActiveDay(0);
      setTrips((prev) => [created, ...prev]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const openTrip = async (id: string) => {
    setError("");
    try {
      const full = await request<Trip>(PATHS.one(id), token);
      setTrip(full);
      setActiveDay(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      handleError(e);
    }
  };

  /* ---------- not signed in ---------- */
  if (!token) {
    return (
      <Shell>
        <div className={cx("layout")}>
          <HeroText />
          <div className={cx("panel")}>
            <p className={cx("panelEyebrow")}>Join TripGenius</p>
            <h2 className={cx("title")} style={{ margin: "8px 0 10px" }}>Sign in to plan your trip</h2>
            <p className={cx("sub")} style={{ marginBottom: 18 }}>
              You need an account to create and save itineraries.
            </p>
            {error && <p className={cx("error")}>{error}</p>}
            <Link to="/login" className={cx("btn")} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
              Sign In
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  /* ---------- result ---------- */
  if (trip) {
    const q = trip.questionnaire || {};
    const ov: Overview = trip.overview || {};
    const cur = ov.currency || q.currency || "USD";
    const people = (q.adults || 1) + (q.children || 0);
    const budgetTitle = BUDGETS.find((b) => b.value === q.budget)?.title;
    const plan = trip.plan || [];
    const day = plan[Math.min(activeDay, plan.length - 1)];
    const range = q.startDate && q.days ? `${formatDate(q.startDate, 0)} — ${formatDate(q.startDate, q.days - 1)}` : "";

    return (
      <Shell>
        <div className={cx("wide")}>
          <div className={cx("topbar", "noprint")}>
            <button className={cx("link")} onClick={() => setTrip(null)}>← New plan</button>
            <div className={cx("actions")}>
              <button className={cx("btn", "small", "ghost")} onClick={() => window.print()}>🖨 Print / PDF</button>
            </div>
          </div>

          <div className={cx("resultHero")}>
            <p className={cx("eyebrow")}>Your itinerary</p>
            <h1>{q.destination || [q.city, q.country].filter(Boolean).join(", ")}</h1>
            <div className={cx("chipsRow")}>
              <span className={cx("pill", "light")}>📅 {q.days} days</span>
              <span className={cx("pill", "light")}>👥 {people}{q.children ? ` (kids: ${q.children})` : ""}</span>
              {budgetTitle && <span className={cx("pill", "light")}>💳 {budgetTitle}</span>}
              {range && <span className={cx("pill", "light")}>{range}</span>}
            </div>
          </div>

          {(ov.summary || !!ov.estimatedTotal || ov.bestTime) && (
            <div className={cx("card")}>
              {ov.summary && <p className={cx("lead")}>{ov.summary}</p>}
              <div className={cx("stats")}>
                {!!ov.estimatedTotal && (
                  <div className={cx("stat")}>
                    <span>Estimated budget</span>
                    <strong>≈ {money(ov.estimatedTotal, cur)}</strong>
                  </div>
                )}
                {ov.bestTime && (
                  <div className={cx("stat")}>
                    <span>Best time to go</span>
                    <strong>{ov.bestTime}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {!!ov.tips?.length && (
            <div className={cx("card")}>
              <h3 className={cx("h3")}>💡 Tips</h3>
              <ul className={cx("bullets")}>{ov.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          )}

          {!!ov.packing?.length && (
            <div className={cx("card")}>
              <h3 className={cx("h3")}>🎒 What to pack</h3>
              <div className={cx("chips")}>
                {ov.packing.map((p, i) => <span className={cx("chip", "static")} key={i}>{p}</span>)}
              </div>
            </div>
          )}

          {!!ov.phrases?.length && (
            <div className={cx("card")}>
              <h3 className={cx("h3")}>🗣 Useful phrases</h3>
              <ul className={cx("phrases")}>
                {ov.phrases.map((p, i) => (
                  <li key={i}>
                    <strong>{p.local}</strong>
                    <span className={cx("muted")}>{p.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={cx("tabs", "noprint")}>
            {plan.map((d, i) => (
              <button key={d.day} className={cx(i === activeDay && "on")} onClick={() => setActiveDay(i)}>
                <b>Day {d.day}</b>
                <small>{formatDate(q.startDate || "", d.day - 1) || d.title}</small>
              </button>
            ))}
          </div>

          <div className={cx("noprint")}>{day && <DayView day={day} currency={cur} />}</div>
          <div className={cx("printOnly")}>
            {plan.map((d) => <DayView key={d.day} day={d} currency={cur} />)}
          </div>

          <p className={cx("note", "noprint")}>Prices are approximate. Check current data before you travel.</p>
        </div>
      </Shell>
    );
  }

  /* ---------- questionnaire ---------- */
  const canNext = step !== 0 || form.city.trim().length > 0;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (canNext) setStep(step + 1);
    } else {
      createTrip();
    }
  };

  return (
    <Shell>
      <div className={cx("layout")}>
        <HeroText />

        <div>
          <div className={cx("panel")}>
            <p className={cx("panelEyebrow")}>Trip planner</p>
            <h2 className={cx("title")} style={{ margin: "8px 0 8px" }}>Create Your Itinerary</h2>
            <p className={cx("sub")} style={{ marginBottom: 18 }}>
              Tell us about your trip and our AI will build the plan.
            </p>

            {loading ? (
              <div className={cx("card", "loading")}>
                <div className={cx("spinner")} />
                <h3 className={cx("h3")}>{LOADING_MESSAGES[msgIdx]}</h3>
                <p className={cx("muted")}>Usually takes 20–60 seconds. Please keep this page open.</p>
                <div className={cx("skel")} />
                <div className={cx("skel", "short")} />
                <div className={cx("skel")} />
              </div>
            ) : (
              <form className={cx("card")} onSubmit={onSubmit} style={{ marginBottom: 0 }}>
                <div className={cx("steps")}>
                  {STEP_TITLES.map((t, i) => (
                    <div key={t} className={cx("step", i === step && "on", i < step && "done")}>
                      <span>{i < step ? "✓" : i + 1}</span>
                      <em>{t}</em>
                    </div>
                  ))}
                </div>

                {step === 0 && (
                  <>
                    <div className={cx("grid")}>
                      <Field label="Country" icon="🌍">
                        <input
                          list="tp-countries"
                          placeholder="e.g. Georgia"
                          value={form.country}
                          onChange={(e) => set("country", e.target.value)}
                        />
                        <datalist id="tp-countries">
                          {COUNTRIES.map((c) => <option key={c} value={c} />)}
                        </datalist>
                      </Field>
                      <Field label="City" icon="📍">
                        <input placeholder="e.g. Tbilisi" value={form.city} onChange={(e) => set("city", e.target.value)} />
                      </Field>
                      <Field label="Start date" icon="📅">
                        <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                      </Field>
                      <div className={cx("field")}>
                        Number of days
                        <Stepper value={form.days} min={1} max={14} onChange={(v) => set("days", v)} />
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className={cx("grid")}>
                      <div className={cx("field")}>
                        Adults
                        <Stepper value={form.adults} min={1} max={10} onChange={(v) => set("adults", v)} />
                      </div>
                      <div className={cx("field")}>
                        Children
                        <Stepper value={form.children} min={0} max={10} onChange={(v) => set("children", v)} />
                      </div>
                    </div>

                    <div className={cx("field")}>
                      Budget level
                      <div className={cx("budgets")}>
                        {BUDGETS.map((b) => (
                          <button
                            key={b.value}
                            type="button"
                            className={cx("budget", form.budget === b.value && "on")}
                            onClick={() => set("budget", b.value)}
                          >
                            <span className={cx("budgetIc")}>{b.icon}</span>
                            <strong>{b.title}</strong>
                            <small>{b.hint}</small>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={cx("grid")}>
                      <Field label="Daily budget (optional)" icon="💰">
                        <input type="number" min={0} value={form.dailyBudget} onChange={(e) => set("dailyBudget", e.target.value)} />
                      </Field>
                      <Field label="Currency" icon="💱">
                        <select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </Field>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className={cx("field")}>
                      Interests
                      <div className={cx("chips")}>
                        {INTERESTS.map((i) => (
                          <button
                            key={i}
                            type="button"
                            className={cx("chip", form.interests.includes(i) && "on")}
                            onClick={() => toggleInterest(i)}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={cx("field")}>
                      Pace
                      <Segmented value={form.pace} options={PACES} onChange={(v) => set("pace", v)} />
                    </div>
                    <div className={cx("field")}>
                      Getting around
                      <Segmented value={form.transport} options={TRANSPORTS} onChange={(v) => set("transport", v)} />
                    </div>

                    <div className={cx("grid")}>
                      <Field label="Diet" icon="🍽">
                        <select value={form.diet} onChange={(e) => set("diet", e.target.value)}>
                          {DIETS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </Field>
                      <Field label="Day starts at" icon="⏰">
                        <select value={form.dayStart} onChange={(e) => set("dayStart", e.target.value)}>
                          {DAY_STARTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </Field>
                    </div>

                    <Field label="Must-see places" icon="⭐">
                      <input value={form.mustSee} onChange={(e) => set("mustSee", e.target.value)} />
                    </Field>
                    <label className={cx("field")}>
                      Notes
                      <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                    </label>
                  </>
                )}

                {error && <p className={cx("error")}>{error}</p>}

                <div className={cx("nav2")}>
                  <button type="button" className={cx("btn", "ghost")} disabled={step === 0} onClick={() => setStep(step - 1)}>
                    Back
                  </button>
                  <button type="submit" className={cx("btn")} disabled={!canNext}>
                    {step < 2 ? "Next →" : "Create itinerary ✨"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {!loading && trips.length > 0 && (
            <div className={cx("panel")} style={{ marginTop: 16 }}>
              <h3 className={cx("h3")} style={{ marginBottom: 12 }}>My trips</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {trips.map((t) => (
                  <div key={t._id} className={cx("tripRow")}>
                    <button type="button" className={cx("tripOpen")} onClick={() => openTrip(t._id)}>
                      <strong>{t.questionnaire?.destination || t.questionnaire?.city || "Trip"}</strong>
                      <span className={cx("muted")}>{t.questionnaire?.days} days</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default TripPlanner;