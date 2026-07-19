'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    async function checkActiveSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push('/admin/dashboard');
      }
    }
    checkActiveSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header className="header">
        <Link href="/" className="logo">
          <img src="/images/Reallogo.jpg" alt="Dikim Rock Garden Logo" />
        </Link>
        <nav className="navbar">
          <Link href="/">HOME</Link>
          <Link href="/cuisine">CUISINE</Link>
          <Link href="/vlb">VIP LOUNGE/BAR</Link>
          <Link href="/gh">GARDEN/HALL</Link>
          <Link href="/club">CLUB/KARAOKE</Link>
          <Link href="/mall">BOUTIQUE</Link>
          <Link href="/contact">CONTACT US</Link>
        </nav>
      </header>

      {/* Login Form Container */}
      <div 
        style={{
          maxWidth: '42rem',
          width: '90%',
          margin: '15rem auto 5rem',
          background: 'var(--white)',
          padding: '4rem 3rem',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--sh-lg)',
          border: '1px solid var(--g100)'
        }}
      >
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.8rem', color: 'var(--g700)', textAlign: 'center', marginBottom: '1rem', fontWeight: 700 }}>
          Admin Portal
        </h2>
        <p style={{ fontSize: '1.4rem', color: 'var(--gray)', textAlign: 'center', marginBottom: '2.5rem' }}>
          Sign in using your administrator email to manage bookings and uploads.
        </p>

        {error && (
          <div 
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '1.2rem 1.8rem',
              borderRadius: 'var(--r-sm)',
              fontSize: '1.4rem',
              marginBottom: '2rem',
              borderLeft: '4px solid #d32f2f',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <i className="fas fa-exclamation-circle"></i> 
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '1.4rem', fontWeight: 600, color: 'var(--dark)', marginBottom: '.6rem' }}>
              Admin Email
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder="admin@dikimrockgarden.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '1.4rem 1.8rem',
                border: '1px solid var(--g200)',
                borderRadius: 'var(--r-sm)',
                fontSize: '1.5rem',
                color: 'var(--dark)',
                background: 'var(--off-white)',
                transition: 'var(--tr-fast)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '1.4rem', fontWeight: 600, color: 'var(--dark)', marginBottom: '.6rem' }}>
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '1.4rem 1.8rem',
                border: '1px solid var(--g200)',
                borderRadius: 'var(--r-sm)',
                fontSize: '1.5rem',
                color: 'var(--dark)',
                background: 'var(--off-white)',
                transition: 'var(--tr-fast)',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'var(--grad-green)',
              color: 'var(--white)',
              padding: '1.4rem 3rem',
              border: 'none',
              borderRadius: 'var(--r-full)',
              cursor: 'pointer',
              fontSize: '1.6rem',
              fontWeight: 600,
              width: '100%',
              transition: 'var(--tr)',
              boxShadow: 'var(--sh-green)',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
