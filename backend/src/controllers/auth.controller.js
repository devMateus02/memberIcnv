import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export const register = async (req, res) => {
  try {
   

    const {
      fullName,
      gender,
      birthDate,
      motherName,
      fatherName,
      primaryPhone,
      secondaryPhone,
      email,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      baptismDate,
      password,
      selfie_url,
      ministries,
    } = req.body;

    // 🔁 MAPEAMENTO (FRONT → BANCO)
    const name = fullName;
    const sex = gender;
    const birth_date = birthDate;
    const mother_name = motherName;
    const father_name = fatherName || null;
    const phone1 = primaryPhone;
    const phone2 = secondaryPhone || null;
    const address_street = street;
    const address_number = number;
    const address_complement = complement || null;
    const zip_code = zipCode;
    const baptism_date = baptismDate || null;

    // ✅ VALIDAÇÃO REAL
    if (
      !name || !sex || !birth_date ||
      !mother_name || !phone1 || !email ||
      !address_street || !address_number ||
      !neighborhood || !city || !state || !zip_code ||
      !password
    ) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // email único
    const [exists] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (exists.length) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const id = randomUUID();
    const password_hash = await bcrypt.hash(password, 10);
    const selfie_status = selfie_url ? "pending_review" : "not_sent";

    await db.query(
      `INSERT INTO users (
        id, role, status,
        name, sex, birth_date,
        mother_name, father_name,
        phone1, phone2, email,
        address_street, address_number, address_complement,
        neighborhood, city, state, zip_code,
        baptism_date,
        password_hash,
        selfie_url, selfie_status
      ) VALUES (?, 'member', 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name, sex, birth_date,
        mother_name, father_name,
        phone1, phone2, email,
        address_street, address_number, address_complement,
        neighborhood, city, state, zip_code,
        baptism_date,
        password_hash,
        selfie_url || null, selfie_status,
      ]
    );

    // Ministérios (N:N)
    if (Array.isArray(ministries) && ministries.length) {
      const values = ministries.map((ministryId) => [
        randomUUID(),
        id,
        ministryId,
      ]);

      await db.query(
        "INSERT INTO user_ministries (id, user_id, ministry_id) VALUES ?",
        [values]
      );
    }

    return res.status(201).json({
      ok: true,
      message: "Cadastro enviado para aprovação",
      userId: id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao cadastrar" });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: "Email é obrigatório",
      });
    }

    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    return res.json({
      exists: rows.length > 0,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao verificar email",
    });
  }
};


export const login = async (req, res) => {
 

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    const [rows] = await db.query(
      "SELECT id, role, status, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    const user = rows[0];

    const ok = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!ok) {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        status: user.status,
      },
    });

  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "Erro no login",
    });
  }
};

export const logout = async (req, res) => {
  return res.json({ message: "Logout realizado com sucesso" });
};
