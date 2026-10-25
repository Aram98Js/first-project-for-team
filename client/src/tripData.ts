export type Activity = {
  time: string;
  title: string;
  description: string;
  category?: string;
  cost?: number;
  place?: string;
};
export type Day = { day: number; title: string; summary?: string; activities: Activity[] };
export type Overview = {
  summary?: string;
  bestTime?: string;
  estimatedTotal?: number;
  currency?: string;
  tips?: string[];
  packing?: string[];
  phrases?: { local: string; meaning: string }[];
};
export type SavedQuestionnaire = {
  destination: string;
  days: number;
  startDate?: string;
  adults?: number;
  children?: number;
  budget?: string;
  currency?: string;
  interests?: string[];
};
export type TripSummary = {
  _id: string;
  createdAt: string;
  questionnaire: SavedQuestionnaire;
  overview?: Overview;
};
export type Trip = TripSummary & { plan: Day[] };

export type Budget = "economy" | "medium" | "comfort" | "luxury";
export type Form = {
  country: string;
  city: string;
  days: number;
  startDate: string;
  adults: number;
  children: number;
  budget: Budget;
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

export const API = "http://localhost:5000";

export const DEFAULT_FORM: Form = {
  country: "",
  city: "",
  days: 3,
  startDate: "",
  adults: 2,
  children: 0,
  budget: "medium",
  dailyBudget: "",
  currency: "USD",
  interests: [],
  pace: "normal",
  transport: "public",
  diet: "none",
  dayStart: "normal",
  mustSee: "",
  notes: "",
};

export const BUDGETS: { value: Budget; title: string; hint: string; icon: string }[] = [
  { value: "economy", title: "Эконом", hint: "Уличная еда, бесплатные места", icon: "🪙" },
  { value: "medium", title: "Средний", hint: "Баланс цены и комфорта", icon: "💳" },
  { value: "comfort", title: "Комфорт", hint: "Хорошие рестораны и экскурсии", icon: "✨" },
  { value: "luxury", title: "Премиум", hint: "Лучшее, что есть в городе", icon: "💎" },
];

export const INTERESTS = [
  { label: "Еда и рестораны", icon: "🍽️" },
  { label: "Кофейни", icon: "☕" },
  { label: "Вино и дегустации", icon: "🍷" },
  { label: "Музеи", icon: "🏛️" },
  { label: "История", icon: "🏰" },
  { label: "Архитектура", icon: "🏙️" },
  { label: "Искусство", icon: "🎨" },
  { label: "Шопинг", icon: "🛍️" },
  { label: "Природа", icon: "🌿" },
  { label: "Походы", icon: "🥾" },
  { label: "Пляжи", icon: "🏖️" },
  { label: "Ночная жизнь", icon: "🌙" },
  { label: "Фото-споты", icon: "📸" },
  { label: "Для детей", icon: "🧸" },
  { label: "Спа и отдых", icon: "🧖" },
  { label: "Фестивали и события", icon: "🎭" },
];

export const PACES = [
  { value: "relaxed", label: "Спокойный" },
  { value: "normal", label: "Обычный" },
  { value: "active", label: "Активный" },
];
export const TRANSPORTS = [
  { value: "walk", label: "Пешком" },
  { value: "public", label: "Транспорт" },
  { value: "car", label: "Машина" },
  { value: "taxi", label: "Такси" },
];
export const DAY_STARTS = [
  { value: "early", label: "Рано" },
  { value: "normal", label: "Обычно" },
  { value: "late", label: "Поздно" },
];
export const DIETS = [
  { value: "none", label: "Без ограничений" },
  { value: "vegetarian", label: "Вегетарианская" },
  { value: "vegan", label: "Веганская" },
  { value: "halal", label: "Халяль" },
  { value: "kosher", label: "Кошерная" },
  { value: "glutenfree", label: "Без глютена" },
];
export const CURRENCIES = ["USD", "EUR", "AMD", "RUB", "GEL"];
export const COUNTRIES = [
  "Армения", "Грузия", "Турция", "Италия", "Франция", "Испания", "Германия",
  "Япония", "ОАЭ", "Греция", "Португалия", "Чехия", "Австрия", "Нидерланды",
  "Великобритания", "США", "Таиланд", "Вьетнам", "Египет", "Азербайджан",
  "Казахстан", "Узбекистан", "Россия", "Черногория", "Сербия", "Хорватия",
  "Болгария", "Польша", "Венгрия", "Китай", "Южная Корея", "Индонезия", "Мексика",
];

export const CATEGORY_ICONS: Record<string, string> = {
  food: "🍽️",
  museum: "🏛️",
  shopping: "🛍️",
  nature: "🌿",
  history: "🏰",
  nightlife: "🌙",
  transport: "🚌",
  rest: "😌",
  other: "📍",
};

export const STEP_TITLES = ["Куда и когда", "Компания и бюджет", "Интересы и стиль"];

export const LOADING_MESSAGES = [
  "Изучаем направление…",
  "Подбираем места под твои интересы…",
  "Строим маршрут по дням…",
  "Ищем, где вкусно поесть…",
  "Считаем примерный бюджет…",
  "Шлифуем план…",
];

export async function request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // пустой ответ
  }
  if (!res.ok) {
    const body = data as { message?: string; msg?: string } | null;
    throw Object.assign(new Error(body?.message || body?.msg || "Ошибка запроса"), {
      status: res.status,
    });
  }
  return data as T;
}

export function formatDate(start: string | undefined, offset: number): string {
  if (!start) return "";
  const d = new Date(`${start}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long" });
}

export function money(value: number, currency: string): string {
  return `${Math.round(value).toLocaleString("ru-RU")} ${currency}`;
}

export function planToText(trip: Trip): string {
  const cur = trip.overview?.currency || trip.questionnaire.currency || "";
  const lines: string[] = [`Поездка: ${trip.questionnaire.destination}`, ""];
  trip.plan.forEach((d) => {
    lines.push(`День ${d.day}: ${d.title}`);
    d.activities.forEach((a) => {
      const cost = a.cost ? ` (≈ ${money(a.cost, cur)})` : "";
      lines.push(`  ${a.time} — ${a.title}${cost}`);
    });
    lines.push("");
  });
  return lines.join("\n");
}