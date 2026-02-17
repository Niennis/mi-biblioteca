import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SearchPage } from "./pages/SearchPage";
import { LibraryPage } from "./pages/LibraryPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { ProfilePage } from "./pages/ProfilePage";

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/biblioteca" /> : <LoginPage />}
      />
      <Route
        path="/registro"
        element={user ? <Navigate to="/biblioteca" /> : <RegisterPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/biblioteca" element={<LibraryPage />} />
          <Route path="/biblioteca/:id" element={<BookDetailPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={user ? "/biblioteca" : "/login"} />} />
    </Routes>
  );
}
