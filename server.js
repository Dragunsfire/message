require('dotenv').config(); // Esto carga las variables de .env (en desarrollo)
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Se usan las variables de entorno proporcionadas por Railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,          // En tu env: ${RAILWAY_PRIVATE_DOMAIN}
  user: process.env.MYSQLUSER,          // En tu env: "root"
  password: process.env.MYSQLPASSWORD,  // En tu env: suSgwgmhCkXHQtSKCpxvFdvOvyWcuDXi
  database: process.env.MYSQLDATABASE,  // En tu env: "railway"
  port: process.env.MYSQLPORT || 3306   // Puerto, por defecto 3306 (en producción Railway usará el puerto privado)
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a Railway MySQL');
});

app.post('/mensaje', (req, res) => {
  const { nombre, mensaje } = req.body;
  const sql = 'INSERT INTO mensajes (nombre, mensaje) VALUES (?, ?)';
  db.query(sql, [nombre, mensaje], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error insertando el mensaje' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

app.get('/mensajes', (req, res) => {
  db.query('SELECT * FROM mensajes', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error consultando mensajes' });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
