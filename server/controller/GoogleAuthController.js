
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const GoogleController = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        msg: "Google credential is required",
      });
    }

    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        msg: "Google account is not verified",
      });
    }

    const { sub: googleId, email, name, picture } = payload;

    let user = await UserModel.findOne({
      provider: "google",
      providerId: googleId,
    });

    if (!user) {
      const existingUser = await UserModel.findOne({
        email: email.toLowerCase(),
      });

     
      if (existingUser) {
        return res.status(409).json({
          msg: "An account with this email already exists. Please log in using your existing method.",
        });
      }

      user = await UserModel.create({
        username: name || email.split("@")[0],
        email: email.toLowerCase(),
        provider: "google",
        providerId: googleId,
      });
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(
      tokenPayload,
      process.env.SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        image: picture || user.image,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);

    return res.status(401).json({
      msg: "Google authentication failed",
    });
  }
};

export default GoogleController
