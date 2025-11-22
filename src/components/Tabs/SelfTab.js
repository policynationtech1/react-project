import React, { useState } from 'react';

export default function SelfTab({ next }) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [cityType, setCityType] = useState('');
  const [retirementAge, setRetirementAge] = useState('');

  const handleNext = () => {
    next({ age, gender, city_type: cityType, retirement_age: retirementAge });
  };

return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Self Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
                placeholder="Age" 
                value={age} 
                onChange={e => setAge(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
            <input 
                placeholder="Gender" 
                value={gender} 
                onChange={e => setGender(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
           
            <select
                value={cityType}
                onChange={e => setCityType(e.target.value)}
                style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                }}
                >
                <option value="">Select</option>
                <option value="metro">Metro</option>
                <option value="tier1">Tier 1</option>
                <option value="tier2">Tier 2</option>
                </select>
            <input 
                placeholder="Retirement Age" 
                value={retirementAge} 
                onChange={e => setRetirementAge(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
            <button 
                onClick={handleNext}
                style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}
            >
                Next
            </button>
        </div>
    </div>
);
}
