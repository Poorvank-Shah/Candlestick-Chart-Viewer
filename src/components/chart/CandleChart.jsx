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
  background-color: white;
  display: flex;
  padding: 1.5vh;
  padding-top: 0;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

//   @media (max-width: 380px) {
//     padding: 1vh;
//   } 
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
//   box-shadow: 0px 0px 8px rgb(66, 66, 66);

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

  @media (max-width: 380px) {
    margin-right: 5px;
    font-size: 13px;
  }
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
    let amazonInitialData = [{open:124.92,high:126.39,low:124.015,close:124.25,time:1685664000},{open:123.36,high:125.8,low:123.03,close:125.3,time:1685923200},{open:125.07,high:127.4,low:125,close:126.61,time:1686009600},{open:127.01,high:127.365,low:120.63,close:121.23,time:1686096000},{open:123.01,high:125.625,low:122.2579,close:124.25,time:1686182400},{open:124.08,high:125.8,low:123.19,close:123.43,time:1686268800},{open:124.02,high:126.78,low:123.53,close:126.57,time:1686528000},{open:128.12,high:128.41,low:125.18,close:126.66,time:1686614400},{open:126.7,high:126.95,low:124.12,close:126.42,time:1686700800},{open:125.21,high:127.69,low:124.32,close:127.11,time:1686787200},{open:127.71,high:127.9,low:125.3,close:125.49,time:1686873600},{open:124.97,high:127.25,low:124.5,close:125.78,time:1687219200},{open:125.64,high:126.73,low:123.85,close:124.83,time:1687305600},{open:125.31,high:130.33,low:125.14,close:130.15,time:1687392000},{open:129.11,high:130.84,low:128.28,close:129.33,time:1687478400},{open:129.33,high:131.49,low:127.1,close:127.33,time:1687737600},{open:128.63,high:130.085,low:127.55,close:129.18,time:1687824000},{open:128.94,high:131.48,low:128.44,close:129.04,time:1687910400},{open:128.77,high:129.26,low:127.255,close:127.9,time:1687996800},{open:129.47,high:131.245,low:128.95,close:130.36,time:1688083200},{open:130.82,high:131.85,low:130.065,close:130.22,time:1688342400},{open:130.24,high:131.4,low:129.64,close:130.38,time:1688515200},{open:128.25,high:128.73,low:127.37,close:128.36,time:1688601600},{open:128.59,high:130.97,low:128.1294,close:129.78,time:1688688000},{open:129.07,high:129.28,low:125.915,close:127.13,time:1688947200},{open:127.75,high:129.77,low:127.35,close:128.78,time:1689033600},{open:130.31,high:131.26,low:128.83,close:130.8,time:1689120000},{open:134.04,high:134.67,low:132.71,close:134.3,time:1689206400},{open:134.06,high:136.65,low:134.06,close:134.68,time:1689292800},{open:134.56,high:135.62,low:133.21,close:133.56,time:1689552000},{open:132.71,high:133.86,low:131.355,close:132.83,time:1689638400},{open:133.39,high:135.99,low:132.53,close:135.36,time:1689724800},{open:134.07,high:134.7915,low:129.33,close:129.96,time:1689811200},{open:131.34,high:131.37,low:128.415,close:130,time:1689897600},{open:130.305,high:131.66,low:128.35,close:128.8,time:1690156800},{open:129.31,high:129.58,low:128.53,close:129.13,time:1690243200},{open:126.51,high:129.08,low:126.11,close:128.15,time:1690329600},{open:131,high:132.63,low:127.79,close:128.25,time:1690416000},{open:129.69,high:133.01,low:129.33,close:132.21,time:1690502400},{open:133.2,high:133.87,low:132.38,close:133.68,time:1690761600},{open:133.55,high:133.69,low:131.6199,close:131.69,time:1690848000},{open:130.154,high:130.23,low:126.82,close:128.21,time:1690934400},{open:127.48,high:129.84,low:126.41,close:128.91,time:1691020800},{open:141.06,high:143.63,low:139.32,close:139.57,time:1691107200},{open:140.99,high:142.54,low:138.95,close:142.22,time:1691366400},{open:140.62,high:140.84,low:138.42,close:139.94,time:1691452800},{open:139.97,high:140.32,low:137.1,close:137.85,time:1691539200},{open:139.075,high:140.41,low:137.49,close:138.56,time:1691625600},{open:137.4,high:139.33,low:137,close:138.41,time:1691712000},{open:138.3,high:140.59,low:137.75,close:140.57,time:1691971200},{open:140.05,high:141.2778,low:137.23,close:137.67,time:1692057600},{open:137.19,high:137.27,low:135.01,close:135.07,time:1692144000},{open:135.46,high:136.085,low:133.53,close:133.98,time:1692230400},{open:131.62,high:134.065,low:131.15,close:133.22,time:1692316800},{open:133.74,high:135.185,low:132.71,close:134.68,time:1692576000},{open:135.08,high:135.65,low:133.73,close:134.25,time:1692662400},{open:134.5,high:135.95,low:133.22,close:135.52,time:1692748800},{open:136.4,high:136.775,low:131.83,close:131.84,time:1692835200},{open:132.47,high:133.87,low:130.58,close:133.26,time:1692921600},{open:133.78,high:133.95,low:131.85,close:133.14,time:1693180800},{open:133.38,high:135.14,low:133.25,close:134.91,time:1693267200},{open:134.93,high:135.68,low:133.92,close:135.07,time:1693353600},{open:135.06,high:138.7885,low:135,close:138.01,time:1693440000},{open:139.455,high:139.96,low:136.875,close:138.12,time:1693526400},{open:137.73,high:137.8,low:135.82,close:137.27,time:1693872000},{open:136.32,high:137.45,low:134.61,close:135.36,time:1693958400},{open:133.9,high:138.03,low:133.16,close:137.85,time:1694044800},{open:136.86,high:138.8519,low:136.75,close:138.23,time:1694131200},{open:138.75,high:143.62,low:138.64,close:143.1,time:1694390400},{open:142.32,high:143,low:140.61,close:141.23,time:1694476800},{open:140.95,high:144.98,low:140.865,close:144.85,time:1694563200},{open:145.08,high:145.86,low:142.95,close:144.72,time:1694649600},{open:142.69,high:143.57,low:140.09,close:140.39,time:1694736000},{open:140.48,high:141.75,low:139.22,close:139.98,time:1694995200},{open:138.7,high:138.84,low:135.56,close:137.63,time:1695081600},{open:138.55,high:139.37,low:135.2,close:135.29,time:1695168000},{open:131.94,high:132.24,low:129.31,close:129.33,time:1695254400},{open:131.11,high:132.03,low:128.52,close:129.12,time:1695340800},{open:129.36,high:131.78,low:128.77,close:131.27,time:1695600000},{open:130.12,high:130.39,low:125.28,close:125.98,time:1695686400},{open:125.76,high:127.48,low:124.13,close:125.98,time:1695772800},{open:124.04,high:126.5801,low:123.04,close:125.98,time:1695859200},{open:128.2,high:129.15,low:126.32,close:127.12,time:1695945600},{open:127.28,high:130.47,low:126.54,close:129.46,time:1696204800},{open:128.06,high:128.52,low:124.2544,close:124.72,time:1696291200},{open:126.06,high:127.36,low:125.68,close:127,time:1696377600},{open:126.71,high:126.73,low:124.33,close:125.96,time:1696464000},{open:124.16,high:128.45,low:124.13,close:127.96,time:1696550400},{open:126.22,high:128.79,low:124.76,close:128.26,time:1696809600},{open:128.82,high:130.74,low:128.05,close:129.48,time:1696896000},{open:129.74,high:132.05,low:129.61,close:131.83,time:1696982400},{open:132.17,high:134.48,low:131.23,close:132.33,time:1697068800},{open:132.98,high:133.3145,low:128.95,close:129.79,time:1697155200},{open:130.69,high:133.07,low:130.425,close:132.55,time:1697414400},{open:130.39,high:132.58,low:128.71,close:131.47,time:1697500800},{open:129.9,high:130.6699,low:127.51,close:128.13,time:1697587200},{open:130.565,high:132.24,low:127.47,close:128.4,time:1697673600},{open:128.05,high:128.17,low:124.97,close:125.17,time:1697760000},{open:124.63,high:127.88,low:123.98,close:126.56,time:1698019200},{open:127.74,high:128.8,low:126.34,close:128.56,time:1698105600}];
    const [overview, setOverview] = useState('AMZN');
    const [timeframe, setTimeframe] = useState('Daily');
    const [historicalData, setHistoricalData] = useState(amazonInitialData);
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

        const socket = new WebSocket('wss://chart-viewer-api.onrender.com/');


        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({ timeframe: timeframe, lastValue: historicalData[historicalData.length - 1] }));
        });

        socket.addEventListener('message', (event) => {
            const receivedMessage = JSON.parse(event.data).liveData;
            // console.log(receivedMessage)
            setLiveData((prevMessages) => [...prevMessages, receivedMessage]);
        });

        socket.addEventListener('close', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
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
                                fontWeight: '700',
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
