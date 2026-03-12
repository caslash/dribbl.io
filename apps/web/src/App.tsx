import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppLayout } from '@/components';
import { CareerPathPage } from './pages/CareerPathPage';
import { DraftLobbyPage } from './pages/DraftLobbyPage';
import { DraftRoomPage } from './pages/DraftRoomPage';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/career" element={<CareerPathPage />} />
          <Route path="/draft" element={<DraftLobbyPage />} />
          <Route path="/draft/:roomId" element={<DraftRoomPage />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" theme="colored" />
    </Router>
  );
}
