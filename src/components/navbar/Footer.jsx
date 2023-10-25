import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ApiService from '../../services/ApiService';

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  /* height: 50px; */
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgb(0,0,0);
  color: #fff;
  padding: 5px;
  box-sizing: border-box;

  @media (max-width: 380px) {
    flex-direction: column;
    font-size: 13px;
  }
`;

const FooterData = styled.div`
  margin-right: 5px;
`;


const Footer = () => {
  return (
    <FooterContainer>
      <FooterData>Thank you for using CandleStick Chart Visualizer.</FooterData>
      <FooterData>Copyright &copy; Poorvank Shah</FooterData>
    </FooterContainer>
  )
}

export default Footer
