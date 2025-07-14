import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  let token;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ msg: "Tidak ada token, authorization ditolak" });
    }

    token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token tidak valid" });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Akses ditolak" });
  }
  next();
};
