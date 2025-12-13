"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Bell, Shield, Palette, Globe, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-accent mb-2">
            Settings
          </h2>
          <p className="text-text-secondary">
            Configure your application preferences and system settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Notifications Settings */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-accent/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-cyan-accent" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Notifications</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Email Notifications</Label>
                    <p className="text-sm text-text-secondary">
                      Receive email alerts for critical events
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-cyan-accent bg-background border-border rounded focus:ring-cyan-accent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Push Notifications</Label>
                    <p className="text-sm text-text-secondary">
                      Get push notifications on your device
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-cyan-accent bg-background border-border rounded focus:ring-cyan-accent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">SMS Alerts</Label>
                    <p className="text-sm text-text-secondary">
                      Receive SMS for urgent alerts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-cyan-accent bg-background border-border rounded focus:ring-cyan-accent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-accent/20 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-cyan-accent" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-foreground">
                    Theme
                  </Label>
                  <Select defaultValue="dark">
                    <SelectTrigger id="theme" className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-foreground">
                    Language
                  </Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-accent/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-cyan-accent" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Regional Settings</CardTitle>
                  <CardDescription>
                    Configure timezone and regional preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-foreground">
                    Timezone
                  </Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone" className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format" className="text-foreground">
                    Date Format
                  </Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="date-format" className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-accent/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-cyan-accent" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Data & Privacy</CardTitle>
                  <CardDescription>
                    Manage your data and privacy settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Data Collection</Label>
                    <p className="text-sm text-text-secondary">
                      Allow anonymous usage data collection
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-cyan-accent bg-background border-border rounded focus:ring-cyan-accent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Analytics</Label>
                    <p className="text-sm text-text-secondary">
                      Help us improve by sharing analytics
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-cyan-accent bg-background border-border rounded focus:ring-cyan-accent"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                  <Database className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-accent/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-accent" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Security</CardTitle>
                  <CardDescription>
                    Advanced security and authentication settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Two-Factor Authentication</Label>
                    <p className="text-sm text-text-secondary">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Session Timeout</Label>
                    <p className="text-sm text-text-secondary">
                      Auto logout after inactivity
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-border">
              Reset to Defaults
            </Button>
            <Button className="bg-cyan-accent hover:bg-cyan-accent/90 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}