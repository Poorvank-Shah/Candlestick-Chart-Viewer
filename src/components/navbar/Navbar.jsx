import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ApiService from '../../services/ApiService';

const NavContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(0,0,0);
  color: #fff;
  padding: 1px;
  box-sizing: border-box;

  @media (max-width: 380px) {
    flex-direction: column;
    height: auto;
  }
`;

const LogoAndTitleContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 380px) {
    width: 100%;
    align-items: normal;
  }
`;

const Logo = styled.div`
  margin-left: 10px;
  box-sizing: border-box;

  img {
    padding: 2px;
    height: 40px;
    width: auto;
    border-radius: 30px;
  }
`;

const NavTitle = styled.div`
  text-align: left;
  font-weight: bolder;
  font-size: 1.5rem;
  padding-left: 5px;
  margin-left: 10px; /* Adjust the margin as needed */

  @media (max-width: 380px) {
    margin-left: 0; /* Reset margin for smaller screens */
    text-align: center;
    margin-top: 10px;
    font-size:1.25rem ;
  }
`;

const NavSearch = styled.div`
  width: 50%;
  text-align: right;
  font-size: 1.2rem;
  padding-left: 10px;
  box-sizing: border-box;

  @media (max-width: 380px) {
    width: 100%;
    text-align: center;
    /* margin-top: 10px; */
  }
`;

const MarqueeContainer = styled.div`
  overflow: hidden;
  white-space: nowrap;
  
`;

const MarqueeContent = styled.div`
  display: inline-block;
  animation: ${keyframes`
    0% {
      transform: translateX(50%);
    }
    100% {
      transform: translateX(-100%);
    }
  `} 50s linear infinite;
`;

const MarqueeSpan = styled.span`
  margin-right: 30px;
  font-size: 15px;
  font-weight: bold;
  color: white;
`;

const Navbar = () => {
    const [globalStatus, setGlobalStatus] = useState([]);

    useEffect(() => {
        const fetchGlobalMarketStatus = async () => {
            try {
                const response = await ApiService.globalMarketStatus();
                // console.log(response);
                setGlobalStatus(response);
            } catch (error) {
                console.error('Error fetching Global Market Status', error.message);
            }
        };

        fetchGlobalMarketStatus();
    }, []);

    return (
        <NavContainer>
            <LogoAndTitleContainer>
                <Logo>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_ORICjZskDktoXoVmPxk3-C0T7qnDPxoDQ&usqp=CAU"
                        alt="Logo"
                    />
                </Logo>
                <NavTitle>
                    <span>Candlestick Chart Visualization</span>
                </NavTitle>
            </LogoAndTitleContainer>
            <NavSearch>
                <MarqueeContainer>
                    <MarqueeContent>
                        {globalStatus.map((info) => {
                            const color = info.current_status === 'open' ? '#03ff03' : 'red';
                            return (
                                <MarqueeSpan key={info.primary_exchange}>
                                    {info.primary_exchange}:{' '}
                                    <span style={{ color: color }}>
                                        {info.current_status.toUpperCase()}
                                    </span>
                                </MarqueeSpan>
                            );
                        })}
                    </MarqueeContent>
                </MarqueeContainer>
            </NavSearch>
        </NavContainer>
    );
};

export default Navbar;

