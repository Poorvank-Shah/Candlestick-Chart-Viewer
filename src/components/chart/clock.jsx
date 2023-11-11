import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  font-size: 18px;
  /* margin-top: 10px; */
  @media (max-width: 380px) {
    font-size: 12px;
  }
`;

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <ClockContainer>
      {formattedTime} (UTC+5:30)
    </ClockContainer>
  );
};

export default Clock;
