"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Navigation,
  Loader2,
  MapPin,
  Check,
  Search,
  X,
  Compass,
  Building2,
} from "lucide-react";

interface AddressFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

interface AddressAutocompleteProps {
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  indianStates: string[];
}

interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  types?: string[];
}

export function AddressAutocomplete({
  formData,
  setFormData,
  indianStates,
}: AddressAutocompleteProps) {
  // Search & Suggestion states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [appliedPlaceName, setAppliedPlaceName] = useState<string | null>(null);

  // GPS Location states
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced Place Autocomplete Search via MapmyIndia (Mappls)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    // If query matches the currently applied place, don't re-trigger search
    if (appliedPlaceName && trimmed === appliedPlaceName.trim()) {
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/address/autocomplete?query=${encodeURIComponent(trimmed)}`
        );
        if (!res.ok) {
          throw new Error("Autocomplete lookup failed");
        }
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setIsDropdownOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.warn("[Autocomplete Error]:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, appliedPlaceName]);

  // Click outside to dismiss suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selecting a place prediction
  const handleSelectPlace = async (sugg: PlaceSuggestion) => {
    setIsSelecting(true);
    setIsDropdownOpen(false);
    setSearchQuery(sugg.mainText || sugg.fullText);
    setAppliedPlaceName(sugg.mainText || sugg.fullText);

    try {
      const res = await fetch(
        `/api/address/details?placeId=${encodeURIComponent(sugg.placeId)}`
      );
      if (!res.ok) throw new Error("Failed to fetch address details");

      const data = await res.json();

      // Standardize state with Indian states list
      const matchedState =
        indianStates.find(
          (st) =>
            st.toLowerCase() === (data.state || "").toLowerCase() ||
            (data.state || "").toLowerCase().includes(st.toLowerCase()) ||
            st.toLowerCase().includes((data.state || "").toLowerCase())
        ) || formData.state;

      setFormData((prev) => ({
        ...prev,
        addressLine1: data.streetAddress || sugg.mainText || prev.addressLine1,
        addressLine2: data.landmarkArea || prev.addressLine2,
        city: data.city || prev.city,
        state: matchedState,
        pincode: data.pincode || prev.pincode,
      }));

      setLocationSuccess(true);
      setLocationError(null);
    } catch (err: any) {
      console.error("[Place Selection Error]:", err);
      setLocationError("Could not retrieve full address details. Please verify fields below.");
    } finally {
      setIsSelecting(false);
    }
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectPlace(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  // GPS "Use Current Location" handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en-IN,en;q=0.9" } }
          );
          if (!res.ok) throw new Error("Location lookup failed");

          const data = await res.json();
          const addr = data.address || {};

          const detectedRoad = [
            addr.house_number,
            addr.road || addr.street || addr.neighbourhood,
          ]
            .filter(Boolean)
            .join(" ");
          const detectedArea = [addr.suburb, addr.subdistrict].filter(Boolean).join(", ");
          const detectedCity = addr.city || addr.town || addr.village || addr.county || "";
          const detectedState = addr.state || "";
          const detectedPostcode = addr.postcode
            ? addr.postcode.replace(/\D/g, "").slice(0, 6)
            : "";

          const matchedState =
            indianStates.find(
              (st) =>
                st.toLowerCase() === detectedState.toLowerCase() ||
                detectedState.toLowerCase().includes(st.toLowerCase())
            ) || formData.state;

          setFormData((prev) => ({
            ...prev,
            addressLine1: detectedRoad || prev.addressLine1,
            addressLine2: detectedArea || prev.addressLine2,
            city: detectedCity || prev.city,
            state: matchedState,
            pincode: detectedPostcode || prev.pincode,
          }));

          setSearchQuery(detectedRoad || detectedArea || detectedCity);
          setAppliedPlaceName(detectedRoad || detectedArea || detectedCity);
          setLocationSuccess(true);
          setLocationError(null);
        } catch {
          setLocationError("Retrieved GPS coordinates. Please confirm street details below.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Please allow GPS or enter address manually.");
        } else {
          setLocationError("Unable to detect current GPS coordinates. Please enter address manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-3 pt-1 pb-2">
      {/* Quick Action Toolbar: GPS Detector */}
      <div className="flex flex-wrap items-center gap-2 bg-ink/5 p-2.5 border border-ink/20">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-hype hover:text-ink px-3 py-1.5 text-xs font-mono font-bold uppercase border border-ink transition-all active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>FETCHING GPS...</span>
            </>
          ) : locationSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-hype" />
              <span>LOCATION APPLIED</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              <span>USE CURRENT LOCATION</span>
            </>
          )}
        </button>

        <span className="text-[10px] font-mono text-ink/60 uppercase">
          • FAST AUTO-FILL FOR INDIAN HOUSES &amp; LANDMARKS
        </span>
      </div>

      {/* Error / Status Notifications */}
      {locationError && (
        <div className="text-[11px] font-mono text-red-600 bg-red-50 border border-red-200 p-2">
          {locationError}
        </div>
      )}

      {/* Places Autocomplete Search Box with Native Neo-Brutalist Suggestions Dropdown */}
      <div ref={wrapperRef} className="space-y-1 relative">
        <label className="block text-[10px] font-bold text-ink/70 uppercase tracking-wider">
          SEARCH ANY AREA, COLONY, APARTMENT, OR LANDMARK (PAN-INDIA)
        </label>

        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink/50">
            {isSearching || isSelecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-ink" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type colony, building name, or area (e.g. Indiranagar, Cyber Hub, Bandra)..."
            className="w-full bg-white border-2 border-ink pl-8 pr-10 py-2.5 text-xs uppercase focus:outline-hidden focus:bg-hype/5 placeholder:text-ink/40 font-mono shadow-xs transition-colors"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                  setIsDropdownOpen(false);
                  setAppliedPlaceName(null);
                  searchInputRef.current?.focus();
                }}
                className="p-1 hover:bg-ink/10 rounded-xs text-ink/50 hover:text-ink transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestion Dropdown */}
        {isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border-2 border-ink shadow-xl divide-y divide-ink/10 overflow-hidden max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5 bg-ink text-white text-[10px] font-mono font-bold uppercase flex items-center justify-between">
              <span>SELECT YOUR LOCATION TO AUTO-FILL</span>
              <span className="text-hype">{suggestions.length} MATCHES</span>
            </div>

            {suggestions.map((sugg, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={sugg.placeId || idx}
                  type="button"
                  onClick={() => handleSelectPlace(sugg)}
                  className={`w-full text-left p-3 text-xs flex items-start gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-hype/20 text-ink font-bold"
                      : "hover:bg-hype/15 text-ink bg-white"
                  }`}
                >
                  <div className="mt-0.5 p-1 bg-ink/5 border border-ink/20 text-ink shrink-0">
                    {sugg.types?.includes("establishment") ||
                    sugg.types?.includes("premise") ||
                    sugg.types?.includes("point_of_interest") ? (
                      <Building2 className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink uppercase text-[12px] truncate">
                      {sugg.mainText}
                    </div>
                    {sugg.secondaryText && (
                      <div className="text-[11px] text-ink/65 truncate font-normal">
                        {sugg.secondaryText}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono font-bold text-ink/40 uppercase shrink-0 pt-0.5">
                    FILL &rarr;
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* No Results Feedback */}
        {isDropdownOpen && !isSearching && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border-2 border-ink shadow-lg p-3 text-center text-xs font-mono text-ink/70">
            <Compass className="w-5 h-5 mx-auto mb-1 text-ink/40" />
            <div>No matching places found in India for &ldquo;{searchQuery}&rdquo;.</div>
            <div className="text-[10px] text-ink/50 mt-0.5">
              Please enter your street address and pincode manually in the fields below.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export backward-compatible alias
export const GoogleAddressAutocomplete = AddressAutocomplete;
