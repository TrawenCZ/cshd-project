import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import '../App.css'
import Profile from './Profile';
import Game from './Game';


export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/user/:id" element={<Profile />}/>
        <Route path="/game/:id" element={<Game />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;