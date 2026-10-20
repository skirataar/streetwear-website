"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { formatPaise } from "@/lib/currency";
import {
  Package,
  MapPin,
  User,
  LogOut,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  Loader2,
  Save,
  ShoppingBag,
  RefreshCw,
  Search,
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

function AccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const {
    customer,
    orders,
    isLoading: isAuthLoading,
    logout,
    updateProfile,
    refreshOrders,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">(
    initialTab === "addresses" ? "addresses" : initialTab === "profile" ? "profile" : "orders"
  );

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Address Form state
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Karnataka",
    pincode: "",
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);

  // Address Autocomplete Quick Search
  const [addressSearch, setAddressSearch] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  // Sync state when customer loads
  useEffect(() => {
    if (customer) {
      setProfileName(customer.name || "");
      setProfilePhone(customer.phone || "");

      setShippingAddress({
        addressLine1: customer.shipping?.address_1 || customer.billing?.address_1 || "",
        addressLine2: customer.shipping?.address_2 || customer.billing?.address_2 || "",
        city: customer.shipping?.city || customer.billing?.city || "",
        state: customer.shipping?.state || customer.billing?.state || "Karnataka",
        pincode: customer.shipping?.postcode || customer.billing?.postcode || "",
      });
    }
  }, [customer]);

  // If not authenticated and done loading, redirect to login
  useEffect(() => {
    if (!isAuthLoading && !customer) {
      router.push("/login?redirect=/account");
    }
  }, [isAuthLoading, customer, router]);

  // Debounced address search
  useEffect(() => {
    const q = addressSearch.trim();
    if (q.length < 2) {
      setAddressSuggestions([]);
      return;
    }

    setIsSearchingAddress(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/address/autocomplete?query=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setAddressSuggestions(data.suggestions || []);
        }
      } catch {
        setAddressSuggestions([]);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [addressSearch]);

  const handleSelectAddressSuggestion = async (sugg: any) => {
    setAddressSearch("");
    setAddressSuggestions([]);
    try {
      const res = await fetch(`/api/address/details?placeId=${encodeURIComponent(sugg.placeId)}`);
      if (res.ok) {
        const data = await res.json();
        setShippingAddress((prev) => ({
          ...prev,
          addressLine1: data.streetAddress || sugg.mainText || prev.addressLine1,
          addressLine2: data.landmarkArea || prev.addressLine2,
          city: data.city || prev.city,
          state: data.state || prev.state,
          pincode: data.pincode || prev.pincode,
        }));
      }
    } catch (e) {
      console.warn("Failed to fetch address details:", e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    const res = await updateProfile({
      name: profileName,
      phone: profilePhone,
    });

    if (res.success) {
      setProfileMessage("Profile successfully updated!");
    } else {
      setProfileMessage(res.error || "Failed to update profile.");
    }
    setIsSavingProfile(false);
  };

  const handleSaveAddresses = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    setAddressMessage(null);

    const res = await updateProfile({
      shipping: {
        address_1: shippingAddress.addressLine1,
        address_2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.pincode,
        country: "IN",
      },
      billing: {
        address_1: shippingAddress.addressLine1,
        address_2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.pincode,
        country: "IN",
      },
    });

    if (res.success) {
      setAddressMessage("Default delivery address saved! Will auto-fill during checkout.");
    } else {
      setAddressMessage(res.error || "Failed to update address.");
    }
    setIsSavingAddress(false);
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  if (isAuthLoading || !customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-ink">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        LOADING SUBSCRIBER ACCOUNT &amp; ORDERS...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-mono text-ink">
      {/* Top Header */}
      <div className="border-b-4 border-ink pb-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase text-ink/70 tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AUTHENTICATED // MEMBER #{customer.id}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink overflow-hidden leading-[1.05]">
            {customer.name || customer.email.split("@")[0]}
          </h1>
          <div className="text-xs text-ink/60 font-mono mt-0.5">{customer.email}</div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 bg-white text-ink hover:bg-ink hover:text-white px-3 py-2 text-xs font-bold uppercase border-2 border-ink shadow-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>DROP ARCHIVE</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-hype hover:text-ink px-3 py-2 text-xs font-bold uppercase border-2 border-ink shadow-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-4 border-ink pb-3 mb-8">
        <button
          onClick={() => setActiveTab("orders")}
          className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-bold uppercase border-2 border-ink transition-all active:translate-y-0.5 ${
            activeTab === "orders"
              ? "bg-ink text-white shadow-xs"
              : "bg-white text-ink hover:bg-hype/30"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>MY ORDERS &amp; LIVE TRACKING ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-bold uppercase border-2 border-ink transition-all active:translate-y-0.5 ${
            activeTab === "addresses"
              ? "bg-ink text-white shadow-xs"
              : "bg-white text-ink hover:bg-hype/30"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>SAVED ADDRESS BOOK</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-bold uppercase border-2 border-ink transition-all active:translate-y-0.5 ${
            activeTab === "profile"
              ? "bg-ink text-white shadow-xs"
              : "bg-white text-ink hover:bg-hype/30"
          }`}
        >
          <User className="w-4 h-4" />
          <span>PROFILE &amp; WHATSAPP</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink/70">
              PAN-INDIA ORDERS DISPATCH ARCHIVE
            </h2>
            <button
              onClick={() => refreshOrders()}
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase hover:underline text-ink"
            >
              <RefreshCw className="w-3 h-3" />
              <span>SYNC ORDERS</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border-std p-10 text-center space-y-4">
              <Package className="w-10 h-10 mx-auto text-ink/30" />
              <h3 className="font-display text-2xl uppercase text-ink">NO ORDERS FOUND</h3>
              <p className="text-xs text-ink/60 max-w-sm mx-auto font-sans">
                You haven&apos;t placed any orders with this email yet. Explore our heavyweight vintage drops to start your collection.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-ink text-white hover:bg-hype hover:text-ink px-6 py-3 font-mono font-bold text-xs uppercase border-2 border-ink shadow-sm transition-all"
              >
                <span>EXPLORE ALL DROPS</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((ord) => {
                const isDelivered = ord.status.toLowerCase() === "completed";
                const isShipped = isDelivered || ord.status.toLowerCase() === "processing";

                return (
                  <div
                    key={ord.id}
                    className="bg-white border-4 border-ink shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 space-y-5"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-ink">
                            ORDER #{ord.number}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 border border-ink uppercase ${
                              isDelivered
                                ? "bg-emerald-500 text-white"
                                : ord.status === "PROCESSING"
                                ? "bg-hype text-ink"
                                : "bg-ink text-white"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-ink/60 mt-0.5">
                          PLACED ON {ord.dateCreated} • {ord.paymentMethod}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-ink/60 uppercase">TOTAL PAID</div>
                        <div className="font-bold text-base text-ink">
                          {formatPaise(ord.total)}
                        </div>
                      </div>
                    </div>

                    {/* Live Tracking Timeline */}
                    <div className="bg-ink/5 border border-ink/20 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-ink">
                          <Truck className="w-4 h-4 text-flash" />
                          <span>COURIER: {ord.courierName}</span>
                        </div>
                        {ord.trackingNumber && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-ink/60 uppercase">AWB:</span>
                            <span className="font-bold uppercase text-[11px] bg-white px-1.5 py-0.5 border border-ink">
                              {ord.trackingNumber}
                            </span>
                            {ord.trackingUrl && (
                              <a
                                href={ord.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase underline hover:text-ink/70"
                              >
                                <span>TRACK</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timeline Steps */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1">
                        <div className="space-y-1">
                          <div className="h-2 bg-emerald-500 border border-ink" />
                          <div className="font-bold uppercase text-ink">CONFIRMED</div>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`h-2 border border-ink ${
                              isShipped ? "bg-emerald-500" : "bg-ink/20"
                            }`}
                          />
                          <div className="font-bold uppercase text-ink">PACKED</div>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`h-2 border border-ink ${
                              isShipped ? "bg-hype animate-pulse" : "bg-ink/20"
                            }`}
                          />
                          <div className="font-bold uppercase text-ink">IN TRANSIT</div>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`h-2 border border-ink ${
                              isDelivered ? "bg-emerald-500" : "bg-ink/20"
                            }`}
                          />
                          <div className="font-bold uppercase text-ink">DELIVERED</div>
                        </div>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="divide-y divide-ink/10 border-t border-b border-ink/20 py-2">
                      {ord.lineItems.map((item) => (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-14 bg-ink/10 border border-ink relative overflow-hidden shrink-0">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-bold uppercase text-ink">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-ink/60">
                                QTY: {item.quantity}
                              </div>
                            </div>
                          </div>

                          <div className="font-bold text-ink">
                            {formatPaise(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Footer */}
                    <div className="text-[11px] text-ink/70 flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div>
                        <span className="font-bold uppercase text-ink">DISPATCHED TO: </span>
                        <span>
                          {ord.shippingAddress.fullName},{" "}
                          {ord.shippingAddress.addressLine1},{" "}
                          {ord.shippingAddress.city},{" "}
                          {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                        </span>
                      </div>
                      {ord.shippingAddress.phone && (
                        <div>
                          <span className="font-bold uppercase text-ink">PHONE: </span>
                          <span>{ord.shippingAddress.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED ADDRESS BOOK */}
      {activeTab === "addresses" && (
        <div className="bg-white border-std p-6 sm:p-8 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>SAVED PAN-INDIA DELIVERY ADDRESS</span>
            </h2>
            <p className="text-xs text-ink/60 font-sans mt-1">
              Your default shipping address is saved securely and auto-populates during checkout.
            </p>
          </div>

          {addressMessage && (
            <div className="bg-emerald-600 text-white p-3 text-xs font-bold border-2 border-ink shadow-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{addressMessage}</span>
            </div>
          )}

          {/* Quick Search Helper */}
          <div className="space-y-1 relative">
            <label className="block text-[10px] font-bold uppercase text-ink/70">
              QUICK AUTOCOMPLETE SEARCH (COLONY / AREA / LANDMARK)
            </label>
            <div className="relative">
              <input
                type="text"
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                placeholder="Type your area or colony to auto-fill (e.g. Indiranagar, Bandra)..."
                className="w-full bg-white border-2 border-ink pl-8 pr-3 py-2 text-xs uppercase focus:outline-hidden focus:bg-hype/10 font-mono shadow-xs"
              />
              <Search className="w-4 h-4 text-ink/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {isSearchingAddress && (
                <Loader2 className="w-4 h-4 animate-spin text-ink absolute right-2.5 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {addressSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border-2 border-ink shadow-xl divide-y divide-ink/10 max-h-60 overflow-y-auto">
                {addressSuggestions.map((sugg, idx) => (
                  <button
                    key={sugg.placeId || idx}
                    type="button"
                    onClick={() => handleSelectAddressSuggestion(sugg)}
                    className="w-full text-left p-2.5 text-xs hover:bg-hype/20 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-ink uppercase">{sugg.mainText}</div>
                      <div className="text-[10px] text-ink/60 truncate">{sugg.secondaryText}</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-ink/50">APPLY &rarr;</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Full Form */}
          <form onSubmit={handleSaveAddresses} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-ink/70">
                HOUSE / FLAT / STREET ADDRESS *
              </label>
              <input
                type="text"
                required
                value={shippingAddress.addressLine1}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, addressLine1: e.target.value }))
                }
                placeholder="e.g. Flat 402, Shanti Niketan Apts, MG Road"
                className="w-full bg-white border-2 border-ink p-2.5 text-xs uppercase focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-ink/70">
                LANDMARK / AREA (OPTIONAL)
              </label>
              <input
                type="text"
                value={shippingAddress.addressLine2}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, addressLine2: e.target.value }))
                }
                placeholder="e.g. Near STD Booth / Metro Pillar 140"
                className="w-full bg-white border-2 border-ink p-2.5 text-xs uppercase focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-ink/70">
                  CITY *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="e.g. Bengaluru"
                  className="w-full bg-white border-2 border-ink p-2.5 text-xs uppercase focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-ink/70">
                  STATE *
                </label>
                <select
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="w-full bg-white border-2 border-ink p-2.5 text-xs uppercase focus:outline-hidden"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-ink/70">
                  PINCODE (6-DIGIT) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={shippingAddress.pincode}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                    }))
                  }
                  placeholder="e.g. 560001"
                  className="w-full bg-white border-2 border-ink p-2.5 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingAddress}
              className="mt-2 inline-flex items-center gap-2 bg-ink text-white hover:bg-hype hover:text-ink px-6 py-3 font-mono font-bold text-xs uppercase border-2 border-ink shadow-sm transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              {isSavingAddress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SAVING ADDRESS...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>SAVE DEFAULT ADDRESS</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PROFILE & WHATSAPP */}
      {activeTab === "profile" && (
        <div className="bg-white border-std p-6 sm:p-8 space-y-6 max-w-lg">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>SUBSCRIBER PROFILE SETTINGS</span>
            </h2>
            <p className="text-xs text-ink/60 font-sans mt-1">
              Keep your contact details up to date for BlueDart courier tracking updates and WhatsApp delivery notifications.
            </p>
          </div>

          {profileMessage && (
            <div className="bg-emerald-600 text-white p-3 text-xs font-bold border-2 border-ink shadow-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-ink/70">
                EMAIL ADDRESS (PRIMARY IDENTIFIER)
              </label>
              <input
                type="email"
                disabled
                value={customer.email}
                className="w-full bg-ink/5 border-2 border-ink/40 p-2.5 text-xs font-mono text-ink/60 cursor-not-allowed"
              />
              <span className="text-[10px] text-ink/40">
                Email address is linked to your account profile.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-ink/70">
                FULL NAME *
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Aryan Sharma"
                className="w-full bg-white border-2 border-ink p-2.5 text-xs uppercase focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-ink/70">
                PHONE / WHATSAPP NUMBER *
              </label>
              <input
                type="tel"
                required
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-white border-2 border-ink p-2.5 text-xs focus:outline-hidden"
              />
              <span className="text-[10px] text-ink/50">
                Used for BlueDart / Delhivery dispatch notifications and delivery OTPs.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="mt-2 inline-flex items-center gap-2 bg-ink text-white hover:bg-hype hover:text-ink px-6 py-3 font-mono font-bold text-xs uppercase border-2 border-ink shadow-sm transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPDATING PROFILE...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>UPDATE PROFILE</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="font-mono text-center text-xs uppercase p-20">
          LOADING SUBSCRIBER ARCHIVE...
        </div>
      }
    >
      <AccountDashboard />
    </Suspense>
  );
}
