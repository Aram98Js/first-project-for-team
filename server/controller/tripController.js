 import Trip from "../models/Trip.js";
import { generateTripPlan } from "../services/aiService.js";

const getUserId = (req) => req.user?.id ?? req.user?._id ?? req.userId;

export const createTrip = async (req, res) => {
 try {
 const { destination, days, budget, travelers, interests, pace } = req.body || {};

 if (!destination || !days) {
 return res.status(400).json({ message: "destination и days обязательны" });
 }

 const userId = getUserId(req);
 if (!userId) {
 return res.status(401).json({ message: "Не удалось определить пользователя из токена" });
 }

 const questionnaire = {
 destination,
 days: Number(days),
 budget,
 travelers: Number(travelers) || 1,
 interests: Array.isArray(interests) ? interests : [],
 pace,
 };

 const plan = await generateTripPlan(questionnaire);
 const trip = await Trip.create({ user: userId, questionnaire, plan });

 res.status(201).json(trip);
 } catch (error) {
 console.error("createTrip error:", error);
 res.status(500).json({ message: "Не удалось создать план", error: error.message });
 }
};

export const getMyTrips = async (req, res) => {
 try {
 const trips = await Trip.find({ user: getUserId(req) }).sort({ createdAt: -1 });
 res.json(trips);
 } catch (error) {
 res.status(500).json({ message: "Ошибка сервера", error: error.message });
 }
};

export const getTripById = async (req, res) => {
 try {
 const trip = await Trip.findOne({ _id: req.params.id, user: getUserId(req) });
 if (!trip) return res.status(404).json({ message: "План не найден" });
 res.json(trip);
 } catch (error) {
 res.status(500).json({ message: "Ошибка сервера", error: error.message });
 }
};