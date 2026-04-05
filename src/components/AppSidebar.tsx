import { LayoutDashboard, BookOpen, Award, Megaphone, UserCircle, X, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/certificates", icon: Award, label: "Certificates" },
  { to: "/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-background transition-transform duration-300 md:sticky md:top-0 md:z-30 md:translate-x-0 md:w-16 md:hover:w-64 group/sidebar",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <span className="font-heading text-lg font-bold text-primary truncate opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200">
            Cificap
          </span>
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="truncate opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200">
              Sign out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
