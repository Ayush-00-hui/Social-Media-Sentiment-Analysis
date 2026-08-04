import React, { useState } from 'react';
import { TagInput } from './TagInput';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC<{ onNavigate: (page: 'login') => void, onSuccess: () => void }> = ({ onNavigate, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [brandKeywords, setBrandKeywords] = useState<string[]>([]);
  const [competitorKeywords, setCompetitorKeywords] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (brandKeywords.length === 0) {
      setError('Please add at least one brand keyword.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          company_name: companyName,
          brand_keywords: brandKeywords,
          competitor_keywords: competitorKeywords
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
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
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '40px', background: '#fff', border: '1px solid #e8eaed', borderRadius: 16, boxShadow: '0 4px 24px rgba(32,33,36,0.06)' }}>
      <h2 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 8, color: '#202124' }}>Create Account</h2>
      <p style={{ fontFamily: 'DM Sans', color: '#5f6368', marginBottom: 32 }}>Start monitoring your brand sentiment in real-time.</p>

      {error && <div style={{ padding: '12px 16px', background: '#fce8e6', color: '#c5221f', borderRadius: 8, marginBottom: 24, fontSize: '0.875rem', fontFamily: 'DM Sans' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', marginBottom: 6 }}>Company Name</label>
          <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8eaed', fontFamily: 'DM Sans', fontSize: '0.9rem' }} placeholder="Acme Corp" />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', marginBottom: 6 }}>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8eaed', fontFamily: 'DM Sans', fontSize: '0.9rem' }} placeholder="admin@acme.com" />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', marginBottom: 6 }}>Password</label>
          <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8eaed', fontFamily: 'DM Sans', fontSize: '0.9rem' }} placeholder="••••••••" />
        </div>

        <div style={{ height: 1, background: '#e8eaed', margin: '8px 0' }} />

        <TagInput
          label="Brand Keywords"
          description="Type a keyword and press Enter (e.g. Acme, @AcmeCorp)"
          tags={brandKeywords}
          onChange={setBrandKeywords}
          placeholder="Add keyword..."
        />

        <TagInput
          label="Competitor Keywords (Optional)"
          description="Track competitor mentions for comparison"
          tags={competitorKeywords}
          onChange={setCompetitorKeywords}
          placeholder="Add competitor..."
        />

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '12px' }}>
          {loading ? 'Creating Account...' : 'Sign Up & Go to Dashboard'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#5f6368' }}>
        Already have an account? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: '#4285F4', fontWeight: 700, cursor: 'pointer' }}>Log In</button>
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
