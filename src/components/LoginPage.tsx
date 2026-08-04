import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock } from 'lucide-react';

export const LoginPage: React.FC<{ onNavigate: (page: 'signup') => void, onSuccess: () => void }> = ({ onNavigate, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      login(data.token, data.user);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '100px auto', padding: '40px', background: '#fff', border: '1px solid #e8eaed', borderRadius: 16, boxShadow: '0 4px 24px rgba(32,33,36,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={20} color="#202124" />
        </div>
      </div>
      
      <h2 style={{ fontFamily: 'Syne', fontSize: '1.75rem', marginBottom: 8, color: '#202124', textAlign: 'center' }}>Welcome Back</h2>
      <p style={{ fontFamily: 'DM Sans', color: '#5f6368', marginBottom: 32, textAlign: 'center', fontSize: '0.9rem' }}>Log in to access your sentiment dashboard.</p>

      {error && <div style={{ padding: '12px 16px', background: '#fce8e6', color: '#c5221f', borderRadius: 8, marginBottom: 24, fontSize: '0.875rem', fontFamily: 'DM Sans' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', marginBottom: 6 }}>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8eaed', fontFamily: 'DM Sans', fontSize: '0.9rem' }} placeholder="admin@acme.com" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem' }}>Password</label>
            <button type="button" onClick={() => alert("Forgot password functionality coming soon!")} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Forgot?</button>
          </div>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8eaed', fontFamily: 'DM Sans', fontSize: '0.9rem' }} placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '12px' }}>
          {loading ? 'Logging in...' : 'Log In'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#5f6368' }}>
        Don't have an account? <button onClick={() => onNavigate('signup')} style={{ background: 'none', border: 'none', color: '#4285F4', fontWeight: 700, cursor: 'pointer' }}>Sign Up</button>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button 
          onClick={() => {
            login("demo-token", {
              email: "tester@traccia.local",
              company_name: "Demo Corp",
              brand_keywords: ["@DemoCorp"],
              competitor_keywords: ["@Rival"],
              notification_emails: [],
              plan_tier: "Enterprise (Demo)"
            });
            onSuccess();
          }} 
          style={{ background: 'none', border: 'none', color: '#9aa0a6', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'DM Sans' }}
        >
          Skip for UI Testing (Demo Mode)
        </button>
      </div>
    </div>
  );
};
