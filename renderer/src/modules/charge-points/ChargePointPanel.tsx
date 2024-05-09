import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { chargePointsListExpanded, chargePointsListNotExpanded } from './ChargePointsList';
import { useLocalStorage } from 'usehooks-ts';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LocalChargePointStatusButton from './LocalChargePointStatusButton';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Terminal from '../../shared/components/Terminal';
import { useTheme } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Overview from './tab-content/Overview';
import Operation from './tab-content/Operation';
import Configurations from './tab-content/Configurations';
import ChargingProfile from './tab-content/ChargingProfile';
import Settings from './tab-content/Settings';
import Task from './tab-content/Task';
import AppSkeleton from '../../core/AppSkeleton';
import { api } from '../../utils/api';
import { ChargePointListPanelItem } from '../../../../main/api/routers/charge-point';

interface ChargePointPanelProps {
  fullWidth?: boolean;
}

const ChargePointPanel: React.FC<ChargePointPanelProps> = ({ fullWidth }) => {
  const theme = useTheme();

  const [chooseChargePoint] = useLocalStorage<ChargePointListPanelItem | null>('choose-charge-points', null);
  const [panelLayoutChargePoint, setPanelLayoutChargePoint] = useLocalStorage<number[]>(
    'panel-layout-charge-points',
    [67, 33],
  );

  const chargePointByIdQuery = api.chargePoint.byIdIgnoreNull.useQuery({
    chargePointId: chooseChargePoint?.chargePointId ?? null,
  });

  const [value, setValue] = useState('overview');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleLayout = (sizes: number[]) => {
    setTimeout(() => {
      setPanelLayoutChargePoint(sizes);
    }, 200);
  };

  return (
    <Paper
      sx={{
        width: `calc(100% - ${fullWidth ? chargePointsListNotExpanded : chargePointsListExpanded}px)`,
        height: '100vh',
      }}
      elevation={0}
    >
      {chooseChargePoint ? (
        <>
          <Container maxWidth="xl" sx={{ p: '0px !important', height: '100%' }}>
            <PanelGroup direction="vertical" onLayout={handleLayout}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, flex: '0 1 auto' }}>
                <AppSkeleton loading={chargePointByIdQuery.isLoading} variant="rounded" width={200} height={25}>
                  <Typography variant="h5">{chargePointByIdQuery.data?.chargePointId}</Typography>
                </AppSkeleton>
                <AppSkeleton loading={chargePointByIdQuery.isLoading} variant="circular" width={40} height={40}>
                  <LocalChargePointStatusButton
                    chargePointId={chargePointByIdQuery.data?.chargePointId}
                    status={chargePointByIdQuery.data?.simulationStatus}
                  />
                </AppSkeleton>
              </Stack>
              <Panel defaultSize={panelLayoutChargePoint[0]}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="charge points"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Overview" value="overview" />
                      <Tab label="Operation" value="operation" />
                      <Tab label="Configurations" value="configurations" />
                      <Tab label="Task" value="task" />
                      <Tab label="Charging Profile" value="charging-profile" />
                      <Tab label="Settings" value="settings" />
                    </TabList>
                  </Box>
                  <TabPanel value="overview">
                    <Overview chargePointId={chargePointByIdQuery.data?.chargePointId} />
                  </TabPanel>
                  <TabPanel value="operation">
                    <Operation chargePointId={chargePointByIdQuery.data?.chargePointId} />
                  </TabPanel>
                  <TabPanel value="configurations">
                    <Configurations chargePointId={chargePointByIdQuery.data?.chargePointId} />
                  </TabPanel>
                  <TabPanel value="task">
                    <Task chargePointId={chargePointByIdQuery.data?.chargePointId} />
                  </TabPanel>
                  <TabPanel value="charging-profile">
                    <ChargingProfile chargePointId={chargePointByIdQuery.data?.chargePointId} />
                  </TabPanel>
                  <TabPanel value="settings">
                    <Settings chargePointId={chargePointByIdQuery.data?.chargePointId} />
                  </TabPanel>
                </TabContext>
              </Panel>
              <PanelResizeHandle>
                <LinearProgress variant="determinate" value={100} />
              </PanelResizeHandle>
              <Panel defaultSize={panelLayoutChargePoint[1]}>
                <Terminal
                  fullHeight
                  lines={
                    [
                      // {
                      //   indicator: '>> Heartbeat',
                      //   indicatorColor: 'red',
                      //   message: ``,
                      //   json: [2, 'c6e60f0c-6f6b-4fdf-b9be-62f23d1af210', 'Heartbeat', {}],
                      // },
                      // {
                      //   indicator: '<< Heartbeat',
                      //   indicatorColor: 'green',
                      //   message: ``,
                      //   json: [3, 'c6e60f0c-6f6b-4fdf-b9be-62f23d1af210', { currentTime: dayjs().toISOString() }],
                      // },
                    ]
                  }
                />
              </Panel>
            </PanelGroup>
          </Container>
        </>
      ) : (
        <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
          <Typography color="textSecondary">No select charge point.</Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default ChargePointPanel;
