/**
 * Toast utility functions
 * Simple wrappers around sonner toast for consistent usage
 */

import { toast } from "sonner";

export const showToast = {
  /**
   * Show success toast
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
    });
  },

  /**
   * Show error toast
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
    });
  },

  /**
   * Show info toast
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
    });
  },

  /**
   * Show warning toast
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
    });
  },

  /**
   * Show loading toast (returns toast ID to update later)
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Update a toast (useful for loading → success/error)
   */
  update: (
    toastId: string | number,
    options: {
      type?: "success" | "error" | "info" | "warning";
      message?: string;
      description?: string;
    }
  ) => {
    if (options.type === "success") {
      toast.success(options.message || "Success", {
        id: toastId,
        description: options.description,
      });
    } else if (options.type === "error") {
      toast.error(options.message || "Error", {
        id: toastId,
        description: options.description,
      });
    } else {
      toast.message(options.message || "Message", {
        id: toastId,
        description: options.description,
      });
    }
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};
