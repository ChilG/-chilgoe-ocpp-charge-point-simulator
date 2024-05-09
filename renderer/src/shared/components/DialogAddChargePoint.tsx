import React, { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TransitionProps } from '@mui/material/transitions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Button, { ButtonProps } from '@mui/material/Button';
import DialogAlertAction from './DialogAlertAction';
import { zodResolver } from '@hookform/resolvers/zod';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { DefaultDialogState } from '../interface/Dialog';

const schema = z.object({
  chargePointId: z.number().nullable(),
});

export type DialogAddChargePointValue = z.infer<typeof schema>;

export const DialogAddChargePointDefaultValues: DialogAddChargePointValue | any = {
  id: null,
};

interface DialogAddChargePointProps {
  open: boolean;
  defaultValues?: DialogAddChargePointValue;
  onSubmit: SubmitHandler<DialogAddChargePointValue>;
  onClose: () => void;
}

interface DialogAddChargePointStep {
  step: number;
  title: string;
  label: string;
  canSkip: boolean;
  isCompleted: boolean;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultSteps: DialogAddChargePointStep[] = [
  { step: 0, title: 'Create Charge Point', label: 'Charge Point ID', canSkip: false, isCompleted: false },
  { step: 1, title: 'You have endpoint central system?', label: 'Connection Central System', canSkip: true, isCompleted: false },
  { step: 2, title: 'Configuration', label: 'Set up configuration', canSkip: true, isCompleted: false },
];

const DialogAddChargePoint: React.FC<DialogAddChargePointProps> = ({ open, defaultValues, onSubmit, onClose }) => {
  const {
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DialogAddChargePointValue>({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const [dialog, setDialog] = useState<DefaultDialogState>({
    open: false,
    target: null,
  });
  const [steps, setSteps] = useState<DialogAddChargePointStep[]>([...defaultSteps]);
  const [activeStep, setActiveStep] = useState(defaultSteps[0].step);

  const title = useMemo(() => {
    const index = steps.findIndex((item) => item.step === activeStep);

    if (index > -1) return steps[index].title;
    else return steps[steps.length - 1].title;
  }, [activeStep, steps]);

  const goBackProps = useMemo((): ButtonProps => {
    return {
      onClick: () => {
        setActiveStep((prevState) => {
          return prevState - 1;
        });
      },
      disabled: activeStep === 0,
      children: activeStep === 0 ? '' : 'Go back',
    };
  }, [activeStep]);

  const continueProps = useMemo((): ButtonProps => {
    const canFinish = !steps.some((item) => item.canSkip === false && item.isCompleted === false);

    return {
      disabled: !canFinish && activeStep === steps[steps.length - 1].step,
      onClick: () => {
        setActiveStep((activeStep) => {
          if (activeStep === steps.length) return activeStep;

          setSteps((steps) => {
            const index = steps.findIndex((item) => item.step === activeStep);

            if (index > -1) {
              steps[index].isCompleted = true;
            }

            return steps;
          });

          return activeStep + 1;
        });
      },
      variant: 'contained',
      children: activeStep === steps.length ? 'Finish' : 'Continue',
    };
  }, [activeStep, steps]);

  const inProcess = useMemo(() => {
    return steps.some((item) => item.isCompleted);
  }, [steps, activeStep]);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleClose = useCallback(() => {
    setSteps([...defaultSteps]);
    setActiveStep(defaultSteps[0].step);
    onClose();
  }, [defaultSteps]);

  const handleCloseDialog = useCallback(() => {
    setDialog({ ...dialog, open: false });
    setTimeout(() => {
      setDialog({ ...dialog, open: false, target: null });
    }, 200);
  }, [dialog]);

  const handleClickClose = useCallback(() => {
    if (!inProcess) {
      handleClose();
    } else {
      setDialog({ open: true, target: 'confirm-close' });
    }
  }, [inProcess]);

  const handleSubmitStopProcess = useCallback(() => {
    handleCloseDialog();
    handleClose();
  }, []);

  return (
    <>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', background: 'transparent' }} elevation={0}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ height: 40, width: 40 }} />
            <Typography variant="h6" component="div" sx={{ color: (theme) => theme.palette.text.primary }}>
              {title}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClickClose} aria-label="close">
              <CloseIcon sx={{ color: (theme) => theme.palette.text.primary }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: '100%' }}>
            <Stack sx={{ height: '100%' }} direction="column" justifyContent="space-between">
              <Box></Box>
              <Stack direction="column">
                <Stack sx={{ width: '100%', p: 2 }} direction="row" justifyContent="space-between">
                  <Button {...goBackProps} />
                  <Button {...continueProps} />
                </Stack>
                <Divider />
                <Stepper nonLinear activeStep={activeStep} sx={{ width: '100%', height: 72, px: 2 }}>
                  {steps.map((item, index) => (
                    <Step
                      key={item.step}
                      completed={item.isCompleted}
                      sx={{
                        '& .MuiSvgIcon-root.Mui-completed': {
                          color: (theme) => theme.palette.success.main,
                        },
                      }}
                    >
                      <StepButton color="inherit" onClick={handleStep(item.step)}>
                        {item.label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
      {dialog.target === 'confirm-close' && (
        <DialogAlertAction
          open={dialog.open}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitStopProcess}
          title="Do you want to stop this process?"
          cancelText="No"
          submitText="Yes"
          maxWidth="xs"
        />
      )}
    </>
  );
};

export default DialogAddChargePoint;
