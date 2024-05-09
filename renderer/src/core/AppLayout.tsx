import React, { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import EvStationIcon from '@mui/icons-material/EvStation';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useRouter } from 'next/router';
import { NoSsr, styled } from '@mui/material';
import { useDrawer } from '../store/useDrawer';
import DialogAddChargePoint, { DialogAddChargePointValue } from '../shared/components/DialogAddChargePoint';
import SettingsIcon from '@mui/icons-material/Settings';
import { DefaultDialogState } from '../shared/interface/Dialog';

interface AppLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 75;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();

  const { open: openDrawer, setOpen: setOpenDrawer } = useDrawer();

  const [dialog, setDialog] = useState<DefaultDialogState>({
    open: false,
    target: null,
  });

  const handleCloseDialog = useCallback(() => {
    setDialog({ ...dialog, open: false });
    setDialog({ ...dialog, open: false, target: null });
    setTimeout(() => {}, 200);
  }, [dialog]);

  const handleClickAddChargePoint = useCallback(() => {
    setDialog({ open: true, target: 'add-charge-point' });
  }, []);

  const handleSubmitAddChargePoint = useCallback((value: DialogAddChargePointValue) => {
    console.log(value);
  }, []);

  return (
    <NoSsr>
      <Stack direction="row" sx={{ height: '100vh', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: 30,
            WebkitUserSelect: 'none',
            userSelect: 'none',
            WebkitAppRegion: 'drag',
            background: 'transparent',
          }}
        />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={openDrawer}
        >
          <Paper sx={{ height: '100vh', p: 1, pt: 4, pr: 0.5 }}>
            <Stack spacing={2} justifyContent="space-between" sx={{ height: '100%', py: 1 }}>
              <Stack spacing={2} alignItems="center">
                <Tooltip title="Home" arrow placement="right">
                  <IconButton aria-label="home" size="large" onClick={() => router.push('/home')}>
                    <HomeIcon fontSize="inherit" color={router.pathname === '/home' ? 'primary' : undefined} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Charge Points" arrow placement="right">
                  <IconButton aria-label="charge-points" size="large" onClick={() => router.push('/charge-points')}>
                    <EvStationIcon
                      fontSize="inherit"
                      color={router.pathname === '/charge-points' ? 'primary' : undefined}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings" arrow placement="right">
                  <IconButton aria-label="settings" size="large" onClick={() => router.push('/settings')}>
                    <SettingsIcon fontSize="inherit" color={router.pathname === '/settings' ? 'primary' : undefined} />
                  </IconButton>
                </Tooltip>
                {process.env.NODE_ENV !== 'production' && (
                  <Tooltip title="Debug" arrow placement="right">
                    <IconButton aria-label="debug" size="large" onClick={() => router.push('/debug')}>
                      <BugReportIcon fontSize="inherit" color={router.pathname === '/debug' ? 'primary' : undefined} />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
              <Stack spacing={2} alignItems="center">
                <Tooltip title="Add Charge Point" arrow placement="right">
                  <Fab size="medium" color="primary" aria-label="add-charge-point" onClick={handleClickAddChargePoint}>
                    <AddIcon fontSize="medium" color={dialog.target === 'add-charge-point' ? 'primary' : undefined} />
                  </Fab>
                </Tooltip>
              </Stack>
            </Stack>
          </Paper>
        </Drawer>
        <Main open={openDrawer}>{children}</Main>
        {dialog.target === 'add-charge-point' && (
          <DialogAddChargePoint open={dialog.open} onClose={handleCloseDialog} onSubmit={handleSubmitAddChargePoint} />
        )}
      </Stack>
    </NoSsr>
  );
};

export default AppLayout;
