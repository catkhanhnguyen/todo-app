import { BorderColor, CheckBox, CheckBoxOutlineBlank, Delete } from '@mui/icons-material';
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

  const generateRandomColor = () => pastelColors[Math.floor(Math.random() * pastelColors.length)];

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      const randomColor = generateRandomColor();
      const newTodo = { text: input, color: randomColor, completed: false };

      try {
        // Thực hiện yêu cầu POST để thêm todo mới vào cơ sở dữ liệu
        const response = await fetch('http://localhost:3000/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo),
        });

        // Kiểm tra xem yêu cầu POST có thành công không (status code 201 Created)
        if (response.status === 201) {
          // Lấy todo đã được tạo từ phản hồi và cập nhật danh sách todos
          const createdTodo = await response.json();
          setTodos([...todos, createdTodo]);
        } else {
          console.error('Failed to add todo to the database.');
        }
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
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEdit = (todo) => {
    setEditTodo({
      id: todo.id,
      initialText: todo.text,
    });
  };

  const handleEditSave = async (newText) => {
    try {
      const currentTodo = todos.find((todo) => todo.id === editTodo.id);

      // Thực hiện yêu cầu PUT để cập nhật todo trong cơ sở dữ liệu
      const response = await fetch(`http://localhost:3000/todos/${editTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText, color: currentTodo.color }),
      });

      // Kiểm tra xem yêu cầu PUT có thành công không (status code 200 OK)
      if (response.status === 200) {
        // Cập nhật danh sách todos với todo đã được cập nhật
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

      // Thực hiện yêu cầu PUT để cập nhật trạng thái completed trong cơ sở dữ liệu
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentTodo.text, color: currentTodo.color, completed: !currentCompleted }),
      });

      // Kiểm tra xem yêu cầu PUT có thành công không (status code 200 OK)
      if (response.status === 200) {
        // Cập nhật danh sách todos với todo đã được cập nhật
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
      </Box>
    </Box>
  );
}

export default TodoForm;
