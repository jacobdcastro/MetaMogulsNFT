import React, { useEffect, useState } from 'react';

const endDateTime = new Date('2022-02-09T12:00:00');
endDateTime.toLocaleString('en-US', { timeZone: 'America/New_York' });

const Countdown = () => {
  const [state, setState] = useState({ days: 0, hours: 0, min: 0, sec: 0 });

  const calculateCountdown = endDate => {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  };

  const stop = i => clearInterval(i);

  useEffect(() => {
    const i = setInterval(() => {
      const date = calculateCountdown(endDateTime);
      date ? setState(date) : stop(i);
    }, 1000);

    return () => stop(i);
  }, []);

  console.log(state);

  return <div></div>;
};

export default Countdown;
