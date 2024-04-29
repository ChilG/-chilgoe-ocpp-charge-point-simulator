import React from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

interface DialogAlertActionProps {
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  cancelText?: string;
  submitText?: string;
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
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {description && <DialogContentText id="alert-dialog-description">{description}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText ?? 'Cancel'}
        </Button>
        <LoadingButton loading={loading} onClick={onSubmit}>
          {submitText ?? 'Submit'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAlertAction;
