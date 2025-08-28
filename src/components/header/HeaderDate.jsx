'use client';

import { useState, useEffect } from 'react';
import moment from 'moment';
// import 'moment/locale/id';

const DateDisplay = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set the interval to update the date every second
    const interval = setInterval(() => {
      // moment.locale('id')
      const formattedDate = moment().format('dddd, D MMMM YYYY HH:mm:ss');
      setCurrentDate(formattedDate);
    }, 1000);

    // Cleanup interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-base font-semibold">
      {currentDate}
    </div>
  );
};

export default DateDisplay;
