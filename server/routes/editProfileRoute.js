import express from 'express';
import EditProfileController from '../controller/editProfileController.js';
import authMiddleware from '../auth/authMiddleware.js';
const editUpdateRouter = express.Router();
editUpdateRouter.patch("/api/editProfile",authMiddleware,EditProfileController);
export default editUpdateRouter