"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardFooter,
  Select,
  Option,
  CardHeader,
  Input,
} from "@material-tailwind/react";

export default function Swap() {
  const { publicKey, signTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [inputToken, setInputToken] = useState("SOL");
  const [outputToken, setOutputToken] = useState("USDC");
  const [isLoading, setIsLoading] = useState(false);
  const { connection } = useConnection();

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey, connection]);

  const fetchBalance = async () => {
    const balance = await connection.getBalance(publicKey);
    setBalance(balance / 1e9); // Convert lamports to SOL
  };

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      const inputMint = "So11111111111111111111111111111111111111112"; // SOL mint address
      const outputMint =
        connection.rpcEndpoint == "https://api.devnet.solana.com"
          ? "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
          : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC mint address
      const amount = inputAmount * 1e9; // Convert to lamports

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
      fetchBalance();
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-4">
      <div className="mb-6">
        <Typography variant="h4" color="white" className="mb-4">
          Swap Tokens
        </Typography>
        <Card className="bg-[#211e2b]">
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
                <Typography className="block mb-2" color="white">From</Typography>
                <div className="flex space-x-2">
                  <Input
                  color="white"
                    type="number"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    placeholder="Amount"
                    className="flex-grow"
                  />
                  <Select
                  color="white"
                    label="Select token"
                    value={inputToken}
                    onValueChange={setInputToken}
                    className="text-white">
                    <Option color="white" value="SOL">SOL</Option>
                    <Option color="white" value="USDC">USDC</Option>
                  </Select>
                </div>
              </div>
              <div>
                <Typography color="white"  className="block mb-2">To</Typography >
                <div className="flex space-x-2">
                  <Input
                  color="white"
                    type="number"
                    value={outputAmount}
                    readOnly
                    placeholder="Estimated amount"
                    className="flex-grow"
                  />
                  <Select
                  color="white"
                    label="Select token"
                    value={outputToken}
                    onValueChange={setOutputToken}
                    className="text-white">
                    <Option color="white" value="SOL">SOL</Option>
                    <Option color="white" value="USDC">USDC</Option>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSwap} className="bg-[#512DA8]" disabled={isLoading || !inputAmount}>
                {isLoading ? "Swapping..." : "Swap"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
