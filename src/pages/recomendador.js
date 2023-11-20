import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { BsGithub } from "react-icons/bs";
import { SiNeo4J } from "react-icons/si";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserBar from "../componentes/userBar";

const defaultTheme = createTheme();

export default function Recomendador() {
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
      ></Grid>
    </ThemeProvider>
  );
}
