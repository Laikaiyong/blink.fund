'use client';

import React, { useState, useEffect } from "react";
import { Select, Option, Input } from "@material-tailwind/react";

const TokenListDropdown = ({ tokens, onSelectToken, selectedToken, handleSwap, isLoading, selectedTokens, location }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selection, setSelection] = useState("");


  useEffect(() => {
    setSelection(selectedToken);
    const filtered = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchTerm, tokens]);

  useEffect(() => {
    console.log("Selected token changed:", selectedToken);
  }, [selectedToken]);

  const getSelectedTokenData = () => {
    const tokenData = tokens.find(t => t.symbol === selection);
    // console.log("Getting selected token data:", tokenData);
    return tokenData || null;
  };

  const handleChange = (value) => {
    // console.log("Select onChange called with value:", value);
    let newTokens = selectedTokens;
    newTokens[location] = value;
    onSelectToken(newTokens);
    setSelection(value);
  };

  const renderSelectedToken = () => {
    const selectedTokenData = getSelectedTokenData();
    // console.log("Rendering selected token:", selectedTokenData);
    
    if (selectedTokenData) {
      return (
        <div className="flex items-center opacity-100 gap-2">
          <img
            src={selectedTokenData.logoURI}
            alt={selectedTokenData.name}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="font-medium">{selectedTokenData.symbol}</span>
          <span className="text-sm text-gray-600">{selectedTokenData.name}</span>
        </div>
      );
    }
    return "Select Token";
  };

  return (
    <div className="w-72">
      <Select
        size="lg"
        label="Select Token"
        value={selectedToken}
        onChange={handleChange}
        selected={renderSelectedToken}
      >
        <div className="sticky top-0 bg-white z-10">
          <Input
            size="sm"
            label="Search tokens"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredTokens.map((token, index) => (
          <Option
            key={token.symbol + index}
            value={token.symbol}
            className="flex items-center gap-2"
          >
            <img
              src={token.logoURI}
              alt={token.name}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="font-medium">{token.symbol}</span>
            <span className="text-sm text-gray-600">{token.name}</span>
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default TokenListDropdown;