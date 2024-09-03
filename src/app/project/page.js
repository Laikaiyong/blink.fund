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
import { projectsData } from "../../../data/projectData";

export default function Project() {
  const projects = projectsData.filter(project => project.myProject);

  return (
        <main className="flex-1 p-4">
          <div className="mb-6">
            <div className="flex flex-row">

            <Typography variant="h4" color="white" className="mb-4 flex-1">
              My Projects
            </Typography>
            <Button className="bg-[#512DA8]">
                Add Project
            </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                 <a href={`/project/${project.id}`}>
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
