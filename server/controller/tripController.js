import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import { generateTripPlan } from "../services/aiService.js";

const getUserId = (req) => req.user?.id ?? req.user?._id ?? req.userId;

const clampInt = (v, min, max, fallback) => {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};
const text = (v, max = 500) => String(v ?? "").trim().slice(0, max);
const pick = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);


export const createTrip = async (req, res) => {
  try {
    const b = req.body || {};

    const country = text(b.country, 80);
    const city = text(b.city, 80);

    const destination =
      [city, country].filter(Boolean).join(", ") ||
      text(b.destination, 160);

    if (!destination) {
      return res.status(400).json({
        message: "Укажи город или страну",
      });
    }

    const days = clampInt(b.days, 1, 14, 0);

    if (!days) {
      return res.status(400).json({
        message: "Укажи количество дней от 1 до 14",
      });
    }

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Не удалось определить пользователя из токена",
      });
    }

    const adults = clampInt(
      b.adults ?? b.travelers, 1, 20, 1
    );

    const children = clampInt(b.children, 0, 20, 0);

    const dailyBudget =
      Number(b.dailyBudget) > 0
        ? Math.round(Number(b.dailyBudget))
        : undefined;

    const questionnaire = {
      destination,
      country,
      city,
      days,
      startDate: /^\d{4}-\d{2}-\d{2}$/.test(b.startDate)
        ? b.startDate
        : "",
      adults,
      children,
      travelers: adults + children,
      budget: pick(
        b.budget,
        ["economy", "medium", "comfort", "luxury"],
        "medium"
      ),
      dailyBudget,
      currency: pick(
        b.currency,
        ["USD", "EUR", "AMD", "RUB", "GEL"],
        "USD"
      ),
      interests: Array.isArray(b.interests)
        ? b.interests
            .map((i) => text(i, 40))
            .filter(Boolean)
            .slice(0, 20)
        : [],
      pace: pick(
        b.pace,
        ["relaxed", "normal", "active"],
        "normal"
      ),
      transport: pick(
        b.transport,
        ["walk", "public", "car", "taxi"],
        "public"
      ),
      diet: pick(
        b.diet,
        [
          "none",
          "vegetarian",
          "vegan",
          "halal",
          "kosher",
          "glutenfree",
        ],
        "none"
      ),
      dayStart: pick(
        b.dayStart,
        ["early", "normal", "late"],
        "normal"
      ),
      mustSee: text(b.mustSee),
      notes: text(b.notes),
    };

    console.log("1. Questionnaire:", questionnaire);

    let generatedPlan;

    try {
      console.log("2. Sending request to Gemini...");

      generatedPlan = await generateTripPlan(questionnaire);

      console.log("3. Gemini response received");
    } catch (error) {
      console.error("GEMINI ERROR:", error.message);

      const isUnavailable =
        /Gemini error (429|500|502|503|504)/.test(error.message);

      return res.status(isUnavailable ? 503 : 502).json({
        message: "Ошибка генерации маршрута",
        error: isUnavailable
          ? "AI сервис временно недоступен. Попробуйте позже."
          : "Не удалось обработать ответ AI",
      });
    }

    if (
      !generatedPlan?.overview ||
      !Array.isArray(generatedPlan.days)
    ) {
      return res.status(502).json({
        message: "AI вернул некорректный план",
      });
    }

    const { overview, days: plan } = generatedPlan;

    console.log("4. Saving trip to MongoDB...");

    let trip;

    try {
      trip = await Trip.create({
        user: userId,
        questionnaire,
        overview,
        plan,
      });
    } catch (error) {
      console.error("MONGODB ERROR:", error);
      throw error;
    }

    console.log("5. Trip saved:", trip._id);

    return res.status(201).json(trip);
  } catch (error) {
    console.error("createTrip error:", error);

    return res.status(500).json({
      message: "Не удалось создать план",
      error:
        process.env.NODE_ENV === "production"
          ? "Внутренняя ошибка сервера"
          : error.message,
    });
  }
};


export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: getUserId(req) })
      .select("questionnaire createdAt overview.estimatedTotal overview.currency")
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "План не найден" });
    }
    const trip = await Trip.findOne({ _id: req.params.id, user: getUserId(req) });
    if (!trip) return res.status(404).json({ message: "План не найден" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "План не найден" });
    }
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: getUserId(req) });
    if (!trip) return res.status(404).json({ message: "План не найден" });
    res.json({ message: "Удалено" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};