'use client';

import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function NavbarWithSimpleLinks() {

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
        className="flex items-center gap-2"
      >
        <WalletMultiButton />
      </div>
    </div>
  </Navbar>
  );
}
