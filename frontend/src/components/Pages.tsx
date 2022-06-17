import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import '../App.css'
import Profile from './Profile';

import Game from './Game';

import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Developer from './Developer';
import Platform from './Platform';
import Genre from './Genre';


export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/user/:id" element={<Profile />}/>
        <Route path="/register" element={<RegisterForm />}/>
        <Route path="/login" element={<LoginForm />}/>
        <Route path="/game/:id" element={<Game />}/>
        <Route path="/developer/:id" element={<Developer />}/>
        <Route path="/platform/:id" element={<Platform />}/>
        <Route path="/genre/:id" element={<Genre />}/>


      </Routes>
    </BrowserRouter>
  );
};

export default Pages;