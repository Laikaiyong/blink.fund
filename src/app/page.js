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
import CustomMap from '../../components/home/Map';
import CustomLineChart from '../../components/home/LineChart';
import { projectsData } from "../../data/projectData";
import { createBlink } from "./lib/utils";

export default function Dashboard() {
  const projects = projectsData;

  return (
        <main className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-[#211e2b]">
              <CardBody>
                <Typography variant="h5" color="white" className="mb-4">
                  Funding Over Time
                </Typography>
                <CustomLineChart />
              </CardBody>
            </Card>
            <Card className="bg-[#211e2b]">
              <CardBody>
                <Typography variant="h5" color="white" className="mb-4">
                  Global Contributions
                </Typography>
                <div style={{ width: '100%', height: '300px' }}>
                  <CustomMap />
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
                <a key={index} href={`/project/${project.id}`}>

                <Card  className="bg-[#211e2b]">
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
                        USDC{project.raised.toLocaleString()}
                      </Typography>
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
                </a>
              ))}
            </div>
          </div>
        </main>

  );
};