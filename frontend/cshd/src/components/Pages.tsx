import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';

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