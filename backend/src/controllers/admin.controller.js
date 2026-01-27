import { db } from "../config/db.js";
import { randomUUID } from "crypto";

export const listPending = async (req, res) => {
  try {
    const [rows] = await db.query(`
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

        -- 🔹 ministérios (pode vir mais de um)
        GROUP_CONCAT(m.name ORDER BY m.name SEPARATOR ', ') AS ministries

      FROM users u
      LEFT JOIN user_ministries um 
        ON um.user_id = u.id
      LEFT JOIN ministries m 
        ON m.id = um.ministry_id
        AND m.active = 1

      WHERE u.role = 'member'
        AND u.status = 'pending'

      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
  
    res.json(rows);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao listar pendentes" });
  }
};


export const approveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.sub;

    await db.query(
      "UPDATE users SET status='active', selfie_status=IF(selfie_url IS NULL,'not_sent','approved') WHERE id=?",
      [userId],
    );

    await db.query(
      "INSERT INTO approval_logs (id, user_id, admin_id, action) VALUES (?, ?, ?, 'approved')",
      [randomUUID(), userId, adminId],
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao aprovar" });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.sub;

    // ✅ fallback correto
    const { reason } = req.body || {};

    await db.query(
      "UPDATE users SET status='blocked', selfie_status='rejected' WHERE id=?",
      [userId],
    );

    await db.query(
      `INSERT INTO approval_logs 
       (id, user_id, admin_id, action, reason) 
       VALUES (?, ?, ?, 'rejected', ?)`,
      [randomUUID(), userId, adminId, reason || null],
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("ERRO AO REJEITAR:", e);
    return res.status(500).json({ error: "Erro ao rejeitar" });
  }
};


