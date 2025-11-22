import { useState, useEffect, useRef } from 'react';
import '../styles/Menu.css';

const Menu = ({ currentPage, onPageChange }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const handleMenuClick = (page) => {
        onPageChange(page);
        setMenuOpen(false);
    };

    return (
        <nav className="nav-menu" ref={menuRef}>
            <button 
                className="hamburger-button"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
            </button>
            {menuOpen && (
                <div className="dropdown-menu">
                    <button 
                        className={`menu-item ${currentPage === 'pack' ? 'menu-item-active' : 'menu-item-inactive'}`}
                        onClick={() => handleMenuClick('pack')}
                    >
                        &lt;Pack /&gt;
                    </button>
                    <button 
                        className={`menu-item ${currentPage === 'card' ? 'menu-item-active' : 'menu-item-inactive'}`}
                        onClick={() => handleMenuClick('card')}
                    >
                        &lt;Card /&gt;
                    </button>
                    <button 
                        className={`menu-item ${currentPage === 'collection' ? 'menu-item-active' : 'menu-item-inactive'}`}
                        onClick={() => handleMenuClick('collection')}
                    >
                        &lt;Collection /&gt;
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Menu;
