// Layout Components
export { default as Layout } from './Layout';
export { default as PublicLayout } from './PublicLayout';

// Header Components
export { default as Header } from './Header';
export { default as AppHeader } from './AppHeader';
export { default as LandingHeader } from './LandingHeader';

// Navigation Components
export { default as Sidebar } from './Sidebar';

// Footer Component
export { default as Footer } from './Footer';

// Types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  onMenuToggle?: () => void;
  onCreateTask?: () => void;
}

export interface PublicLayoutProps {
  children: React.ReactNode;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}
