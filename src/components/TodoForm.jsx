import { BorderColor, Delete } from '@mui/icons-material';
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

function TodoForm() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);


  const handleChange = (e) => setInput(e.target.value);

  const generateRandomColor = () => pastelColors[Math.floor(Math.random() * pastelColors.length)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      const randomColor = generateRandomColor();
      const newTodo = { text: input, color: randomColor };

      setTodos([...todos, newTodo]);

      try {
        await fetch('http://localhost:3000/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo),
        });
      } catch (error) {
        console.error('Error saving todo to database:', error);
      }

      setInput('');
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

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/todos');
      const data = await response.json();
      const todosWithColor = data.map((todo) => ({ ...todo, color: generateRandomColor() }));
      setTodos(todosWithColor);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEdit = (todo) => {
    setEditTodo(todo);
  };

  const handleEditSave = async (newText) => {
    try {
      await fetch(`http://localhost:3000/todos/${editTodo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText }),
      });

      const updatedTodos = todos.map((todo) =>
        todo.id === editTodo.id ? { ...todo, text: newText } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setEditTodo(null);
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
            sx={{ height: '40px', width: '200px', color: 'white' }}
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
              color: 'white',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box>{todo.text}</Box>

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
          open={Boolean(editTodo)}
          onClose={() => setEditTodo(null)}
          onSave={handleEditSave}
          initialText={editTodo?.text || ''}
        />
      </Box>
    </Box>
  );
}

export default TodoForm;
