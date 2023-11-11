import React from 'react';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const TimeframeContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px;
  width: auto;

  @media (max-width: 380px) {
    justify-content: center;
  }
`;

const TimeframeButton = styled.button`
  font-weight: ${(props) => (props.dataselected === 'true' ? '700' : 'normal')};
  outline: none;
  padding: 5px;
  cursor: pointer;
  background: #b7b7b7c9;
  border: none;
  border-radius: 5px;
  margin: 0px 5px;
  
  @media (max-width: 380px) {
    margin-right: 3px;
    font-size: 12px;
  }
`;

const TimeframeButtons = ({ selectedTimeframe, onSelectTimeframe }) => {
  const isMobile = useMediaQuery({ maxWidth: 380 });
  const timeframeLabels = {
    '1min': '1m',
    '5min': '5m',
    '15min': '15m',
    '30min': '30m',
    '60min': '60m',
    'Daily': 'D',
    'Weekly': 'W',
    'Monthly': 'M',
  };

  return (
    <TimeframeContainer>
      {Object.entries(timeframeLabels).map(([tf, label]) => (
        <TimeframeButton
          key={tf}
          onClick={() => onSelectTimeframe(tf)}
          dataselected={tf === selectedTimeframe ? 'true' : 'false'}
        >
          {isMobile ? label : tf}
        </TimeframeButton>
      ))}
    </TimeframeContainer>
  );
};

export default TimeframeButtons;