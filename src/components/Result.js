import React from 'react';

export default function Result({ result }) {
  return (
    <div>
      <h2>Your Insurance Coverage Recommendations</h2>
      <div>
        <p><strong>Term Cover Needed:</strong> ₹{result.term_cover_needed}</p>
        {/* <p><strong>Health Cover Needed:</strong> ₹{result.health_cover_needed}</p> */}
        <h3>Explanation:</h3>
        { console.log(result) }
        {/* <ul>
          {result.explanation.map((text, index) => <li key={index}>{text}</li>)}
        </ul> */}
      </div>
    </div>
  );
}
