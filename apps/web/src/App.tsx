import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppLayout } from '@/components';
import { DraftProvider } from '@/providers/DraftProvider';
import { CareerPathPage } from './pages/CareerPathPage';
import { DraftLobbyPage } from './pages/DraftLobbyPage';
import { DraftRoomPage } from './pages/DraftRoomPage';
import { HomePage } from './pages/HomePage';

/**
 * Layout wrapper that provides draft context to all draft routes.
 * Keeps DraftProvider alive when navigating between /draft and /draft/:roomId.
 */
function DraftLayout() {
  return (
    <DraftProvider>
      <Outlet />
    </DraftProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/career" element={<CareerPathPage />} />
          <Route element={<DraftLayout />}>
            <Route path="/draft" element={<DraftLobbyPage />} />
            <Route path="/draft/:roomId" element={<DraftRoomPage />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-right" theme="colored" />
    </Router>
  );
}
