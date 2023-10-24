const neo4j = require("neo4j-driver");

/**
 * Creamos la conexión a la base de datos
 */
const driver = neo4j.driver(
  "neo4j://localhost",
  neo4j.auth.basic("neo4j", "Aitor777"),
  { disableLosslessIntegers: true }
);

let sesion = driver.session();

// Exportamos la conexión
module.exports = sesion;
