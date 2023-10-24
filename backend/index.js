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
 * Configuramos el puerto del servidor
 */
app.set("port", 5000);

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

  const query = `MATCH (u:Usuario {nombre: $usuario, contrasenia: $contrasenia}) RETURN u`;

  neo4j
    .run(query, { usuario: usuario, contrasenia: contrasenia })
    .then((result) => {
      if (result.records.length === 0) {
        console.log("Usuario no encontrado");
        res.status(404).send({ message: "Usuario no encontrado" });
      } else {
        console.log("Usuario encontrado");
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

  const query = `MERGE (u:Usuario {nombre: $usuario, contrasenia: $contrasenia}) RETURN u`;

  neo4j
    .run(query, { usuario: usuario, contrasenia: contrasenia })
    .then((result) => {
      if (result.records.length === 0) {
        res.status(404).send({ message: "Usuario ya registrado" });
      } else {
        res.status(200).send({ message: "Usuario registrado" });
      }
    });
  return res;
});

app.listen(app.get("port"), () => {
  console.log("Servidor abierto en puerto", app.get("port"));
});
