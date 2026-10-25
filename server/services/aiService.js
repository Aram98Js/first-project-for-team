const LABELS = {
  budget: {
    economy: "эконом (бесплатные и недорогие места, уличная еда, общественный транспорт)",
    medium: "средний (разумный баланс цены и качества)",
    comfort: "повышенный комфорт (хорошие рестораны, платные экскурсии)",
    luxury: "премиум (лучшие рестораны и места, такси)",
  },
  pace: {
    relaxed: "спокойный: 2-3 активности в день, много свободного времени",
    normal: "обычный: 4-5 активностей в день",
    active: "активный: 6-7 активностей в день, насыщенная программа",
  },
  transport: {
    walk: "пешком",
    public: "общественный транспорт",
    car: "арендованная машина",
    taxi: "такси",
  },
  diet: {
    none: "без ограничений",
    vegetarian: "вегетарианская",
    vegan: "веганская",
    halal: "халяль",
    kosher: "кошерная",
    glutenfree: "без глютена",
  },
  dayStart: {
    early: "ранний подъём, старт в 07:00-08:00",
    normal: "обычный старт около 09:00",
    late: "поздний старт, около 11:00",
  },
};

function buildMockPlan(q) {
  const days = Array.from({ length: q.days }, (_, i) => ({
    day: i + 1,
    title: `День ${i + 1}: ${q.destination}`,
    summary: "Тестовый план. Добавь GEMINI_API_KEY в .env, чтобы получить настоящий маршрут.",
    activities: [
      { time: "09:00", title: "Завтрак", description: "Местная кухня недалеко от отеля", category: "food", cost: 10, place: "" },
      { time: "11:00", title: "Главные достопримечательности", description: `Осмотр центра: ${q.destination}`, category: "history", cost: 15, place: "" },
      { time: "14:00", title: "Обед", description: "Ресторан с национальными блюдами", category: "food", cost: 20, place: "" },
      { time: "16:00", title: "Свободное время", description: (q.interests || []).join(", ") || "Прогулка по городу", category: "rest", cost: 0, place: "" },
      { time: "19:00", title: "Ужин", description: "Вечерняя прогулка и ужин", category: "food", cost: 25, place: "" },
    ],
  }));
  return {
    overview: {
      summary: `Тестовый маршрут по направлению: ${q.destination}.`,
      bestTime: "",
      estimatedTotal: q.days * 70,
      currency: q.currency,
      tips: [],
      packing: [],
      phrases: [],
    },
    days,
  };
}

function buildPrompt(q) {
  const who = `${q.adults} взрослых` + (q.children ? ` и ${q.children} детей` : "");
  const budgetText = LABELS.budget[q.budget] || q.budget;
  const budgetLine = q.dailyBudget
    ? `${budgetText}; ориентир ${q.dailyBudget} ${q.currency} в день на всю компанию`
    : budgetText;
  const interests = (q.interests || []).join(", ") || "не указаны, предложи разнообразную программу";

  return `Ты опытный тревел-планировщик. Составь подробный маршрут поездки.

Направление: ${q.destination}
Длительность: ${q.days} дн.
Дата начала: ${q.startDate || "не указана"}
Путешественники: ${who}
Бюджет: ${budgetLine}
Валюта: ${q.currency}
Интересы: ${interests}
Темп: ${LABELS.pace[q.pace] || "обычный"}
Передвижение: ${LABELS.transport[q.transport] || "общественный транспорт"}
Питание: ${LABELS.diet[q.diet] || "без ограничений"}
Начало дня: ${LABELS.dayStart[q.dayStart] || "обычный старт около 09:00"}
Обязательно включить: ${q.mustSee || "нет"}
Пожелания: ${q.notes || "нет"}

Правила:
- Используй только реально существующие и известные места, не выдумывай названия и адреса.
- Группируй места по районам, чтобы не терять время на дорогу.
- Если есть дети, добавь места, подходящие для детей.
- Если указана дата, учитывай сезон и погоду.
- cost: ориентировочная сумма на всю компанию в ${q.currency}, число; 0, если бесплатно.
- category: одно из food, museum, shopping, nature, history, nightlife, transport, rest, other.
- estimatedTotal: примерная сумма на всю поездку на всю компанию (еда, местный транспорт, билеты, развлечения; без авиабилетов и жилья).
- Пиши по-русски, коротко и конкретно.

Верни ТОЛЬКО JSON такого вида:
{
  "overview": {
    "summary": "2-3 предложения о поездке",
    "bestTime": "когда лучше ехать",
    "estimatedTotal": 0,
    "currency": "${q.currency}",
    "tips": ["полезный совет"],
    "packing": ["что взять с собой"],
    "phrases": [{"local": "фраза на местном языке", "meaning": "перевод"}]
  },
  "days": [
    {
      "day": 1,
      "title": "название дня",
      "summary": "одно предложение о дне",
      "activities": [
        {"time": "09:00", "title": "что делаем", "description": "подробности", "category": "food", "cost": 0, "place": "название места"}
      ]
    }
  ]
}
Ровно ${q.days} дней в массиве days.`;
}

function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new Error("AI вернул ответ не в формате JSON");
  }
  return JSON.parse(text.slice(start, end + 1));
}

const list = (v) => (Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : []);

function normalize(raw, q) {
  const days = Array.isArray(raw.days) ? raw.days : [];
  if (!days.length) throw new Error("AI не вернул план по дням");
  const ov = raw.overview || {};

  return {
    overview: {
      summary: ov.summary || "",
      bestTime: ov.bestTime || "",
      estimatedTotal: Number.isFinite(Number(ov.estimatedTotal)) ? Number(ov.estimatedTotal) : 0,
      currency: ov.currency || q.currency,
      tips: list(ov.tips),
      packing: list(ov.packing),
      phrases: (Array.isArray(ov.phrases) ? ov.phrases : [])
        .map((p) => ({ local: String(p?.local || ""), meaning: String(p?.meaning || "") }))
        .filter((p) => p.local),
    },
    days: days.slice(0, q.days).map((d, i) => ({
      day: Number(d.day) || i + 1,
      title: d.title || `День ${i + 1}`,
      summary: d.summary || "",
      activities: (Array.isArray(d.activities) ? d.activities : []).map((a) => ({
        time: a.time || "",
        title: a.title || "",
        description: a.description || "",
        category: a.category || "other",
        cost: Number.isFinite(Number(a.cost)) ? Number(a.cost) : 0,
        place: a.place || "",
      })),
    })),
  };
}

export async function generateTripPlan(q) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY не задан, возвращаю тестовый план");
    return buildMockPlan(q);
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(q) }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 16384,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("");

  return normalize(parseJson(text), q);
}