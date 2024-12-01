import './App.css';
import RegisterPage from './components/RegisterPage';
import { useEffect, useState } from 'react';
import Heatmap from './components/Heatmap';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Message from Backend: {message}</h1>

      {/* Display the RegisterPage */}
      <RegisterPage />

      {/* Add the Heatmap component here */}
      <Heatmap />
    </div>
  );
}

export default App;
