"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Plus, ExternalLink, Clock, Users } from "lucide-react";

// Mock project data
const projects = [
  {
    id: 1,
    name: "Engine Analytics Platform",
    description: "Real-time analytics and monitoring dashboard for engine performance metrics",
    status: "active",
    members: 5,
    lastUpdated: "2 hours ago",
    progress: 75,
  },
  {
    id: 2,
    name: "Predictive Maintenance AI",
    description: "Machine learning model for predicting engine maintenance needs",
    status: "active",
    members: 3,
    lastUpdated: "1 day ago",
    progress: 60,
  },
  {
    id: 3,
    name: "IoT Sensor Integration",
    description: "Integration layer for various IoT sensors and data collection",
    status: "planning",
    members: 4,
    lastUpdated: "3 days ago",
    progress: 30,
  },
  {
    id: 4,
    name: "Mobile Monitoring App",
    description: "Cross-platform mobile application for on-the-go engine monitoring",
    status: "completed",
    members: 6,
    lastUpdated: "1 week ago",
    progress: 100,
  },
];

export default function ProjectsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-status/20 text-green-status border-green-status/30";
      case "planning":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-accent mb-2">
              Projects
            </h2>
            <p className="text-text-secondary">
              Manage and track your sub-projects and initiatives
            </p>
          </div>
          <Button className="bg-cyan-accent hover:bg-cyan-accent/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border-border bg-card hover:border-cyan-accent/50 transition-all group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-cyan-accent/20 flex items-center justify-center group-hover:bg-cyan-accent/30 transition-colors">
                      <FolderKanban className="w-6 h-6 text-cyan-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground group-hover:text-cyan-accent transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Progress</span>
                    <span className="text-foreground font-semibold">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-cyan-accent h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Users className="w-4 h-4" />
                    <span>{project.members} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span>{project.lastUpdated}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no projects) */}
        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <FolderKanban className="w-16 h-16 text-text-secondary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first project to get started
            </p>
            <Button className="bg-cyan-accent hover:bg-cyan-accent/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}