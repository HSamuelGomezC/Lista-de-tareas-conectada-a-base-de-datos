const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(':memory:');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Crear tabla para almacenar las tareas
db.serialize(() => {
  db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, task TEXT)');
});

// Ruta para obtener todas las tareas
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Ruta para agregar una nueva tarea
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).send('La tarea no puede estar vacía');
  }
  
  db.run('INSERT INTO tasks (task) VALUES (?)', [task], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ id: this.lastID, task });
  });
});

// Ruta para eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ message: `Tarea con id ${id} eliminada` });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
