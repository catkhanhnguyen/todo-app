import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import PropTypes from 'prop-types';

const Toast = ({ open, message, handleClose }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    // Update isOpen state when the open prop changes
    setIsOpen(open);
  }, [open]);

  const handleSnackbarClose = (event, reason) => {
    // If the user closes the snackbar or it times out, update the state
    if (reason === 'clickaway') {
      return;
    }

    setIsOpen(false);
    handleClose();
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={1500} onClose={handleSnackbarClose} message={message} />
  );
};

Toast.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Toast;
