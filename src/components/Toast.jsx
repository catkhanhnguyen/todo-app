import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import PropTypes from 'prop-types';

const Toast = ({ open, message, handleClose }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleSnackbarClose = () => {
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
