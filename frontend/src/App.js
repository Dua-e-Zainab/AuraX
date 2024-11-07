import './App.css';
import RegisterPage from './components/RegisterPage';
import { useEffect } from 'react';
import { useState } from 'react';
function App() {
  const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api')
            .then(response => response.json())
            .then(data => setMessage(data.message))
            .catch(err => console.error(err));
    }, []);

  return (
    <div >
      <h1>Message from Backend: {message}</h1>
     
      <RegisterPage/>
    </div>
  );
}

export default App;
