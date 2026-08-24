import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Book } from "./pages/Book";
import { Login } from "./pages/Login";
import { Appointments } from "./pages/Appointments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/book/:tenantId" element={<Book />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
