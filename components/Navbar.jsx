'use client';

import React, { useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Select,
  Option
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNetwork } from "../src/app/network-context";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export default function NavbarWithSimpleLinks() {
  const { network, setNetwork } = useNetwork();


  const handleNetworkChange = (value) => {
    setNetwork(value);
  };


  return (
    <Navbar className="sticky inset-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 bg-[#211e2b] border-0" fullWidth>
    <div className="flex items-center justify-between">
      <Typography
        as="a"
        href="/"
        className="mr-4 cursor-pointer"
      >
       <Image
        src={"/logo.png"}
        width={80}
        height={80}
        alt="blink.fund"
       />
      </Typography>
      <div 
        className="flex items-center gap-2 "
      >
        <Select
        value={network}
        onChange={handleNetworkChange}
        label="Select network"
      >
          <Option value={WalletAdapterNetwork.Mainnet}>Mainnet</Option>
          <Option value={WalletAdapterNetwork.Testnet}>Testnet</Option>
          <Option value={WalletAdapterNetwork.Devnet}>Devnet</Option>
        </Select>
        <WalletMultiButton />
      </div>
    </div>
  </Navbar>
  );
}
