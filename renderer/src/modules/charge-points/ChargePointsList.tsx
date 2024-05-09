import React, { useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { LinearProgress } from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';
import ChargePointsListItem from './ChargePointsListItem';
import { api } from '../../utils/api';
import { ChargePointListPanelItem } from '../../../../main/api/routers/charge-point';

interface ChargePointsListProps {
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
}

export const chargePointsListExpanded = 260;
export const chargePointsListNotExpanded = 40;

const ChargePointsList: React.FC<ChargePointsListProps> = ({ expanded = true, onChange }) => {
  const chargePointQuery = api.chargePoint.listPanel.useQuery();

  const [chooseChargePoint, setChooseChargePoint] = useLocalStorage<ChargePointListPanelItem | null>(
    'choose-charge-points',
    null,
  );

  const handleChooseChargePoint = useCallback((chargePoint: ChargePointListPanelItem) => {
    setChooseChargePoint(chargePoint);
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <AppBar
        elevation={0}
        variant="outlined"
        component="div"
        sx={{
          position: 'absolute',
          borderLeftWidth: 0,
          borderTopWidth: 0,
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar sx={{ p: `${expanded ? 2 : '2px !important'}` }}>
          <Stack direction="row" justifyContent={expanded ? 'space-between' : 'center'} sx={{ width: '100%' }}>
            {expanded && (
              <Typography variant="subtitle1" color="textPrimary">
                Local Charge Points
              </Typography>
            )}
            <IconButton aria-label="delete" size="small" onClick={() => onChange(!expanded)}>
              {expanded ? (
                <KeyboardDoubleArrowLeftIcon fontSize="inherit" />
              ) : (
                <KeyboardDoubleArrowRightIcon fontSize="inherit" />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
        {chargePointQuery.isLoading && <LinearProgress />}
      </AppBar>
      <Paper
        sx={{
          width: expanded ? chargePointsListExpanded : chargePointsListNotExpanded,
          height: '100vh',
          borderLeftWidth: 0,
          overflow: 'none',
        }}
        elevation={0}
        variant="outlined"
      >
        <Toolbar />
        {chargePointQuery.isSuccess && (
          <Box sx={{ display: !expanded && 'none', px: 1 }}>
            {chargePointQuery.data.length > 0 ? (
              <List dense>
                {chargePointQuery.data.map((item: ChargePointListPanelItem) => {
                  return <ChargePointsListItem data={item} key={item.chargePointId} />;
                })}
              </List>
            ) : (
              <Stack justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  No Data
                </Typography>
              </Stack>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChargePointsList;
