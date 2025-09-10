import React from 'react';
import LandingHeader from './LandingHeader';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  onLoginClick,
  onSignupClick
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Public Header */}
      <LandingHeader
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
      />

      {/* Main Content */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
