import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const Modal = ({ open, onClose, onSave, initialText }) => {
  const [text, setText] = useState(initialText);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Todo</DialogTitle>
      <DialogContent>
        <TextField
          label="Todo Text"
          fullWidth
          value={text}
          onChange={handleTextChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialText: PropTypes.string.isRequired,
};

export default Modal;
