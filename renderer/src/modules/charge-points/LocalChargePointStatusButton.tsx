import React, { useCallback, useMemo } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import StopIcon from '@mui/icons-material/Stop';
import Box from '@mui/material/Box';
import { SimulateStatusEnum } from '../../shared/enum/app/SimulateStatus';
import { api } from '../../utils/api';

interface LocalChargePointStatusButtonProps {
  chargePointId: string;
  status: SimulateStatusEnum;
}

const LocalChargePointStatusButton: React.FC<LocalChargePointStatusButtonProps> = ({ chargePointId, status }) => {
  const utils = api.useUtils();

  const simulateStatusMutation = api.chargePoint.simulateStatus.useMutation({
    onSuccess() {
      utils.chargePoint.byId.invalidate();
      utils.chargePoint.byIdIgnoreNull.invalidate();
    },
    onError() {},
  });

  const isStart = useMemo(() => {
    return status === SimulateStatusEnum.Start;
  }, [status]);

  const handleClick = useCallback(() => {
    simulateStatusMutation.mutate({
      chargePointId: chargePointId,
      status: status === SimulateStatusEnum.Start ? SimulateStatusEnum.Stop : SimulateStatusEnum.Start,
    });
  }, [status]);

  return (
    <Box>
      <Tooltip title={isStart ? SimulateStatusEnum.Stop : SimulateStatusEnum.Start} arrow placement="left">
        <IconButton aria-label="local-charge-point-status-button" onClick={handleClick}>
          {isStart ? <StopIcon color="error" /> : <PlayArrowIcon color="success" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default LocalChargePointStatusButton;
