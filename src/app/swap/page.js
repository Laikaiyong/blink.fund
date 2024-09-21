'use client';

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Typography,
  Button,
  Card,
  CardBody,
  Input,
} from "@material-tailwind/react";
import TokenListModal from "./TokenListModal";

const SwapInterface = () => {
  const { publicKey, signTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [selectedTokens, setSelectedTokens] = useState(["SOL", "USDC"]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const { connection } = useConnection();

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchBalance = async () => {
    if (publicKey) {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await fetch("https://tokens.jup.ag/tokens?tags=verified");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const allTokens = await response.json();
      setTokens(allTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      // Fetch balance before proceeding with the swap
      await fetchBalance();

      const inputToken = tokens.find((t) => t.symbol === selectedTokens[0]);
      const outputToken = tokens.find((t) => t.symbol === selectedTokens[1]);

      if (!inputToken || !outputToken) {
        throw new Error("Invalid token selection");
      }

      const inputMint = inputToken.address;
      const outputMint = outputToken.address;
      const amount = Math.floor(inputAmount * 10 ** inputToken.decimals);

      // Step 1: Fetch routes
      const routesResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`
      );
      const routes = await routesResponse.json();

      if (!routes.data || routes.data.length === 0) {
        throw new Error("No routes found");
      }

      // Step 2: Get serialized transactions
      const { swapTransaction } = await fetch(
        "https://quote-api.jup.ag/v6/swap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse: routes.data[0],
            userPublicKey: publicKey.toString(),
            wrapUnwrapSOL: true,
          }),
        }
      ).then((res) => res.json());

      // Step 3: Deserialize and sign the transaction
      const transaction = await connection.deserializeTransaction(
        swapTransaction
      );
      const signedTransaction = await signTransaction(transaction);

      // Step 4: Execute the swap
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction({
        signature: txid,
      });

      console.log("Swap executed:", txid);

      // Refresh balance after swap
      await fetchBalance();
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="flex-1 p-4">
        <div className="mb-6">
          <Typography variant="h4" color="white" className="mb-4">
            Swap Tokens
          </Typography>
      <TokenListModal
        handleSwap={handleSwap}
        isLoading={isLoading}
        tokens={tokens}
        isOpen={isOpen}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        outputAmount={outputAmount}
        toggleModal={() => setIsOpen(false)}
        selectedTokens={selectedTokens}
        setSelectedTokens={setSelectedTokens}
        modalSelectToken={(token) => {
          setSelectedTokens((old) => {
            let newTokens = [token, old[1]];
            if (old.length === 3) newTokens = newTokens.reverse();
            return newTokens;
          });
          setIsOpen(false);
        }}
      />
          {/* <Card className="bg-[#211e2b]">
            <CardBody>
              <Typography variant="h5" color="white" className="mb-4">
                Wallet Balance
              </Typography>
              <Typography color="white">{balance.toFixed(4)} SOL</Typography>
            </CardBody>
          </Card>

          <Card className="bg-[#211e2b]">
            <CardBody>
              <Typography variant="h5" color="white" className="mb-4">
                Swap
              </Typography>
              <div className="space-y-4">
                <div>
                  <Typography className="block mb-2" color="white">
                    From
                  </Typography>
                  <div className="flex space-x-2 items-center">
                    <Input
                      color="white"
                      type="number"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      placeholder="Amount"
                      className="flex-grow"
                    />
                    <Button
                      onClick={() => setIsOpen(true)}
                      className="py-2 px-3 h-10 rounded-xl flex items-center bg-gray-700 text-white"
                    >
                      {selectedTokens[0]}
                    </Button>
                  </div>
                </div>
                <div>
                  <Typography color="white" className="block mb-2">
                    To
                  </Typography>
                  <div className="flex space-x-2 items-center">
                    <Input
                      color="white"
                      type="number"
                      value={outputAmount}
                      readOnly
                      placeholder="Estimated amount"
                      className="flex-grow"
                    />
                    <Button
                      onClick={() => {
                        setSelectedTokens((old) => [
                          ...old.reverse(),
                          "PLACEHOLDER",
                        ]);
                        setIsOpen(true);
                      }}
                      className="py-2 px-3 h-10 rounded-xl flex items-center bg-gray-700 text-white"
                    >
                      {selectedTokens[1]}
                    </Button>
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
          </Card> */}
        </div>
        <div className="flex items-center justify-between mt-6 pl-4">
          <Typography variant="h6" color="white">
            Powered by 
            <img 
              src="/jupiter.png"
              href="https://jup.ag"
              alt="Jupiter" 
              className="h-6 w-6 inline ml-2" 
            />
          </Typography>
        </div>
      </main>
    </>
  );
};

export default SwapInterface;
