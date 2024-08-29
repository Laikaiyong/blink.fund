"use client";

import { ThemeProvider, Button } from "@material-tailwind/react";
import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  UnsafeBurnerWalletAdapter,
  SkyWalletAdapter,
  MathWalletAdapter,
  NekoWalletAdapter,
  NufiWalletAdapter,
  OntoWalletAdapter,
  SpotWalletAdapter,
  AlphaWalletAdapter,
  AvanaWalletAdapter,
  HuobiWalletAdapter,
  SaifuWalletAdapter,
  TorusWalletAdapter,
  PhantomWalletAdapter,
  TrustWalletAdapter,
  BitgetWalletAdapter,
  BitpieWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinhubWalletAdapter,
  LedgerWalletAdapter,
  SolongWalletAdapter,
  SolflareWalletAdapter,
  NightlyWalletAdapter,
  SafePalWalletAdapter,
  SalmonWalletAdapter,
  TokenPocketWalletAdapter,
  TokenaryWalletAdapter
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletProviders = ({
  children,
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
      new SkyWalletAdapter(),
      new MathWalletAdapter(),
      new NekoWalletAdapter(),
      new NufiWalletAdapter(),
      new OntoWalletAdapter(),
      new SpotWalletAdapter(),
      new AlphaWalletAdapter(),
      new AvanaWalletAdapter(),
      new HuobiWalletAdapter(),
      new SaifuWalletAdapter(),
      new TorusWalletAdapter(),
      new PhantomWalletAdapter(),
      new TrustWalletAdapter(),
      new BitgetWalletAdapter(),
      new BitpieWalletAdapter(),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new CoinhubWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolongWalletAdapter(),
      new SolflareWalletAdapter(),
      new NightlyWalletAdapter(),
      new SafePalWalletAdapter(),
      new SalmonWalletAdapter(),
      new TokenPocketWalletAdapter(),
      new TokenaryWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
          <ThemeProvider>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
          </ThemeProvider>
  );
};