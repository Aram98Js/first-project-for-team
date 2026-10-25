import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./TripPlanner.css";
import {
  BUDGETS,
  COUNTRIES,
  CURRENCIES,
  DAY_STARTS,
  DEFAULT_FORM,
  DIETS,
  INTERESTS,
  LOADING_MESSAGES,
  PACES,
  STEP_TITLES,
  TRANSPORTS,
  formatDate,
  money,
  planToText,
  request,
} from "./tripData";
import type { Form, Overview, Trip, TripSummary } from "./tripData";
import { DayView, Segmented, Shell, Stepper } from "./parts";

export default function TripPlanner() {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [auth, setAuth] = useState({ email: "", password: "" });
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleInterest = (label: string) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(label)
        ? f.interests.filter((i) => i !== label)
        : [...f.interests, label],
    }));

  const logout = (message = "") => {
    localStorage.removeItem("accessToken");
    setToken("");
    setTrip(null);
    setTrips([]);
    setStep(0);
    setError(message);
  };

  const handleError = (e: unknown) => {
    if ((e as { status?: number }).status === 401) {
      logout("Сессия истекла, войди заново");
      return;
    }
    setError(e instanceof Error ? e.message : "Что-то пошло не так");
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    request<TripSummary[]>("/api/trip", token)
      .then((list) => {
        if (!cancelled) setTrips(list);
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

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await request<{ accessToken?: string }>("/api/login", "", {
        method: "POST",
        body: JSON.stringify(auth),
      });
      if (!data.accessToken) throw new Error("no token");
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
    } catch {
      setError("Неверный email или пароль");
    }
  };

  const createTrip = async () => {
    setError("");
    setLoading(true);
    setMsgIdx(0);
    try {
      const created = await request<Trip>("/api/trip", token, {
        method: "POST",
        body: JSON.stringify({
          country: form.country.trim(),
          city: form.city.trim(),
          days: form.days,
          startDate: form.startDate,
          adults: form.adults,
          children: form.children,
          budget: form.budget,
          dailyBudget: form.dailyBudget ? Number(form.dailyBudget) : null,
          currency: form.currency,
          interests: form.interests,
          pace: form.pace,
          transport: form.transport,
          diet: form.diet,
          dayStart: form.dayStart,
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
      const full = await request<Trip>(`/api/trip/${id}`, token);
      setTrip(full);
      setActiveDay(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      handleError(e);
    }
  };

  const removeTrip = async (id: string) => {
    if (!window.confirm("Удалить эту поездку?")) return;
    try {
      await request<unknown>(`/api/trip/${id}`, token, { method: "DELETE" });
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      handleError(e);
    }
  };

  const copyPlan = (t: Trip) => {
    navigator.clipboard.writeText(planToText(t)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ---------- Вход ---------- */
  if (!token) {
    return (
      <Shell>
        <div className="tp-hero">
          <h1>✈️ Планировщик поездок</h1>
          <p>Войди, чтобы составить свой маршрут</p>
        </div>
        <form className="tp-card" onSubmit={login}>
          <label className="tp-field">
            <span>Email</span>
            <input
              type="email"
              value={auth.email}
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
            />
          </label>
          <label className="tp-field">
            <span>Пароль</span>
            <input
              type="password"
              value={auth.password}
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            />
          </label>
          {error && <p className="tp-error">{error}</p>}
          <button className="tp-btn" type="submit">
            Войти
          </button>
        </form>
      </Shell>
    );
  }

  /* ---------- Результат ---------- */
  if (trip) {
    const q = trip.questionnaire;
    const ov: Overview = trip.overview || {};
    const cur = ov.currency || q.currency || "USD";
    const people = (q.adults || 1) + (q.children || 0);
    const budgetTitle = BUDGETS.find((b) => b.value === q.budget)?.title;
    const range = q.startDate
      ? `${formatDate(q.startDate, 0)} — ${formatDate(q.startDate, q.days - 1)}`
      : "";
    const tips = ov.tips || [];
    const packing = ov.packing || [];
    const phrases = ov.phrases || [];
    const day = trip.plan[Math.min(activeDay, trip.plan.length - 1)];

    return (
      <Shell>
        <div className="tp-topbar tp-noprint">
          <button className="tp-link" onClick={() => setTrip(null)}>
            ← Новый план
          </button>
          <div className="tp-actions">
            <button className="tp-btn small ghost" onClick={() => copyPlan(trip)}>
              {copied ? "✓ Скопировано" : "📋 Копировать"}
            </button>
            <button className="tp-btn small ghost" onClick={() => window.print()}>
              🖨 Печать / PDF
            </button>
          </div>
        </div>

        <div className="tp-hero">
          <h1>{q.destination}</h1>
          <div className="tp-chips-row">
            <span className="tp-pill light">📅 {q.days} дн.</span>
            <span className="tp-pill light">
              👥 {people}
              {q.children ? ` (детей: ${q.children})` : ""}
            </span>
            {budgetTitle && <span className="tp-pill light">💳 {budgetTitle}</span>}
            {range && <span className="tp-pill light">{range}</span>}
          </div>
        </div>

        {(ov.summary || !!ov.estimatedTotal || ov.bestTime) && (
          <div className="tp-card">
            {ov.summary && <p className="tp-lead">{ov.summary}</p>}
            <div className="tp-stats">
              {!!ov.estimatedTotal && (
                <div className="tp-stat">
                  <span>Ориентировочный бюджет</span>
                  <strong>≈ {money(ov.estimatedTotal, cur)}</strong>
                </div>
              )}
              {ov.bestTime && (
                <div className="tp-stat">
                  <span>Лучшее время</span>
                  <strong>{ov.bestTime}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {tips.length > 0 && (
          <div className="tp-card">
            <h3>💡 Советы</h3>
            <ul className="tp-bullets">
              {tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {packing.length > 0 && (
          <div className="tp-card">
            <h3>🎒 Что взять с собой</h3>
            <div className="tp-chips">
              {packing.map((p, i) => (
                <span className="tp-chip static" key={i}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {phrases.length > 0 && (
          <div className="tp-card">
            <h3>🗣 Полезные фразы</h3>
            <ul className="tp-phrases">
              {phrases.map((p, i) => (
                <li key={i}>
                  <strong>{p.local}</strong>
                  <span className="tp-muted">{p.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="tp-tabs tp-noprint">
          {trip.plan.map((d, i) => (
            <button
              key={d.day}
              className={i === activeDay ? "on" : ""}
              onClick={() => setActiveDay(i)}
            >
              <b>День {d.day}</b>
              <small>{formatDate(q.startDate, d.day - 1) || d.title}</small>
            </button>
          ))}
        </div>

        <div className="tp-noprint">
          {day && <DayView day={day} startDate={q.startDate} currency={cur} />}
        </div>

        <div className="tp-print-only">
          {trip.plan.map((d) => (
            <DayView key={d.day} day={d} startDate={q.startDate} currency={cur} />
          ))}
        </div>

        <p className="tp-muted tp-noprint">
          Цены ориентировочные, перед поездкой проверь актуальные данные.
        </p>
      </Shell>
    );
  }

  /* ---------- Анкета ---------- */
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
      <div className="tp-hero">
        <h1>✈️ Планировщик поездок</h1>
        <p>Ответь на несколько вопросов, и ИИ составит маршрут по дням</p>
        <button className="tp-link" onClick={() => logout()}>
          Выйти
        </button>
      </div>

      {loading ? (
        <div className="tp-card tp-loading">
          <div className="tp-spinner" />
          <h2>{LOADING_MESSAGES[msgIdx]}</h2>
          <p className="tp-muted">Обычно это занимает 20–60 секунд. Не закрывай страницу.</p>
          <div className="tp-skel" />
          <div className="tp-skel short" />
          <div className="tp-skel" />
        </div>
      ) : (
        <form className="tp-card" onSubmit={onSubmit}>
          <div className="tp-steps">
            {STEP_TITLES.map((t, i) => (
              <div
                key={t}
                className={`tp-step ${i === step ? "on" : ""} ${i < step ? "done" : ""}`}
              >
                <span>{i < step ? "✓" : i + 1}</span>
                <em>{t}</em>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="tp-grid">
              <label className="tp-field">
                <span>Страна</span>
                <input
                  list="tp-countries"
                  placeholder="Например, Грузия"
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                />
                <datalist id="tp-countries">
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <label className="tp-field">
                <span>Город *</span>
                <input
                  placeholder="Например, Тбилиси"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </label>
              <div className="tp-field">
                <span>Сколько дней</span>
                <Stepper value={form.days} min={1} max={14} onChange={(n) => set("days", n)} />
              </div>
              <label className="tp-field">
                <span>Дата начала (необязательно)</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="tp-grid">
                <div className="tp-field">
                  <span>Взрослых</span>
                  <Stepper
                    value={form.adults}
                    min={1}
                    max={20}
                    onChange={(n) => set("adults", n)}
                  />
                </div>
                <div className="tp-field">
                  <span>Детей</span>
                  <Stepper
                    value={form.children}
                    min={0}
                    max={20}
                    onChange={(n) => set("children", n)}
                  />
                </div>
              </div>
              <div className="tp-field">
                <span>Бюджет</span>
                <div className="tp-budgets">
                  {BUDGETS.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      className={`tp-budget ${form.budget === b.value ? "on" : ""}`}
                      onClick={() => set("budget", b.value)}
                    >
                      <span className="ic">{b.icon}</span>
                      <strong>{b.title}</strong>
                      <small>{b.hint}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="tp-grid">
                <label className="tp-field">
                  <span>Бюджет в день на всех (необязательно)</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="например, 150"
                    value={form.dailyBudget}
                    onChange={(e) => set("dailyBudget", e.target.value)}
                  />
                </label>
                <label className="tp-field">
                  <span>Валюта</span>
                  <select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                    {CURRENCIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="tp-field">
                <span>Что вас интересует</span>
                <div className="tp-chips">
                  {INTERESTS.map((i) => (
                    <button
                      key={i.label}
                      type="button"
                      className={`tp-chip ${form.interests.includes(i.label) ? "on" : ""}`}
                      onClick={() => toggleInterest(i.label)}
                    >
                      {i.icon} {i.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="tp-field">
                <span>Темп</span>
                <Segmented value={form.pace} options={PACES} onChange={(v) => set("pace", v)} />
              </div>
              <div className="tp-field">
                <span>Как передвигаться</span>
                <Segmented
                  value={form.transport}
                  options={TRANSPORTS}
                  onChange={(v) => set("transport", v)}
                />
              </div>
              <div className="tp-field">
                <span>Начало дня</span>
                <Segmented
                  value={form.dayStart}
                  options={DAY_STARTS}
                  onChange={(v) => set("dayStart", v)}
                />
              </div>
              <label className="tp-field">
                <span>Питание</span>
                <select value={form.diet} onChange={(e) => set("diet", e.target.value)}>
                  {DIETS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="tp-field">
                <span>Что обязательно посмотреть</span>
                <input
                  placeholder="например, Нарикала, серные бани"
                  value={form.mustSee}
                  onChange={(e) => set("mustSee", e.target.value)}
                />
              </label>
              <label className="tp-field">
                <span>Другие пожелания</span>
                <textarea
                  placeholder="Например: едем с коляской, не любим толпы"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </label>
            </>
          )}

          {error && <p className="tp-error">{error}</p>}

          <div className="tp-nav">
            {step > 0 ? (
              <button type="button" className="tp-btn ghost" onClick={() => setStep(step - 1)}>
                ← Назад
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <button type="submit" className="tp-btn" disabled={!canNext}>
                Дальше →
              </button>
            ) : (
              <button type="submit" className="tp-btn">
                ✨ Составить план
              </button>
            )}
          </div>
        </form>
      )}

      {!loading && step === 0 && trips.length > 0 && (
        <div className="tp-card">
          <h2>Мои поездки</h2>
          {trips.map((t) => (
            <div className="tp-trip-row" key={t._id}>
              <button type="button" className="tp-trip-open" onClick={() => openTrip(t._id)}>
                <strong>{t.questionnaire.destination}</strong>
                <span className="tp-muted">
                  {t.questionnaire.days} дн. · {new Date(t.createdAt).toLocaleDateString("ru-RU")}
                  {t.overview?.estimatedTotal
                    ? ` · ≈ ${money(t.overview.estimatedTotal, t.overview.currency || t.questionnaire.currency || "USD")}`
                    : ""}
                </span>
              </button>
              <button
                type="button"
                className="tp-icon-btn"
                onClick={() => removeTrip(t._id)}
                aria-label="Удалить"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}