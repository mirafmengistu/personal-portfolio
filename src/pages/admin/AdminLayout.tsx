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
  ChevronRight,
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

  // Use the same breakpoint as Tailwind's `lg` (1024px)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Desktop → open by default, Mobile → closed by default
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
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

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header – only visible below lg */}
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

      {/* Mobile overlay */}
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
          // Width
          isSidebarOpen ? "w-64" : "w-16",
          // Mobile: slide in/out
          isMobile
            ? isSidebarOpen
              ? "translate-x-0 shadow-xl"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo + toggle */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span
                className={cn(
                  "text-xl font-bold transition-opacity duration-300 whitespace-nowrap",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}
              >
                Admin
              </span>
            </div>

            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hidden lg:flex flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 lg:hidden flex-shrink-0"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
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
                      : "text-muted-foreground",
                    !isSidebarOpen && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={cn(
                      "text-sm font-medium transition-opacity duration-200 whitespace-nowrap",
                      isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer actions */}
          <div className="border-t p-4 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("w-full", !isSidebarOpen && "px-2")}
              onClick={() => window.open("/", "_blank")}
            >
              <span className={cn("truncate", !isSidebarOpen && "hidden")}>
                View Portfolio
              </span>
              {!isSidebarOpen && <span className="text-xs">👁️</span>}
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50",
                !isSidebarOpen && "justify-center px-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span
                className={cn(
                  "transition-opacity duration-200",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}
              >
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          // Mobile: space for fixed header
          "pt-16 lg:pt-0",
          // Desktop: push content so it never sits under the sidebar
          isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};