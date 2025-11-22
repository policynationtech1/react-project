import React, { useState } from 'react';

export default function FamilyTab({ next }) {
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseAge, setSpouseAge] = useState('');
  const [spouseIncome, setSpouseIncome] = useState('');
  const [numChildren, setNumChildren] = useState('');
  const [childAge, setChildAge] = useState('');

  const handleNext = () => {
    next({
      has_spouse: hasSpouse,
      spouse_age: spouseAge,
      spouse_income: spouseIncome,
      num_children: numChildren,
      child_age: childAge,
    });
  };

return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Family Details</h2>
        
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                    type="checkbox" 
                    checked={hasSpouse} 
                    onChange={(e) => setHasSpouse(e.target.checked)}
                    style={{ marginRight: '10px', width: '18px', height: '18px' }}
                /> 
                Do you have a spouse?
            </label>
        </div>

        {hasSpouse && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <input 
                    placeholder="Spouse Age" 
                    value={spouseAge} 
                    onChange={e => setSpouseAge(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                <input 
                    placeholder="Spouse Income" 
                    value={spouseIncome} 
                    onChange={e => setSpouseIncome(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
            </div>
        )}

        <div style={{ marginBottom: '20px' }}>
            <input 
                placeholder="Number of Children" 
                value={numChildren} 
                onChange={e => setNumChildren(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
        </div>

        {numChildren > 0 && (
            <div style={{ marginBottom: '20px' }}>
                <input 
                    placeholder="Child Age" 
                    value={childAge} 
                    onChange={e => setChildAge(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
            </div>
        )}

        <button 
            onClick={handleNext}
            style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
        >
            Next
        </button>
    </div>
);
}
