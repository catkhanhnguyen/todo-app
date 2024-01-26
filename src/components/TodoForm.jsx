import {
  Box,
  Button,
  IconButton,
  OutlinedInput,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import pastelColors from '../assets/color';
import Modal from './Modal';
import Toast from './Toast';
import { BorderColor, CheckBox, CheckBoxOutlineBlank, Delete } from '@mui/icons-material';

function TodoForm() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const generateRandomColor = () =>
    pastelColors[Math.floor(Math.random() * pastelColors.length)];

  const handleChange = (e) => setInput(e.target.value);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      const existingTodo = todos.find((todo) => todo.text === input);
  
      if (existingTodo) {
        showSnackbar('Todo already exists! Fulfill it now?!');
  
      } else {
        const randomColor = generateRandomColor();
        const newTodo = { text: input, color: randomColor, completed: false };
  
        try {
          const response = await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo),
          });
  
          if (response.status === 201) {
            const createdTodo = await response.json();
            setTodos([...todos, createdTodo]);
          } else if (response.status === 400) {
            showSnackbar('Todo is invalid: Please enter a non-empty string!!');
          } else {
            console.error('Failed to add todo to the database.');
          }
        } catch (error) {
          console.error('Error saving todo to database:', error);
        }
  
        setInput('');
      }
    } else {
      showSnackbar('Todo is invalid: Please enter a non-empty string!!');
    }
  };
  

  const handleDelete = async (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      await fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting todo from database:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditTodo({
      id: todo.id,
      initialText: todo.text,
    });
  };

  const handleEditSave = async (newText) => {
    try {
      const currentTodo = todos.find((todo) => todo.id === editTodo.id);

      const response = await fetch(`http://localhost:3000/todos/${editTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText, color: currentTodo.color }),
      });

      if (response.status === 200) {
        const updatedTodos = todos.map((todo) =>
          todo.id === editTodo.id ? { ...todo, text: newText } : todo
        );
        setTodos(updatedTodos);
      } else {
        console.error('Failed to update todo in the database.');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setEditTodo(null);
    }
  };

  const handleToggleComplete = async (id, currentCompleted) => {
    try {
      const currentTodo = todos.find((todo) => todo.id === id);

      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentTodo.text, color: currentTodo.color, completed: !currentCompleted }),
      });
      if (response.status === 200) {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !currentCompleted } : todo
        );
        setTodos(updatedTodos);
      } else {
        console.error('Failed to update todo in the database.');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <Box>
      <Typography textAlign="center" m={2} variant="h5">
        TODO APP
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            '@media (min-width: 600px)': {
              flexDirection: 'row',
            },
          }}
        >
          <OutlinedInput
            placeholder="Your activity here"
            value={input}
            sx={{ height: '40px', width: '250px', color: 'white' }}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundImage: 'linear-gradient(to right, #ee9ca7, #ffdde1)',
              color: 'white',
              height: '40px',
              '&:hover': {
                backgroundImage: 'linear-gradient(to right, #ee9ca7, #ffdde1)',
              },
            }}
          >
            Add
          </Button>
        </Box>
      </form>
      <Box sx={{
        height: '300px',
        mt: 2,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          background: "#888",
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'white'
        }
      }}>
        {todos.map((todo, index) => (
          <Box
            key={index}
            sx={{
              padding: '8px',
              margin: '4px',
              backgroundColor: todo.color,
              color: '#303952',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Tooltip title={todo.completed ? 'true' : 'false'}>
                <IconButton onClick={() => handleToggleComplete(todo.id, todo.completed)}>
                  {todo.completed ? (
                    <CheckBox sx={{ fontSize: '18px' }} />
                  ) : (
                    <CheckBoxOutlineBlank sx={{ fontSize: '18px' }} />
                  )}
                </IconButton>
              </Tooltip>
              {todo.text}
            </Box>

            <Box>
              <Tooltip title="Edit">
                <IconButton onClick={() => handleEdit(todo)}>
                  <BorderColor sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(todo.id)}>
                  <Delete sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
        <Modal
          key={editTodo?.id || 'new'}
          open={Boolean(editTodo)}
          onClose={() => setEditTodo(null)}
          onSave={(newText) => handleEditSave(newText, editTodo?.id)}
          initialText={editTodo?.initialText || ''}
        />

        <Toast
          open={snackbarOpen}
          message={snackbarMessage}
          handleClose={handleSnackbarClose}
        />
      </Box>
    </Box>
  );
}

export default TodoForm;
