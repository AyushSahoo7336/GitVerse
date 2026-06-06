import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar"; 
import { Box, Typography, Card, CardContent, TextField, InputAdornment, List, ListItem, ListItemText, ListItemIcon, CssBaseline, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, FormControlLabel, Switch } from "@mui/material";
import { Search, Book, StarBorder, Code, Add, Public, Lock, Terminal } from "@mui/icons-material";
import { apiUrl } from "../../config/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRepoData, setNewRepoData] = useState({ name: "", description: "", visibility: true });

  const fetchUserRepositories = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    try {
      const response = await fetch(apiUrl(`/repo/user/${userId}`), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRepositories(data.repositories || []);
      }
    } catch (err) {
      console.error("Error fetching repositories: ", err);
    }
  }, []);
  
  const fetchSuggestedRepositories = useCallback(async () => {
    try {
      const response = await fetch(apiUrl("/repo/all"));
      const data = await response.json();
      setSuggestedRepositories(data || []);
    } catch (err) {
      console.error("Error fetching suggested repositories: ", err);
    }
  }, []);

  useEffect(() => {
    fetchUserRepositories();
    fetchSuggestedRepositories();
  }, [fetchUserRepositories, fetchSuggestedRepositories]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      setSearchResults(repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery, repositories]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewRepoData({ name: "", description: "", visibility: true });
  };

  const handleCreateRepo = async () => {
    setIsCreating(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(apiUrl("/repo/create"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newRepoData.name, description: newRepoData.description, visibility: newRepoData.visibility, owner: userId, content: [], issues: [] }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchUserRepositories();
        handleCloseModal();
      } else {
        alert(data.error || "Failed to create repository");
      }
    } catch (err) {
      console.error("Error creating repo:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: '#f3f4f6', backgroundColor: '#06080f', borderRadius: '6px',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&.Mui-focused fieldset': { borderColor: '#00f2fe' }, 
    },
    '& .MuiInputLabel-root': { color: '#9ca3af' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#00f2fe' }, 
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#06080f', overflowX: 'hidden' }}>
      <CssBaseline />
      <Navbar />
      
      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%' }}>
        
        <Box sx={{ width: { xs: '100%', md: '340px' }, backgroundColor: '#121521', borderRight: '1px solid rgba(255, 255, 255, 0.05)', display: { xs: 'none', md: 'block' }, p: 3, pt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#f3f4f6', fontWeight: 700, fontFamily: 'monospace' }}>Your Repositories</Typography>
            <Button variant="contained" size="small" startIcon={<Add />} onClick={handleOpenModal} sx={{
                background: 'linear-gradient(45deg, #00f2fe 10%, #8b5cf6 90%)', color: 'white', fontWeight: 600, textTransform: 'none', borderRadius: '6px', px: 1.5,
                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.2)', '&:hover': { background: 'linear-gradient(45deg, #00c3cc 10%, #7c3aed 90%)' }
              }}>New</Button>
          </Box>
          <TextField fullWidth size="small" variant="outlined" placeholder="Find a repository..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Search sx={{ color: '#6b7280', fontSize: 18 }} /></InputAdornment>) }}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { backgroundColor: '#06080f', color: '#f3f4f6', borderRadius: '6px', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.05)' }, '&.Mui-focused fieldset': { borderColor: '#00f2fe' } } }}
          />
          <List disablePadding sx={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            {searchResults.map((repo) => (
              <ListItem 
                key={repo._id} 
                disableGutters 
                onClick={() => navigate(`/repo/${repo._id}`)} 
                sx={{ py: 1, px: 1, borderRadius: '6px', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}><Code sx={{ color: '#00f2fe', fontSize: 18 }} /></ListItemIcon>
                <ListItemText primary={<Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.name}</Typography>} />
                {repo.visibility === false ? <Lock sx={{ color: '#6b7280', fontSize: 14 }} /> : <Public sx={{ color: '#6b7280', fontSize: 14 }} />}
              </ListItem>
            ))}
            {searchResults.length === 0 && <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic', pl: 1 }}>No repositories found.</Typography>}
          </List>
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 3, md: 4, lg: 5 }, 
          overflowY: 'auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4, 
            width: '100%' 
          }}>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 0%' } }}>
              <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarBorder sx={{ color: '#00f2fe' }} /> Explore Projects
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {suggestedRepositories.map((repo) => (
                  <Card 
                    key={repo._id} 
                    elevation={0} 
                    onClick={() => navigate(`/repo/${repo._id}`)} 
                    sx={{ 
                      backgroundColor: '#121521', 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      borderRadius: '10px', 
                      transition: 'all 0.2s', 
                      cursor: 'pointer', 
                      '&:hover': { transform: 'translateY(-2px)', borderColor: 'rgba(139, 92, 246, 0.3)' } 
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Book sx={{ color: '#8b5cf6', fontSize: 20 }} />
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                          <Typography variant="subtitle1" sx={{ color: '#00f2fe', fontWeight: 600 }}>
                            {repo.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#8b949e', backgroundColor: 'rgba(139, 92, 246, 0.1)', px: 1, py: 0.3, borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                            @{repo.owner?.username || "unknown"}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
                        {repo.description || "A pristine repository inside the GitVerse ecosystem."}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {suggestedRepositories.length === 0 && (
                  <Card elevation={0} sx={{ backgroundColor: 'transparent', border: '1px dashed rgba(255, 255, 255, 0.2)', borderRadius: '10px', p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>No suggested projects found right now. Check back later!</Typography>
                  </Card>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Terminal sx={{ color: '#00f2fe' }} /> CLI Quick Guide
              </Typography>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Start Server</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js start
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Initialize Repository</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js init
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>3. Link Remote Repo</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js remote add &lt;repoId&gt;
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>4. Stage Files</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js add &lt;file&gt;
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>5. Commit Changes</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js commit "&lt;message&gt;"
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>6. Push to Cloud</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js push
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>7. Pull from Cloud</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js pull
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>8. Revert to Commit</Typography>
                      <Box sx={{ backgroundColor: '#010409', p: 1.5, mt: 0.5, borderRadius: '6px', border: '1px solid #21262d', fontFamily: 'monospace', color: '#e6edf3', fontSize: '13px' }}>
                        <span style={{ color: '#3fb950' }}>$</span> node index.js revert &lt;commitID&gt;
                      </Box>
                    </Box>
                  </Box>
        </Box>
      </Box>
    </Box>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm" PaperProps={{ sx: { backgroundColor: '#121521', color: '#f3f4f6', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', p: 1 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', pb: 2, fontWeight: 600 }}>Create a new repository</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField fullWidth required label="Repository Name" variant="outlined" value={newRepoData.name} onChange={(e) => setNewRepoData({ ...newRepoData, name: e.target.value })} sx={{ ...inputSx, mb: 3 }} />
          <TextField fullWidth label="Description (optional)" variant="outlined" multiline rows={3} value={newRepoData.description} onChange={(e) => setNewRepoData({ ...newRepoData, description: e.target.value })} sx={{ ...inputSx, mb: 3 }} />
          <FormControlLabel control={<Switch checked={newRepoData.visibility} onChange={(e) => setNewRepoData({ ...newRepoData, visibility: e.target.checked })} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#00f2fe' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00f2fe' } }} />} label={newRepoData.visibility ? "Public (Anyone can see this)" : "Private (You choose who can see this)"} sx={{ color: '#f3f4f6', '& .MuiTypography-root': { fontSize: '0.85rem', color: '#9ca3af' } }} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRepo} disabled={!newRepoData.name.trim() || isCreating} sx={{
              background: 'linear-gradient(45deg, #00f2fe 10%, #8b5cf6 90%)', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: '6px', px: 3, '&.Mui-disabled': { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }
            }}>
            {isCreating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;