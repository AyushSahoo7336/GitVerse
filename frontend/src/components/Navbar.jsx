import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { AddBox, AccountCircle } from "@mui/icons-material";

import logo from "../assets/gitverse_logo.png"; 

const Navbar = () => {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: '#06080f', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Box sx={{ width: '100%', px: { xs: 2, md: 4 } }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
          
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1.5 }}>
            <img src={logo} alt="GitVerse Logo" style={{ width: '36px', height: 'auto', borderRadius: '6px' }} />
            <Typography variant="h6" noWrap sx={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>
              Git<Box component="span" sx={{ 
                background: 'linear-gradient(45deg, #00f2fe 10%, #8b5cf6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'sans-serif' 
              }}>Verse</Box>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button component={Link} to="/profile" startIcon={<AccountCircle />} sx={{
                color: '#f3f4f6', textTransform: 'none', fontWeight: 600, borderRadius: '8px', padding: '6px 16px', backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}>
              Profile
            </Button>
          </Box>

        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Navbar;