import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/LoginForm';
import Signin from './components/SignIn';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signIn, setSignIn] = useState(false); // Fix: Renamed state variable
  const [email, setEmail] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} SignIn={signIn} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/signin" element={<Signin setLoggedIn={setSignIn} setEmail={setEmail} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

