'use client';

import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

// Mock function to fetch project data
const fetchProjectData = (id) => {
  // In a real application, this would fetch data from an API or blockchain
  return {
    id,
    name: 'Solana DeFi Aggregator',
    description: 'A decentralized platform aggregating various DeFi protocols on Solana for optimized yields and trading.',
    imageUrl: '/api/placeholder/800/400',
    fundingGoal: 50000,
    currentFunding: 35000,
    contributor_count: 156,
    days_left: 7,
    long_description: `
      Our Solana DeFi Aggregator aims to simplify and optimize the DeFi experience on the Solana blockchain. 
      By aggregating multiple protocols, we provide users with the best rates, lowest fees, and highest yields across the ecosystem.
      
      Key Features:
      - One-click yield farming
      - Cross-protocol swaps
      - Liquidity pool optimization
      - Real-time analytics and performance tracking
      
      Funds raised will be used for:
      - Smart contract development and audits
      - UI/UX improvements
      - Marketing and community building
      - Integration of additional protocols
    `,
    team: [
      { name: 'Alice Johnson', role: 'Lead Developer' },
      { name: 'Bob Smith', role: 'Smart Contract Specialist' },
      { name: 'Carol Williams', role: 'UI/UX Designer' },
    ],
    github: 'https://github.com/solana-defi-aggregator',
    website: 'https://solana-defi-aggregator.io',
  };
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const project = fetchProjectData(id);

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-800 text-white">
          <CardBody>
            <img src={project.imageUrl} alt={project.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <Typography variant="h2" className="mb-4">{project.name}</Typography>
            <Typography className="mb-6 text-gray-400">{project.description}</Typography>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>{project.contributor_count} contributors</span>
                <span>{project.days_left} days left</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(project.currentFunding / project.fundingGoal) * 100}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>{((project.currentFunding / project.fundingGoal) * 100).toFixed(2)}% funded</span>
                <span>${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}</span>
              </div>
            </div>

            <Typography variant="h4" className="mb-4">About the Project</Typography>
            <Typography className="mb-6 whitespace-pre-line">{project.long_description}</Typography>

            <Typography variant="h4" className="mb-4">Team</Typography>
            <ul className="list-disc list-inside mb-6">
              {project.team.map((member, index) => (
                <li key={index}>{member.name} - {member.role}</li>
              ))}
            </ul>

            <Typography variant="h4" className="mb-4">Links</Typography>
            <div className="flex space-x-4">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">GitHub</a>
              <a href={project.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Website</a>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button color="blue" fullWidth>
              Contribute to this Project
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default ProjectDetailPage;