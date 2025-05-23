import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} Music Search App</p>
    </footer>
  );
};

export default Footer; 