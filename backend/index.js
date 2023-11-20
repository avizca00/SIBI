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
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
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
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});

/**
 * Endpoint para obtener todos los jugadores con un determinado número de puntos, rebotes y asistencias
 */
app.get("/jugadores", (req, res) => {
  const { puntos, rebotes, asistencias } = req.body;

  const query = `MATCH (j:Jugador) WHERE j.puntos = $puntos AND j.rebotes = $rebotes AND j.asistencias = $asistencias RETURN j`;

  neo4j
    .run(query, {
      puntos: parseInt(puntos),
      rebotes: parseInt(rebotes),
      asistencias: parseInt(asistencias),
    })
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j").properties
      );
      res.status(200).send(jugadores);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});

app.get("/jugadoresSimilares/:nombre", (req, res) => {
  const { nombre } = req.params;

  const query = `
    MATCH (j1:Jugador {nombre: $nombre})
    MATCH (j2:Jugador)
    WHERE j2 <> j1
    WITH j1, j2,
      SQRT(POWER(j1.puntos - j2.puntos, 2) + POWER(j1.rebotes - j2.rebotes, 2) + POWER(j1.asistencias - j2.asistencias, 2)) AS distancia
    RETURN j2, distancia
    ORDER BY distancia ASC
    LIMIT 10
  `;

  neo4j
    .run(query, { nombre: nombre })
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j2").properties
      );
      res.status(200).send(jugadores);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});
app.get("/jugadoresVisitados/:usuario", (req, res) => {
  const { usuario } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $usuario})-[v:HA_VISITADO_PERFIL]->(j:Jugador)
    RETURN j order by v.vecesVisitado DESC    
  `;

  neo4j
    .run(query, { usuario: usuario })
    .then((result) => {
      const jugadores = result.records.map((record) => {
        const jugador = record.get("j").properties;
        const numeroVisitas = record.get("numeroVisitas");
        return { ...jugador, numeroVisitas };
      });
      res.status(200).send(jugadores);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});

app.get("/usuario/:nombre", (req, res) => {
  const { nombre } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $nombre})
    RETURN u
  `;

  neo4j
    .run(query, { nombre: nombre })
    .then((result) => {
      const usuario = result.records.map((record) => record.get("u").properties);
      res.status(200).send(usuario);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});


app.post("/visitarPerfil/:usuario", (req, res) => {
  const { jugador } = req.body;
  const { usuario } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $usuario}), (j:Jugador {nombre: $jugador})
    MERGE (u)-[v:HA_VISITADO_PERFIL]->(j)
    ON CREATE SET v.numeroVisitas = 1
    ON MATCH SET v.numeroVisitas = v.numeroVisitas + 1
  `;

  neo4j
    .run(query, { usuario: usuario, jugador: jugador })
    .then(() => {
      res.status(200).send({ message: "Perfil visitado correctamente" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});

app.get("/favoritos/:usuario", (req, res) => {
  const { usuario } = req.params;

  const query = `MATCH (u:Usuario {nombre: $usuario})-[:ES_FAVORITO]->(j:Jugador) RETURN j`;

  neo4j
    .run(query, { usuario: usuario })
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j").properties
      );
      res.status(200).send(jugadores);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});

app.post("/favoritos/:usuario", (req, res) => {
  const { jugador } = req.body;
  const { usuario } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $usuario}), (j:Jugador {nombre: $jugador})
    MERGE (u)-[:ES_FAVORITO]->(j)
  `;

  neo4j
    .run(query, { usuario: usuario, jugador: jugador })
    .then(() => {
      res.status(200).send({ message: "Jugador añadido a favoritos" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});

app.get("/jugadores", (req, res) => {
  const query = "MATCH (j:Jugador) RETURN j";

  neo4j
    .run(query)
    .then((result) => {
      const jugadores = result.records.map((record) => record.get("j").properties);
      res.status(200).send(jugadores);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});


app.listen(app.get("port"), () => {
  console.log("Servidor abierto en puerto", app.get("port"));
});
