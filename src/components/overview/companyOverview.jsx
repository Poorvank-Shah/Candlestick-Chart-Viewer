import React from 'react';
import styled from 'styled-components';

// Styled components
const OverviewContainer = styled.div`
  max-width: 100%;
  background-color: white;
`;

const CompanyOverviewWrapper = styled.div`
  color: #000;
  max-width: 80%;
  margin: 0 auto;
  margin-top: 10px;
  padding: 25px;
  background-color: #d2d2d2;
  text-align: center;

  @media (max-width: 380px) {
    max-width: 90%;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const TabularData = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const TableRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const TableCell = styled.div`
  padding: 8px;
  width: fit-content;
  box-sizing: border-box;
  @media (max-width: 380px) {
    width: 100%;
  }
`;

const Warning = styled.div`
  color: #ff0000;
  text-align: center;
  font-size: 20px;

  @media (max-width:380px) {
   font-size : 15px;
  }
`;

const CompanyOverview = ({ data }) => {
    // console.log(data);

    return (
        <>
            <OverviewContainer>
                <CompanyOverviewWrapper>
                    {Object.keys(data).length > 1 ? (
                        <>
                            <Header>
                                <h2>{data?.Name ?? 'N/A'} ({data?.Symbol ?? 'N/A'})</h2>
                                <p style={{ textAlign: 'justify' }}>{data?.Description ?? 'N/A'}</p>
                            </Header>

                            <Section>
                                <h3>General Information</h3>
                                <TabularData>
                                    <TableRow>
                                        <TableCell><strong>Asset Type:</strong> {data?.AssetType ?? 'N/A'}</TableCell>
                                        <TableCell><strong>CIK:</strong> {data?.CIK ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Exchange:</strong> {data?.Exchange ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Currency:</strong> {data?.Currency ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Country:</strong> {data?.Country ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Sector:</strong> {data?.Sector ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Industry:</strong> {data?.Industry ?? 'N/A'}</TableCell>
                                    </TableRow>
                                </TabularData>
                            </Section>

                            <Section>
                                <h3>Financial Information</h3>
                                <TabularData>
                                    <TableRow>
                                        <TableCell><strong>Market Capitalization:</strong> {data?.MarketCapitalization ?? 'N/A'}</TableCell>
                                        <TableCell><strong>EBITDA:</strong> {data?.EBITDA ?? 'N/A'}</TableCell>
                                        <TableCell><strong>PE Ratio:</strong> {data?.PERatio ?? 'N/A'}</TableCell>
                                        <TableCell><strong>PE Growth Ratio:</strong> {data?.PEGRatio ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Book Value:</strong> {data?.BookValue ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Dividend Per Share:</strong> {data?.DividendPerShare ?? 'N/A'}</TableCell>
                                        <TableCell><strong>Dividend Yield:</strong> {data?.DividendYield ?? 'N/A'}</TableCell>
                                    </TableRow>
                                </TabularData>
                            </Section>

                            <Section>
                                <h3>52-Week Performance</h3>
                                <TabularData>
                                    <TableRow>
                                        <TableCell><strong>52 Week High:</strong> {data?.['52WeekHigh'] ?? 'N/A'}</TableCell>
                                        <TableCell><strong>52 Week Low:</strong> {data?.['52WeekLow'] ?? 'N/A'}</TableCell>
                                        <TableCell><strong>50 Day Moving Average:</strong> {data?.['50DayMovingAverage'] ?? 'N/A'}</TableCell>
                                        <TableCell><strong>200 Day Moving Average:</strong> {data?.['200DayMovingAverage'] ?? 'N/A'}</TableCell>
                                    </TableRow>
                                </TabularData>
                            </Section>
                        </>
                    ) : (
                        <Warning>
                            <p>Data not available. Please check again later.</p>
                        </Warning>
                    )}
                </CompanyOverviewWrapper>
            </OverviewContainer>
        </>
    );
};

export default CompanyOverview;