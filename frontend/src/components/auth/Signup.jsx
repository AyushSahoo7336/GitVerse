import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";
import logo from "../../assets/gitverse_logo.png";
import { apiUrl } from "../../config/api";

// Material UI Imports
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  InputAdornment,
  IconButton,
  CssBaseline
} from '@mui/material';
import { Visibility, VisibilityOff, AlternateEmail, LockOutlined, Person } from '@mui/icons-material';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(apiUrl("/signup"), {
        email: email,
        password: password,
        username: username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
      setLoading(false);
    }
  };
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: '#f3f4f6',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&.Mui-focused fieldset': { borderColor: '#10b981' }, 
    },
    '& .MuiInputLabel-root': { color: '#9ca3af' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' }, 
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: '#6b7280' },
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0b1220 0%, #081222 100%)',
          padding: 2,
          zIndex: 0,
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#1e293b', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Logo Container */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <img 
                src={logo} 
                alt="GitVerse Logo" 
                style={{ width: '60px', height: 'auto', borderRadius: '8px' }} 
              />
            </Box>

            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                color: '#f3f4f6', 
                fontWeight: 700, 
                mb: 1,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace'
              }}
            >
              Sign Up
            </Typography>

            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 4, textAlign: 'center' }}>
              Join the developer universe.
            </Typography>

            <Box component="form" onSubmit={handleSignup} sx={{ width: '100%' }}>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#9ca3af' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                  color: 'white',
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Already have an account?{' '}
                  <Link 
                    to="/auth" 
                    style={{ 
                      color: '#10b981', 
                      textDecoration: 'none', 
                      fontWeight: 500 
                    }}
                  >
                    Login
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Signup;
