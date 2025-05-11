import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { throwError } from "../utils/utils.js";

export const isAuth = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.cookies.token; // make sure this matches your cookie name

    if (!token) return next(throwError(401, "No token provided"));

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) return next(throwError(401, "Invalid token payload"));

    // Fetch user from the database using the ID decoded from the token
    const foundUser = await User.findById(decoded.id).select("-password");

    if (!foundUser) return next(throwError(404, "User not found"));

    // Attach the user to the request object
    req.user = foundUser;

    // If a required role is specified, check if the user has the correct role
    if (requiredRole && !foundUser.role.includes(requiredRole)) {
      return next(throwError(403, "You do not have the required role"));
    }

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(throwError(401, "Invalid or expired token"));
    }
    next(err);
  }
};
