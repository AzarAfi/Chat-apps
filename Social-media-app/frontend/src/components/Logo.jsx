import React from 'react'

const logo = () => {
  return (
    <>
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="60" viewBox="0 0 300 100">
  {/* <!-- Background Color --> */}
  <rect width="300" height="100" fill="#ffffff"/>
  
  {/* <!-- Speech Bubble --> */}
  <path d="M200,30 Q220,10 240,30 Q260,50 240,70 Q220,90 200,70 Q180,50 200,30" fill="#4CAF50"/>
  
 {/*  <!-- Quick Talk Text --> */}
  <text x="30" y="60" fontFamily="Poppins" fontSize="30" fill="#000000" fontWeight="bold">
    Quick Talk
  </text>
  
 {/*  <!-- Arrow (representing speed) --> */}
  <line x1="215" y1="30" x2="240" y2="15" stroke="#4CAF50" strokeWidth="3"/>
  <line x1="240" y1="15" x2="245" y2="25" stroke="#4CAF50" strokeWidth="3"/>
  <line x1="240" y1="15" x2="235" y2="5" stroke="#4CAF50" strokeWidth="3"/>
</svg>

    </>
  )
}

export default logo