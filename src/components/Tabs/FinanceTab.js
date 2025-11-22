import React, { useState } from 'react';

export default function FinanceTab({ next }) {
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
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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
