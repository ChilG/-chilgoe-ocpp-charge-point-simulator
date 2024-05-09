import React, { useCallback, useMemo, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircleIcon from '@mui/icons-material/Circle';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { useLocalStorage } from 'usehooks-ts';
import IconButton from '@mui/material/IconButton';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Fade from '@mui/material/Fade';
import { green } from '@mui/material/colors';
import { ChargePointListPanelItem } from '../../../../main/api/routers/charge-point';
import { api } from '../../utils/api';
import { SimulateStatusEnum } from '../../shared/enum/app/SimulateStatus';

interface ChargePointsListItemProps {
  data: ChargePointListPanelItem;
}

const ChargePointsListItem: React.FC<ChargePointsListItemProps> = ({ data }) => {
  const [chooseChargePoint, setChooseChargePoint] = useLocalStorage<ChargePointListPanelItem | null>(
    'choose-charge-points',
    null,
  );

  const [displayStatusButton, setDisplayStatusButton] = useState(false);

  const utils = api.useUtils();

  const chargePointByIdQuery = api.chargePoint.byId.useQuery({ chargePointId: data.chargePointId });

  const simulateStatusMutation = api.chargePoint.simulateStatus.useMutation({
    onSuccess() {
      utils.chargePoint.byId.invalidate();
      utils.chargePoint.byIdIgnoreNull.invalidate();
    },
    onError() {},
  });

  const isStart = useMemo(() => {
    return chargePointByIdQuery.data?.simulationStatus === SimulateStatusEnum.Start;
  }, [chargePointByIdQuery.data]);

  const isChoose = useMemo(() => {
    return chooseChargePoint?.chargePointId === data.chargePointId;
  }, [chooseChargePoint, data]);

  const handleChooseChargePoint = useCallback(() => {
    setChooseChargePoint(data);
  }, []);

  const handleClickChangeStatus = useCallback(() => {
    simulateStatusMutation.mutate({
      chargePointId: data.chargePointId,
      status:
        chargePointByIdQuery.data?.simulationStatus === SimulateStatusEnum.Start
          ? SimulateStatusEnum.Stop
          : SimulateStatusEnum.Start,
    });
  }, [data, chargePointByIdQuery.data]);

  return (
    <ListItem
      disablePadding
      onMouseEnter={() => setDisplayStatusButton(true)}
      onMouseLeave={() => setDisplayStatusButton(false)}
      secondaryAction={
        <Fade in={displayStatusButton || isChoose || isStart}>
          <IconButton
            edge="end"
            aria-label="status"
            size="small"
            onClick={handleClickChangeStatus}
            sx={{ mr: '-12px' }}
          >
            {isStart ? <StopIcon color="error" fontSize="small" /> : <PlayArrowIcon color="success" fontSize="small" />}
          </IconButton>
        </Fade>
      }
    >
      <Tooltip title={data.chargePointId} placement="right" arrow>
        <ListItemButton
          sx={{ borderRadius: (theme) => theme.spacing(4) }}
          selected={chooseChargePoint?.chargePointId === data.chargePointId}
          onClick={handleChooseChargePoint}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 12, color: isStart ? green[500] : undefined }} />
          </ListItemIcon>
          <ListItemText
            primary={data.chargePointId}
            primaryTypographyProps={{
              sx: {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              },
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

export default ChargePointsListItem;
