'use client';

import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Card, CardHeader, CardBody, Input, Typography } from "@material-tailwind/react";

// Import your IDL and set up your program ID
import idl from '../../contract/qfproject.json';
const programId = new PublicKey(process.env.NEXT_PUBLIC_QFPROJECT_CONTRACT);

// ProjectCreation component
const ProjectCreation = ({ program }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await program.rpc.createProject(
        name,
        description,
        new BN(fundingGoal),
        imageUrl,
        {
          accounts: {
            project: web3.Keypair.generate().publicKey,
            owner: program.provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          },
        }
      );
      console.log("Project created successfully");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Card className="w-96">
      <CardHeader color="blue" className="relative h-56">
        <img
          src="/img/project-creation.jpg"
          alt="Project Creation"
          className="h-full w-full"
        />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h5" className="mb-2">
          Create New Project
        </Typography>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Funding Goal"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mb-2"
          />
          <Button type="submit" color="blue">Create Project</Button>
        </form>
      </CardBody>
    </Card>
  );
};

// ProjectList component
const ProjectList = ({ program }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const allProjectAccounts = await program.account.project.all();
      setProjects(allProjectAccounts);
    };
    fetchProjects();
  }, [program]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project, index) => (
        <Card key={index} className="w-96">
          <CardHeader color="blue" className="relative h-56">
            <img
              src={project.account.imageUrl}
              alt={project.account.name}
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {project.account.name}
            </Typography>
            <Typography>
              {project.account.description}
            </Typography>
            <Typography>
              Goal: {project.account.fundingGoal.toString()} SOL
            </Typography>
            <Typography>
              Current: {project.account.currentFunding.toString()} SOL
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

// FundProject component
const FundProject = ({ program }) => {
  const [projectAddress, setProjectAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await program.rpc.fundProject(
        new BN(amount),
        {
          accounts: {
            project: new PublicKey(projectAddress),
            funder: program.provider.wallet.publicKey,
          },
        }
      );
      console.log("Project funded successfully");
    } catch (error) {
      console.error("Error funding project:", error);
    }
  };

  return (
    <Card className="w-96">
      <CardHeader color="green" className="relative h-56">
        <img
          src="/img/fund-project.jpg"
          alt="Fund Project"
          className="h-full w-full"
        />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h5" className="mb-2">
          Fund a Project
        </Typography>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Project Address"
            value={projectAddress}
            onChange={(e) => setProjectAddress(e.target.value)}
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Amount (SOL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-2"
          />
          <Button type="submit" color="green">Fund Project</Button>
        </form>
      </CardBody>
    </Card>
  );
};

// Main App component
const App = () => {
  const wallet = useWallet();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const connection = new Connection("https://api.devnet.solana.com");
    const provider = new Provider(connection, wallet, Provider.defaultOptions());
    const program = new Program(idl, programId, provider);
    setProgram(program);
  }, [wallet]);

  if (!program) return null;

  return (
    <div className="container mx-auto px-4">
      <Typography variant="h2" className="text-center my-8">
        Quadratic Funding Platform
      </Typography>
      <div className="flex flex-wrap justify-center gap-8">
        <ProjectCreation program={program} />
        <FundProject program={program} />
      </div>
      <Typography variant="h4" className="text-center my-8">
        Current Projects
      </Typography>
      <ProjectList program={program} />
    </div>
  );
};

export default App;