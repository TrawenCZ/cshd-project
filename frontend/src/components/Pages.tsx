import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import '../App.css'
import Profile from './Profile';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/user/:id" element={<Profile />}/>
        <Route path="/register" element={<RegisterForm />}/>
        <Route path="/login" element={<LoginForm />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;