import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavMenu.css';

function NavMenu() {
    return (
        <header>
            <nav className={styles.navbar} style={{
                background: 'linear-gradient(180deg, var(--rail-dark) 0%, var(--rail-mid) 60%, var(--rail-dark) 100%)',
                borderBottom: '2px solid var(--gold-400)',
                height: '56px',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
            }}>
                <Link to="/" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--gold-400)',
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                }}>
                    Liverpool
                </Link>
                <Link to="/Liverpool" style={{
                    color: 'var(--text-primary)',
                    fontFamily: "'Lato', sans-serif",
                    textDecoration: 'none',
                    opacity: 0.85,
                }}>
                    Lobby
                </Link>
            </nav>
        </header>
    );
}

export default NavMenu;
