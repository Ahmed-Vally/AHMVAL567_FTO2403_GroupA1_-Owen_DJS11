// src/components/BurgerMenu.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure to have react-router-dom installed

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={styles.container}>
    
      {isOpen && (
        <div style={styles.menu}>
          <Link to="/favorites" style={styles.link} onClick={toggleMenu}>
            View Favorites
          </Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
  },
 

  link: {
    display: 'block',
    padding: '10px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '1rem',
  },
};

export default BurgerMenu;
