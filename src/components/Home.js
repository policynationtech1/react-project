import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const [step, setStep] = useState(1);
  const [spouseStep, setSpouseStep] = useState(1);
  const [savingsStep, setSavingsStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [loanStep, setLoanStep] = useState(0);
  const [goalStep, setGoalStep] = useState(0);

  const [form, setForm] = useState({
    name :"",
    age: "",
    gender: "",
    city_type: "",
    retirement_age: "60",
    has_spouse: false,
    spouse_age: "",
    spouse_income: "",
    num_children: 0,
    children_ages: [],
    has_parents: false,
    parents: [],
    monthly_income: "",
    household_expenses: "",
    liquid_savings: "",
    market_investments: "",
    loans: [],
    goals: [],
    existing_term_cover: "",
    employer_life_cover: "",
    existing_health_cover_family: "",
    existing_health_cover_parents: "",
    existing_diseases: [],
    smoker_type: "",
    financial_personality: "", // NEW: stores user's financial personality / risk tolerance
    inflation_rate: "8", 
    health_premium_comfort: "",
  });

  const family_size = useMemo(() => {
    let size = 1;
    if (form.has_spouse) size += 1;
    const nChildren = Number(form.num_children) || 0;
    size += nChildren;
    return size;
  }, [form.has_spouse, form.num_children]);

  const goalOptions = [
    "Children’s Education",
    "Children’s Marriage",
    "Home Purchase",
    "Retirement Corpus for Spouse",
    "Medical Emergency Fund",
    "Family Wealth Creation",
    "Other Future Expenses"
  ];

  const update = (path, value) => {
    setForm(prev => ({ ...prev, [path]: value }));
  };

  const addLoan = () => setForm(prev => ({ ...prev, loans: [...prev.loans, { type: "home", outstanding: "", emi: "" }] }));
  const updateLoan = (i, key, value) => {
    const loans = [...form.loans];
    loans[i] = { ...loans[i], [key]: value };
    update("loans", loans);
  };
  const removeLoan = (i) => {
    const loans = [...form.loans];
    loans.splice(i, 1);
    update("loans", loans);
  };

 // Add goal entry
const addGoal = (goal) => {
  setForm((prev) => ({
    ...prev,
    goals: [...prev.goals, goal],
  }));
};

// Remove by name
const removeGoalByName = (name) => {
  setForm((prev) => ({
    ...prev,
    goals: prev.goals.filter((g) => g.name !== name),
  }));
};

// Update goal by name
const updateGoalByName = (name, field, value) => {
  setForm((prev) => ({
    ...prev,
    goals: prev.goals.map((g) =>
      g.name === name ? { ...g, [field]: value } : g
    ),
  }));
};


  const addParent = () => setForm(prev => ({ ...prev, parents: [...prev.parents, ""] }));
  const updateParent = (i, value) => {
    const p = [...form.parents];
    p[i] = value;
    update("parents", p);
  };
  const removeParent = (i) => {
    const p = [...form.parents];
    p.splice(i, 1);
    update("parents", p);
  };

  const toggleDisease = (code) => {
    const set = new Set(form.existing_diseases);
    if (set.has(code)) set.delete(code);
    else set.add(code);
    update("existing_diseases", Array.from(set));
  };

  const loansOutstandingSum = useMemo(() => {
    return form.loans.reduce((s, l) => s + (Number(l.outstanding) || 0), 0);
  }, [form.loans]);

  const goalsTotal = useMemo(() => {
    return form.goals.reduce((s, g) => s + (Number(g.today_cost) || 0), 0);
  }, [form.goals]);

  const buildPayload = () => {
    const parentAge = form.parents.length ? Math.max(...form.parents.map(a => Number(a) || 0)) : null;
    return {
      name: form.name,
      age: Number(form.age) || 0,
      gender: form.gender,
      city_type: form.city_type,
      retirement_age: Number(form.retirement_age) || 60,
      has_spouse: !!form.has_spouse,
      spouse_age: Number(form.spouse_age) || 0,
      spouse_income: Number(form.spouse_income) || 0,
      num_children: Number(form.num_children) || 0,
      children_ages: form.children_ages.map(a => Number(a) || 0),
      has_parents: !!form.has_parents,
      parent_age: parentAge || 0,
      parents: form.parents.map(a => Number(a) || 0),
      monthly_income: Number(form.monthly_income) || 0,
      household_expenses: Number(form.household_expenses) || 0,
      liquid_savings: Number(form.liquid_savings) || 0,
      market_investments: Number(form.market_investments) || 0,
      loans_outstanding: loansOutstandingSum,
      loans: form.loans.map(l => ({ type: l.type, outstanding: Number(l.outstanding) || 0, emi: Number(l.emi) || 0 })),
      goals: form.goals.map(g => ({ name: g.name, today_cost: Number(g.today_cost) || 0, years_left: Number(g.years_left) || 0 })),
      future_goals: goalsTotal,
      existing_term_cover: Number(form.existing_term_cover) || 0,
      employer_life_cover: Number(form.employer_life_cover) || 0,
      existing_health_cover_family: Number(form.existing_health_cover_family) || 0,
      existing_health_cover_parents: Number(form.existing_health_cover_parents) || 0,
      existing_diseases: form.existing_diseases,
      smoker_type: form.smoker_type ,
      financial_personality: form.financial_personality, // include new field
      family_size,
      inflation_rate: Number(form.inflation_rate) || 8,  // default to 8% if not specified
      health_premium_percentage: Number(form.health_premium_percentage) || 0,  // default to 0% if not specified
    };
  };


  const [pincode, setPincode] = useState('');
  const [isPincodeVisible, setIsPincodeVisible] = useState(false);
  const [cityName, setCityName] = useState('');


  // Handle when "Other" is selected
  const handleCitySelection = (city) => {
    update('city_type', city);
    if (city === 'other') {
      setIsPincodeVisible(true); 
    } else {
      setIsPincodeVisible(false); 
    }
  };


  const handlePincodeSubmit = async () => {
    if (!pincode) {
      alert('Please enter a pincode');
      return;
    }

   
    try {
      const response = await fetch('https://reapply-unnationalised-eve.ngrok-free.dev/validate-pincode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode }),
        
      });

      const data = await response.json();
      console.log('Pincode validation response:', data);
     
      if (data.city_name && data.zone_type) {
        setCityName(data.city_name); 
      const zone = (data.zone_type);
      update('city_type', zone);
      setStep(5); 
       
      } else {
        alert('Invalid pincode');
      }
    } catch (error) {
      console.error('Error validating pincode:', error);
      alert('There was an error validating the pincode');
    }
 

  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    setLoading(true);
    setApiResult(null);
    try {
      const res = await fetch("https://reapply-unnationalised-eve.ngrok-free.dev/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      setApiResult(json);
      setStep(28); // results moved to step 24
    } catch (err) {
      alert("API error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
 const downloadReport = async () => {
  const res = await fetch("https://reapply-unnationalised-eve.ngrok-free.dev/download-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    alert("Download failed!");
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Protection_Report.pdf";
  link.click();
  link.remove();
};
 const payload = {
  name: form.name,
  age: form.age,
  city_type: form.city,
  household_description: form.household,

  // 2. Financial Summary
  monthly_income: form.monthly_income,
  monthly_expenses: form.monthly_expenses,
  loans: form.loans,
  savings: form.savings,

  // 3. LIFE INSURANCE (Correct API Fields)
  ideal_term_cover: apiResult?.term_life_needed || 0,
  minimum_cover: apiResult?.term_life_needed || 0,
  life_explanation: "Calculated based on income replacement, household expenses, loans & future goals",

  // 4. HEALTH INSURANCE (Correct API Fields)
  family_floater: apiResult?.health_insurance?.recommended_family_si || 0,
  parents_si: apiResult?.health_insurance?.recommended_parent_si || 0,
  health_explanation:
    "Calculated based on age, city-type, diseases, family size, and inflation factors",

  // 5. COVERAGE GAP ANALYSIS
  current_life_cover: form.existing_life,
  required_life_cover: apiResult?.term_life_needed || 0,
  life_gap: (apiResult?.term_life_needed || 0) - form.existing_life,

  current_health_si: form.existing_health,
  required_health_si:
    apiResult?.health_insurance?.recommended_family_si +
      (apiResult?.health_insurance?.recommended_parent_si || 0) || 0,

  health_gap:
    (apiResult?.health_insurance?.recommended_family_si || 0) +
    (apiResult?.health_insurance?.recommended_parent_si || 0) -
    form.existing_health,

  // 6. Advisory Notes
  advice_notes: "Review protection every 12 months or during major life events."
};


  const medicalConditions = [
    { code: 'none', label: 'None', icon: '✓' },
    { code: 'cancer_history', label: 'Cancer (history)', icon: '🎗️' },
    { code: 'heart_disease', label: 'Heart disease / stents', icon: '❤️' },
    { code: 'kidney_disease', label: 'Kidney disease', icon: '🩺' },
    { code: 'liver_disease', label: 'Chronic liver disease', icon: '🏥' },
    { code: 'organ_transplant', label: 'Organ transplant', icon: '⚕️' },
    { code: 'diabetes', label: 'Diabetes', icon: '💊' },
    { code: 'hypertension', label: 'Hypertension', icon: '📊' },
    { code: 'thyroid', label: 'Thyroid', icon: '🔬' },
    { code: 'asthma_copd', label: 'Asthma / COPD', icon: '💨' },
    { code: 'autoimmune', label: 'Autoimmune', icon: '🛡️' },
    { code: 'obesity', label: 'Obesity (BMI 30+)', icon: '⚖️' }
   
  ];

  const questions = [
    { id: 1, title: "What is your Name?", validation: () => form.name },
    { id: 2, title: "What is your age?", validation: () => form.age },
    { id: 3, title: "What is your gender?", validation: () => form.gender },
    { id: 4, title: "What is your city type?", validation: () => form.city_type },
    { id: 5, title: "What is your retirement age?", validation: () => form.retirement_age },
    { id: 6, title: "Are you married?", validation: () => true },
    { id: 7, title: "Spouse Age", validation: () => !form.has_spouse || form.spouse_age },
    { id: 8, title: "Spouse Monthly Income", validation: () => !form.has_spouse || form.spouse_income },
    { id: 9, title: "Number of children?", validation: () => true },
    { id: 10, title: "Children ages", validation: () => form.num_children === 0 || form.children_ages.every(a => a) },
    { id: 11, title: "Do you have dependent parents?", validation: () => true },
    { id: 12, title: "Parent ages", validation: () => !form.has_parents || form.parents.every(a => a) },
    { id: 13, title: "Select Smoker or non-smoker", validation: () => true },
    { id: 14, title: "Pre-existing diseases", validation: () => true },
    { id: 15, title: "Monthly income", validation: () => form.monthly_income },
    { id: 16, title: "Household expenses", validation: () => form.household_expenses },
    { id: 17, title: "Liquid Savings", validation: () => true },
    { id: 18, title: "Market Investments", validation: () => true },
    { id: 19, title: "Add Loans", validation: () => true },
    { id: 20, title: "Add Goals", validation: () => true },
    { id: 21, title: "Existing term life cover", validation: () => true },
    { id: 22, title: "Employer life cover", validation: () => true },
    { id: 23, title: "Existing health cover (family)", validation: () => true },
    { id: 24, title: "Existing health cover (parents)", validation: () => true },
    { id: 25, title: "Your Financial Personality", validation: () => true } ,// NEW question
    { id: 26, title: "Inflation Assumption", validation: () => form.inflation_rate },
    { id: 27, title: "Health Premium Comfort Level", validation: () => form.health_premium_comfort }

  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Insurance Needs Calculator</h1>
            <p className="text-gray-500 mt-1">Question {step} of 27</p>
          </div>
          {step === 1 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[0].title}</h2>
              <input className="w-full p-3 border rounded text-lg" placeholder="Enter your Name" type="text" value={form.name} onChange={e => update('name', e.target.value)} />
              <div className="mt-6 flex justify-end gap-3 ">
                
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => { if (form.name) setStep(2); else alert('Please enter Name'); }}>Next</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[1].title}</h2>
              <input className="w-full p-3 border rounded text-lg" placeholder="Enter your age" type="number" value={form.age} onChange={e => update('age', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(1)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => { if (form.age) setStep(3); else alert('Please enter age'); }}>Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
           

            <div>
              <h2 className="text-xl font-medium mb-6">{questions[2].title}</h2>

              <div className="mt-4 flex justify-between gap-4">

               
                <div
                  onClick={() => {update('gender', 'female'); setStep(4);  }}
                  className={`text-center cursor-pointer border rounded-lg p-4 
                    ${form.gender === 'female' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/female_compressed.jpg" className=" mx-auto" />
                  <span className="mt-2 block font-medium">Female</span>
                </div>

               
                <div
                  onClick={() => {update('gender', 'male'); setStep(4); }}
                  className={`text-center cursor-pointer border rounded-lg p-4 
                    ${form.gender === 'male' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/male_compressed.jpg" className=" mx-auto" />
                  <span className="mt-2 block font-medium">Male</span>
                </div>

                
                <div
                  onClick={() => {update('gender', 'other'); setStep(4); }}
                  className={`text-center cursor-pointer border rounded-lg p-4 
                    ${form.gender === 'other' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/other_compressed.jpg" className=" mx-auto" />
                  <span className="mt-2 block font-medium">Other</span>
                </div>

              </div>

              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(2)}>Back</button>
                {/* <button className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={() => form.gender ? setStep(4) : alert('Please select gender')}>
                  Next
                </button> */}
              </div>
            </div>


          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[3].title}</h2>
             

              <div className="mt-4 flex flex-wrap justify-between gap-4">

               
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={` w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'mumbai' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/mumbai_compressed.jpg" className=" mx-auto" />
                
                </div>

               
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={` w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'delhi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/delhi_compressed.jpg" className=" mx-auto" />
                  
                </div>

                
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={`w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'chennai' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/chennai_compressed.jpg" className=" mx-auto" />
                  
                </div>

                  
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={` w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'kolkata' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/kolkata_compressed.jpg" className=" mx-auto" />
                  
                </div>

  
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={` w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'bangalore' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/bangalore_compressed.jpg" className=" mx-auto" />
                 
                </div>
  
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={`w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'hyderabad' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/hyderabad_compressed.jpg" className=" mx-auto" />
                 
                </div>
  
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={`w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'pune' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/pune_compressed.jpg" className=" mx-auto" />
                 
                </div>
                <div
                  onClick={() => {update('city_type', 'Metro'); setStep(5); } }
                  className={`w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'ahmedabad' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/ahmedabad_compressed.jpg" className=" mx-auto" />
                 
                </div>
                <div
                  onClick={() =>handleCitySelection('other')}
                  className={`w-full sm:w-[20%] text-center cursor-pointer border rounded-lg p-4 
                    ${form.city_type === 'other' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/other_city_compressed.jpg" className=" mx-auto" />
                 
                </div>
                {isPincodeVisible && (
                  <div className="w-full sm:w-[20%] mt-6">
                    <input type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="Enter Pincode"
                            className="border rounded-lg p-2 w-full "
                    />
                    
                    <button
                      onClick={handlePincodeSubmit}
                      className="px-4 py-2 bg-green-600 text-white rounded mt-2"
                    >
                      Submit
                    </button>
                  </div>
                )}
                <div className="w-full sm:w-[20%] text-center mt-6">{cityName}</div>
                <div className="w-full sm:w-[20%] text-center"></div>

              </div>

              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(3)}>Back</button>
                {/* <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => { if (form.city_type) setStep(5); else alert('Please select city type'); }}>Next</button> */}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[4].title}</h2>
              <input className="w-full p-3 border rounded text-lg" placeholder="Enter retirement age" type="number" value={form.retirement_age} onChange={e => update('retirement_age', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(4)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(6)}>Next</button>
              </div>
            </div>
          )}

        {step === 6 && (
          <div>
            <h2 className="text-xl font-medium mb-6">{questions[5].title}</h2>

            <div className="mt-4 flex justify-between gap-4">

              {/* NO SPOUSE */}
              <div
                onClick={() => { update('has_spouse', false); setStep(9); }}
                className={`text-center cursor-pointer border rounded-lg p-4 w-full
                  ${form.has_spouse === false ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                `}
              >
                <img src="/images/cloud-data.png" className="mx-auto w-10 h-10" />
                <span className="mt-2 block font-medium">Nopes</span>
              </div>

              {/* YES SPOUSE */}
              <div
                onClick={() => { update('has_spouse', true); setStep(7); }}
                className={`text-center cursor-pointer border rounded-lg p-4 w-full
                  ${form.has_spouse ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                `}
              >
                <img src="/images/wedding-couple.png" className="mx-auto w-10 h-10" />
                <span className="mt-2 block font-medium">OF Course</span>
              </div>

            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(5)}>Back</button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => setStep(form.has_spouse ? 7 : 9)}
              >
                Next
              </button>
            </div>
          </div>
        )}



          {step === 7 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[6].title}</h2>
              <input className="w-full p-3 border rounded" placeholder="Spouse age" type="number" value={form.spouse_age} onChange={e => update('spouse_age', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(6)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => { if (form.spouse_age) setStep(8); else alert('Please enter spouse age'); }}>Next</button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[7].title}</h2>
              <input className="w-full p-3 border rounded" placeholder="Spouse monthly income" type="number" value={form.spouse_income} onChange={e => update('spouse_income', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(7)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => { if (form.spouse_income) setStep(9); else alert('Please enter spouse income'); }}>Next</button>
              </div>
            </div>
          )}

          {step === 9 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[8].title}</h2>
              <input className="w-full p-3 border rounded text-lg" placeholder="Number of children" type="number" min="0" value={form.num_children} onChange={e => { const v = Number(e.target.value) || 0; update('num_children', v); const ages = Array.from({ length: v }, (_, i) => form.children_ages[i] || ''); update('children_ages', ages); }} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(form.has_spouse ? 8 : 6)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(form.num_children > 0 ? 10 : 11)}>Next</button>
              </div>
            </div>
          )}

          {step === 10 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[9].title}</h2>
              <div className="space-y-3">
                {Array.from({ length: form.num_children }).map((_, i) => (
                  <input key={i} className="w-full p-3 border rounded" placeholder={`Child #${i + 1} age`} type="number" value={form.children_ages[i] || ''} onChange={e => { const a = [...form.children_ages]; a[i] = e.target.value; update('children_ages', a); }} />
                ))}
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(9)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(11)}>Next</button>
              </div>
            </div>
          )}

          {step === 11 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[10].title}</h2>
              <label className="flex items-center gap-3 p-4 border rounded cursor-pointer">
                <input type="checkbox" checked={form.has_parents} onChange={e => update('has_parents', e.target.checked)} className="w-5 h-5" />
                <span className="text-lg">Yes, I have dependent parents</span>
              </label>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(form.num_children > 0 ? 10 : 9)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(form.has_parents ? 12 : 13)}>Next</button>
              </div>
            </div>
          )}

          {step === 12 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[11].title}</h2>
              <div className="space-y-3">
                {form.parents.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input className="flex-1 p-3 border rounded" placeholder={`Parent #${i + 1} age`} type="number" value={p} onChange={e => updateParent(i, e.target.value)} />
                    <button className="px-3 bg-red-500 text-white rounded" onClick={() => removeParent(i)}>Remove</button>
                  </div>
                ))}
                <button className="w-full px-3 py-2 bg-gray-100 rounded" onClick={addParent}>Add Parent</button>
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(11)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(13)}>Next</button>
              </div>
            </div>
          )}
           {step === 13 && (
           

            <div>
              <h2 className="text-xl font-medium mb-6">{questions[12].title}</h2>

              <div className="mt-4 flex justify-between gap-4">

               
                <div
                  onClick={() => update('smoker_type', 'smoker')}
                  className={`text-center cursor-pointer border rounded-lg p-4 
                    ${form.smoker_type === 'smoker' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/Yes.png" className=" mx-auto" />
                  <span className="mt-2 block font-medium">Smoker</span>
                </div>

               
                <div
                  onClick={() => update('smoker_type', 'non-smoker')}
                  className={`text-center cursor-pointer border rounded-lg p-4 
                    ${form.smoker_type === 'non-smoker' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <img src="/images/No.png" className=" mx-auto" />
                  <span className="mt-2 block font-medium">Non -  smoker</span>
                </div>

              

              </div>

              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(12)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={() => form.gender ? setStep(14) : alert('Please select gender')}>
                  Next
                </button>
              </div>
            </div>


          )}

          {step === 14 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[13].title}</h2>
              <p className="text-gray-600 text-sm mb-6">Select any conditions that apply:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicalConditions.map(condition => (
                  <button
                    key={condition.code}
                    type="button"
                    onClick={() => {
                      if (condition.code === 'none') {
                        update('existing_diseases', form.existing_diseases.length === 0 ? [] : []);
                      } else {
                        if (form.existing_diseases.includes('none')) {
                          toggleDisease('none');
                        }
                        toggleDisease(condition.code);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 font-medium transition-all duration-200 flex items-center gap-3 ${
                      form.existing_diseases.includes(condition.code)
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg scale-105'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <span className="text-xl">{condition.icon}</span>
                    <span>{condition.label}</span>
                    {form.existing_diseases.includes(condition.code) && (
                      <span className="ml-auto">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(form.has_parents ? 13 : 12)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(15)}>Next</button>
              </div>
            </div>
          )}

          {step === 15 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[14].title}</h2>
              <div className="space-y-3">
                <input className="w-full p-3 border rounded" placeholder="Monthly income" type="number" value={form.monthly_income} onChange={e => update('monthly_income', e.target.value)} />
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(14)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => { if (form.monthly_income) setStep(16); else alert('Please enter monthly income'); }}>Next</button>
              </div>
            </div>
          )}

          {step === 16 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[15].title}</h2>
              <div className="space-y-3">
                <input className="w-full p-3 border rounded" placeholder="Household monthly expenses" type="number" value={form.household_expenses} onChange={e => update('household_expenses', e.target.value)} />
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(15)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => { if (form.household_expenses) setStep(17); else alert('Please enter household expenses'); }}>Next</button>
              </div>
            </div>
          )}

          {step === 17 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[16].title}</h2>
              <div className="space-y-3">
                <input className="w-full p-3 border rounded" placeholder="Liquid savings" type="number" value={form.liquid_savings} onChange={e => update('liquid_savings', e.target.value)} />
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(16)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(18)}>Next</button>
              </div>
            </div>
          )}

          {step === 18 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[17].title}</h2>
              <div className="space-y-3">
                <input className="w-full p-3 border rounded" placeholder="Market investments" type="number" value={form.market_investments} onChange={e => update('market_investments', e.target.value)} />
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(17)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(19)}>Next</button>
              </div>
            </div>
          )}

          {step === 19 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[18].title}</h2>
              <div className="space-y-3">
                <button className="w-full px-3 py-2 bg-gray-100 rounded mb-3" onClick={addLoan}>Add Loan</button>
                <div className="space-y-2">
                  {form.loans.map((loan, i) => (
                    <div key={i} className="flex gap-2">
                      <select className="flex-1 p-2 border rounded" value={loan.type} onChange={e => updateLoan(i, 'type', e.target.value)}>
                        <option value="home">Home</option>
                        <option value="car">Car</option>
                        <option value="personal">Personal</option>
                        <option value="other">Other</option>
                      </select>
                      <input className="flex-1 p-2 border rounded" placeholder="Outstanding" type="number" value={loan.outstanding} onChange={e => updateLoan(i, 'outstanding', e.target.value)} />
                      <input className="flex-1 p-2 border rounded" placeholder="EMI" type="number" value={loan.emi} onChange={e => updateLoan(i, 'emi', e.target.value)} />
                      <button className="px-2 bg-red-500 text-white rounded" onClick={() => removeLoan(i)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(18)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(20)}>Next</button>
              </div>
            </div>
          )}

        {step === 20 && (
          <div>
            <h2 className="text-xl font-medium mb-6">
              Select Your Future Financial Goals
            </h2>

            <p className="text-gray-600 mb-4">
              Choose the goals that matter to you and enter their cost in today’s value.
            </p>

            <div className="space-y-4">
              {goalOptions.map((goal, index) => (
                <div key={index} className="p-3 border rounded">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.goals.some((g) => g.name === goal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          addGoal({ name: goal, today_cost: "" });
                        } else {
                          removeGoalByName(goal);
                        }
                      }}
                    />
                    <span>{goal}</span>
                  </label>

                  {form.goals.some((g) => g.name === goal) && (
                    <input
                      className="mt-2 w-full p-2 border rounded"
                      placeholder="Cost today (₹)"
                      type="number"
                      value={form.goals.find((g) => g.name === goal)?.today_cost || ""}
                      onChange={(e) =>
                        updateGoalByName(goal, "today_cost", e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setStep(19)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => setStep(21)}
              >
                Next
              </button>
            </div>
          </div>
        )}

          {step === 21 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[20].title}</h2>
              <input className="w-full p-3 border rounded" placeholder="Existing term life cover" type="number" value={form.existing_term_cover} onChange={e => update('existing_term_cover', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(20)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(22)}>Next</button>
              </div>
            </div>
          )}

          {step === 22 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[21].title}</h2>
              <input className="w-full p-3 border rounded" placeholder="Employer life cover" type="number" value={form.employer_life_cover} onChange={e => update('employer_life_cover', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(21)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(23)}>Next</button>
              </div>
            </div>
          )}

          {step === 23 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[22].title}</h2>
              <input className="w-full p-3 border rounded" placeholder="Existing health cover (family)" type="number" value={form.existing_health_cover_family} onChange={e => update('existing_health_cover_family', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(22)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(24)}>Next</button>
              </div>
            </div>
          )}

          {step === 24 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[23].title}</h2>
              <input className="w-full p-3 border rounded" placeholder="Existing health cover (parents)" type="number" value={form.existing_health_cover_parents} onChange={e => update('existing_health_cover_parents', e.target.value)} />
              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(23)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(25)}>Next</button>
              </div>
            </div>
          )}

          {step === 25 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[24].title}</h2>
              <p className="text-gray-600 mb-4">How would you describe your approach to financial decisions? This defines your risk tolerance.</p>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer ${form.financial_personality === 'conservative' ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <input type="radio" name="financial_personality" value="conservative" checked={form.financial_personality === 'conservative'} onChange={e => update('financial_personality', e.target.value)} />
                  <div>
                    <div className="font-medium">Conservative</div>
                    <div className="text-sm text-gray-600">Prefer low risk and stable returns, focus on capital preservation.</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer ${form.financial_personality === 'balanced' ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <input type="radio" name="financial_personality" value="balanced" checked={form.financial_personality === 'balanced'} onChange={e => update('financial_personality', e.target.value)} />
                  <div>
                    <div className="font-medium">Balanced</div>
                    <div className="text-sm text-gray-600">Willing to accept moderate risk for balanced growth and safety.</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer ${form.financial_personality === 'aggressive' ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <input type="radio" name="financial_personality" value="aggressive" checked={form.financial_personality === 'aggressive'} onChange={e => update('financial_personality', e.target.value)} />
                  <div>
                    <div className="font-medium">Aggressive</div>
                    <div className="text-sm text-gray-600">Comfortable with higher risk for the potential of greater returns.</div>
                  </div>
                </label>
              </div>
                <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(24)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(26)}>Next</button>
              </div>
            
            </div>
          )}
          {step === 26 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[25].title}</h2>
              <p className="text-gray-600 mb-4">Please confirm the inflation rate we should consider for future goals (default 8%).</p>

              <input
                className="w-full p-3 border rounded"
                placeholder="Inflation rate (%)"
                type="number"
                value={form.inflation_rate}
                onChange={e => update("inflation_rate", e.target.value)}
              />

              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(25)}>Back</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStep(27)}>Next</button>
              </div>
            </div>
          )}
          {step === 27 && (
            <div>
              <h2 className="text-xl font-medium mb-6">{questions[26].title}</h2>
              <p className="text-gray-600 mb-4">
                What percentage of your annual income would you be comfortable allocating to health coverage?
              </p>

              <input
                className="w-full p-3 border rounded"
                placeholder="Enter % (e.g., 5)"
                type="number"
                value={form.health_premium_comfort}
                onChange={e => update("health_premium_comfort", e.target.value)}
              />

              <div className="mt-6 flex justify-between gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(26)}>Back</button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Calculate & Show Recommendation'}
                </button>
              </div>
            </div>
          )}

          {step === 28 && apiResult && (
            <div>
              <h2 className="text-lg font-medium mb-4">Recommendation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Term Life</h3>
                  <div className="mt-2 text-sm text-gray-700">Recommended: <strong>₹{Number(apiResult.term_life_needed || apiResult.recommended_term_cover || 0).toLocaleString()}</strong></div>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Health Insurance</h3>
                  <div className="mt-2 text-sm text-gray-700">Family SI: <strong>₹{Number(apiResult.health_insurance?.recommended_family_si || apiResult.recommended_family_si || 0).toLocaleString()}</strong></div>
                  <div className="mt-1 text-sm text-gray-700">Parent SI: <strong>₹{Number(apiResult.health_insurance?.recommended_parent_si || apiResult.recommended_parent_si || 0).toLocaleString()}</strong></div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setStep(1)}>Home</button>
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setStep(27); setApiResult(null); }}>Edit Inputs</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={downloadReport}>Download Report</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
