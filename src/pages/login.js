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
    <Typography variant="h5" color="text.secondary" align="center" {...props}>
      Memoria del proyecto en{" "}
      <BsGithub id="logoGithub" onClick={github} cursor={"pointer"} />
      <br />
      Powered by <SiNeo4J id="logoNeo4j" onClick={neo} cursor={"pointer"} />
      <br />
      <a
        href={"https://ingenierias.unileon.es/"}
        target={"_blank"}
        rel="noopener noreferrer external"
      >
        Escuela de Ingenierías Universidad de León
      </a>
    </Typography>
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
            alert(
              "Usuario registrado correctamente"
            );
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
            backgroundColor: "#FF862C",
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
            <Typography component="h1" variant="h4">
              ¡INICIA SESION!
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={iniciaSesion}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="usuario"
                placeholder="Usuario"
                name="usuario"
                autoComplete="usuario"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="contrasenia"
                placeholder="Contraseña"
                type="password"
                id="contrasenia"
                autoComplete="contraseña-actual"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#F3A062" }}
              >
                INICIA SESION
              </Button>
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
            <Typography component="h1" variant="h4">
              ¡REGISTRATE YA!
            </Typography>
            <Box component="form" noValidate onSubmit={registraUsuario}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="usuario-registro"
                label="Usuario"
                name="usuario-registro"
                autoComplete="usuario"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="contrasenia-registro"
                label="Contraseña"
                type="password"
                id="contrasenia-registro"
                autoComplete="contraseña"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="contrasenia-registro-comprobacion"
                label="Confirmar contraseña"
                type="password"
                id="contrasenia-registro-comprobacion"
                autoComplete="contraseña"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#F3A062" }}
              >
                REGISTRATE
              </Button>
              <Copyright sx={{ mt: 2 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
