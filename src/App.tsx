import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectHome from "./components/RedirectHome";
import PetsPage from "./pages/PetsPage";

const App = () => (
  <Routes>
    <Route path="/" element={<RedirectHome />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pets"
      element={
        <ProtectedRoute>
          <PetsPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
