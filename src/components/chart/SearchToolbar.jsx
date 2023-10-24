import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import ApiService from '../../services/ApiService';
import '../../App.css';

const SearchBarContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  position: relative;
  @media (max-width: 380px) {
    width: 100%;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  height: 2.5rem;
  border: none;
  border-radius: 10px;
  padding: 0 15px;
  /* box-shadow: 0px 0px 8px rgb(92, 87, 87); */
  background-color: #c1c1c1bf;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  @media (max-width: 380px) {
   margin-top: 10px;
  }
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  height: 100%;
  font-size: 1rem;
  width: 100%;
  margin-left: 5px;

  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: royalblue;
  cursor: pointer;
`;

const ResultsList = styled.div`
  width: 100%;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 8px #afadad;
  border-radius: 10px;
  margin-top: 2.6rem;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  z-index: 5;

  @media (max-width: 380px) {
    margin-top:3.5rem  
   }
`;

const SearchResult = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: #d1c7c7;
    color: #000;
    cursor: pointer;
  }

  @media (max-width: 380px) {
    padding: 8px 15px;
  }

`;

const SearchToolbar = ({ onCompanySelect }) => {
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await ApiService.searchKeyword(keyword);
            console.log(response);
            setSearchResults(response);
        } catch (error) {
            console.error('Error fetching search results:', error.message);
        }
    };

    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        onCompanySelect(company); // Pass the selected company to the parent component
        alert(`You selected ${company['1. symbol']} - ${company['2. name']}!`);

        // Clear searchResults after selection
        setKeyword('');
        setSearchResults([]);
    };

    return (
        <SearchBarContainer>
            <InputWrapper>
                <Input
                    placeholder="Type and Click to search..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <SearchIcon id="search-icon" onClick={handleSearch} />
            </InputWrapper>

            {searchResults && searchResults.length > 0 && (
                <ResultsList>
                    {searchResults.map((company) => (
                        <SearchResult
                            key={company['1. symbol']}
                            onClick={(e) => {
                                handleCompanySelect(company);
                            }}
                        >
                            <div>
                                {company['2. name']}({company['4. region']})
                            </div>
                            <div>{company['1. symbol']}</div>
                        </SearchResult>
                    ))}
                </ResultsList>
            )}
        </SearchBarContainer>
    );
};

export default SearchToolbar;