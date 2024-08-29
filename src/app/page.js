'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';


import React, { useState } from 'react';
import {
  Navbar,
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

const projects = [
  { 
    name: 'Solana DEX Aggregator', 
    description: 'A decentralized exchange aggregator built on Solana for optimal trading routes and liquidity.',
    image: '/api/placeholder/400/300',
    raised: 15000,
    contributors: 250,
    daysLeft: 7
  },
  { 
    name: 'NFT Marketplace', 
    description: 'A user-friendly NFT marketplace showcasing unique digital assets on the Solana blockchain.',
    image: '/api/placeholder/400/300',
    raised: 30000,
    contributors: 500,
    daysLeft: 5
  },
  { 
    name: 'DeFi Lending Protocol', 
    description: 'An innovative DeFi lending platform leveraging Solana\'s speed for efficient borrowing and lending.',
    image: '/api/placeholder/400/300',
    raised: 25000,
    contributors: 300,
    daysLeft: 10
  },
  { 
    name: 'Cross-chain Bridge', 
    description: 'A secure bridge connecting Solana with other major blockchains for seamless asset transfers.',
    image: '/api/placeholder/400/300',
    raised: 40000,
    contributors: 700,
    daysLeft: 3
  },
  { 
    name: 'DAO Governance Tool', 
    description: 'A comprehensive DAO management and voting system built on Solana for decentralized decision-making.',
    image: '/api/placeholder/400/300',
    raised: 10000,
    contributors: 150,
    daysLeft: 14
  },
];

const chartData = [
  { name: 'Jan', DAI: 4000 },
  { name: 'Feb', DAI: 3000 },
  { name: 'Mar', DAI: 5000 },
  { name: 'Apr', DAI: 4500 },
  { name: 'May', DAI: 6000 },
  { name: 'Jun', DAI: 5500 },
];

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const mapData = {
    US: 1000,
    IN: 750,
    GB: 1800,
    CN: 1500,
    JP: 1300,
    DE: 1100,
  };

  return (
    <>
        <main className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-800">
              <CardBody>
                <Typography variant="h5" color="white" className="mb-4">
                  Funding Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                    <Line type="monotone" dataKey="DAI" stroke="#AB9EF2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
            <Card className="bg-gray-800">
              <CardBody>
                <Typography variant="h5" color="white" className="mb-4">
                  Global Contributions
                </Typography>
                <div style={{ width: '100%', height: '300px' }}>
                  <VectorMap
                    map={worldMill}
                    markers={mapData}
                    backgroundColor="transparent"
                    containerStyle={{
                      width: '100%',
                      height: '100%',
                    }}
                    containerClassName="map"
                    onRegionTipShow={function regionsTooltipHandler(event, label, code) {
                      return label.html(`
                        <div style="background-color: ${darkMode ? '#374151' : '#f3f4f6'}; color: ${darkMode ? '#ffffff' : '#000000'}; padding: 10px; border-radius: 4px;">
                          <strong>${label.html()}</strong><br/>
                          Funding: $${mapData[code] || 0}
                        </div>
                      `);
                    }}
                    series={{
                      regions: [{
                        values: mapData,
                        scale: ['#AB9EF2', '#512DA8'],
                        normalizeFunction: 'polynomial',
                      }]
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
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
    </>

  );
};

export default Dashboard;