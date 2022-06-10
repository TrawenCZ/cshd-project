import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import '../App.css'
import Profile from './Profile';

export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/user/:id" element={<Profile />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;