import React, { useMemo } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const Heatmap = ({ heatmapData, loading, totalContributions }) => {
  const getColor = (count) => {
    if (count === 0) return '#161b22'; 
    if (count <= 2) return '#0e4429';  
    if (count <= 4) return '#006d32';  
    if (count <= 6) return '#26a641';  
    return '#39d353';                  
  };

  const monthBlocks = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) return [];

    const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const blocks = [];
    let currentMonthStr = null;
    let currentBlock = null;
    let currentCol = null;

    heatmapData.forEach((day, index) => {
      if (!day || !day.date) return;
      const parts = day.date.split("-");
      if (parts.length !== 3) return;

      const year = parts[0];
      const month = parts[1];
      const monthStr = `${year}-${month}`; 
      const rowIndex = index % 7;          

      if (monthStr !== currentMonthStr) {
        if (currentCol) {
          while (currentCol.length < 7) currentCol.push(null);
          currentBlock.columns.push(currentCol);
        }
        currentMonthStr = monthStr;
        currentBlock = {
          name: monthsArr[parseInt(month, 10) - 1],
          columns: []
        };
        blocks.push(currentBlock);
        currentCol = null;
      }

      if (!currentCol) {
        currentCol = [];
        for (let i = 0; i < rowIndex; i++) {
          currentCol.push(null);
        }
      }

      currentCol.push(day);

      if (rowIndex === 6) {
        currentBlock.columns.push(currentCol);
        currentCol = null;
      }
    });

    if (currentCol) {
      while (currentCol.length < 7) currentCol.push(null);
      currentBlock.columns.push(currentCol);
    }

    return blocks;
  }, [heatmapData]);

  return (
    <Box sx={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', p: 3 }}>
      <Typography variant="body2" sx={{ color: '#8b949e', mb: 3 }}>
        {loading ? "Calculating..." : `${totalContributions} contributions in the last year`}
      </Typography>
      
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress sx={{ color: '#26a641' }} />
          </Box>
        ) : (
          <Box sx={{ minWidth: 'max-content', pt: 1, pr: 2 }}>
            <Box sx={{ display: 'flex' }}>
              
              <Box sx={{ display: 'flex', gap: '16px' }}> 
                {monthBlocks.map((block, bIdx) => (
                  <Box key={bIdx} sx={{ display: 'flex', flexDirection: 'column' }}>
                    
                    <Box sx={{ display: 'flex', gap: '4px' }}>
                      {block.columns.map((col, cIdx) => (
                        <Box key={cIdx} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {col.map((day, dIdx) => (
                            day ? (
                              <Box 
                                key={dIdx} 
                                title={`${day.count} commits on ${day.date}`}
                                sx={{ 
                                  width: '12px', height: '12px', backgroundColor: getColor(day.count), borderRadius: '2px',
                                  transition: 'transform 0.1s', '&:hover': { transform: 'scale(1.2)', border: '1px solid rgba(255,255,255,0.2)' }
                                }} 
                              />
                            ) : (
                              <Box key={`empty-${dIdx}`} sx={{ width: '12px', height: '12px', backgroundColor: 'transparent' }} />
                            )
                          ))}
                        </Box>
                      ))}
                    </Box>

                    <Typography sx={{ color: '#8b949e', fontSize: '12px', mt: 1, textAlign: 'left' }}>
                      {block.name}
                    </Typography>
                  </Box>
                ))}
              </Box>

            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Heatmap;