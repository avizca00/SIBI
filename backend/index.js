/**
 * Importamos el módulo de express
 */
const express = require("express");

/**
 * Creamos la aplicación de express
 */
const app = express();

/**
 * Importamos el módulo de cors
 */
const cors = require("cors");

/**
 * Importamos la conexión a la base de datos
 */
const neo4j = require("./conexionDB");

/**
 * Creamos la conexión a la base de datos
 */
neo4j()
  .then(() => {
    app.listen(3000, function () {
      console.log("Base de datos conectada y servidor arrancado .");
    });
  })
  .catch((err) => console.log("Algo ha ido mal ..."));

/**
 * Configuramos el servidor para que entienda las peticiones
 */
app.use(express.json());
app.use(cors());

/**
 * Endpoint para el inicio de usuarios
 */
app.post("/inicioSesion", (req, res) => {
  const { usuario, contrasenia } = req.body;

  const query = `MATCH (u:Usuario {usuario: ${usuario}, contrasenia: ${contrasenia}}) RETURN u`;

  neo4j.run(query).then((result) => {
    if (result.records.length === 0) {
      res.status(404).send({ message: "Usuario no encontrado" });
    } else {
      res.status(200).send({ message: "Usuario encontrado" });
    }
  });
  return res;
});

/**
 * Endpoint para el registro de usuarios
 */
app.post("/registro", (req, res) => {
  const { usuario, contrasenia } = req.body;

  const query = `MERGE (u:Usuario {usuario: ${usuario}, contrasenia: ${contrasenia}}) RETURN u`;

  neo4j.run(query).then((result) => {
    if (result.records.length === 0) {
      res.status(404).send({ message: "Usuario ya registrado" });
    } else {
      res.status(200).send({ message: "Usuario encontrado" });
    }
  });
  return res;
});
