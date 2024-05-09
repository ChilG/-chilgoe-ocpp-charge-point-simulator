import React from 'react';
import AppPageTitle from '../../src/core/AppPageTitle';
import Container from '@mui/material/Container';

interface IndexProps {}

const Index: React.FC<IndexProps> = (props) => {
  return (
    <Container maxWidth="xl">
      <AppPageTitle title="Settings" />
    </Container>
  );
};

export default Index;
