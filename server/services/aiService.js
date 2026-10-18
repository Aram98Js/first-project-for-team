function buildMockPlan(q) {
  return Array.from({ length: q.days }, (_, i) => ({
    day: i + 1,
    title: `День ${i + 1}: ${q.destination}`,
    activities: [
      { time: "09:00", title: "Завтрак", description: "Местная кухня недалеко от отеля" },
      { time: "11:00", title: "Главные достопримечательности", description: `Осмотр центра: ${q.destination}` },
      { time: "14:00", title: "Обед", description: "Ресторан с национальными блюдами" },
      { time: "16:00", title: "Свободное время", description: (q.interests || []).join(", ") || "Прогулка по городу" },
      { time: "19:00", title: "Ужин", description: "Вечерняя прогулка и ужин" },
    ],
  }));
}

export async function generateTripPlan(q) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY не задан, возвращаю тестовый план");
    return buildMockPlan(q);
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const prompt = `Составь план путешествия.
Направление: ${q.destination}
Дней: ${q.days}
Бюджет: ${q.budget}
Путешественников: ${q.travelers}
Интересы: ${(q.interests || []).join(", ") || "не указаны"}
Темп: ${q.pace}

Верни ТОЛЬКО JSON-массив в формате:
[{"day":1,"title":"...","activities":[{"time":"09:00","title":"...","description":"..."}]}]
Ровно ${q.days} дней, 4-6 активностей в день. Пиши по-русски.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
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
    .join("")
    .trim();

  return JSON.parse(text);
}