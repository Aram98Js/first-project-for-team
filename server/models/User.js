import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    country:{
type: String,
default: ""
    },


    phoneNumber: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },

    providerId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    resetPasswordToken: {
  type: String,
  default: null
},

resetPasswordExpires: {
  type: Date,
  default: null
},
isEmailVerified: {
  type: Boolean,
  default: false
},

emailVerificationOtp: {
  type: String,
  default: null
},

emailVerificationExpires: {
  type: Date,
  default: null
},

emailVerificationAttempts: {
  type: Number,
  default: 0
},emailVerificationLastSentAt: {
  type: Date,
  default: null
}
  },
  {
    timestamps: true,
  }
);

UserSchema.index(
  { provider: 1, providerId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      providerId: { $type: "string" },
    },
  }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;