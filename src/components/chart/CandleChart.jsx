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
    let amazonInitialData = [
        [{ open: 133.12, high: 133.58, low: 132.27, close: 132.64, time: 1685923200 }, { open: 132.43, high: 132.94, low: 131.88, close: 132.69, time: 1686009600 }, { open: 132.5, high: 134.44, low: 132.19, close: 134.38, time: 1686096000 }, { open: 134.69, high: 135.98, low: 134.01, close: 134.41, time: 1686182400 }, { open: 134.36, high: 136.1, low: 134.17, close: 135.3, time: 1686268800 }, { open: 136, high: 136.62, low: 135.8216, close: 136.42, time: 1686528000 }, { open: 136.51, high: 138.17, low: 136, close: 137.6, time: 1686614400 }, { open: 137.8, high: 138.93, low: 136.94, close: 137.2, time: 1686700800 }, { open: 137.27, high: 138.8, low: 137.175, close: 138.4, time: 1686787200 }, { open: 139.23, high: 139.469, low: 137.47, close: 137.48, time: 1686873600 }, { open: 136.36, high: 137.23, low: 135.89, close: 135.96, time: 1687219200 }, { open: 135.11, high: 135.39, low: 133.29, close: 133.69, time: 1687305600 }, { open: 131.68, high: 132.96, low: 130.68, close: 131.17, time: 1687392000 }, { open: 130.4, high: 130.62, low: 129.18, close: 129.43, time: 1687478400 }, { open: 129.39, high: 131.41, low: 129.31, close: 131.34, time: 1687737600 }, { open: 131.3, high: 132.95, low: 130.83, close: 132.34, time: 1687824000 }, { open: 132.06, high: 132.17, low: 130.91, close: 131.76, time: 1687910400 }, { open: 131.75, high: 134.35, low: 131.69, close: 134.06, time: 1687996800 }, { open: 134.69, high: 135.03, low: 133.425, close: 133.81, time: 1688083200 }, { open: 133.42, high: 134.35, low: 132.87, close: 133.67, time: 1688342400 }, { open: 133.32, high: 134.31, low: 132.59, close: 134.24, time: 1688515200 }, { open: 133.235, high: 133.9, low: 131.55, close: 132.16, time: 1688601600 }, { open: 131.78, high: 133.855, low: 131.75, close: 132.08, time: 1688688000 }, { open: 131.76, high: 133.05, low: 131.695, close: 132.9, time: 1688947200 }, { open: 133.66, high: 134.56, low: 133.23, close: 134.44, time: 1689033600 }, { open: 135.07, high: 135.33, low: 132.575, close: 132.84, time: 1689120000 }, { open: 133.51, high: 135.07, low: 133.36, close: 133.92, time: 1689206400 }, { open: 133.91, high: 133.92, low: 132.94, close: 133.4, time: 1689292800 }, { open: 133.26, high: 134.61, low: 133.1, close: 134.24, time: 1689552000 }, { open: 134.71, high: 135.95, low: 134.29, close: 135.36, time: 1689638400 }, { open: 135.53, high: 136.45, low: 135.19, close: 135.48, time: 1689724800 }, { open: 137.19, high: 140.32, low: 136.56, close: 138.38, time: 1689811200 }, { open: 138.21, high: 139.7799, low: 137.76, close: 138.94, time: 1689897600 }, { open: 139.35, high: 140.12, low: 138.7788, close: 139.54, time: 1690156800 }, { open: 139.42, high: 140.43, low: 139.0403, close: 140.33, time: 1690243200 }, { open: 140.44, high: 141.25, low: 139.88, close: 141.07, time: 1690329600 }, { open: 142.3, high: 143.38, low: 141.9, close: 142.97, time: 1690416000 }, { open: 143.44, high: 143.95, low: 142.85, close: 143.45, time: 1690502400 }, { open: 143.81, high: 144.605, low: 143.53, close: 144.18, time: 1690761600 }, { open: 144.25, high: 144.48, low: 142.17, close: 143.33, time: 1690848000 }, { open: 142.78, high: 144.3, low: 142.31, close: 144.17, time: 1690934400 }, { open: 143.78, high: 145.22, low: 143.3116, close: 144.45, time: 1691020800 }, { open: 145.09, high: 146.09, low: 143.99, close: 144.24, time: 1691107200 }, { open: 145, high: 146.5, low: 144.93, close: 146.18, time: 1691366400 }, { open: 145.7, high: 146.15, low: 144.11, close: 145.91, time: 1691452800 }, { open: 144.94, high: 144.94, low: 142.3, close: 142.49, time: 1691539200 }, { open: 143.04, high: 144.58, low: 142.69, close: 143.25, time: 1691625600 }, { open: 143.12, high: 143.45, low: 142.205, close: 143.12, time: 1691712000 }, { open: 143.05, high: 143.365, low: 141.802, close: 141.91, time: 1691971200 }, { open: 141.5, high: 142.31, low: 141.2, close: 141.87, time: 1692057600 }, { open: 141.7, high: 142.09, low: 140.56, close: 140.64, time: 1692144000 }, { open: 141.01, high: 142.66, low: 140.6, close: 140.66, time: 1692230400 }, { open: 140, high: 141.83, low: 139.76, close: 141.41, time: 1692316800 }, { open: 141.42, high: 142.39, low: 141.11, close: 142.28, time: 1692576000 }, { open: 142.66, high: 143.225, low: 141.3, close: 141.49, time: 1692662400 }, { open: 141.72, high: 143.475, low: 141.58, close: 143.41, time: 1692748800 }, { open: 143.505, high: 144.47, low: 143.22, close: 143.55, time: 1692835200 }, { open: 144.18, high: 145.47, low: 143.5, close: 145.35, time: 1692921600 }, { open: 145.41, high: 146.74, low: 145.21, close: 146.02, time: 1693180800 }, { open: 146.3, high: 146.73, low: 145.62, close: 146.45, time: 1693267200 }, { open: 146.42, high: 146.92, low: 145.7452, close: 146.86, time: 1693353600 }, { open: 146.94, high: 147.7275, low: 146.54, close: 146.83, time: 1693440000 }, { open: 147.26, high: 148.1, low: 146.92, close: 147.94, time: 1693526400 }, { open: 147.91, high: 149, low: 147.5719, close: 148.13, time: 1693872000 }, { open: 147.66, high: 148.33, low: 147.12, close: 148.06, time: 1693958400 }, { open: 148.13, high: 148.78, low: 147.4, close: 147.52, time: 1694044800 }, { open: 147.35, high: 148.59, low: 147.26, close: 147.68, time: 1694131200 }, { open: 148.57, high: 148.78, low: 147.58, close: 148.38, time: 1694390400 }, { open: 147.92, high: 148, low: 145.8, close: 146.3, time: 1694476800 }, { open: 145.95, high: 146.98, low: 145.92, close: 146.55, time: 1694563200 }, { open: 147.38, high: 147.73, low: 146.48, close: 147.35, time: 1694649600 }, { open: 147.11, high: 147.85, low: 145.53, close: 145.99, time: 1694736000 }, { open: 145.77, high: 146.48, low: 145.06, close: 145.09, time: 1694995200 }, { open: 145, high: 146.72, low: 144.66, close: 146.52, time: 1695081600 }, { open: 148.36, high: 151.9299, low: 148.13, close: 149.83, time: 1695168000 }, { open: 149, high: 149.25, low: 147.31, close: 147.38, time: 1695254400 }, { open: 147.41, high: 148.1, low: 146.82, close: 146.91, time: 1695340800 }, { open: 146.57, high: 147.43, low: 146.25, close: 146.48, time: 1695600000 }, { open: 145.51, high: 146.17, low: 143.0201, close: 143.24, time: 1695686400 }, { open: 143.67, high: 143.82, low: 141.76, close: 143.17, time: 1695772800 }, { open: 142.14, high: 142.282, low: 140.205, close: 141.58, time: 1695859200 }, { open: 142, high: 142.13, low: 139.61, close: 140.3, time: 1695945600 }, { open: 140.04, high: 141.45, low: 139.86, close: 140.8, time: 1696204800 }, { open: 140.87, high: 141.64, low: 140, close: 140.39, time: 1696291200 }, { open: 140.37, high: 141.2004, low: 139.99, close: 141.07, time: 1696377600 }, { open: 140.9, high: 141.7, low: 140.19, close: 141.52, time: 1696464000 }, { open: 141.4, high: 142.94, low: 140.11, close: 142.03, time: 1696550400 }, { open: 142.3, high: 142.4, low: 140.68, close: 142.2, time: 1696809600 }, { open: 142.6, high: 143.415, low: 141.72, close: 142.11, time: 1696896000 }, { open: 142.51, high: 143.34, low: 142.14, close: 143.23, time: 1696982400 }, { open: 142.51, high: 142.93, low: 140.95, close: 141.24, time: 1697068800 }, { open: 139.77, high: 140.12, low: 138.27, close: 138.46, time: 1697155200 }, { open: 139.28, high: 139.78, low: 138.52, close: 139.21, time: 1697414400 }, { open: 137.12, high: 140.62, low: 136.31, close: 140.32, time: 1697500800 }, { open: 140, high: 140.43, low: 139.58, close: 139.97, time: 1697587200 }, { open: 138.64, high: 139.405, low: 137.93, close: 138.01, time: 1697673600 }, { open: 138.15, high: 139.27, low: 137.12, close: 137.16, time: 1697760000 }, { open: 136.63, high: 137.68, low: 135.87, close: 136.38, time: 1698019200 }, { open: 136.74, high: 137.98, low: 136.05, close: 137.79, time: 1698105600 }, { open: 137.5, high: 138.49, low: 136.33, close: 137.08, time: 1698192000 }]
        ,
        [{ value: 3993516, time: 1685923200, color: '#ef5350' }, { value: 3297951, time: 1686009600, color: '#26a69a' }, { value: 5772024, time: 1686096000, color: '#26a69a' }, { value: 4128939, time: 1686182400, color: '#ef5350' }, { value: 3981748, time: 1686268800, color: '#26a69a' }, { value: 4500120, time: 1686528000, color: '#26a69a' }, { value: 3927331, time: 1686614400, color: '#26a69a' }, { value: 4514888, time: 1686700800, color: '#ef5350' }, { value: 3812582, time: 1686787200, color: '#26a69a' }, { value: 7473676, time: 1686873600, color: '#ef5350' }, { value: 4272511, time: 1687219200, color: '#ef5350' }, { value: 5501272, time: 1687305600, color: '#ef5350' }, { value: 6013021, time: 1687392000, color: '#ef5350' }, { value: 11324705, time: 1687478400, color: '#ef5350' }, { value: 4845649, time: 1687737600, color: '#26a69a' }, { value: 3219909, time: 1687824000, color: '#26a69a' }, { value: 2753779, time: 1687910400, color: '#ef5350' }, { value: 3639836, time: 1687996800, color: '#26a69a' }, { value: 4236677, time: 1688083200, color: '#ef5350' }, { value: 1477149, time: 1688342400, color: '#26a69a' }, { value: 2955870, time: 1688515200, color: '#26a69a' }, { value: 3508083, time: 1688601600, color: '#ef5350' }, { value: 2982738, time: 1688688000, color: '#26a69a' }, { value: 2369425, time: 1688947200, color: '#26a69a' }, { value: 2925238, time: 1689033600, color: '#26a69a' }, { value: 3732189, time: 1689120000, color: '#ef5350' }, { value: 3221422, time: 1689206400, color: '#26a69a' }, { value: 2861496, time: 1689292800, color: '#ef5350' }, { value: 3168419, time: 1689552000, color: '#26a69a' }, { value: 3852058, time: 1689638400, color: '#26a69a' }, { value: 5519992, time: 1689724800, color: '#ef5350' }, { value: 10896330, time: 1689811200, color: '#26a69a' }, { value: 5858741, time: 1689897600, color: '#26a69a' }, { value: 3475442, time: 1690156800, color: '#26a69a' }, { value: 3770813, time: 1690243200, color: '#26a69a' }, { value: 4046441, time: 1690329600, color: '#26a69a' }, { value: 6331563, time: 1690416000, color: '#26a69a' }, { value: 6686627, time: 1690502400, color: '#26a69a' }, { value: 6138902, time: 1690761600, color: '#26a69a' }, { value: 4798703, time: 1690848000, color: '#ef5350' }, { value: 4959381, time: 1690934400, color: '#26a69a' }, { value: 3952640, time: 1691020800, color: '#26a69a' }, { value: 4223204, time: 1691107200, color: '#ef5350' }, { value: 3438654, time: 1691366400, color: '#26a69a' }, { value: 4654582, time: 1691452800, color: '#26a69a' }, { value: 4073038, time: 1691539200, color: '#ef5350' }, { value: 4735763, time: 1691625600, color: '#26a69a' }, { value: 2526433, time: 1691712000, color: '#26a69a' }, { value: 4226563, time: 1691971200, color: '#ef5350' }, { value: 3656559, time: 1692057600, color: '#26a69a' }, { value: 3285347, time: 1692144000, color: '#ef5350' }, { value: 3742058, time: 1692230400, color: '#ef5350' }, { value: 3915480, time: 1692316800, color: '#26a69a' }, { value: 2937781, time: 1692576000, color: '#26a69a' }, { value: 3557734, time: 1692662400, color: '#ef5350' }, { value: 2559083, time: 1692748800, color: '#26a69a' }, { value: 2900244, time: 1692835200, color: '#26a69a' }, { value: 3660147, time: 1692921600, color: '#26a69a' }, { value: 3561347, time: 1693180800, color: '#26a69a' }, { value: 2778113, time: 1693267200, color: '#26a69a' }, { value: 2245402, time: 1693353600, color: '#26a69a' }, { value: 3885949, time: 1693440000, color: '#ef5350' }, { value: 2727796, time: 1693526400, color: '#26a69a' }, { value: 3731281, time: 1693872000, color: '#26a69a' }, { value: 2932203, time: 1693958400, color: '#26a69a' }, { value: 3333040, time: 1694044800, color: '#ef5350' }, { value: 3722927, time: 1694131200, color: '#26a69a' }, { value: 3273720, time: 1694390400, color: '#ef5350' }, { value: 4457695, time: 1694476800, color: '#ef5350' }, { value: 2627999, time: 1694563200, color: '#26a69a' }, { value: 2723200, time: 1694649600, color: '#ef5350' }, { value: 6234033, time: 1694736000, color: '#ef5350' }, { value: 2508062, time: 1694995200, color: '#ef5350' }, { value: 3945423, time: 1695081600, color: '#26a69a' }, { value: 9636681, time: 1695168000, color: '#26a69a' }, { value: 4944786, time: 1695254400, color: '#ef5350' }, { value: 2562216, time: 1695340800, color: '#ef5350' }, { value: 2694245, time: 1695600000, color: '#ef5350' }, { value: 4824654, time: 1695686400, color: '#ef5350' }, { value: 4439121, time: 1695772800, color: '#ef5350' }, { value: 5783422, time: 1695859200, color: '#ef5350' }, { value: 5703983, time: 1695945600, color: '#ef5350' }, { value: 3275461, time: 1696204800, color: '#26a69a' }, { value: 3284421, time: 1696291200, color: '#ef5350' }, { value: 2637779, time: 1696377600, color: '#26a69a' }, { value: 3223910, time: 1696464000, color: '#26a69a' }, { value: 3511347, time: 1696550400, color: '#26a69a' }, { value: 2354396, time: 1696809600, color: '#ef5350' }, { value: 3015784, time: 1696896000, color: '#ef5350' }, { value: 2511459, time: 1696982400, color: '#26a69a' }, { value: 3921142, time: 1697068800, color: '#ef5350' }, { value: 4583553, time: 1697155200, color: '#ef5350' }, { value: 3361468, time: 1697414400, color: '#ef5350' }, { value: 4172822, time: 1697500800, color: '#26a69a' }, { value: 3329985, time: 1697587200, color: '#ef5350' }, { value: 5314159, time: 1697673600, color: '#ef5350' }, { value: 4865615, time: 1697760000, color: '#ef5350' }, { value: 3457527, time: 1698019200, color: '#ef5350' }, { value: 3697975, time: 1698105600, color: '#26a69a' }, { value: 6472549, time: 1698192000, color: '#ef5350' }]
    ]
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
                const orderedData = response;
                setHistoricalData(orderedData);
            } catch (error) {
                console.error('Error fetching historical data:', error.message);
            }
        };

        fetchHistoricalData();

        const socket = new WebSocket('wss://chart-viewer-api.onrender.com/');
        // const socket = new WebSocket('ws://localhost:5000/');


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

        candleStickSeries.priceScale().applyOptions({
            scaleMargins: {
                // positioning the price scale for the area series
                top: 0.1,
                bottom: 0.4,
            },
        })

        const volumeSeries = chart.addHistogramSeries({
            priceFormat: {
                type: 'value',
            },
            priceScaleId: '', // set as an overlay by setting a blank priceScaleId
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.7, // highest point of the series will be 70% away from the top
                bottom: 0,
            },
        });

        const combinedData = [...historicalData, ...liveData];
        candleStickSeries.setData(combinedData[0]);
        volumeSeries.setData(combinedData[1]);

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
