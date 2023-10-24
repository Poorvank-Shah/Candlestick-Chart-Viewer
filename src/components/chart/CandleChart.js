import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, TickMarkType } from 'lightweight-charts';
import styled from 'styled-components';

import TimeframeButtons from './TimeframeButtons';
import ApiService from '../../services/ApiService';
import SearchToolbar from './SearchToolbar';
import '../../App.css';
import Clock from './clock';
import CompanyOverview from '../overview/companyOverview';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #00ff8d99;
  display: flex;
  padding: 2vh;
  padding-top: 0;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  /* @media (max-width: 380px) {
    padding: 1vh;
  } */
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;

 @media (max-width: 380px) {
    flex-direction: column-reverse;
  }
`;

const Box1 = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 2px;
  box-shadow: 0px 0px 8px rgb(66, 66, 66);

  /* @media (max-width: 380px) {
    border: none;
    box-shadow: none;
  } */

`;

const Box2 = styled.div`
  width: 100%;
  height: 100%;
`;

const ChartContainer = styled.div`
  position: relative;
  box-sizing: border-box;
`;

const InfoContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
`;

const InfoBox = styled.div`
  display: flex;
  color: ${({ isnegative }) => (isnegative === 'true' ? 'red' : 'green')};
  font-weight: bold;
`;

const InfoItem = styled.div`
  margin-right: 10px;
`;

const StyledFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const CandleChart = () => {
    const [symbol, setSymbol] = useState('AMZN');
    const [company, setCompany] = useState({
        '1. symbol': 'AMZN',
        '2. name': 'Amazon.com Inc',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-04',
        '8. currency': 'USD',
        '9. matchScore': '0.7500',
    });
    const [overview, setOverview] = useState('AMZN');
    const [timeframe, setTimeframe] = useState('Daily');
    const [historicalData, setHistoricalData] = useState([]);
    const [liveData, setLiveData] = useState([]);
    const [candlePrice, setCandlePrice] = useState(null);

    const chartContainerRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const response = await ApiService.getHistoricalData(symbol, timeframe);
                const orderedData = response.reverse();
                setHistoricalData(orderedData);
            } catch (error) {
                console.error('Error fetching historical data:', error.message);
            }
        };

        fetchHistoricalData();

        const socket = new WebSocket('ws://localhost:5000');

        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({ timeframe: timeframe, lastValue: historicalData[historicalData.length - 1] }));
        });

        socket.addEventListener('message', (event) => {
            const receivedMessage = JSON.parse(event.data).liveData;
            console.log(receivedMessage)
            setLiveData((prevMessages) => [...prevMessages, receivedMessage]);
        });

        socket.addEventListener('close', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            socket.close();
            setLiveData([]);
        };
    }, [symbol, timeframe]);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await ApiService.companyOverview(symbol);
                setOverview(response);
            } catch (error) {
                console.error('Error fetching overview', error.message);
            }
        };
        fetchOverview();
    }, [symbol]);

    const backgroundColor = 'white';
    const textColor = 'black';

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        const chart = createChart(chartContainerRef.current);
        chart.applyOptions({
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.width,
            height: 500,
            localization: {
                locale: 'en-IN',
                timeFormatter: (time) => {
                    const date = new Date(time * 1000);

                    const dateFormatter = new Intl.DateTimeFormat(navigator.language, { month: 'short', day: 'numeric', year: '2-digit' });

                    const dateTimeFormatter = new Intl.DateTimeFormat(navigator.language, { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric', year: '2-digit' });

                    if (['Daily', 'Weekly', 'Monthly'].includes(timeframe)) {
                        return dateFormatter.format(date);
                    }
                    else {
                        return dateTimeFormatter.format(date);
                    }
                }
            },
            timeScale: {
                rightOffset: 5,
                timeVisible: true,
                minBarSpacing: 5,
                barSpacing: 15,
                tickMarkFormatter: (time, tickMarkType, locale) => {
                    const date = new Date(time * 1000);

                    switch (tickMarkType) {
                        case TickMarkType.Year:
                            return date.getFullYear();

                        case TickMarkType.Month:
                            const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short', });

                            return monthFormatter.format(date);

                        case TickMarkType.DayOfMonth:
                            return date.getDate();

                        case TickMarkType.Time:
                            const timeFormtter = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' });

                            return timeFormtter.format(date);

                        case TickMarkType.TimeWithSeconds:
                            const timeWithSecondsFormtter = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' });

                            return timeWithSecondsFormtter.format(date);
                        default:
                            console.log('sorry');
                    }
                }
            },
        });

        const candleStickSeries = chart.addCandlestickSeries();

        candleStickSeries.applyOptions({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        const combinedData = [...historicalData, ...liveData];
        candleStickSeries.setData(combinedData);

        chart.subscribeCrosshairMove((param) => {
            if (param.time) {
                const data = param.seriesData.get(candleStickSeries);
                setCandlePrice(data);

                // if (tooltipRef.current) {
                //     tooltipRef.current.style.left = param.point.x + "px";
                //     tooltipRef.current.style.top = param.point.y + "px";
                //   }

            } else {
                setCandlePrice(null);
            }
        });

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [historicalData, liveData]);

    return (
        <>
            <MainContainer>
                <Box2>
                    <Toolbar>
                        <div
                            className="companyInfo"
                            style={{
                                paddingLeft: '15px',
                                boxSizing: 'border-box',
                                fontWeight: '500',
                                width: 'auto',
                                flex: '1'
                            }}
                        >
                            <p>{company ? `${company['2. name']} (${company['1. symbol']})` : 'N/A'}</p>
                        </div>

                        <SearchToolbar
                            onCompanySelect={(selected) => {
                                setSymbol(selected['1. symbol']);
                                setCompany(selected);
                            }}
                        />
                    </Toolbar>
                </Box2>

                <Box1>
                    <ChartContainer ref={chartContainerRef}>
                        <InfoContainer>
                            <InfoBox isnegative={candlePrice?.open > candlePrice?.close ? 'true' : 'false'}>
                                <InfoItem>O: {candlePrice?.open}</InfoItem>
                                <InfoItem>H: {candlePrice?.high}</InfoItem>
                                <InfoItem>L: {candlePrice?.low}</InfoItem>
                                <InfoItem>C: {candlePrice?.close}</InfoItem>
                            </InfoBox>
                        </InfoContainer>
                    </ChartContainer>

                    <StyledFlexContainer>
                        <TimeframeButtons selectedTimeframe={timeframe} onSelectTimeframe={(selected) => setTimeframe(selected)} />
                        <div style={{ padding: '5px', fontWeight: 'bold' }}>
                            <Clock></Clock>
                        </div>
                    </StyledFlexContainer>
                </Box1>
            </MainContainer >
            <CompanyOverview data={overview} />
        </>
    );
};

export default CandleChart;


// {
//     <div ref={tooltipRef}
//         style={{
//             position: 'absolute',
//             top: 10,
//             left: 10,
//             zIndex: 3,
//         }}
//     >
//         <div
//             style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 color: candlePrice?.open > candlePrice?.close ? 'red' : 'green',
//                 fontWeight: 'bold',
//                 width: 'auto',
//                 height: 'auto',
//                 background: 'rgba(255, 255, 255, 0.25)',
//                 color: 'black',
//                 border: '1px solid black',
//                 borderColor: 'rgba( 239, 83, 80, 1)'
//             }}
//         >
//             <div style={{ marginRight: '10px' }}>O: {candlePrice?.open}</div>
//             <div style={{ marginRight: '10px' }}>H: {candlePrice?.high}</div>
//             <div style={{ marginRight: '10px' }}>L: {candlePrice?.low}</div>
//             <div style={{ marginRight: '10px' }}>C: {candlePrice?.close}</div>
//         </div>
//     </div>
// }