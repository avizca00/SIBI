import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
} from "@mui/material";
import { orange } from "@mui/material/colors";

export default function MovieInfoCard({ user, jugador, cerrarDialogo, open, actualizaFavoritos }) {
  const [info, setInfo] = useState({});
  const [infoUsuario, setInfoUsuario] = useState({});
  const [isFavorite, setIsFavorite] = useState("No");

  useEffect(() => {
    console.log(user);
    //visitaJugador();
    if (jugador !== undefined && user !== undefined) {
      //visitaJugador();
      setInfo(jugador);
      setInfoUsuario(user);
      getFavoritos();
    }
  }, [open]);

  const styles = {
    fontd: {
      width: "100%",
      color: "white",
      fontFamily: "Franklin Gothic Medium",
      fontSize: "20px",
    },
    titulo: {
      color: "white",
      backgroundColor: "#363A43",
      fontFamily: "Franklin Gothic Medium",
      fontSize: "35px",
    },
  };

  const getFavoritos = async () => {
    await axios
      .get(`http://localhost:5000/favoritos/${user.nombre}`)
      .then((response) => {
        const { favoritos } = response.data;
        const favoritePlayer = favoritos.find(
          (player) => player.nombre === jugador.nombre
        );

        if (favoritePlayer) {
          console.log("Es favorito");
          setIsFavorite("Si");
        } else {
          setIsFavorite("No");
        }
        visitaJugador();
      })
      .catch((error) => {
        console.log("Hola");
        alert("Ha ocurrido un error" + error);
      });
  };

  const visitaJugador = async () => {
    await axios
      .post(`http://localhost:5000/visitarPerfil/${user.nombre}`, {
        nombre: jugador.nombre,
      })
      .catch((error) => {
        alert("Ha ocurrido un error" + error);
      });
  };

  const handleToggleFavorite = async () => {
    if (isFavorite === "No") {
      await axios
        .post(`http://localhost:5000/favoritos/${user.nombre}`, {
          nombre: jugador.nombre,
        })
        .then((response) => {
          setIsFavorite("Si");
        })
        .catch((error) => {
          alert("Ha ocurrido un error" + error);
        });
    } else {
      await axios
        .delete(
          `http://localhost:5000/favoritos/${user.nombre}/${jugador.nombre}`
        )
        .then((response) => {
          setIsFavorite("No");
        })
        .catch((error) => {
          alert("Ha ocurrido un error" + error);
        });
    }
    actualizaFavoritos();
  };

  if (info !== undefined && infoUsuario !== undefined) {
    return (
      <Dialog
        open={open}
        onClose={cerrarDialogo}
        maxWidth={"lg"}
        sx={{
          color: "white",
          backgroundColor: orange[200],
          borderRadius: "15px",
        }}
      >
        <DialogTitle id="responsive-dialog-title" style={styles.titulo}>
          <Grid>
            <IconButton
              style={{
                position: "absolute",
                padding: "0px",
                top: "5%",
                right: "3%",
              }}
              onClick={cerrarDialogo}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          Información de "{info.nombre}"
        </DialogTitle>
        <DialogContent
          sx={{
            color: "white",
            backgroundColor: orange[200],
          }}
        >
          <>
            <br />
          </>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <img
                src={info.imagenJugador}
                alt="Foto del jugador"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Grid>
            <Grid item xs={4}>
              <img
                src={info.imagenEquipo}
                alt="Foto del jugador"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <DialogContentText style={styles.fontd}>
                  Nombre: {info.nombre}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Edad: {info.edad}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Posicion: {info.posicion}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Equipo: {info.equipo}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Partidos Jugados: {info.partidosJugados}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Partidos Titular: {info.partidosTitular}
                </DialogContentText>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <DialogContentText style={styles.fontd}>
                  Puntos por Partido: {info.puntosPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Asistencias por Partido: {info.asistenciasPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Tiros por Partido: {info.tirosPorPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Canastas por Partido: {info.canastasPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Porcentaje Tiros de Campo: {info.porcentajeTirosDeCampo}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Efectividad en Tiros de Campo:{" "}
                  {info.efectividadEnTirosDeCampo}
                </DialogContentText>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <DialogContentText style={styles.fontd}>
                  Triples por Partido: {info.triplesPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Triples Acertados por Partido: {info.triplesAcertadosPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Porcentaje de Triple: {info.porcentajeDeTriple}
                </DialogContentText>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
              </Grid>
              <Grid item xs={6}>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <DialogContentText style={styles.fontd}>
                  Tiros de 2 por Partido: {info.tirosDe2Partido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Tiros de 2 Acertados por Partido:{" "}
                  {info.tirosDe2AcertadosPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Porcentaje de Tiros de 2: {info.porcentajeTirosDe2Partido}
                </DialogContentText>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <DialogContentText style={styles.fontd}>
                  Tiros Libre por Partido: {info.tirosLibresPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Tiros Libres Acertados por Partido:{" "}
                  {info.tirosLibresAcertadosPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Porcentaje de Tiros Libres: {info.porcentajeTirosLibres}
                </DialogContentText>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <DialogContentText style={styles.fontd}>
                  Rebotes Ofensivos por Partido: {info.rebotesOfensivosPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Rebotes Defensivos por Partido:{" "}
                  {info.rebotesDefensivosPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Rebotes Totales por Partido: {info.rebotesTotalesPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Robos por Partido: {info.robosPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Tapones por Partido: {info.taponesPartido}
                </DialogContentText>
                <>
                  <>
                    <br />
                  </>
                  <Divider variant="middle" />
                  <>
                    <br />
                  </>
                </>
                <DialogContentText style={styles.fontd}>
                  Perdidas por Partido: {info.perdidasPartido}
                </DialogContentText>
                <DialogContentText style={styles.fontd}>
                  Faltas Personales por Partido por Partido:{" "}
                  {info.faltasPersonalesPartido}
                </DialogContentText>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <DialogContentText style={styles.fontd}>
                  Favorito: {isFavorite}
                </DialogContentText>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
                <Grid container justifyContent="center" alignItems="center">
                  <IconButton
                    style={{
                      padding: "0px",
                    }}
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={handleToggleFavorite}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Grid>
                <>
                  <br />
                </>
                <Divider variant="middle" />
                <>
                  <br />
                </>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}
