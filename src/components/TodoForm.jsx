import { Box, Button, OutlinedInput, Typography } from '@mui/material';
import { useState } from 'react';

function TodoForm(props) {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const generateRandomColor = () => {
    // Generate a random hex color code
    return `#${(Math.random() * 0xffffff << 0).toString(16).padStart(6, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() !== '') {
      const randomColor = generateRandomColor();
      setTodos([...todos, { text: input, color: randomColor }]);
      setInput('');
    }
  };

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
            sx={{ height: '40px', width: '200px' }}
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
            }}
          >
            {todo.text}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default TodoForm;
