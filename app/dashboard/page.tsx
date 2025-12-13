"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Power, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { deviceApi } from "@/lib/api";
import { DevicesDto, PaginatedResponse } from "@/lib/types";
import { showToast } from "@/lib/toast";

export default function DashboardPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<DevicesDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await deviceApi.getDevices(currentPage, pageSize);

        // Check if response is paginated
        if (data && typeof data === 'object' && 'content' in data) {
          const paginatedData = data as PaginatedResponse<DevicesDto>;
          setDevices(paginatedData.content || []);
          setTotalPages(paginatedData.totalPages || 0);
          setTotalElements(paginatedData.totalElements || 0);
        } else {
          // Fallback for non-paginated response
          setDevices(Array.isArray(data) ? data : []);
          setTotalPages(1);
          setTotalElements(Array.isArray(data) ? data.length : 0);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load devices";
        setError(errorMessage);
        showToast.error("Error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [currentPage]);

  const handleDeviceClick = (deviceId: number) => {
    router.push(`/dashboard/${deviceId}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-cyan-accent animate-spin" />
            <p className="text-text-secondary">Loading devices...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load devices</h3>
              <p className="text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-accent mb-2">
            Your Devices
          </h2>
          <p className="text-text-secondary">
            Select a device to view detailed monitoring data
          </p>
        </div>

        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <Power className="w-16 h-16 text-text-secondary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No devices found</h3>
            <p className="text-text-secondary">You don&apos;t have any devices registered yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => {
              const isHealthy = device.isHealthy ?? (device.healthScore ? device.healthScore > 70 : false);

              return (
                <Card
                  key={device.id}
                  className="border-border bg-card hover:border-cyan-accent/50 transition-all cursor-pointer group"
                  onClick={() => handleDeviceClick(device.deviceId)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-cyan-accent/20 flex items-center justify-center group-hover:bg-cyan-accent/30 transition-colors">
                          <Power className="w-6 h-6 text-cyan-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground group-hover:text-cyan-accent transition-colors">
                            {device.deviceName}
                          </CardTitle>
                          <p className="text-sm text-text-secondary">
                            {device.deviceModel}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          isHealthy
                            ? "bg-green-status/20 text-green-status border-green-status/30"
                            : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                        }
                      >
                        {isHealthy ? "Healthy" : "Warning"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Location</span>
                        <span className="text-foreground">
                          {device.location || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Type</span>
                        <span className="text-foreground">
                          {device.deviceType || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">MAC Address</span>
                        <span className="text-foreground font-mono text-xs">
                          {device.macAddress || "N/A"}
                        </span>
                      </div>
                      {device.healthScore !== undefined && device.healthScore !== null && (
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Health Score</span>
                          <span className="text-foreground font-semibold">
                            {device.healthScore.toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-text-secondary">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} devices
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className="border-border"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 0 ||
                        page === totalPages - 1 ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      const showEllipsis =
                        (page === 1 && currentPage > 2) ||
                        (page === totalPages - 2 && currentPage < totalPages - 3);

                      if (showEllipsis) {
                        return (
                          <span key={page} className="px-2 text-text-secondary">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageClick(page)}
                          className={
                            currentPage === page
                              ? "bg-cyan-accent text-white hover:bg-cyan-accent/90"
                              : "border-border"
                          }
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="border-border"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}