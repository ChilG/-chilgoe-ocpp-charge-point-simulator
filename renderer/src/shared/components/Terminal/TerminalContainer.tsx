import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

export interface TerminalContainerProps {
  fullHeight?: boolean;
  boxProps?: BoxProps;
  children: React.ReactNode;
}

const TerminalContainer: React.FC<TerminalContainerProps> = ({ fullHeight, children, boxProps }) => {
  return (
    <Box
      sx={{ p: 4, background: '#1E1E1E', height: fullHeight ? '100%' : undefined, '& button.jv-button': { color: '#da70d6' }, ...boxProps?.sx }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default TerminalContainer;
