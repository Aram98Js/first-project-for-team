import jwt from "jsonwebtoken";

const  authMiddleware = (req, res, next)=> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        msg: "Authorization header missing"
      });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        msg: "Invalid authorization format"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error.name);

    return res.status(401).json({
      msg: "Invalid or expired token"
    });
  }
}

export default authMiddleware;