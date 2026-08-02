import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Code2, 
  Mail as MailIcon, 
  Palette,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/dashboard/profile", icon: User, label: "Profile" },
  { path: "/admin/dashboard/projects", icon: FolderGit2, label: "Projects" },
  { path: "/admin/dashboard/skills", icon: Code2, label: "Skills" },
  { path: "/admin/dashboard/contact", icon: MailIcon, label: "Contact" },
  { path: "/admin/dashboard/hero", icon: FaFacebook, label: "Hero Section" },
  { path: "/admin/dashboard/footer", icon: Palette, label: "Footer" },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  // Check if link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 h-16 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-10 w-10"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Portfolio Admin</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-10 w-10"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
          isMobile && isSidebarOpen && "shadow-xl"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-bold hidden lg:block">Portfolio Admin</h1>
              <h1 className="text-xl font-bold lg:hidden">Admin</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hidden lg:flex"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                    "hover:bg-secondary hover:text-foreground",
                    active 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open('/', '_blank')}
            >
              View Portfolio
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          "lg:ml-64",
          isMobile ? "pt-16" : "",
          !isSidebarOpen && "lg:ml-0"
        )}
      >
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};