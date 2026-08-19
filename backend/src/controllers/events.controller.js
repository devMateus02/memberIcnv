import { db } from "../config/db.js";
import { randomUUID } from "crypto";

const STATUSES = ["scheduled", "cancelled", "postponed", "moved_up"];

export const listEvents = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, description, image_url, event_time, start_date, end_date, status, created_at, updated_at
       FROM events
       ORDER BY start_date ASC, event_time ASC`
    );
    return res.json(rows);
  } catch (error) {
    console.error("ERRO AO LISTAR EVENTOS:", error);
    return res.status(500).json({ error: "Erro ao listar eventos" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, description, image_url, event_time, start_date, end_date, status } = req.body;

    if (!name || !event_time || !start_date) {
      return res.status(400).json({ error: "Nome, horário e data de início são obrigatórios" });
    }

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const id = randomUUID();

    await db.query(
      `INSERT INTO events (id, name, description, image_url, event_time, start_date, end_date, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        description || null,
        image_url || null,
        event_time,
        start_date,
        end_date || null,
        status || "scheduled",
        req.user.sub,
      ]
    );

    return res.status(201).json({ ok: true, id });
  } catch (error) {
    console.error("ERRO AO CRIAR EVENTO:", error);
    return res.status(500).json({ error: "Erro ao criar evento" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, event_time, start_date, end_date, status } = req.body;

    if (!name || !event_time || !start_date) {
      return res.status(400).json({ error: "Nome, horário e data de início são obrigatórios" });
    }

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const [result] = await db.query(
      `UPDATE events
       SET name = ?, description = ?, image_url = ?, event_time = ?, start_date = ?, end_date = ?, status = ?
       WHERE id = ?`,
      [
        name,
        description || null,
        image_url || null,
        event_time,
        start_date,
        end_date || null,
        status || "scheduled",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR EVENTO:", error);
    return res.status(500).json({ error: "Erro ao atualizar evento" });
  }
};
