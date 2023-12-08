import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Container, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserBar from "../componentes/userBar";
import Slider from "@mui/material/Slider";
import { orange } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";

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
  marginBottom: 30,
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

const StyledDataGrid = styled(DataGrid)({
  width: "70%", // Set the width to 100% of the container
  boxShadow: 2,
  backgroundColor: "#363A43",
  border: 2,
  color: "white",
  borderColor: "primary.light",
  maxWidth: "100%",
  marginLeft: "100px",
  marginRight: "100px",
  "& .MuiDataGrid-cell:hover": {
    color: "primary.main",
  },
  "& .MuiDataGrid-columnHeader:hover": {
    color: "primary.main",
  },
  "& .MuiDataGrid-columnHeader:focus": {
    color: "primary.main",
  },
});

export default function Recomendador() {
  const { usuario } = useParams(); // Obtiene el nombre de usuario de la URL
  const [infoUser, setInfoUser] = useState({}); // Estado para la información del usuario]
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(""); // Estado para el nombre del jugador
  const [puntos, setPuntos] = useState(0); // Estado para los puntos del jugador
  const [partidos, setPartidos] = useState(0); // Estado para los partidos jugados del jugador
  const [asistencias, setAsistencias] = useState(0); // Estado para las asistencias del jugador
  const [rebotes, setRebotes] = useState(0); // Estado para los rebotes del jugador
  const [faltas, setFaltas] = useState(0); // Estado para las faltas del jugador
  const [robos, setRobos] = useState(0); // Estado para los robos del jugador
  const [tapones, setTapones] = useState(0); // Estado para los tapones del jugador
  const [triples, setTriples] = useState(0); // Estado para los triples del jugador
  const [edad, setEdad] = useState(0); // Estado para la edad del jugador
  const [posicion, setPosicion] = useState(""); // Estado para la posicion del jugador
  const [equipo, setEquipo] = useState(""); // Estado para el equipo del jugador
  const [tirosLibresPartido, setTirosLibresPartido] = useState(0); // Estado para los tiros libres del partido
  const [jugadoresTabla, setJugadoresTabla] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    await axios
      .get(`http://localhost:5000/usuario/${usuario}`)
      .then((response) => {
        setInfoUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        alert("Error. Usuario no encontrado");
        navigate("/");
      });
  };

  const compruebaVariables = () => {
    if (
      nombre !== "" &&
      puntos !== 0 &&
      partidos !== 0 &&
      asistencias !== 0 &&
      rebotes !== 0 &&
      faltas !== 0 &&
      robos !== 0 &&
      triples !== 0 &&
      edad !== 0 &&
      tapones !== 0 &&
      posicion !== "" &&
      equipo !== "" &&
      tirosLibresPartido !== 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const getJugadores = async () => {
    console.log("Comprobando variables");
    if (compruebaVariables()) {
      console.log("Variables comprobadas");
      await axios
        .get("http://localhost:5000/jugadores")
        .then((res) => {
          const { jugadores, jugadoresTabla } = res.data; // Desestructura la respuesta en dos matrices
          console.log(jugadoresTabla);
          setJugadores(jugadores); // Asigna un valor a la primera matriz
          setJugadoresTabla(jugadoresTabla); // Asigna un valor a la segunda matriz
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Rellene todos los campos");
    }
  };

  const handleNombre = (event, newValue) => {
    setNombre(newValue);
  };

  const handlePuntos = (event,newValue) => {
    setPuntos(newValue);
  };

  const handlePartidos = (event,newValue) => {
    setPartidos(newValue);
  };

  const handleAsistencias = (event,newValue) => {
    setAsistencias(newValue);
  };

  const handleRebotes = (event,newValue) => {
    setRebotes(newValue);
  };

  const handleFaltas = (event,newValue) => {
    setFaltas(newValue);
  };

  const handleRobos = (event,newValue) => {
    setRobos(newValue);
  };

  const handleTriples = (event,newValue) => {
    setTriples(newValue);
  };

  const handleEdad = (event,newValue) => {
    setEdad(newValue);
  };

  const handlePosicion = (event,newValue) => {
    setPosicion(newValue);
  };

  const handleEquipo = (event,newValue) => {
    setEquipo(newValue);
  };

  const handleTirosLibres = (event,newValue) => {
    setTirosLibresPartido(newValue);
  };

  const handleTapones = (event,newValue) => {
    setTapones(newValue);
  };

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      width: 250,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "edad",
      headerName: "Edad",
      width: 100,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "equipo",
      headerName: "Equipo",
      width: 100,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "posicion",
      headerName: "Posicion",
      width: 100,
      editable: false,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "partidos",
      headerName: "Partidos",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "puntos",
      headerName: "Puntos",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "asistencias",
      headerName: "Asistencias",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rebotes",
      headerName: "Rebotes",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tapones",
      headerName: "Tapones",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "robos",
      headerName: "Robos",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "faltas",
      headerName: "Faltas",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "triples",
      headerName: "Triples",
      width: 150,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tirosLibresPartido",
      headerName: "Tiro Libres por Partido",
      width: 200,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Info",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              info(event, cellValues);
            }}
          >
            Info
          </Button>
        );
      },
      width: 20,
      align: "center",
      headerAlign: "center",
    },
  ];

  const info = (event, cellValues) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (infoUser !== undefined && Object.keys(infoUser).length !== 0) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles
          styles={{
            body: { backgroundColor: orange[200] },
          }}
        />
        <UserBar />
        <Grid container component="main">
          <Grid item xs={12} sm={12} align="center" height={150}>
            <StylerButtonBuscar variant="contained" onClick={getJugadores}>
              Buscar
            </StylerButtonBuscar>
          </Grid>
          <Grid item xs={12} sm={12} align="center" height={120}>
            <StyledTypography variant="h6" align="center">
              Nombre del Jugador
            </StyledTypography>
            <StyledTextField
              value={nombre}
              variant="outlined"
              onChange={handleNombre}
            />
          </Grid>
          <Grid item xs={12} sm={3} align="center" height={100}>
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
          <Grid item xs={12} sm={3} align="center" height={100}>
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
          <Grid item xs={12} sm={3} align="center" height={100}>
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
          <Grid item xs={12} sm={3} align="center" height={100}>
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
          <Grid item xs={12} sm={3} align="center" height={100}>
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
          <Grid item xs={12} sm={3} align="center" height={100}>
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

          <Grid item xs={12} sm={3} align="center" height={100}>
            <StyledTypography variant="h6" align="center">
              Tapones por Partido
            </StyledTypography>
            <StyledSlider
              value={tapones}
              onChange={handleTapones}
              defaultValue={3}
              marks
              min={0}
              max={6}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={3} align="center" height={100}>
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
          <Grid item xs={12} sm={3} align="center" height={100}>
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
          <Grid item xs={12} sm={3} align="center" height={100}>
            <StyledTypography variant="h6" align="center">
              Tiros libres por Partido
            </StyledTypography>
            <StyledSlider
              value={tirosLibresPartido}
              onChange={handleTirosLibres}
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
            <StyledSelect
              value={posicion}
              onChange={handlePosicion}
              displayEmpty
            >
              <MenuItem value={""}>None</MenuItem>
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
              <MenuItem value={""}>None</MenuItem>
              {equipos.map((equipo) => (
                <MenuItem key={equipo} value={equipo}>
                  {equipo}
                </MenuItem>
              ))}
            </StyledSelect>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Container maxWidth={"3400px"}>
              <Grid item container paddingTop={3} paddingBottom={3}>
                <StyledDataGrid
                  {...jugadoresTabla}
                  columns={columns}
                  rows={jugadoresTabla}
                  initialState={{
                    ...jugadoresTabla.initialState,
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  pageSizeOptions={[10, 20]}
                />
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
}
