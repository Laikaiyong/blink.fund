'use client';

import {
  Typography,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import {
  WalletIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function Project() {
  const projects = [
    { 
      name: 'Solana DEX Aggregator', 
      description: 'A decentralized exchange aggregator built on Solana for optimal trading routes and liquidity.',
      image: './logo.png',
      raised: 15000,
      contributors: 250,
      daysLeft: 7
    },
    { 
      name: 'NFT Marketplace', 
      description: 'A user-friendly NFT marketplace showcasing unique digital assets on the Solana blockchain.',
      image: './logo.png',
      raised: 30000,
      contributors: 500,
      daysLeft: 5
    }
  ];
  

  return (
        <main className="flex-1 p-4">
          <div className="mb-6">
            <Typography variant="h4" color="white" className="mb-4">
              Featured Projects
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="bg-[#211e2b]">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardBody>
                    <Typography variant="h5" color="white" className="mb-2">
                      {project.name}
                    </Typography>
                    <Typography color="gray" className="mb-4">
                      {project.description}
                    </Typography>
                    <div className="flex justify-between items-center mb-2">
                      <Typography color="white">Raised:</Typography>
                      <Typography color="white" className="font-bold">
                        ${project.raised.toLocaleString()}
                      </Typography>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(project.raised / 50000) * 100}%` }}></div>
                    </div>
                  </CardBody>
                  <CardFooter className="pt-0 flex justify-between">
                    <Typography color="gray" className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" /> {project.contributors}
                    </Typography>
                    <Typography color="gray" className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" /> {project.daysLeft} days left
                    </Typography>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>

  );
};