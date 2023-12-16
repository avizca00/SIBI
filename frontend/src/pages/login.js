import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { BsGithub } from "react-icons/bs";
import { SiNeo4J } from "react-icons/si";
import axios from "axios";
import logo from "../logo/logo.jpg";
import { styled } from "@mui/material";

const StyledTypography = styled(Typography)({
  color: "#fbfdfb",
  fontSize: "2.5rem",
  fontFamily: "Times New Roman",
});

const StyledTypography2 = styled(Typography)({
  color: "#fbfdfb",
  fontSize: "1.2rem",
  fontFamily: "Times New Roman",
});

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    color: "blue",
    fontSize: "1.25rem",
    fontFamily: "Times New Roman",
    borderRadius: "10px",
    overflow: "hidden", // Add this line to hide overflow
    backgroundColor: "#8ecbfa",
    width: "100%", // Add this line to set the width
  },
  backgroundColor: "#081552",
  overflow: "hidden", // Add this line to hide overflow
  width: "100%", // Add this line to set the width
});

const StyledButton = styled(Button)({
  backgroundColor: "#fd7528",
  color: "white",
  borderRadius: "5px",
  padding: "10px 20px",
  fontSize: "1.1rem",
  fontFamily: "Times New Roman",
  marginTop: "15px",
  "&:hover": {
    backgroundColor: "#fa5128",
  },
});

function Copyright(props) {
  /**
   * Función que abre la página de github del proyecto
   */
  const github = () => {
    window.open("https://github.com/avizca00/sibi", "_blank");
  };

  /**
   * Función que abre la página de neo4j
   */
  const neo = () => {
    window.open("https://neo4j.com", "_blank");
  };

  return (
    <StyledTypography2
      variant="h5"
      color="text.secondary"
      align="center"
      {...props}
    >
      Memoria del proyecto en{" "}
        <BsGithub id="logoGithub" onClick={github} cursor={"pointer"} />
      <br />
      Powered by{" "}
        <SiNeo4J id="logoNeo4j" onClick={neo} cursor={"pointer"} />
      <br />
      <a
        href={"https://ingenierias.unileon.es/"}
        target={"_blank"}
        rel="noopener noreferrer external"
        style={{ color: "#c70755" }}
      >
        Escuela de Ingenierías Universidad de León
      </a>
    </StyledTypography2>
  );
}
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();

  const iniciaSesion = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let usuario = data.get("usuario");
    let contra = data.get("contrasenia");

    let body = { usuario: usuario, contrasenia: contra };

    axios
      .post("http://localhost:5000/inicioSesion", body)
      .then((res) => {
        if (res.status === 200) {
          alert("Usuario encontrado.\nRediriendo al Recomendador...");
          navigate("/" + usuario + "/recomendador", { replace: true });
        }
      })
      .catch((err) => {
        alert("Usuario o contraseña incorrectos");
      });
  };

  const registraUsuario = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let usuario = data.get("usuario-registro");
    let contra = data.get("contrasenia-registro");
    let contra_conf = data.get("contrasenia-registro-comprobacion");

    if (contra !== contra_conf) {
      alert("Las contraseñas son distintas");
    } else {
      let body = { usuario: usuario, contrasenia: contra };

      axios
        .post("http://localhost:5000/registro", body)
        .then((res) => {
          if (res.status === 200) {
            alert("Usuario registrado correctamente");
          } else {
            alert("El usuario a registrar ya existe");
          }
        })
        .catch((err) => {
          alert("No se ha podido registrar el usuario");
        });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(" + logo + ")",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            backgroundColor: "#07043b",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StyledTypography>¡INICIA SESION!</StyledTypography>
            <Box
              component="form"
              noValidate
              onSubmit={iniciaSesion}
              sx={{ mt: 1 }}
            >
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="usuario"
                placeholder="Usuario"
                name="usuario"
                autoComplete="usuario"
                autoFocus
              />
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="contrasenia"
                placeholder="Contraseña"
                type="password"
                id="contrasenia"
                autoComplete="contraseña-actual"
              />
              <StyledButton type="submit" fullWidth variant="contained">
                INICIA SESION
              </StyledButton>
            </Box>
          </Box>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StyledTypography component="h1" variant="h4">
              ¡REGISTRATE YA!
            </StyledTypography>
            <Box component="form" noValidate onSubmit={registraUsuario}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="usuario-registro"
                placeholder="Usuario"
                name="usuario-registro"
                autoComplete="usuario"
                autoFocus
              />
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="contrasenia-registro"
                placeholder="Contraseña"
                type="password"
                id="contrasenia-registro"
                autoComplete="contraseña"
              />
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="contrasenia-registro-comprobacion"
                placeholder="Confirmar contraseña"
                type="password"
                id="contrasenia-registro-comprobacion"
                autoComplete="contraseña"
              />
              <StyledButton type="submit" fullWidth variant="contained">
                REGISTRATE
              </StyledButton>
              <Copyright sx={{ mt: 2 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
