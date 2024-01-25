import { BorderColor } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, OutlinedInput, Tooltip, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

function TodoForm() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const generateRandomColor = () => {
    // Generate a random hex color code
    return `#${(Math.random() * 0xffffff << 0).toString(16).padStart(6, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() !== '') {
      const randomColor = generateRandomColor();
      const newTodo = { text: input, color: randomColor };

      // Add the new todo to the local state
      setTodos([...todos, newTodo]);

      // Save the new todo to the database using json-server
      try {
        await fetch('http://localhost:3000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo),
        });
      } catch (error) {
        console.error('Error saving todo to database:', error);
      }

      setInput('');
    }
  };

  const handleDelete = async (id) => {
    // Remove the todo from the local state
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    // Delete the todo from the database using json-server
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting todo from database:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/todos');
      const data = await response.json();
      // Add a random color property to each fetched todo
      const todosWithColor = data.map((todo) => ({ ...todo, color: generateRandomColor() }));
      setTodos(todosWithColor);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Use useEffect to fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <Box>
      <Typography textAlign={'center'} m={2} variant="h5">
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
            placeholder='Your activity here'
            value={input}
            sx={{ height: '40px', width: '200px', color: 'white' }}
            onChange={handleChange}
          />
          <Button
            type='submit'
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        {todos.map((todo, index) => (
          <Box
            key={index}
            sx={{
              width: '95%', // Set width to 100% for full width
              padding: '8px',
              margin: '4px',
              backgroundColor: todo.color, // Use the solid color for the background
              color: 'white',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>{todo.text}</Box>

            <Box>
              <Tooltip title="Edit">
                <IconButton>
                  <BorderColor sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(todo.id)}>
                  <DeleteIcon sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default TodoForm;
