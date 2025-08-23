'use client'

import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { Calendar } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

export default function DateRangePickerV1() {
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleChange = (ranges: any) => {
    setDate(ranges.selection);
  };

  const toggle = () => setOpenDate(o => !o);

  return (
    // INLINE-BLOCK wrapper so it doesn't stretch or center by default
    <div className="relative">
      {/* combined toggle control */}
      <div
        onClick={toggle}
        className="flex overflow-hidden border border-gray-300 rounded-lg cursor-pointer select-none"
      >
        {/* left: date text */}
        <span className="px-4 py-3 bg-white text-gray-700 text-sm flex-1">
          {`${format(date.startDate, 'M/d/yyyy')} – ${format(date.endDate, 'M/d/yyyy')}`}
        </span>
        {/* right: icon */}
        <span className="px-4 py-3 bg-blue-500 text-white flex items-center justify-center">
          <Calendar size={16} />
        </span>
      </div>

      {/* pop-over sits directly under the toggle */}
      {openDate && (
        <div className="absolute mt-5 left-0 z-10">
          <DateRangePicker
            ranges={[date]}
            onChange={handleChange}
            minDate={new Date()}
            editableDateInputs
            moveRangeOnFirstSelection={false}
            className="shadow-lg rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
