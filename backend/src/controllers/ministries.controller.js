import { db } from "../config/db.js";

export const listMinistries = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM ministries WHERE active = TRUE ORDER BY name ASC"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao listar ministérios" });
  }
};
