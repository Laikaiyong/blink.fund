'use client';

import React, {useState} from 'react';
import { useParams, } from 'react-router-dom';
import { usePathname } from 'next/navigation';
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { Col, message, Row } from "antd";
import { projectsData } from "../../../../data/projectData";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Image from "next/image";
import FetchBlink from '../../../../components/FetchBlink';
import { createBlink } from '@/app/lib/utils';
import { clusterApiUrl, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import { sendAndConfirmTransaction } from '@solana/web3.js';

// Mock function to fetch project data
const fetchProjectData = (id) => {
  // In a real application, this would fetch data from an API or blockchain
  return projectsData.find(val => val.id == id);
};
export const runtime = 'edge';

const ProjectDetailPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const path = usePathname();
  const pathSplitted = path.split("/");
  const project = fetchProjectData(pathSplitted[pathSplitted.length - 1]);

  const [amount, setAmount] = useState('');
  const [actionDetails, setActionDetails] = useState(null);
  const wallet = useWallet();
  const {connection} = useConnection();

  const handleSolanaTransaction = async (amount = 0.0001, recipient = "DnhmBBGMiKLtG2gj5VCq4TPmgFT9dwDxDoUPAmrSNWqa") => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipient,
          lamports: 0.0001 * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      alert(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
      console.error('Error processing Solana transaction:', error);
      alert(`Transaction failed: ${error.message}`);
    }
  };

  async function getActionDetails(toPubkey, title, image, description) {
    const response = await fetch(`/api/actions?to=${toPubkey}`, {
      method: 'GET',
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch action details');
    }
  
    return response.json();
  }

  async function executeAction(toPubkey, amount, account) {
    const response = await fetch(`/api/actions?to=${toPubkey}&amount=${amount}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to execute action');
    }
  
    return response.json();
  }

  async function handleGetAction() {
    try {
      // const details = await getActionDetails(
      //   'DYVT2LQ6U7PERSYgBLWDkrruhJxpTrWdK55yeVJqfg1c',
      //   project.name,
      //   project.image,
      //   project.description
      // );
      let response = await createBlink(
        new Connection(clusterApiUrl("devnet")),
        wallet,
        project.name,
        project.image,
        project.description,
        'DnhmBBGMiKLtG2gj5VCq4TPmgFT9dwDxDoUPAmrSNWqa',
        // 'DYVT2LQ6U7PERSYgBLWDkrruhJxpTrWdK55yeVJqfg1c'
        []
      );

      console.log(response)
      if (response.status === "success") {
        messageApi.open({
          type: "success",
          content: "Blink created successfully",
        });
        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        console.log("Error creating blink", response);
        messageApi.open({
          type: "error",
          content: "Error creating blink",
        });
      }
  
      // setActionDetails(details);
    } catch (error) {
      console.error('Error fetching action details:', error);
    }
  }

  async function handleExecuteAction() {
    if (!wallet.publicKey.toString()) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const result = await executeAction(
        // 'DnhmBBGMiKLtG2gj5VCq4TPmgFT9dwDxDoUPAmrSNWqa',
        'DYVT2LQ6U7PERSYgBLWDkrruhJxpTrWdK55yeVJqfg1c',
        amount,
        wallet.publicKey.toString()
      );
      console.log('Action executed:', result);
      
      // Here you would typically sign and send the transaction
      // This depends on your wallet adapter setup
      if (result.transaction) {
        const signedTx = await wallet.signTransaction(result.transaction);
        // Send the signed transaction to the network
        // This step depends on how you're set up to interact with the Solana network
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-[#211e2b] text-white">
          <CardBody>
            <img src={project.image} alt={project.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <Typography variant="h2" className="mb-4">{project.name}</Typography>
            <Typography className="mb-6 text-gray-400">{project.description}</Typography>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <Typography>{project.contributor_count} contributors</Typography>
                <Typography>{project.daysLeft} days left</Typography>
              </div>
              {/* <div className="mt-2 flex justify-between text-sm">
                <span>{((project.currentFunding / project.fundingGoal) * 100).toFixed(2)}% funded</span>
                <span>${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}</span>
              </div> */}
            </div>

            <Typography variant="h4" className="mb-4">About the Project</Typography>
            <Typography className="mb-6 whitespace-pre-line">{project.description}</Typography>

          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={handleSolanaTransaction} color="blue" fullWidth>
              Contribute to this Project
            </Button>
            <Button onClick={handleGetAction}>Create Blink to Share</Button>
          </CardFooter>
        </Card>

          <FetchBlink />
      </main>
    </div>
  );
};

export default ProjectDetailPage;