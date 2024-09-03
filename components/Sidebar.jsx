"use client";

import React from "react";
import { Card, Typography, CardBody } from "@material-tailwind/react";

import {
  ChartPieIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
  HomeIcon,
  DocumentCurrencyPoundIcon,
    ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";


export default function Sidebar() {
  return (
    <>
<nav className="grid gap-4 p-4 grid-cols-2 md:grid-cols-1">
<a href="/" className="bg-[#2c2938] hover:bg-[#3d3a4f] transition-colors duration-300">
                {/* Home */}
                <div className="flex">
                    <HomeIcon className="h-6 w-6 mr-4 text-white mb-2" />
                    <Typography variant="h6" color="white" className="mb-1">
                        Home
                    </Typography>
                </div>
            </a>
            <a href="/project" className="bg-[#2c2938] hover:bg-[#3d3a4f] transition-colors duration-300">
                {/* Project */}
                <div className="flex">
                    <DocumentCurrencyPoundIcon className="h-6 w-6 mr-4 text-white mb-2"  />
                    <Typography variant="h6" color="white" className="mb-1">
                        Project
                    </Typography>
                </div>
            </a>
            <a href="/swap" className="bg-[#2c2938] hover:bg-[#3d3a4f] transition-colors duration-300">
                {/* Swap */}
                <div className="flex">
                    <ArrowsRightLeftIcon className="h-6 w-6 mr-4 text-white mb-2" />
                    <Typography variant="h6" color="white" className="mb-1">
                        Swap
                    </Typography>
                </div>
            </a>
    </nav>
    <div className="grid gap-4 p-4 grid-cols-2 md:grid-cols-1">
      <Card className="bg-[#2c2938]">
        <CardBody className="p-4">
          <div className="flex">
            <ChartPieIcon className="h-6 w-6 mr-2 text-white mb-2" />
            <Typography variant="h6" color="white" className="mb-1">
              Total Raised
            </Typography>
          </div>
          <Typography variant="h4" color="white">
            $120,000
          </Typography>
        </CardBody>
      </Card>
      <Card className="bg-[#2c2938]">
        <CardBody className="p-4">
          <div className="flex">
            <CurrencyDollarIcon className="h-6 w-6 mr-2 text-white mb-2" />
            <Typography variant="h6" color="white" className="mb-1">
              Matching Pool
            </Typography>
          </div>
          <Typography variant="h4" color="white">
            $50,000
          </Typography>
        </CardBody>
      </Card>
      <Card className="bg-[#2c2938]">
        <CardBody className="p-4">
          <div className="flex">
            <UsersIcon className="h-6 w-6 mr-2 text-white mb-2" />
            <Typography variant="h6" color="white" className="mb-1">
              Contributors
            </Typography>
          </div>
          <Typography variant="h4" color="white">
            1,500
          </Typography>
        </CardBody>
      </Card>
      <Card className="bg-[#2c2938]">
        <CardBody className="p-4">
          <div className="flex">
            <ClockIcon className="h-6 w-6 mr-2 text-white mb-2" />
            <Typography variant="h6" color="white" className="mb-1">
              Time Left
            </Typography>
          </div>
          <Typography variant="h4" color="white">
            5 days
          </Typography>
        </CardBody>
      </Card>
    </div>
    </>
  );
}
