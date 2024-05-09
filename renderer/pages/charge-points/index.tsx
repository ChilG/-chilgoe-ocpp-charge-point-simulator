import React from 'react';
import Stack from '@mui/material/Stack';
import ChargePointsList from '../../src/modules/charge-points/ChargePointsList';
import ChargePointPanel from '../../src/modules/charge-points/ChargePointPanel';
import { useLocalStorage } from 'usehooks-ts';
import { CHARGE_POINTS_PANEL } from '../../src/shared/constant/LocalStorage';

interface ChargePointsProps {}

const ChargePoints: React.FC<ChargePointsProps> = (props) => {
  const [expanded, setExpanded] = useLocalStorage<boolean>(CHARGE_POINTS_PANEL, true);

  return (
    <Stack direction="row">
      <ChargePointsList expanded={expanded} onChange={(expanded) => setExpanded(expanded)} />
      <ChargePointPanel fullWidth={!expanded} />
    </Stack>
  );
};

export default ChargePoints;
