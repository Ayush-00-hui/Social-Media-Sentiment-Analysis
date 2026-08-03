import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label: string;
  description?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder, label, description }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/^,+|,+$/g, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', marginBottom: 6, color: '#202124' }}>
        {label}
      </label>
      {description && (
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: '#5f6368', marginBottom: 8, lineHeight: 1.4 }}>
          {description}
        </p>
      )}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          padding: '8px 12px',
          border: '1px solid #e8eaed', borderRadius: 8,
          background: '#fff',
          alignItems: 'center',
          transition: 'border-color 0.2s',
        }}
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px',
              background: '#f1f3f4', borderRadius: 16,
              fontFamily: 'DM Mono', fontSize: '0.75rem', fontWeight: 500, color: '#202124'
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#5f6368' }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          style={{
            flex: 1, minWidth: 120,
            border: 'none', outline: 'none',
            fontFamily: 'DM Sans', fontSize: '0.875rem',
            background: 'transparent',
            padding: '4px 0'
          }}
        />
      </div>
    </div>
  );
};
