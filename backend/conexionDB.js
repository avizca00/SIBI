const neo4j = require("neo4j-driver");

/**
 * Creamos la conexión a la base de datos
 */
const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "Aitor777")
);

// Exportamos la conexión
module.exports = driver;
