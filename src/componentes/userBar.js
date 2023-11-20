import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import { orange } from "@mui/material/colors";

export default function UserBar() {
  const { user } = useParams();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const [infoUser, setInfoUser] = useState({});
  const pages = ["Home", "Perfil"];
  const settings = ["Logout"];

  useEffect(() => {
    getUser();
  }, []);

  const styles = {
    appBar: {
      backgroundColor: orange[500],
      boxShadow: 4,
      box: {
        flexGrow: 1,
        display: { xs: "flex", md: "none" },
        height: "100px",
      },
      box2: {
        flexGrow: 1,
        display: { xs: "none", md: "flex" },
        height: "100px",
      },
      menuItenPaginas: {
        margin: 0,
      },
      buttonItemPaginas: {
        color: "white",
        display: "block",
        margin: 0,
        px: 7,
        fontSize: "1.25rem",
      },
    },
  };

  const cambiaAHome = (event) => {
    const selectedIndex = event.target.innerText;
    switch (selectedIndex) {
      case "HOME":
        navigate(`/${user}/recomendador`);
        break;
      case "PERFIL":
        navigate(`/${user}/perfil`);
        break;
      default:
        break;
    }
  };

  const getUser = async () => {
    axios
      .get(`http://localhost:5000/usuario/${user}`)
      .then((response) => {
        setInfoUser(response.data);
      })
      .catch((error) => {
        alert("Error. Usuario no encontrado");
        navigate("/");
      });
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const cierraSesion = () => {
    navigate("/");
  };

  return (
    <AppBar position="static" sx={styles.appBar}>
      <Container maxWidth="100vh">
        <Toolbar disableGutters>
          <Box sx={styles.appBar.box}>
            {pages.map((page) => (
              <MenuItem
                key={page}
                onClick={cambiaAHome}
                sx={styles.appBar.menuItenPaginas}
              >
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Box>
          <Box sx={styles.appBar.box2}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={cambiaAHome}
                sx={styles.appBar.buttonItemPaginas}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={cierraSesion}
                  sx={{ width: "150px" }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
