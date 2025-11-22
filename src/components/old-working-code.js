import React, { useState } from 'react';

function App() {
  const [tab, setTab] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData(prevData => ({ ...prevData, ...data }));
    setTab(prevTab => prevTab + 1);
  };

  const handleSubmit = (data) => {
    setFormData(prevData => ({ ...prevData, ...data }));
    console.log('Final form data:', { ...formData, ...data });
  };

  switch (tab) {
    case 1: return <SelfTab next={handleNext} />;
    case 2: return <FamilyTab next={handleNext} />;
    case 3: return <FinanceTab next={handleNext} />;
    case 4: return <ExistingTab submit={handleSubmit} />;
    default: return <div>Unknown Tab</div>;
  }
}

export default App;

function SelfTab({ next }) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [cityType, setCityType] = useState('');
  const [retirementAge, setRetirementAge] = useState('');

  const handleNext = () => {
    next({ age, gender, city_type: cityType, retirement_age: retirementAge });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px  auto' , padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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

function FamilyTab({ next }) {
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
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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

function FinanceTab({ next }) {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [spouseIncome, setSpouseIncome] = useState('');
  const [householdExpenses, setHouseholdExpenses] = useState('');
  const [liquidSavings, setLiquidSavings] = useState('');
  const [marketInvestments, setMarketInvestments] = useState('');

  const handleNext = () => {
    next({
      monthly_income: monthlyIncome,
      spouse_income: spouseIncome,
      household_expenses: householdExpenses,
      liquid_savings: liquidSavings,
      market_investments: marketInvestments,
    });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>Financial Details</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="Monthly Income" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
        <input placeholder="Spouse Monthly Income" value={spouseIncome} onChange={e => setSpouseIncome(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
        <input placeholder="Monthly Household Expenses" value={householdExpenses} onChange={e => setHouseholdExpenses(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
        <input placeholder="Liquid Savings" value={liquidSavings} onChange={e => setLiquidSavings(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
        <input placeholder="Market Investments" value={marketInvestments} onChange={e => setMarketInvestments(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
        <button onClick={handleNext} style={{ padding: '12px', marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Next</button>
      </div>
    </div>
  );
}

function ExistingTab({ submit }) {
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
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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
        >
          Submit
        </button>
      </div>
    </div>
  );
}
