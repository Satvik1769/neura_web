"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Power, Search, Loader2, Activity } from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";
import { Badge } from "@/components/ui/badge";
import { EngineOption } from "@/lib/types";
import { deviceApi } from "@/lib/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EngineOption[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const searchDevices = async () => {
      const query = searchQuery.trim();

      if (!query || query.length <= 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      // Use API for queries longer than 2 characters
      setIsSearching(true);
      try {
        const results = await deviceApi.searchDevices(query);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(searchDevices, 300);
    return () => clearTimeout(timeoutId);
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
                  className="pl-10 pr-10 bg-background border-border"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-accent animate-spin" />
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.map((engine) => {
                    const isHealthy = engine.isHealthy ?? (engine.healthScore ? engine.healthScore > 70 : false);
                    
                    return (
                      <button
                        key={engine.id}
                        onClick={() => handleDeviceClick(String(engine.deviceId))}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Device Logo */}
                          <div className="w-10 h-10 rounded-full bg-cyan-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-accent/30 transition-colors">
                            <Power className="w-5 h-5 text-cyan-accent" />
                          </div>
                          
                          {/* Device Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="font-medium text-foreground group-hover:text-cyan-accent transition-colors">
                                {engine.deviceName} - {engine.deviceModel}
                              </div>
                              <Badge
                                className={
                                  isHealthy
                                    ? "bg-green-status/20 text-green-status border-green-status/30 flex-shrink-0"
                                    : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 flex-shrink-0"
                                }
                              >
                                <Activity className="w-3 h-3 mr-1" />
                                {isHealthy ? "Healthy" : "Warning"}
                              </Badge>
                            </div>
                            {engine.location && (
                              <div className="text-xs text-text-secondary mt-1">
                                Location: {engine.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              
              {showResults && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                  <p className="text-text-secondary text-sm">No devices found</p>
                </div>
              )}
            </div>

            {/* User Menu */}
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}