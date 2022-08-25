import React from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import { Container, Typography, Alert } from '@mui/material';

const Home = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return (
      <Container maxWidth={false}>
        <Typography variant='h5' component="h2" sx={{ my: 3 }} >Congrautaltions - You are now authenticated</Typography>
        <Alert sx={{ border:1, padding: 2, mx: 2 }} severity='success' >Now, you can now use the left navigation menu to navigate to workspaces and open reports.</Alert>
      </Container>
    )
  }
  else {
    return (
      <Container maxWidth={false}>
        <Typography variant='h5' component="h2" sx={{ my: 3 }} >Welcome to the React SPA Starter</Typography>
        <Alert sx={{ border:1, padding: 2, mx: 2 }} severity='info' >Click the <strong>LOGIN</strong> button in the upper right to get started.</Alert>
        </Container>
    )
  }
}

export default Home;