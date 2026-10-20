"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Mail,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { GoogleIcon } from "@/components/ui/OAuthIcons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const urlError = searchParams.get("error");

  const { customer, sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [isDelivered, setIsDelivered] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError && urlError !== "oauth_credentials_missing"
      ? urlError === "invalid_oauth_state"
        ? "OAuth session expired or state token mismatch. Please try again."
        : urlError === "access_denied"
        ? "Google sign-in was cancelled."
        : urlError === "oauth_profile_fetch_failed"
        ? "Could not retrieve profile information from Google."
        : decodeURIComponent(urlError)
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showGoogleNotice, setShowGoogleNotice] = useState<boolean>(
    urlError === "oauth_credentials_missing"
  );

  // If already logged in, redirect
  useEffect(() => {
    if (customer) {
      router.push(redirectTo);
    }
  }, [customer, redirectTo, router]);

  // Handle URL errors (e.g. from OAuth redirect or callback)
  useEffect(() => {
    if (urlError) {
      if (urlError === "oauth_credentials_missing") {
        setShowGoogleNotice(true);
      } else if (urlError === "invalid_oauth_state") {
        setErrorMessage("OAuth session expired or state token mismatch. Please try again.");
      } else if (urlError === "access_denied") {
        setErrorMessage("Google sign-in was cancelled.");
      } else if (urlError === "oauth_profile_fetch_failed") {
        setErrorMessage("Could not retrieve profile information from Google.");
      } else {
        setErrorMessage(decodeURIComponent(urlError));
      }
    }
  }, [urlError]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowGoogleNotice(false);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(email.trim());
      if (res.success) {
        setStep("OTP");
        const delivered = Boolean(res.delivered);
        setIsDelivered(delivered);

        if (delivered) {
          setDevCode(null);
          setOtp(""); // Let the user type the real code they received in their inbox
        } else {
          const code = res.devOtp || "2026";
          setDevCode(code);
          setOtp(code); // Pre-fill test code for convenience
        }
      } else {
        setErrorMessage(res.error || "Failed to send verification code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const codeToVerify = otp.trim() || devCode || "2026";

    setIsLoading(true);
    try {
      const res = await verifyOtp(email.trim(), codeToVerify, name.trim());
      if (res.success) {
        setSuccessMessage("Authentication successful! Loading your archive...");
        setTimeout(() => {
          router.push(redirectTo);
        }, 500);
      } else {
        setErrorMessage(res.error || "Invalid code. Please try again or use 2026 / 1998.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);
    window.location.href = `/api/auth/oauth/google?redirect=${encodeURIComponent(redirectTo)}`;
  };

  const handleDevGoogleTest = () => {
    setErrorMessage(null);
    setSuccessMessage("Connecting via simulated Google account...");
    setIsGoogleLoading(true);
    window.location.href = `/api/auth/oauth/dev-mock?provider=google&redirect=${encodeURIComponent(redirectTo)}`;
  };

  return (
    <div className="max-w-md mx-auto w-full font-mono text-ink">
      <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b-2 border-ink pb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink/70 mb-1">
            // MEMBER PORTAL • SECURE ACCESS
          </div>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-ink leading-tight">
            {step === "EMAIL" ? "ACCESS YOUR ACCOUNT" : "ENTER PASSCODE"}
          </h1>
          <p className="text-xs text-ink/70 font-sans mt-1">
            {step === "EMAIL"
              ? "Passwordless authentication synced with your order archive & saved delivery addresses."
              : `Verification for ${email}`}
          </p>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 text-xs font-bold border-2 border-ink shadow-xs">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-600 text-white p-3 text-xs font-bold border-2 border-ink shadow-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google OAuth Configuration Helper Banner (Dev Guidance) */}
        {showGoogleNotice && (
          <div className="bg-hype border-2 border-ink p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                GOOGLE OAUTH SETUP
              </span>
              <span className="font-mono font-bold text-[10px] tracking-wider bg-ink text-white px-2 py-0.5">
                DEV NOTICE
              </span>
            </div>
            <div className="text-[11px] text-ink/80 leading-normal">
              API credentials not yet defined in <code>.env.local</code>. Configure{" "}
              <strong>GOOGLE_CLIENT_ID &amp; GOOGLE_CLIENT_SECRET</strong> for live Google sign-in, or test with our simulated profile below:
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDevGoogleTest}
                className="w-full flex items-center justify-center gap-2 bg-ink text-white hover:bg-white hover:text-ink py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-ink shadow-xs transition-colors cursor-pointer"
              >
                <span>TEST WITH SIMULATED GOOGLE PROFILE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Passcode Helper Banner */}
        {step === "OTP" && (
          <div className="bg-hype border-2 border-ink p-3 space-y-2">
            {isDelivered ? (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink uppercase mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  CODE SENT TO EMAIL INBOX
                </div>
                <div className="text-[11px] text-ink/80 leading-normal">
                  Check <strong>{email}</strong> (including Spam or Junk folders) for your 6-digit passcode.
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-ink uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    TEST PASSCODE:
                  </span>
                  <span className="font-mono font-bold text-sm tracking-widest bg-ink text-white px-2 py-0.5">
                    {devCode || "2026"}
                  </span>
                </div>
                <div className="text-[10px] text-ink/75 leading-tight mt-1.5">
                  Hostinger SMTP password incorrect or pending. We pre-filled your test passcode above (or use <strong>2026</strong> / <strong>1998</strong>).
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Email Form & Google OAuth Action */}
        {step === "EMAIL" ? (
          <div className="space-y-5">
            <form onSubmit={handleSendCode} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-ink/70">
                  EMAIL ADDRESS *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. aryan@thehypeco.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-ink pl-9 pr-3 py-2.5 text-xs focus:outline-hidden focus:bg-hype/10 font-mono shadow-xs"
                  />
                  <Mail className="w-4 h-4 text-ink/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-ink/70">
                  YOUR NAME (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aryan Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-2 border-ink p-2.5 text-xs uppercase focus:outline-hidden focus:bg-hype/10 font-mono shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-ink text-white hover:bg-hype hover:text-ink py-3 px-4 font-mono font-bold text-xs uppercase border-2 border-ink shadow-sm transition-all active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>TRANSMITTING PASSCODE...</span>
                  </>
                ) : (
                  <>
                    <span>SEND VERIFICATION PASSCODE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Seamless Neo-Brutalist Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-ink/15" />
              </div>
              <div className="relative bg-white px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60">
                // OR 1-CLICK ACCESS
              </div>
            </div>

            {/* Solo Prominent Google OAuth Button */}
            <div>
              <button
                type="button"
                id="oauth-google-btn"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-ink hover:bg-hype hover:text-ink py-3.5 px-4 font-mono font-bold text-xs uppercase border-2 border-ink shadow-[3px_3px_0px_#141414] hover:shadow-[4px_4px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#141414] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-[20px] h-[20px] animate-spin text-ink" />
                    <span>CONNECTING TO GOOGLE...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-[20px] h-[20px] shrink-0 fill-current text-ink" />
                    <span>CONTINUE WITH GOOGLE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: OTP Verification Form */
          <form onSubmit={handleVerifyCode} className="space-y-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase text-ink/70">
                  6-DIGIT PASSCODE *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep("EMAIL");
                    setOtp("");
                    setErrorMessage(null);
                  }}
                  className="text-[10px] uppercase font-bold text-ink/60 hover:text-ink underline cursor-pointer"
                >
                  CHANGE EMAIL
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-white border-2 border-ink pl-9 pr-3 py-3 text-center text-lg tracking-[0.4em] font-bold focus:outline-hidden focus:bg-hype/10 font-mono shadow-xs"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-ink text-white hover:bg-hype hover:text-ink py-3.5 px-4 font-mono font-bold text-xs uppercase border-2 border-ink shadow-sm transition-all active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VERIFYING PASSCODE...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFY &amp; ACCESS ACCOUNT</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-ink/10 text-[10px]">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading}
                className="inline-flex items-center gap-1 font-bold text-ink hover:underline uppercase cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>RESEND CODE</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="font-bold text-ink/70 hover:text-ink uppercase underline cursor-pointer"
              >
                USE GOOGLE OAUTH
              </button>
            </div>
          </form>
        )}

        {/* Footer Features Info - Single Line */}
        <div className="border-t-2 border-ink/10 pt-4 flex items-center justify-between gap-1.5 text-[9px] sm:text-[10px] text-ink/65 uppercase font-mono tracking-tight whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-ink rounded-full shrink-0" />
            <span>LIVE ORDER TRACKING</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-ink rounded-full shrink-0" />
            <span>SAVED ADDRESSES</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-ink rounded-full shrink-0" />
            <span>1-CLICK CHECKOUT</span>
          </div>
        </div>

        {/* Return to Store Link */}
        <div className="text-center pt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase hover:underline text-ink/80"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>RETURN TO ARCHIVE DROP</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="font-mono text-center text-xs uppercase p-10">
            LOADING SUBSCRIBER PORTAL...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
