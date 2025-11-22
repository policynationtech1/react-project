import React, { useState } from 'react';

export default function ExistingTab({ submit }) {
  const [existingTermCover, setExistingTermCover] = useState('');
  const [employerLifeCover, setEmployerLifeCover] = useState('');
  const [existingHealthCoverFamily, setExistingHealthCoverFamily] = useState('');
  const [existingHealthCoverParents, setExistingHealthCoverParents] = useState('');

  const handleSubmit = () => {
    submit({
      existing_term_cover: existingTermCover,
      employer_life_cover: employerLifeCover,
      existing_health_cover_family: existingHealthCoverFamily,
      existing_health_cover_parents: existingHealthCoverParents,
    });
  };

return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333', marginBottom: '24px', textAlign: 'center', fontSize: '24px' }}>Existing Insurance</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
                placeholder="Existing Term Life Cover" 
                value={existingTermCover} 
                onChange={e => setExistingTermCover(e.target.value)} 
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
            <input 
                placeholder="Employer Life Cover" 
                value={employerLifeCover} 
                onChange={e => setEmployerLifeCover(e.target.value)} 
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
            <input 
                placeholder="Existing Health Cover (Family)" 
                value={existingHealthCoverFamily} 
                onChange={e => setExistingHealthCoverFamily(e.target.value)} 
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
            <input 
                placeholder="Existing Health Cover (Parents)" 
                value={existingHealthCoverParents} 
                onChange={e => setExistingHealthCoverParents(e.target.value)} 
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
            <button 
                onClick={handleSubmit}
                style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
                Submit
            </button>
        </div>
    </div>
);
}
