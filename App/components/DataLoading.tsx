import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const DataLoading = () => {

  return (
    <Box sx={{ width: 1, backgroundColor: "lightyellow", textAlign: "center" }} >
      <CircularProgress size="1.5rem" sx={{ m:1, color: "DarkRed" }} />
    </Box>
  );
  
}

export default DataLoading;