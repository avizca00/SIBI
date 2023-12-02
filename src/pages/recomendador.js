import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { TableContainer, Table, Select, MenuItem } from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserBar from "../componentes/userBar";
import Slider from "@mui/material/Slider";
import { orange } from "@mui/material/colors";
import { styled } from "@mui/material";

const defaultTheme = createTheme({
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#f57c00",
    },
    secondary: {
      main: "#f57c00",
    },
  },
});

const StyledSlider = styled(Slider)({
  color: orange[500],
  width: "50%",
  "& .MuiSlider-thumb": {
    color: orange[500],
  },
  "& .MuiSlider-track": {
    color: orange[500],
  },
  "& .MuiSlider-rail": {
    color: orange[500],
  },
});

const StylerButtonBuscar = styled(Button)({
  marginTop: 30,
  height: 100,
  width: 200,
  backgroundColor: orange[300],
  opacity: 0.8,
  fontSize: 30,
  color: "white", // Cambiar el color del texto del botón a blanco
  "&:hover": {
    backgroundColor: orange[500],
  },
  "& .MuiButton-label": {
    opacity: 1,
  },
});

const StyledSelect = styled(Select)({
  height: 100,
  width: 200,
  backgroundColor: orange[300],
  opacity: 0.8,
  fontSize: 30,
  "&:hover": {
    backgroundColor: orange[500],
  },
  "& .MuiButton-label": {
    opacity: 1,
  },
});

const StyledTypography = styled(Typography)({
  color: "white",
  "& .MuiButton-label": {
    opacity: 1,
  },
});

const StyledTextField = styled(TextField)({
  color: "white",
  backgroundColor: orange[300],
  opacity: 0.8,
  fontSize: 30,
  width: "25%",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "white",
    opacity: 1,
  },
  "&:hover": {
    backgroundColor: orange[500],
  },
  "& .MuiButton-label": {
    opacity: 1,
  },
});

export default function Recomendador() {
  const [nombre, setNombre] = useState(""); // Estado para el nombre del jugador
  const [puntos, setPuntos] = useState(0); // Estado para los puntos del jugador
  const [partidos, setPartidos] = useState(0); // Estado para los partidos jugados del jugador
  const [asistencias, setAsistencias] = useState(0); // Estado para las asistencias del jugador
  const [rebotes, setRebotes] = useState(0); // Estado para los rebotes del jugador
  const [faltas, setFaltas] = useState(0); // Estado para las faltas del jugador
  const [robos, setRobos] = useState(0); // Estado para los robos del jugador
  const [triples, setTriples] = useState(0); // Estado para los triples del jugador
  const [edad, setEdad] = useState(0); // Estado para la edad del jugador
  const [posicion, setPosicion] = useState(""); // Estado para la posicion del jugador
  const [equipo, setEquipo] = useState(""); // Estado para el equipo del jugador

  const equipos = [
    "MIN",
    "LAL",
    "MIA",
    "BOS",
    "DAL",
    "PHI",
    "DEN",
    "TOR",
    "HOU",
    "UTA",
    "LAC",
    "POR",
    "OKC",
    "IND",
    "MIL",
    "SAS",
    "BRK",
    "MEM",
    "ORL",
    "PHO",
    "SAC",
    "NOP",
    "WAS",
    "CHO",
    "CHI",
    "ATL",
    "NYK",
    "CLE",
    "DET",
    "GSW",
  ];

  const handleNombre = (newValue) => {
    setNombre(newValue);
  };

  const handlePuntos = (newValue) => {
    setPuntos(newValue);
  };

  const handlePartidos = (newValue) => {
    setPartidos(newValue);
  };

  const handleAsistencias = (newValue) => {
    setAsistencias(newValue);
  };

  const handleRebotes = (newValue) => {
    setRebotes(newValue);
  };

  const handleFaltas = (newValue) => {
    setFaltas(newValue);
  };

  const handleRobos = (newValue) => {
    setRobos(newValue);
  };

  const handleTriples = (newValue) => {
    setTriples(newValue);
  };

  const handleEdad = (newValue) => {
    setEdad(newValue);
  };

  const handlePosicion = (newValue) => {
    setPosicion(newValue);
  };

  const handleEquipo = (newValue) => {
    setEquipo(newValue);
  };

  const handleSearch = () => {};

  return (
    <ThemeProvider theme={defaultTheme}>
      <UserBar />
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Grid item xs={12} sm={12} align="center">
          <StylerButtonBuscar variant="contained" onClick={handleSearch}>
            Buscar
          </StylerButtonBuscar>
        </Grid>
        <Grid item xs={12} sm={12} align="center">
          <StyledTypography variant="h6" align="center">
            Nombre del Jugador
          </StyledTypography>
          <StyledTextField
            value={nombre}
            variant="outlined"
            onChange={handleNombre}
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Puntos por Partido
          </StyledTypography>
          <StyledSlider
            value={puntos}
            onChange={handlePuntos}
            defaultValue={25}
            marks
            min={0}
            max={50}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Asistencias por Partido
          </StyledTypography>
          <StyledSlider
            value={asistencias}
            onChange={handleAsistencias}
            defaultValue={5}
            marks
            min={0}
            max={10}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Rebotes por Partido
          </StyledTypography>
          <StyledSlider
            value={rebotes}
            onChange={handleRebotes}
            defaultValue={5}
            marks
            min={0}
            max={10}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Faltas por Partido
          </StyledTypography>
          <StyledSlider
            value={faltas}
            onChange={handleFaltas}
            defaultValue={5}
            marks
            min={0}
            max={10}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Partidos Jugados
          </StyledTypography>
          <StyledSlider
            value={partidos}
            onChange={handlePartidos}
            defaultValue={45}
            marks
            min={0}
            max={90}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Robos por Partido
          </StyledTypography>
          <StyledSlider
            value={robos}
            onChange={handleRobos}
            defaultValue={3}
            marks
            min={0}
            max={6}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Edad
          </StyledTypography>
          <StyledSlider
            value={edad}
            onChange={handleEdad}
            aria-label="Campo 7"
            defaultValue={30}
            marks
            min={18}
            max={42}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Triples por Partido
          </StyledTypography>
          <StyledSlider
            value={triples}
            onChange={handleTriples}
            defaultValue={5}
            marks
            min={0}
            max={10}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Posicion
          </StyledTypography>
          <StyledSelect value={posicion} onChange={handlePosicion} displayEmpty>
            <MenuItem value={"PG"}>PG</MenuItem>
            <MenuItem value={"SG"}>SG</MenuItem>
            <MenuItem value={"SF"}>SF</MenuItem>
            <MenuItem value={"PF"}>PF</MenuItem>
            <MenuItem value={"C"}>C</MenuItem>
          </StyledSelect>
        </Grid>
        <Grid item xs={12} sm={3} align="center">
          <StyledTypography variant="h6" align="center">
            Equipo
          </StyledTypography>
          <StyledSelect value={equipo} onChange={handleEquipo} displayEmpty>
            {equipos.map((equipo) => (
              <MenuItem key={equipo} value={equipo}>
                {equipo}
              </MenuItem>
            ))}
          </StyledSelect>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ margin: "auto" }}>
          <Table>
            {/* Aquí puedes agregar las filas y columnas de la tabla */}
          </Table>
        </TableContainer>
      </Grid>
    </ThemeProvider>
  );
}
