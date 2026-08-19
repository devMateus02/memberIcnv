import { db } from "../config/db.js";
import { randomUUID } from "crypto";

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

    const user = rows[0];

    // LEFT JOIN sem ministérios gera [null] em vez de [] no JSON_ARRAYAGG
    user.ministries = Array.isArray(user.ministries)
      ? user.ministries.filter(Boolean)
      : [];

    return res.json(user);
  } catch (error) {
    console.error("ERRO AO BUSCAR USUÁRIO LOGADO:", error);
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const getAllUsers = async (req, res) => {
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
        u.role,

        COALESCE(
          JSON_ARRAYAGG(
            CASE
              WHEN m.id IS NOT NULL THEN
                JSON_OBJECT(
                  'id', m.id,
                  'name', m.name
                )
            END
          ),
          JSON_ARRAY()
        ) AS ministries

      FROM users u
      LEFT JOIN user_ministries um ON um.user_id = u.id
      LEFT JOIN ministries m ON m.id = um.ministry_id

      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    const users = rows.map((user) => ({
      ...user,
      ministries: Array.isArray(user.ministries)
        ? user.ministries.filter(
            (m) => m && m.id && m.name
          )
        : [],
    }));

    return res.json(users);

  } catch (error) {
    console.error("ERRO AO BUSCAR USUÁRIOS:", error);

    return res.status(500).json({
      error: "Erro ao buscar usuários",
    });
  }
};



export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // membro só pode editar o próprio cadastro; admin edita qualquer um
    if (req.user.role !== "admin" && req.user.sub !== id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const {
      name,
      email,
      phone1,
      phone2,
      sex,
      mother_name,
      father_name,
      birth_date,
      baptism_date,
      address_street,
      address_number,
      address_complement,
      neighborhood,
      city,
      state,
      zip_code,
      selfie_url,
      ministries,
    } = req.body;

    // email duplicado
    const [exists] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      AND id <> ?
      `,
      [email, id]
    );

    if (exists.length) {
      return res.status(409).json({
        error: "Email já cadastrado",
      });
    }

    // formatar datas
    const formattedBirthDate = birth_date
      ? new Date(birth_date).toISOString().split("T")[0]
      : null;

    const formattedBaptismDate = baptism_date
      ? new Date(baptism_date).toISOString().split("T")[0]
      : null;

    // update usuário
    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone1 = ?,
        phone2 = ?,
        sex = ?,
        mother_name = ?,
        father_name = ?,
        birth_date = ?,
        baptism_date = ?,
        address_street = ?,
        address_number = ?,
        address_complement = ?,
        neighborhood = ?,
        city = ?,
        state = ?,
        zip_code = ?,
        selfie_url = COALESCE(?, selfie_url)
      WHERE id = ?
      `,
      [
        name,
        email,
        phone1,
        phone2,
        sex,
        mother_name,
        father_name,
        formattedBirthDate,
        formattedBaptismDate,
        address_street,
        address_number,
        address_complement,
        neighborhood,
        city,
        state,
        zip_code,
        selfie_url || null,
        id,
      ]
    );

    // ministérios: só mexe se o campo foi enviado explicitamente
    // (evita apagar os vínculos quando quem chama não gerencia ministérios, ex: membro editando o próprio perfil)
    if (ministries !== undefined) {
      await db.query(
        "DELETE FROM user_ministries WHERE user_id = ?",
        [id]
      );

      if (Array.isArray(ministries) && ministries.length > 0) {
        const values = ministries.map((ministry) => [
          randomUUID(),
          id,
          ministry.id,
        ]);

        await db.query(
          `
          INSERT INTO user_ministries
          (id, user_id, ministry_id)
          VALUES ?
          `,
          [values]
        );
      }
    }

    return res.json({
      success: true,
      message: "Usuário atualizado com sucesso",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao atualizar usuário",
    });
  }
};