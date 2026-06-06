import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CssBaseline, Button, CircularProgress, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ArrowBack, Commit as CommitIcon, InsertDriveFile } from "@mui/icons-material"; // Added file icon
import Navbar from "../Navbar";
import { apiUrl } from "../../config/api";

const RepoView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // File Explorer States
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]); 
  const [activeFile, setActiveFile] = useState(null); 
  const [isLoadingFile, setIsLoadingFile] = useState(false); 

  useEffect(() => {
    const fetchCommits = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(apiUrl(`/repo/${id}/commits`), {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCommits(data);
        }
      } catch (err) {
        console.error("Error fetching commits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [id]);

  const handleCommitClick = async (commit) => {
    setSelectedCommit(commit);
    setIsCodeModalOpen(true);
    setFileList([]); 
    setActiveFile(null); 

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl(`/repo/commits/${commit.commitID}/files`), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const files = await response.json();
      setFileList(files); 
    } catch (err) {
      console.error("Error fetching file list:", err);
    }
  };

  const handleFileClick = async (file) => {
    setIsLoadingFile(true);
    try {
      const fileRes = await fetch(file.secure_url);
      const text = await fileRes.text();
      const fileName = file.public_id.split('/').pop();
      setActiveFile({ name: fileName, content: text });
    } catch (err) {
      console.error("Error fetching file content:", err);
    } finally {
      setIsLoadingFile(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#06080f', overflowX: 'hidden' }}>
      <CssBaseline />
      <Navbar />
      
      <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '900px', margin: '0 auto' }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate("/")}
          sx={{ color: '#9ca3af', textTransform: 'none', mb: 4, '&:hover': { color: '#00f2fe' } }}
        >
          Back to Dashboard
        </Button>

        <Typography variant="h4" sx={{ color: '#f3f4f6', fontWeight: 700, mb: 1, fontFamily: 'monospace' }}>
          Commit History
        </Typography>
        <Typography variant="body1" sx={{ color: '#9ca3af', mb: 5 }}>
          Tracking the evolution of your code.
        </Typography>

        {loading ? (
          <CircularProgress sx={{ color: '#00f2fe' }} />
        ) : commits.length === 0 ? (
          <Card elevation={0} sx={{ backgroundColor: 'transparent', border: '1px dashed rgba(255, 255, 255, 0.2)', borderRadius: '10px', p: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>No commits found yet. Run `node index.js push` to populate this timeline!</Typography>
          </Card>
        ) : (
          <Box sx={{ position: 'relative', ml: 2 }}>
            <Box sx={{ position: 'absolute', left: '11px', top: '20px', bottom: 0, width: '2px', backgroundColor: 'rgba(0, 242, 254, 0.2)' }} />

            {commits.map((commit, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 4, position: 'relative' }}>
                <Box sx={{ mt: 1, mr: 3, zIndex: 1 }}>
                  <Box sx={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#121521', border: '2px solid #00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(0, 242, 254, 0.5)' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00f2fe' }} />
                  </Box>
                </Box>

                <Card 
                  elevation={0} 
                  onClick={() => handleCommitClick(commit)}
                  sx={{ 
                    flexGrow: 1, backgroundColor: '#121521', border: '1px solid rgba(255, 255, 255, 0.05)', 
                    borderRadius: '10px', transition: 'all 0.2s', cursor: 'pointer',
                    '&:hover': { borderColor: '#00f2fe', transform: 'translateX(4px)' } 
                  }}
                >
                  <CardContent sx={{ p: 3, pb: "24px !important" }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 600 }}>{commit.message}</Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af', backgroundColor: 'rgba(255, 255, 255, 0.05)', px: 1.5, py: 0.5, borderRadius: '4px', fontFamily: 'monospace' }}>
                        {new Date(commit.timestamp).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <CommitIcon sx={{ color: '#8b5cf6', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: '#8b5cf6', fontFamily: 'monospace', fontSize: '13px' }}>{commit.commitID}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Dialog open={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { backgroundColor: '#121521', color: '#f3f4f6', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
            {activeFile ? activeFile.name : selectedCommit?.message || "Repository Files"}
          </Typography>
          <Button onClick={() => setIsCodeModalOpen(false)} sx={{ color: '#9ca3af', textTransform: 'none' }}>Close</Button>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 3, minHeight: '400px' }}>
          
          {fileList.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress sx={{ color: '#00f2fe' }} /></Box>
          ) 
          
          : activeFile ? (
            <Box>
              <Button onClick={() => setActiveFile(null)} sx={{ color: '#9ca3af', mb: 2, textTransform: 'none' }} startIcon={<ArrowBack />}>
                Back to File List
              </Button>
              <Box sx={{ backgroundColor: '#06080f', p: 2, borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
                <pre style={{ margin: 0, color: '#e5e7eb', fontFamily: 'monospace', fontSize: '13px' }}>
                  <code>{activeFile.content}</code>
                </pre>
              </Box>
            </Box>
          ) 
          
          : isLoadingFile ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress sx={{ color: '#8b5cf6' }} /></Box>
          ) 
          
          : (
            <List sx={{ p: 0 }}>
              {fileList.map((file, idx) => {
                const fileName = file.public_id.split('/').pop();
                return (
                  <ListItem 
                    key={idx} 
                    onClick={() => handleFileClick(file)}
                    sx={{ 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      mb: 1, 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: '#1a1d2d',
                      '&:hover': { backgroundColor: 'rgba(0, 242, 254, 0.05)', borderColor: '#00f2fe' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}><InsertDriveFile sx={{ color: '#9ca3af' }}/></ListItemIcon>
                    <ListItemText primary={<Typography sx={{ color: '#e5e7eb', fontFamily: 'monospace', fontWeight: 500 }}>{fileName}</Typography>} />
                  </ListItem>
                )
              })}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RepoView;