import jwt from "jsonwebtoken";

const generateTokenAndSetPassword = async (res, userId) => {
  const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None for production, Lax for development
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

export default generateTokenAndSetPassword;
