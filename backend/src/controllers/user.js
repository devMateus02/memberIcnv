import { db } from "../config/db.js";

export const getLoggedUser = async (req, res) => {
  try {
    const userId = req.user.sub;

    const [rows] = await db.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone1,
        u.phone2,
        u.birth_date,
        u.created_at,
        u.selfie_url,
        u.selfie_status,
        u.status,
        u.sex,
        u.mother_name,
        u.father_name,
        u.address_street,
        u.address_number,
        u.address_complement,
        u.neighborhood,
        u.state,
        u.city,
        u.zip_code,
        u.baptism_date,

        -- 👇 ministérios
        COALESCE(
          JSON_ARRAYAGG(m.name),
          JSON_ARRAY()
        ) AS ministries

      FROM users u
      LEFT JOIN user_ministries um ON um.user_id = u.id
      LEFT JOIN ministries m ON m.id = um.ministry_id
      WHERE u.id = ?
      GROUP BY u.id
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    console.log("USUÁRIO LOGADO:", rows[0]);
    return res.json(rows[0]);
  } catch (error) {
    console.error("ERRO AO BUSCAR USUÁRIO LOGADO:", error);
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};
