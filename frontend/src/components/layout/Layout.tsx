import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { springTransitions } from '../../lib/motion';
import { useAuth } from '../../app/AuthProvider';
import {
  BookOpen,
  Award,
  Compass,
  BarChart2,
  User as UserIcon,
  LogOut,
  Flame,
  Map,
  MessageSquare,
  Code2,
  Menu,
  Settings,
} from 'lucide-react';
import { FeedbackModal } from '../../features/feedback/FeedbackModal';
import { AnimatedButton as Button } from '../motion';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: BarChart2 },
  { label: 'Practice Loop', path: '/practice', icon: BookOpen },
  { label: 'Mock Interview', path: '/interview', icon: Award },
  { label: 'Coding Practice', path: '/coding-practice', icon: Code2 },
  { label: 'Learning Roadmap', path: '/roadmap', icon: Map },
  { label: 'Resource Library', path: '/resources', icon: Compass },
  { label: 'Profile', path: '/profile', icon: UserIcon },
];

function initials(name?: string) {
  if (!name) return 'SF';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '').concat(parts[1]?.[0] ?? '').toUpperCase() || 'SF';
}

const Logo: React.FC = () => (
  <Link to="/dashboard" className="group flex items-center gap-3">
    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_8px_20px_-6px_hsl(var(--primary)/0.6)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
      <Flame className="h-5 w-5 text-white" strokeWidth={2.25} />
    </div>
    <div className="leading-tight">
      <div className="font-display text-lg font-medium tracking-tight text-foreground">
        StudyForge<span className="text-primary">.</span>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Interview Foundry
      </div>
    </div>
  </Link>
);

const NavList: React.FC<{ pathname: string; onNavigate?: () => void }> = ({ pathname, onNavigate }) => (
  <nav className="space-y-1">
    {navItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className="relative flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {isActive && (
            <motion.span
              layoutId="nav-active-indicator"
              transition={springTransitions.layoutIndicator}
              className="absolute inset-0 rounded-md bg-primary/10"
            />
          )}
          {isActive && (
            <motion.span
              layoutId="nav-active-bar"
              transition={springTransitions.layoutIndicator}
              className="absolute left-0 top-1/2 h-6 w-[4px] -translate-y-1/2 rounded-r-full bg-primary shadow-glow-primary"
            />
          )}
          <Icon className={`relative z-10 h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-primary' : ''}`} />
          <span className={`relative z-10 transition-colors ${isActive ? 'text-foreground font-semibold' : ''}`}>{item.label}</span>
        </Link>
      );
    })}
  </nav>
);

const SidebarFooter: React.FC<{ onFeedback: () => void }> = ({ onFeedback }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onFeedback}
        className="w-full justify-start gap-2 border-steel/25 text-steel hover:bg-steel/10 hover:text-steel"
      >
        <MessageSquare className="h-4 w-4" />
        Share feedback
      </Button>

      <Separator />

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-surface">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials(user.display_name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{user.display_name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider">
              Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      {/* Desktop sidebar — the tool rack */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-border bg-card/40 p-5 backdrop-blur-[20px] md:flex"
      >
        <div>
          <div className="mb-8 px-1">
            <Logo />
          </div>
          <NavList pathname={location.pathname} />
        </div>
        <SidebarFooter onFeedback={() => setIsFeedbackOpen(true)} />
      </motion.aside>

      {/* Mobile top bar + Sheet nav */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-sm md:hidden">
        <Logo />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col justify-between">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div>
              <div className="mb-8 mt-2">
                <Logo />
              </div>
              <NavList pathname={location.pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
            <SidebarFooter onFeedback={() => setIsFeedbackOpen(true)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="bg-blueprint bg-forge-glow pointer-events-none absolute inset-0 opacity-[0.35]" />
        <div className="relative mx-auto w-full max-w-7xl p-6 md:p-10">{children}</div>
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};
