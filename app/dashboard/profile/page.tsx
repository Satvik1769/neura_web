"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-accent mb-2">
            Profile
          </h2>
          <p className="text-text-secondary">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview Card */}
          <Card className="md:col-span-1 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-cyan-accent text-white text-2xl font-semibold">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-cyan-accent" />
                  <span className="text-text-secondary">User ID:</span>
                  <span className="text-foreground font-mono text-xs">
                    {user?.id}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-cyan-accent" />
                  <span className="text-text-secondary">Member since:</span>
                  <span className="text-foreground">Jan 2024</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-cyan-accent" />
                  <span className="text-text-secondary">Role:</span>
                  <span className="text-foreground">Administrator</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card className="md:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Account Details</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue={user?.name}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-foreground">
                    Company
                  </Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-foreground">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-cyan-accent focus:ring-offset-2 focus:ring-offset-background"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="border-border">
                  Cancel
                </Button>
                <Button className="bg-cyan-accent hover:bg-cyan-accent/90 text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Security Settings</CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-foreground">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-foreground">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button className="bg-cyan-accent hover:bg-cyan-accent/90 text-white">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}