import { useState, useEffect, useRef } from 'react';
import '../styles/Dropdown.css';

const Dropdown = ({ label, sets, selectedSetId, onSetChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const selectedSet = sets.find(s => s.id === selectedSetId);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    
    return (
        <div className="dropdown-container">
            {label && <label className="dropdown-label">{label}</label>}
            <div className="custom-dropdown" ref={dropdownRef}>
                <button 
                    className={`dropdown-select ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedSet?.name || 'Select a set'}
                </button>
                {isOpen && (
                    <div className="dropdown-options">
                        {sets.map(s => (
                            <button
                                key={s.id}
                                className={`dropdown-option ${selectedSetId === s.id ? 'dropdown-option-active' : 'dropdown-option-inactive'}`}
                                onClick={() => {
                                    onSetChange(s.id);
                                    setIsOpen(false);
                                }}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
