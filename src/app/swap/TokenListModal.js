"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Typography,
  Button,
  Card,
  CardBody,
  Input,
} from "@material-tailwind/react";
import TokenListDropdown from "./TokenListDropdown";

const SwapInterface = ({
  handleSwap,
  isLoading,
  inputAmount,
  setInputAmount,
  outputAmount,
  selectedTokens,
  setSelectedTokens,
  tokens,
}) => {
  return (
    <main className="flex-1 p-4">
      {/* ... other UI elements ... */}
      <Card className="bg-[#211e2b]">
        <CardBody>
          <div className="space-y-4">
            <div>
              <Typography className="block mb-2 font-bold" color="white">
                From
              </Typography>
              <div className="flex space-x-2">
                <Input
                  color="white"
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="Amount"
                  className="flex-grow"
                />
                <TokenListDropdown
                                  selectedTokens={selectedTokens}
                                  location={0}
                  tokens={tokens}
                  onSelectToken={setSelectedTokens}
                  selectedToken={selectedTokens[0]}
                />
              </div>
            </div>
            <div>
              <Typography color="white" className="block mb-2 font-bold">
                To
              </Typography>
              <div className="flex space-x-2">
                <Input
                  color="white"
                  type="number"
                  value={outputAmount}
                  readOnly
                  placeholder="Estimated amount"
                  className="flex-grow"
                />
                <TokenListDropdown
                  selectedTokens={selectedTokens}
                  location={1}
                  tokens={tokens}
                  onSelectToken={setSelectedTokens}
                  selectedToken={selectedTokens[1]}
                />
              </div>
            </div>
            <Button
              onClick={handleSwap}
              className="bg-[#512DA8]"
              disabled={isLoading || !inputAmount}
              >
              {isLoading ? "Swapping..." : "Swap"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
};

export default SwapInterface;
