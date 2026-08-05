import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { AdminLogin } from "@/pages/AdminLogin";
import { ResetPassword } from "@/pages/admin/ResetPassword";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Dashboard } from "@/pages/admin/Dashboard";
import { ProfileEditor } from "@/pages/admin/ProfileEditor";
import { ProjectsManager } from "@/pages/admin/ProjectsManager";
import { SkillsManager } from "@/pages/admin/SkillsManager";
import { ContactEditor } from "@/pages/admin/ContactEditor";
import { HeroEditor } from "@/pages/admin/HeroEditor";
import { FooterEditor } from "@/pages/admin/FooterEditor";
import MainPortfolio from "./MainPortfolio";

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Main Portfolio Route - Without any wrappers */}
          <Route path="/" element={<MainPortfolio />} />
          
          {/* Admin Routes - Keep them separate */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="hero" element={<HeroEditor />} />
            <Route path="footer" element={<FooterEditor />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;