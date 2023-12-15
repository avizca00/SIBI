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
const driver = require("./conexionDB");

/**
 * Configuramos el puerto del servidor
 */
app.set("port", 5000);

/**
 * Configuramos el servidor para que entienda las peticiones
 */
app.use(express.json());
app.use(cors());

app.use(express.json({ limit: "5000mb" }));
app.use(express.urlencoded({ extended: true, limit: "5000mb" }));

/**
 * Endpoint para el inicio de usuarios
 */
app.post("/inicioSesion", async (req, res) => {
  const { usuario, contrasenia } = req.body;

  const query = `MATCH (u:Usuario {nombre: $usuario, contrasenia: $contrasenia}) RETURN u`;

  let sesion = driver.session();

  await sesion
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
    })
    .then(async () => await sesion.close());
});

/**
 * Endpoint para el registro de usuarios
 */
app.post("/registro", (req, res) => {
  const { usuario, contrasenia } = req.body;

  const query = `MERGE (u:Usuario {nombre: $usuario, contrasenia: $contrasenia}) RETURN u`;

  let sesion = driver.session();

  sesion
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
    })
    .then(async () => await sesion.close());
});

/**
 * Endpoint para obtener todos los jugadores con un determinado número de puntos, rebotes y asistencias
 */
app.post("/jugadoresCar", (req, res) => {
  const {
    nombre,
    puntos,
    partidos,
    rebotes,
    asistencias,
    faltas,
    robos,
    triples,
    edad,
    tapones,
    posicion,
    equipo,
    tirosLibresPartido,
  } = req.body;

  let query = `MATCH (j:Jugador) WHERE j.puntosPartido >= $puntos AND j.partidosJugados >= $partidos AND j.rebotesTotalesPartido >= $rebotes AND j.asistenciasPartido >= $asistencias AND 
  j.faltasPersonalesPartido >= $faltas AND j.robosPartido >= $robos AND j.triplesAcertadosPartido >= $triples AND j.edad >= $edad AND j.taponesPartido >= $tapones AND 
  j.tirosLibresAcertadosPartido >= $tirosLibresPartido `;

  let json = {
    puntos: puntos,
    partidos: partidos,
    rebotes: rebotes,
    asistencias: asistencias,
    faltas: faltas,
    robos: robos,
    triples: triples,
    edad: edad,
    tapones: tapones,
    tirosLibresPartido: tirosLibresPartido,
  };

  if (nombre !== "") {
    query += `AND j.nombre CONTAINS $nombre `;
    json.nombre = nombre;
  }
  if (equipo !== "") {
    query += `AND j.equipo CONTAINS $equipo `;
    json.equipo = equipo;
  }
  if (posicion !== "") {
    query += `AND j.posicion CONTAINS $posicion `;
    json.posicion = posicion;
  }
  query += `RETURN j`;

  let sesion = driver.session();
  //MIRAR PARAMETROS
  sesion
    .run(query, json)
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j").properties
      );
      // Modificar el parámetro deseado en todos los jugadores
      const jugadoresModificados = jugadores.map((jugador) => {
        jugador.edad = jugador.edad.low;
        jugador.partidosJugados = jugador.partidosJugados.low;
        jugador.partidosTitular = jugador.partidosTitular.low;
        return jugador;
      });

      const jugadoresTabla = jugadoresModificados.map((jugador, i) => ({
        id: i,
        nombre: jugador.nombre,
        puntos: jugador.puntosPartido,
        edad: jugador.edad,
        equipo: jugador.equipo,
        posicion: jugador.posicion,
        partidos: jugador.partidosJugados,
        asistencias: jugador.asistenciasPartido,
        rebotes: jugador.rebotesTotalesPartido,
        tapones: jugador.taponesPartido,
        robos: jugador.robosPartido,
        faltas: jugador.faltasPersonalesPartido,
        triples: jugador.triplesAcertadosPartido,
        tirosLibresPartido: jugador.tirosLibresAcertadosPartido,
      }));

      res.status(200).send({ jugadores: jugadoresModificados, jugadoresTabla });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(() => sesion.close());
});

app.get("/jugadoresSimilares/:nombre", async (req, res) => {
  const { nombre } = req.params;

  const query = `
    MATCH (j1:Jugador {nombre: $nombre})
    MATCH (j2:Jugador)
    WHERE j2 <> j1 AND j2.posicion = j1.posicion
    WITH j1, j2,
    gds.similarity.euclideanDistance([j1.asistenciasPartido, j1.canastasPartido, j1.efectividadEnTirosDeCampo, j1.faltasPersonalesPartido,  j1.perdidasPartido, j1.porcentajeDeTriple, j1.porcentajeTirosDe2Partido, j1.porcentajeTirosDeCampo, j1.porcentajeTirosLibres
    , j1.puntosPartido, j1.rebotesDefensivosPartido, j1.rebotesOfensivosPartido, j1.rebotesTotalesPartido, j1.robosPartido, j1.taponesPartido, j1.tirosDe2AcertadosPartido, j1.tirosDe2Partido, j1.tirosLibresAcertadosPartido, j1.tirosLibresPartido, j1.tirosPorPartido, j1.triplesAcertadosPartido, j1.triplesPartido ], \
      [j2.asistenciasPartido, j2.canastasPartido, j2.efectividadEnTirosDeCampo, j2.faltasPersonalesPartido,  j2.perdidasPartido, j2.porcentajeDeTriple, j2.porcentajeTirosDe2Partido, j2.porcentajeTirosDeCampo, j2.porcentajeTirosLibres
        , j2.puntosPartido, j2.rebotesDefensivosPartido, j2.rebotesOfensivosPartido, j2.rebotesTotalesPartido, j2.robosPartido, j2.taponesPartido, j2.tirosDe2AcertadosPartido, j2.tirosDe2Partido, j2.tirosLibresAcertadosPartido, j2.tirosLibresPartido, j2.tirosPorPartido, j2.triplesAcertadosPartido, j2.triplesPartido]) AS distancia
    RETURN j2, distancia
    ORDER BY distancia ASC LIMIT 10
  `;

  let sesion = driver.session();

  await sesion
    .run(query, { nombre: nombre })
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j2").properties
      );
      const jugadoresModificados = jugadores.map((jugador) => {
        // Cambiar el parámetro deseado
        jugador.edad = jugador.edad.low;
        jugador.partidosJugados = jugador.partidosJugados.low;
        jugador.partidosTitular = jugador.partidosTitular.low;
        return jugador;
      });

      const jugadoresSimilaresTabla = jugadoresModificados.map(
        (jugador, i) => ({
          id: i,
          nombre: jugador.nombre,
          puntos: jugador.puntosPartido,
          edad: jugador.edad,
          equipo: jugador.equipo,
          posicion: jugador.posicion,
          partidos: jugador.partidosJugados,
          asistencias: jugador.asistenciasPartido,
          rebotes: jugador.rebotesTotalesPartido,
          tapones: jugador.taponesPartido,
          robos: jugador.robosPartido,
          faltas: jugador.faltasPersonalesPartido,
          triples: jugador.triplesAcertadosPartido,
          tirosLibresPartido: jugador.tirosLibresAcertadosPartido,
        })
      );

      res.status(200).send({
        jugadoresSimilares: jugadoresModificados,
        jugadoresSimilaresTabla,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(() => sesion.close());
});

app.get("/jugadoresVisitados/:usuario", (req, res) => {
  const { usuario } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $usuario})-[v:HA_VISITADO_PERFIL]->(j:Jugador)
    RETURN j order by v.numeroVisitas DESC    
  `;

  let sesion = driver.session();

  sesion
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
    })
    .then(() => sesion.close());
});

app.get("/jugadoresRecomendados/:usuario", async (req, res) => {
  const { usuario } = req.params;

  const query = `
  MATCH (u:Usuario {nombre: $usuario})-[:HA_VISITADO_PERFIL]->(j:Jugador)
  WITH COLLECT(j) AS jugadoresVisitados
  MATCH (u:Usuario {nombre: $usuario})-[:ES_FAVORITO]->(j:Jugador)
  WITH jugadoresVisitados, collect(j) AS jugadoresFavoritos
  WITH jugadoresVisitados + jugadoresFavoritos AS jugadoresEncontrados
  MATCH (j1:Jugador)
  WHERE j1 IN jugadoresEncontrados
  WITH jugadoresEncontrados, j1
  MATCH (j2:Jugador)
  WHERE j2 <> j1 AND j2.posicion = j1.posicion
  WITH j1, j2,
  gds.similarity.euclideanDistance([
    j1.asistenciasPartido, j1.canastasPartido, j1.efectividadEnTirosDeCampo, j1.faltasPersonalesPartido, j1.perdidasPartido, j1.porcentajeDeTriple, j1.porcentajeTirosDe2Partido, j1.porcentajeTirosDeCampo, j1.porcentajeTirosLibres,
    j1.puntosPartido, j1.rebotesDefensivosPartido, j1.rebotesOfensivosPartido, j1.rebotesTotalesPartido, j1.robosPartido, j1.taponesPartido, j1.tirosDe2AcertadosPartido, j1.tirosDe2Partido, j1.tirosLibresAcertadosPartido, j1.tirosLibresPartido, j1.tirosPorPartido, j1.triplesAcertadosPartido, j1.triplesPartido
  ], [
    j2.asistenciasPartido, j2.canastasPartido, j2.efectividadEnTirosDeCampo, j2.faltasPersonalesPartido, j2.perdidasPartido, j2.porcentajeDeTriple, j2.porcentajeTirosDe2Partido, j2.porcentajeTirosDeCampo, j2.porcentajeTirosLibres,
    j2.puntosPartido, j2.rebotesDefensivosPartido, j2.rebotesOfensivosPartido, j2.rebotesTotalesPartido, j2.robosPartido, j2.taponesPartido, j2.tirosDe2AcertadosPartido, j2.tirosDe2Partido, j2.tirosLibresAcertadosPartido, j2.tirosLibresPartido, j2.tirosPorPartido, j2.triplesAcertadosPartido, j2.triplesPartido
  ]) AS distancia
  RETURN j2, distancia
  ORDER BY distancia ASC
  LIMIT 20`;

  let sesion = driver.session();

  await sesion
    .run(query, { usuario: usuario })
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j2").properties
      );
      const jugadoresModificados = jugadores.map((jugador) => {
        // Cambiar el parámetro deseado
        jugador.edad = jugador.edad.low;
        jugador.partidosJugados = jugador.partidosJugados.low;
        jugador.partidosTitular = jugador.partidosTitular.low;
        return jugador;
      });

      const jugadoresRecomendadosTabla = jugadoresModificados.map(
        (jugador, i) => ({
          id: i,
          nombre: jugador.nombre,
          puntos: jugador.puntosPartido,
          edad: jugador.edad,
          equipo: jugador.equipo,
          posicion: jugador.posicion,
          partidos: jugador.partidosJugados,
          asistencias: jugador.asistenciasPartido,
          rebotes: jugador.rebotesTotalesPartido,
          tapones: jugador.taponesPartido,
          robos: jugador.robosPartido,
          faltas: jugador.faltasPersonalesPartido,
          triples: jugador.triplesAcertadosPartido,
          tirosLibresPartido: jugador.tirosLibresAcertadosPartido,
        })
      );

      res.status(200).send({
        jugadoresRecomendados: jugadoresModificados,
        jugadoresRecomendadosTabla,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .finally(() => sesion.close());
});

app.get("/usuario/:nombre", async (req, res) => {
  const { nombre } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $nombre})
    RETURN u
  `;

  let sesion = driver.session();

  await sesion
    .run(query, { nombre: nombre })
    .then((result) => {
      const usuario = result.records.map(
        (record) => record.get("u").properties
      )[0]; // Obtener el primer elemento del array
      res.status(200).send(usuario);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(async () => await sesion.close());
});

app.post("/visitarPerfil/:usuario", async (req, res) => {
  const { nombre } = req.body;
  const { usuario } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $usuario}), (j:Jugador {nombre: $jugador})
    MERGE (u)-[v:HA_VISITADO_PERFIL]->(j)
    ON CREATE SET v.numeroVisitas = 1
    ON MATCH SET v.numeroVisitas = v.numeroVisitas + 1
  `;

  let sesion = driver.session();

  await sesion
    .run(query, { usuario: usuario, jugador: nombre })
    .then(() => {
      res.status(200).send({ message: "Perfil visitado correctamente" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(async () => await sesion.close());
});

/**
 * Endpoint para obtener todos los jugadores favoritos de un usuario
 */
app.get("/favoritos/:usuario", async (req, res) => {
  const { usuario } = req.params;

  const query = `MATCH (u:Usuario {nombre: $usuario})-[:ES_FAVORITO]->(j:Jugador) RETURN j`;

  let sesion = driver.session();

  await sesion
    .run(query, { usuario: usuario })
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j").properties
      );
      const jugadoresModificados = jugadores.map((jugador) => {
        // Cambiar el parámetro deseado
        jugador.edad = jugador.edad.low;
        jugador.partidosJugados = jugador.partidosJugados.low;
        jugador.partidosTitular = jugador.partidosTitular.low;
        return jugador;
      });

      const favoritosTabla = jugadoresModificados.map((jugador, i) => ({
        id: i,
        nombre: jugador.nombre,
        puntos: jugador.puntosPartido,
        edad: jugador.edad,
        equipo: jugador.equipo,
        posicion: jugador.posicion,
        partidos: jugador.partidosJugados,
        asistencias: jugador.asistenciasPartido,
        rebotes: jugador.rebotesTotalesPartido,
        tapones: jugador.taponesPartido,
        robos: jugador.robosPartido,
        faltas: jugador.faltasPersonalesPartido,
        triples: jugador.triplesAcertadosPartido,
        tirosLibresPartido: jugador.tirosLibresAcertadosPartido,
      }));

      res.status(200).send({
        favoritos: jugadoresModificados,
        favoritosTabla,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(async () => await sesion.close());
});

/**
 * Endpoint para añadir un jugador a favoritos
 */
app.post("/favoritos/:usuario", async (req, res) => {
  const { nombre } = req.body;
  const { usuario } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $usuario}), (j:Jugador {nombre: $nombre})
    MERGE (u)-[:ES_FAVORITO]->(j)
  `;

  let sesion = driver.session();

  await sesion
    .run(query, { usuario: usuario, nombre: nombre })
    .then(() => {
      res.status(200).send({ message: "Jugador añadido a favoritos" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(async () => await sesion.close());
});

/**
 * Endpoint para eliminar un jugador de favoritos
 */
app.delete("/favoritos/:usuario/:nombre", async (req, res) => {
  const { usuario, nombre } = req.params;

  const query = `
    MATCH (u:Usuario {nombre: $usuario})-[r:ES_FAVORITO]->(j:Jugador {nombre: $nombre})
    DELETE r
  `;

  let sesion = driver.session();

  await sesion
    .run(query, { usuario: usuario, nombre: nombre })
    .then(() => {
      res.status(200).send({ message: "Relación eliminada correctamente" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(async () => await sesion.close());
});

/**
 * Endpoint para obtener todos los jugadores
 */
app.get("/jugadores", async (req, res) => {
  const query = "MATCH (j:Jugador) RETURN j";

  let sesion = driver.session();

  await sesion
    .run(query)
    .then((result) => {
      const jugadores = result.records.map(
        (record) => record.get("j").properties
      );

      // Modificar el parámetro deseado en todos los jugadores
      const jugadoresModificados = jugadores.map((jugador) => {
        // Cambiar el parámetro deseado
        jugador.edad = jugador.edad.low;
        jugador.partidosJugados = jugador.partidosJugados.low;
        jugador.partidosTitular = jugador.partidosTitular.low;
        return jugador;
      });

      const jugadoresTabla = jugadoresModificados.map((jugador, i) => ({
        id: i,
        nombre: jugador.nombre,
        puntos: jugador.puntosPartido,
        edad: jugador.edad,
        equipo: jugador.equipo,
        posicion: jugador.posicion,
        partidos: jugador.partidosJugados,
        asistencias: jugador.asistenciasPartido,
        rebotes: jugador.rebotesTotalesPartido,
        tapones: jugador.taponesPartido,
        robos: jugador.robosPartido,
        faltas: jugador.faltasPersonalesPartido,
        triples: jugador.triplesAcertadosPartido,
        tirosLibresPartido: jugador.tirosLibresAcertadosPartido,
      }));

      res.status(200).send({ jugadores: jugadoresModificados, jugadoresTabla });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    })
    .then(async () => await sesion.close());
});

app.listen(app.get("port"), () => {
  console.log("Servidor abierto en puerto", app.get("port"));
});
