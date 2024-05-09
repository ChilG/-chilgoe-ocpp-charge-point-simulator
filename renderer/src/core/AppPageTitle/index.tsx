import React from 'react';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

interface AppPageTitleProps {
  title: string;
  description?: string;
}

const AppPageTitle: React.FC<AppPageTitleProps> = ({ title, description }) => {
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom={description === undefined} component="h3">
        <b>{title}</b>
      </Typography>
      {description && (
        <Typography gutterBottom variant="subtitle1" sx={{ fontWeight: 400 }} component="p" color="textSecondary">
          {description}
        </Typography>
      )}
    </Stack>
  );
};

export default AppPageTitle;
