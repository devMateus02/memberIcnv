import jwt from "jsonwebtoken"; // 🔴 FALTAVA ISSO

export const auth = (req, res, next) => {
  

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {

    return res.status(401).json({ error: "Token ausente" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ TOKEN INVÁLIDO:", err.message);
    return res.status(401).json({ error: "Token inválido" });
  }
};


