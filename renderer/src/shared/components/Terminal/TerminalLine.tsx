import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import JsonView from 'react18-json-view';

export interface TerminalLineProps {
  indicator?: string;
  indicatorColor?: TypographyProps['color'];
  message: string;
  json?: any;
}

const TerminalLine: React.FC<TerminalLineProps> = ({ message, indicator = '$', indicatorColor = 'gray', json }) => {
  return (
    <Stack direction="row" spacing={1}>
      {indicator && <Typography color={indicatorColor}>{indicator}</Typography>}{' '}
      {message && <Typography sx={{ color: '#eee', userSelect: 'all' }}>{message}</Typography>}
      {json && <JsonView src={json} collapsed={0} dark theme="vscode" style={{ userSelect: 'auto' }} />}
    </Stack>
  );
};

export default TerminalLine;
