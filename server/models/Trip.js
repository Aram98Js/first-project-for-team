import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    time: String,
    title: String,
    description: String,
    category: String,
    cost: Number,
    place: String,
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  { day: Number, title: String, summary: String, activities: [activitySchema] },
  { _id: false }
);

const phraseSchema = new mongoose.Schema(
  { local: String, meaning: String },
  { _id: false }
);

const overviewSchema = new mongoose.Schema(
  {
    summary: String,
    bestTime: String,
    estimatedTotal: Number,
    currency: String,
    tips: [String],
    packing: [String],
    phrases: [phraseSchema],
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionnaire: {
      destination: { type: String, required: true },
      country: String,
      city: String,
      days: { type: Number, required: true, min: 1, max: 14 },
      startDate: String,
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      travelers: { type: Number, default: 1 },
      budget: { type: String, default: "medium" },
      dailyBudget: Number,
      currency: { type: String, default: "USD" },
      interests: [String],
      pace: String,
      transport: String,
      diet: String,
      dayStart: String,
      mustSee: String,
      notes: String,
    },
    overview: overviewSchema,
    plan: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);