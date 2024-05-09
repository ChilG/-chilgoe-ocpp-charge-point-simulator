import React from 'react';
import TerminalLine, { TerminalLineProps } from './TerminalLine';
import Box from '@mui/material/Box';

interface TerminalProps {
  fullHeight?: boolean;
  lines: TerminalLineProps[];
}

const Terminal: React.FC<TerminalProps> = ({ lines = [], fullHeight = false }) => {
  return (
    <Box sx={{ p: 4, background: '#1E1E1E', height: fullHeight ? '100%' : undefined, '& button.jv-button': { color: '#da70d6' } }}>
      {lines.length > 0 ? lines.map((props, index) => <TerminalLine key={index} {...props} />) : <TerminalLine message="" />}
    </Box>
  );
};

export default Terminal;
