import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import '../App.css'

export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;