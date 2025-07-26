'use client';

import { useState, useEffect } from 'react';
import moment from 'moment';

const DateDisplay = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set the interval to update the date every second
    const interval = setInterval(() => {
      const formattedDate = moment().format('DD MMM YYYY HH:mm:ss'); 
      setCurrentDate(formattedDate); 
    }, 1000);

    // Cleanup interval when the component is unmounted
    return () => clearInterval(interval);
  }, []); 

  return (
    <div className="bg-blue-100 text-blue-600 py-2 px-4 rounded-lg text-sm">
      <span>Today </span>
      {currentDate}
    </div>
  );
};

export default DateDisplay;
