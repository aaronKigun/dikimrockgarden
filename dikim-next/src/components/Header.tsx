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

  // Monitor scrolling to append sticky styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="logo">
        <img src="/images/Reallogo.jpg" alt="Dikim Rock Garden Logo" />
      </Link>

      <nav className={`navbar ${isOpen ? 'active' : ''}`}>
        {navLinks.map((link) => {
          // Home path exact match, subpages prefix match
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

      <div
        id="menu-btn"
        className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}
        onClick={toggleMenu}
      ></div>
    </header>
  );
}
