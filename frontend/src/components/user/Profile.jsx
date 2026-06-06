import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Avatar, CssBaseline, CircularProgress } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Heatmap from "./HeatMap"; 
import { apiUrl } from "../../config/api";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState({ username: "Loading..." });
  const [heatmapData, setHeatmapData] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/auth");
        return;
      }

      try {
        // 1. Fetch User Details from MongoDB
        const userRes = await fetch(apiUrl(`/userProfile/${userId}`), {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (userRes.ok) {
          const uData = await userRes.json();
          console.log("USER API RESPONSE:", uData);
          
          let finalUsername = "Developer"; 
          
          if (Array.isArray(uData) && uData.length > 0) {
            finalUsername = uData[0].username || uData[0].userName || "Developer";
          } else if (uData.user && Array.isArray(uData.user) && uData.user.length > 0) {
            finalUsername = uData.user[0].username || uData.user[0].userName || "Developer";
          } else if (uData.user) {
            finalUsername = uData.user.username || uData.user.userName || "Developer";
          } else {
            finalUsername = uData.username || uData.userName || "Developer";
          }
          
          setUserData({ username: finalUsername });
        } else {
          setUserData({ username: "Developer" });
        }

        // 2. Fetch Repositories to calculate dynamic heatmap
        const repoRes = await fetch(apiUrl(`/repo/user/${userId}`), {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (repoRes.ok) {
          const repoData = await repoRes.json();
          const repos = repoData.repositories || [];
          
          const commitDates = [];
          repos.forEach(repo => {
            const commits = repo.content || repo.commits || [];
            commits.forEach(commit => {
              if (commit.timestamp || commit.date) {
                commitDates.push(new Date(commit.timestamp || commit.date).toISOString().split('T')[0]);
              }
            });
          });

          setTotalContributions(commitDates.length);

          const today = new Date();
          const calendar = [];
          for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            
            const count = commitDates.filter(cd => cd === dateStr).length;
            calendar.push({ date: dateStr, count });
          }
          setHeatmapData(calendar);
        }

      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/auth");
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#06080f', overflowX: 'hidden', color: '#c9d1d9' }}>
      <CssBaseline />
      <Navbar />

      <Box sx={{ borderBottom: '1px solid #30363d', px: { xs: 2, md: 5 }, pt: 3, display: 'flex', gap: 4 }}>
         <Typography sx={{ pb: 1.5, borderBottom: '2px solid #f78166', color: '#f3f4f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            Overview
         </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, px: { xs: 2, md: 5 }, py: 5, maxWidth: '1400px' }}>        
        
        <Box sx={{ width: { xs: '100%', md: '300px' }, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          
          <Avatar 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} 
            sx={{ width: 250, height: 250, border: '2px solid #30363d', mb: 3, backgroundColor: '#121521' }} 
          />
          
          {loading ? <CircularProgress size={24} sx={{ color: '#58a6ff', mb: 2 }} /> : (
              <Typography variant="h4" sx={{ color: '#f3f4f6', fontWeight: 700, mb: 0.5 }}>
                @{userData.username}
              </Typography>
          )}
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ color: '#f3f4f6', mb: 2 }}>Contributions</Typography>
            
            <Heatmap 
              heatmapData={heatmapData} 
              loading={loading} 
              totalContributions={totalContributions} 
            />
            
        </Box>

      </Box>

      <Box sx={{ position: 'fixed', bottom: 30, right: 30 }}>
         <Button 
            onClick={handleLogout}
            variant="outlined" 
            color="error" 
            startIcon={<Logout />}
            sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600, backgroundColor: 'rgba(248, 81, 73, 0.1)' }}
         >
             Logout
         </Button>
      </Box>

    </Box>
  );
};

export default Profile;