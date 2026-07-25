'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/cuisine', label: 'CUISINE' },
    { href: '/vlb', label: 'VIP LOUNGE/BAR' },
    { href: '/gh', label: 'GARDEN/HALL' },
    { href: '/club', label: 'CLUB/KARAOKE' },
    { href: '/mall', label: 'BOUTIQUE' },
    { href: '/contact', label: 'CONTACT US' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
      <div className="header-bar">
        <Link href="/" className="logo" onClick={closeMenu}>
          <img src="/images/Reallogo.jpg" alt="Dikim Rock Garden Logo" />
        </Link>

        <nav className="navbar desktop-nav" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'active' : ''}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          id="menu-btn"
          className={`menu-toggle rose-toggle ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {[0, 1, 2].map((i) => (
            <span className="rose-line" key={i} aria-hidden="true">
              <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="8" cy="8" rx="5.5" ry="4.2" fill="#c45c6a" />
                <ellipse cx="12.5" cy="8" rx="5" ry="3.8" fill="#d97784" />
                <ellipse cx="10" cy="6.5" rx="3.2" ry="2.6" fill="#e8a0a8" />
                <circle cx="10.2" cy="8" r="1.4" fill="#8b3a45" />
                <path d="M15.5 8H42" stroke="#1a7a1a" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M28 8c2-2.5 4-2.5 6 0" stroke="#2d9e2d" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M22 8c1.5 2.2 3.5 2.2 5 0" stroke="#2d9e2d" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          ))}
        </button>
      </div>

      <nav className={`grass-bar ${isOpen ? 'active' : ''}`} aria-label="Mobile">
        {navLinks.map((link) => {
          const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? 'active' : ''}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
