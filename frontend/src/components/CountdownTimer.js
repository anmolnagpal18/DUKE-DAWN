import React from 'react';

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = React.useState({});

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft({});
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
    return <div className="text-red-500 font-bold">Sale Ended</div>;
  }

  return (
    <div className="flex gap-2 text-sm font-bold text-gold-400">
      <div className="bg-dark-800 px-2 py-1 rounded">
        {timeLeft.days || 0}d
      </div>
      <div className="bg-dark-800 px-2 py-1 rounded">
        {timeLeft.hours || 0}h
      </div>
      <div className="bg-dark-800 px-2 py-1 rounded">
        {timeLeft.minutes || 0}m
      </div>
      <div className="bg-dark-800 px-2 py-1 rounded">
        {timeLeft.seconds || 0}s
      </div>
    </div>
  );
};

export default CountdownTimer;
