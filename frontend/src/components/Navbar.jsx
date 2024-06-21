import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Drawer,
  List,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutBtn";
import Logo from "../assets/logo2.png";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <React.Fragment>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { sm: "block", md: "none" } }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to="/invoices"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={Logo} alt="Invoice Alert" style={{ width: "5rem" }} />
              </Link>
            </Typography>
            <nav style={{ display: "flex" }}>
              <MenuItem
                component={Link}
                to="/invoices"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  fontWeight: "bold",
                }}
              >
                Invoices
              </MenuItem>
              <MenuItem
                component={Link}
                to="/create-invoice"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  fontWeight: "bold"
                }}
              >
                Create Invoice
              </MenuItem>
            </nav>
            <LogoutButton />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for small screens */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <MenuItem
              component={Link}
              to="/invoices"
              onClick={toggleDrawer}
              key="invoices"
            >
              Invoices
            </MenuItem>
            <MenuItem
              component={Link}
              to="/create-invoice"
              onClick={toggleDrawer}
              key="create-invoice"
            >
              Create Invoice
            </MenuItem>
            {/* Add more MenuItems for other links */}
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default Navbar;
