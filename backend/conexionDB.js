const neo4j = require('neo4j-driver');

/**
 * Creamos la conexión a la base de datos
 */
const driver = neo4j.driver(
    
    "bolt://localhost:7687", 
    neo4j.auth.basic("neo4j", "Aitor777"),
    { disableLosslessIntegers: true }
).session();

// Exportamos la conexión
module.exports = driver;