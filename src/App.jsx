import {Container, Box } from '@mui/material'
import './App.css'
import TodoForm from './components/TodoForm'

function App() {
  

  return (
    <Container disableGutters maxWidth={false} 
      sx={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #ee9ca7, #ffdde1)'
    }}>
      <Box 
      sx={{
        backgroundColor: '#303952',
        color: 'white',
        borderRadius: '10px',
        boxShadow: 3,
        p: 4
      }}>
        <TodoForm />
    </Box>
    </Container>
  )
}

export default App
