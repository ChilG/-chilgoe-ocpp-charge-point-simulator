import React from 'react';
import AppPageTitle from '../src/core/AppPageTitle';
import Container from '@mui/material/Container';

interface CentralSystemProps {}

const CentralSystem: React.FC<CentralSystemProps> = (props) => {
  return (
    <Container maxWidth="xl">
      <AppPageTitle title="Debug" />
    </Container>
  );
};

export default CentralSystem;
