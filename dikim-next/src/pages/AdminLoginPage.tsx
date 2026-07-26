import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import '@/styles/admin.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkActiveSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        navigate('/admin/dashboard');
      }
    }
    checkActiveSession();
  }, [navigate]);

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
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" aria-hidden="true" />

      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/images/Reallogo.jpg" alt="Dikim Rock Garden" />
          <p className="admin-login-eyebrow">Staff only</p>
          <h1>Admin Portal</h1>
          <p className="admin-login-lead">
            Sign in to manage bookings, rooms, boutique, and guest feedback.
          </p>
        </div>

        {error && (
          <div className="admin-login-error" role="alert">
            <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
            <span>{error}</span>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleLogin}>
          <label htmlFor="admin-email">Email</label>
          <input
            type="email"
            id="admin-email"
            autoComplete="username"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            type="password"
            id="admin-password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <Link to="/" className="admin-login-back">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
