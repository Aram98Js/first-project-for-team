
const LABELS = {
  budget: {
    low: "Экономный",
    medium: "Средний",
    high: "Высокий",
    luxury: "Люкс",
  },

  pace: {
    slow: "Спокойный",
    moderate: "Умеренный",
    normal: "Умеренный",
    fast: "Активный",
  },

  transport: {
    walking: "Пешком",
    public: "Общественный транспорт",
    car: "Автомобиль",
    mixed: "Комбинированный",
  },

  diet: {
    none: "Без ограничений",
    vegetarian: "Вегетарианское",
    vegan: "Веганское",
    halal: "Халяль",
  },

  dayStart: {
    early: "Раннее начало около 07:00",
    normal: "Обычное начало около 09:00",
    late: "Позднее начало около 11:00",
  },
};


// ====================================
// 1. VALIDATE QUESTIONNAIRE
// ====================================

function validateQuestionnaire(q) {
  if (!q || typeof q !== "object") {
    throw new Error("Данные поездки отсутствуют");
  }

  const days = Number(q.days);

  if (
    !q.destination ||
    typeof q.destination !== "string" ||
    !q.destination.trim()
  ) {
    throw new Error("Не указано направление поездки");
  }

  if (!Number.isInteger(days) || days < 1 || days > 30) {
    throw new Error("Количество дней должно быть от 1 до 30");
  }

  return {
    ...q,
    destination: q.destination.trim(),
    days,
    adults: Number(q.adults) > 0 ? Number(q.adults) : 1,
    children: Number(q.children) >= 0
      ? Number(q.children)
      : 0,
    currency: q.currency || "USD",
    budget: q.budget || "medium",
    pace: q.pace || "normal",
    transport: q.transport || "public",
    diet: q.diet || "none",
    dayStart: q.dayStart || "normal",
    interests: Array.isArray(q.interests)
      ? q.interests
      : [],
  };
}


// ====================================
// 2. MOCK PLAN
// ====================================

function buildMockPlan(q) {
  const days = Array.from(
    { length: q.days },
    (_, i) => ({
      day: i + 1,

      title: `День ${i + 1}: ${q.destination}`,

      summary:
        "Тестовый план. Добавь GEMINI_API_KEY в .env, чтобы получить настоящий маршрут.",

      activities: [
        {
          time: "09:00",
          title: "Завтрак",
          description: "Местная кухня недалеко от отеля",
          category: "food",
          cost: 10,
          place: "",
        },
        {
          time: "11:00",
          title: "Главные достопримечательности",
          description: `Осмотр центра: ${q.destination}`,
          category: "history",
          cost: 15,
          place: "",
        },
        {
          time: "14:00",
          title: "Обед",
          description: "Ресторан с национальными блюдами",
          category: "food",
          cost: 20,
          place: "",
        },
        {
          time: "16:00",
          title: "Свободное время",
          description:
            q.interests.join(", ") || "Прогулка по городу",
          category: "rest",
          cost: 0,
          place: "",
        },
        {
          time: "19:00",
          title: "Ужин",
          description: "Вечерняя прогулка и ужин",
          category: "food",
          cost: 25,
          place: "",
        },
      ],
    })
  );

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


// ====================================
// 3. BUILD GEMINI PROMPT
// ====================================

function buildPrompt(q) {
  const who =
    `${q.adults} взрослых` +
    (q.children > 0
      ? ` и ${q.children} детей`
      : "");

  const budgetText =
    LABELS.budget[q.budget] || q.budget;

  const budgetLine = q.dailyBudget
    ? `${budgetText}; ориентир ${q.dailyBudget} ${q.currency} в день на всю компанию`
    : budgetText;

  const interests =
    q.interests.join(", ") ||
    "не указаны, предложи разнообразную программу";

  return `
Ты опытный тревел-планировщик.
Составь подробный маршрут поездки.

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
Начало дня: ${LABELS.dayStart[q.dayStart] || "около 09:00"}
Обязательно включить: ${q.mustSee || "нет"}
Пожелания: ${q.notes || "нет"}

Правила:
- Используй только реально существующие и известные места.
- Не выдумывай названия и адреса.
- Группируй места по районам.
- Учитывай количество путешественников.
- Если есть дети, добавь подходящие для них места.
- Если указана дата, учитывай сезон.
- Не утверждай точный прогноз погоды без актуальных данных.
- cost: примерная стоимость на всю компанию в ${q.currency}.
- category: одно из food, museum, shopping, nature, history, nightlife, transport, rest, other.
- estimatedTotal: примерная сумма на всю поездку без авиабилетов и жилья.
- Пиши по-русски.
- Верни только корректный JSON.
- Ровно ${q.days} дней.
- Для каждого дня предложи 4-6 активностей.

Формат JSON:

{
  "overview": {
    "summary": "2-3 предложения о поездке",
    "bestTime": "когда лучше ехать",
    "estimatedTotal": 0,
    "currency": "${q.currency}",
    "tips": ["полезный совет"],
    "packing": ["что взять с собой"],
    "phrases": [
      {
        "local": "фраза на местном языке",
        "meaning": "перевод"
      }
    ]
  },
  "days": [
    {
      "day": 1,
      "title": "название дня",
      "summary": "одно предложение о дне",
      "activities": [
        {
          "time": "09:00",
          "title": "что делаем",
          "description": "подробности",
          "category": "food",
          "cost": 0,
          "place": "название места"
        }
      ]
    }
  ]
}
`;
}


// ====================================
// 4. PARSE GEMINI JSON
// ====================================

function parseJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Gemini вернул пустой ответ");
  }

  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    const start = cleanedText.indexOf("{");
    const end = cleanedText.lastIndexOf("}");

    if (start === -1 || end <= start) {
      throw new Error(
        "AI вернул ответ не в формате JSON"
      );
    }

    return JSON.parse(
      cleanedText.slice(start, end + 1)
    );
  }
}


// ====================================
// 5. ARRAY NORMALIZATION
// ====================================

const list = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => String(item))
        .filter(Boolean)
    : [];


// ====================================
// 6. NORMALIZE GEMINI RESPONSE
// ====================================

function normalize(raw, q) {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI вернул некорректные данные");
  }

  const days = Array.isArray(raw.days)
    ? raw.days
    : [];

  if (!days.length) {
    throw new Error("AI не вернул план по дням");
  }

  if (days.length !== q.days) {
    throw new Error(
      `AI вернул ${days.length} дней вместо ${q.days}`
    );
  }

  const ov = raw.overview || {};

  const categories = new Set([
    "food",
    "museum",
    "shopping",
    "nature",
    "history",
    "nightlife",
    "transport",
    "rest",
    "other",
  ]);

  return {
    overview: {
      summary: String(ov.summary || ""),
      bestTime: String(ov.bestTime || ""),

      estimatedTotal:
        Number.isFinite(Number(ov.estimatedTotal))
          ? Math.max(0, Number(ov.estimatedTotal))
          : 0,

      currency: q.currency,

      tips: list(ov.tips),
      packing: list(ov.packing),

      phrases: (
        Array.isArray(ov.phrases)
          ? ov.phrases
          : []
      )
        .map((p) => ({
          local: String(p?.local || ""),
          meaning: String(p?.meaning || ""),
        }))
        .filter((p) => p.local),
    },

    days: days.map((d, i) => ({
      day: i + 1,

      title: String(
        d?.title || `День ${i + 1}`
      ),

      summary: String(d?.summary || ""),

      activities: (
        Array.isArray(d?.activities)
          ? d.activities
          : []
      ).map((a) => ({
        time: String(a?.time || ""),
        title: String(a?.title || ""),
        description: String(a?.description || ""),

        category: categories.has(a?.category)
          ? a.category
          : "other",

        cost: Number.isFinite(Number(a?.cost))
          ? Math.max(0, Number(a.cost))
          : 0,

        place: String(a?.place || ""),
      })),
    })),
  };
}


// ====================================
// 7. GENERATE TRIP PLAN
// ====================================


export async function generateTripPlan(questionnaire) {
  const q = validateQuestionnaire(questionnaire);

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY отсутствует");
    return buildMockPlan(q);
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
console.log("Gemini model:", model);
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const prompt = buildPrompt(q);

  let response;

  for (let attempt = 0; attempt < 4; attempt++) {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 16384,
        },
      }),
    });

    if (response.ok) {
      break;
    }

    const retryable = [429, 500, 502, 503, 504]
      .includes(response.status);

    if (!retryable || attempt === 3) {
      const errorText = await response.text();

      throw new Error(
        `Gemini error ${response.status}: ${errorText}`
      );
    }

    const delay =
      1000 * 2 ** attempt +
      Math.floor(Math.random() * 500);

    console.log(
      `Gemini ${response.status}: retry ${attempt + 1}/3`
    );

    await new Promise((resolve) =>
      setTimeout(resolve, delay)
    );
  }

  // Read Gemini response
  const data = await response.json();

  const candidate = data.candidates?.[0];

  const text = (candidate?.content?.parts || [])
    .map((part) => part.text || "")
    .join("");

  if (!text) {
    throw new Error(
      `Gemini returned empty response: ${
        candidate?.finishReason || "unknown"
      }`
    );
  }

  // Convert JSON text into an object
  const parsedPlan = parseJson(text);

  // Return normalized trip plan
  return normalize(parsedPlan, q);
}

