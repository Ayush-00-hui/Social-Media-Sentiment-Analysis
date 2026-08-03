import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TagInput } from './TagInput';
import { Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, token, updateKeywords } = useAuth();
  const [brandKeywords, setBrandKeywords] = useState<string[]>(user?.brand_keywords || []);
  const [competitorKeywords, setCompetitorKeywords] = useState<string[]>(user?.competitor_keywords || []);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSave = async () => {
    setError('');
    setSuccess(false);

    if (brandKeywords.length === 0) {
      setError('At least one brand keyword is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me/keywords`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          brand_keywords: brandKeywords,
          competitor_keywords: competitorKeywords
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to update settings');
      }

      updateKeywords(brandKeywords, competitorKeywords);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 24, color: '#202124' }}>Client Settings</h2>
      
      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Syne', fontSize: '1.25rem', marginBottom: 16 }}>Profile & Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Company Name</label>
            <div style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1rem', color: '#202124' }}>{user.company_name}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Account Email</label>
            <div style={{ fontFamily: 'DM Sans', fontSize: '1rem', color: '#202124' }}>{user.email}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Current Plan</label>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f3f4', padding: '4px 12px', borderRadius: 16, fontFamily: 'DM Sans', fontSize: '0.875rem', fontWeight: 600 }}>
              {user.plan_tier}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <h3 style={{ fontFamily: 'Syne', fontSize: '1.25rem', marginBottom: 8 }}>Tracking Keywords</h3>
        <p style={{ fontFamily: 'DM Sans', color: '#5f6368', fontSize: '0.875rem', marginBottom: 24 }}>Update the keywords Traccia monitors in real-time. Changes take effect immediately in the dashboard.</p>
        
        {error && <div style={{ padding: '12px 16px', background: '#fce8e6', color: '#c5221f', borderRadius: 8, marginBottom: 24, fontSize: '0.875rem', fontFamily: 'DM Sans' }}>{error}</div>}
        
        <TagInput
          label="Brand Keywords"
          description="Type a keyword and press Enter. At least one is required."
          tags={brandKeywords}
          onChange={setBrandKeywords}
        />

        <TagInput
          label="Competitor Keywords (Optional)"
          description="Track competitor mentions for the Brand Comparison matrix."
          tags={competitorKeywords}
          onChange={setCompetitorKeywords}
        />

        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ padding: '10px 24px' }}>
            {loading ? 'Saving...' : 'Save Changes'}
            {!loading && <Save size={16} />}
          </button>
          {success && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#137333', fontFamily: 'DM Sans', fontSize: '0.875rem', fontWeight: 600, animation: 'fade-up 0.3s ease-out' }}>
              <CheckCircle2 size={16} /> Saved successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
