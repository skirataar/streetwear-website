"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CustomerProfile, CustomerOrder } from "@/lib/woocommerce-customer";

interface AuthContextType {
  customer: CustomerProfile | null;
  orders: CustomerOrder[];
  isLoading: boolean;
  sendOtp: (email: string) => Promise<{
    success: boolean;
    delivered?: boolean;
    devOtp?: string;
    message?: string;
    error?: string;
  }>;
  verifyOtp: (email: string, code: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    billing?: any;
    shipping?: any;
  }) => Promise<{ success: boolean; error?: string }>;
  refreshOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current session and orders on mount
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.customer) {
          setCustomer(data.customer);
          // Fetch orders
          try {
            const ordRes = await fetch("/api/account/orders");
            if (ordRes.ok) {
              const ordData = await ordRes.json();
              setOrders(ordData.orders || []);
            }
          } catch (e) {
            console.warn("Failed to load orders:", e);
          }
        } else {
          setCustomer(null);
          setOrders([]);
        }
      }
    } catch (err) {
      console.warn("Auth check error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const sendOtp = async (email: string) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to send code" };
      }
      return {
        success: true,
        delivered: data.delivered,
        devOtp: data.devOtp,
        message: data.message,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const verifyOtp = async (email: string, code: string, name?: string) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to verify code" };
      }
      setCustomer(data.customer);

      // Fetch customer orders immediately
      try {
        const ordRes = await fetch("/api/account/orders");
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders || []);
        }
      } catch {}

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setCustomer(null);
      setOrders([]);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    phone?: string;
    billing?: any;
    shipping?: any;
  }) => {
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Failed to update profile" };
      }
      if (resData.customer) {
        setCustomer(resData.customer);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const refreshOrders = async () => {
    if (!customer) return;
    try {
      const res = await fetch("/api/account/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.warn("Failed to refresh orders:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        orders,
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
        updateProfile,
        refreshOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
