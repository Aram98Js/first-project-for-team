import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  { time: String, title: String, description: String },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  { day: Number, title: String, activities: [activitySchema] },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionnaire: {
      destination: { type: String, required: true },
      days: { type: Number, required: true, min: 1, max: 14 },
      budget: { type: String, default: "medium" },
      travelers: { type: Number, default: 1 },
      interests: [String],
      pace: { type: String, default: "normal" },
    },
    plan: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);