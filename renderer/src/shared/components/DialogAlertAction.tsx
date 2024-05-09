import React from 'react';
import { Breakpoint, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

interface DialogAlertActionProps {
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  cancelText?: string;
  submitText?: string;
  maxWidth?: Breakpoint;
}

const DialogAlertAction: React.FC<DialogAlertActionProps> = ({
  loading,
  open,
  onClose,
  onSubmit,
  title,
  description,
  cancelText,
  submitText,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{description && <DialogContentText id="alert-dialog-description">{description}</DialogContentText>}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText ?? 'Close'}
        </Button>
        <LoadingButton loading={loading} onClick={onSubmit}>
          {submitText ?? 'OK'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAlertAction;
