import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/LoginForm';
import Signin from './components/SignIn';
import UserProfile from './components/UserProfile';
import './App.css';
import { useEffect, useState } from 'react';
import { UserProvider, useUser } from './provider/user-provider';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
          <Routing />
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}


function Routing() {
  const { user, loading } = useUser();
  const [loggedIn, setLoggedIn] = useState(false);
  const [signIn, setSignIn] = useState(false); 
  const [userprofile, setUserProfile] = useState(false);
  const [email, setEmail] = useState("");
  // Hi just for testing 


  if (loading) {
    return <div>loading...</div>
  }
 
  
  return <Routes>
    <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} SignIn={signIn} setUserProfile={setUserProfile} />} />
    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
    <Route path="/signin" element={<Signin setLoggedIn={setSignIn} setEmail={setEmail} />} />
   {user && <>
    <Route path="/profile" element={<UserProfile setEmail={setEmail} user={user} />} />
   </>} 
  </Routes>
}

export default App;

