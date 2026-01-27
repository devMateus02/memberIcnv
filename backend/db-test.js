import mysql from "mysql2/promise";

(async () => {
  try {
    const conn = await mysql.createConnection({
     host: "caboose.proxy.rlwy.net",
  user: "root",
  password:"lSKLloGVQWrfZBnhWMWoVbttWdydAHBX",
  database:'cadastro_icnv',
  port: 54506,
      ssl: false,                // 👈 MUITO IMPORTANTE
    });

    const [rows] = await conn.query("SELECT 1");
    console.log("✅ Conectou:", rows);
    await conn.end();
  } catch (err) {
    console.error("❌ Falhou:", err);
  }
})();
