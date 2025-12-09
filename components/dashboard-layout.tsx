"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Power, Search, User, LogOut } from "lucide-react";
import { mockEngines } from "@/lib/mock-data";
import { EngineOption } from "@/lib/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EngineOption[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockEngines.filter(
        (engine) =>
          engine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          engine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          engine.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleDeviceClick = (deviceId: string) => {
    router.push(`/dashboard/${deviceId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-cyan-accent">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-accent flex items-center justify-center">
                <Power className="w-5 h-5 text-red-500" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-cyan-accent">
                  Engine Maintenance
                </h1>
                <p className="text-xs text-text-secondary">
                  Real-time monitoring
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <Input
                  type="text"
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                  {searchResults.map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => handleDeviceClick(engine.id)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="font-medium text-foreground">
                        {engine.name} - {engine.model}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {engine.serialNumber}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {showResults && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                  <p className="text-text-secondary text-sm">No devices found</p>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <User className="w-4 h-4 text-cyan-accent" />
                <span className="text-sm text-foreground">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                className="border-border hover:bg-muted"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}