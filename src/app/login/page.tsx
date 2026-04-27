"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, MapPin, Shield, ChevronRight, LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { getHospitals, getDoctors, setCurrentDoctor } from "@/lib/auth";
import type { Hospital, Doctor } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const hospitals = getHospitals();

  // If user is already authenticated, skip to step 1
  useEffect(() => {
    if (user && step === 0) {
      setStep(1);
    }
  }, [user, step]);

  async function handleEmailSignIn() {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setSigningIn(true);
    setError("");

    if (isSignUp) {
      const { error: signUpError } = await signUpWithEmail(email, password);
      setSigningIn(false);
      if (signUpError) {
        setError(signUpError);
      } else {
        setError("");
        // Show success message for email confirmation
        setError("Check your email for a confirmation link!");
      }
    } else {
      const { error: signInError } = await signInWithEmail(email, password);
      setSigningIn(false);
      if (signInError) {
        setError(signInError);
      } else {
        setStep(1);
      }
    }
  }

  async function handleGoogleSignIn() {
    setSigningIn(true);
    setError("");
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setSigningIn(false);
      setError(googleError);
    }
    // On success, page redirects to Google OAuth → callback → back here with session
  }

  function handleHospitalContinue() {
    if (selectedHospital) setStep(2);
  }

  function handleLogin() {
    if (selectedDoctor) {
      setCurrentDoctor(selectedDoctor.id);
      router.push("/dashboard");
    }
  }

  const doctorColors = ["bg-teal-600", "bg-blue-600", "bg-purple-600"];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] py-4">
        <div className="max-w-md mx-auto px-6 flex items-center justify-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ConsentFlow</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Step 0: Authentication */}
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-1">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
                {isSignUp ? "Sign up for ConsentFlow" : "Sign in to your ConsentFlow account"}
              </p>

              {/* Error message */}
              {error && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4 ${
                  error.includes("Check your email")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Google Sign In — prominent at top */}
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-full font-medium text-sm hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[var(--color-border)]" />
                <span className="text-sm text-[var(--color-muted)]">or</span>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
              </div>

              {/* Email / Password */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
                      placeholder="doctor@hospital.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
                      placeholder={isSignUp ? "Create a password (min 6 chars)" : "Enter your password"}
                      className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleEmailSignIn}
                disabled={signingIn}
                className="w-full mt-4 bg-gray-900 text-white py-3 rounded-full font-medium text-sm hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {signingIn ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </button>

              {!isSignUp && (
                <div className="text-center mt-2">
                  <button className="text-sm text-[var(--color-primary)] hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <p className="text-center text-sm text-[var(--color-muted)] mt-6">
                {isSignUp ? (
                  <>Already have an account?{" "}<button onClick={() => { setIsSignUp(false); setError(""); }} className="text-[var(--color-primary)] font-medium hover:underline">Sign in</button></>
                ) : (
                  <>Don&apos;t have an account?{" "}<button onClick={() => { setIsSignUp(true); setError(""); }} className="text-[var(--color-primary)] font-medium hover:underline">Sign up</button></>
                )}
              </p>
            </div>
          )}

          {/* Step 1: Hospital Select */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-1">Select your hospital</h1>
              <p className="text-sm text-[var(--color-text-secondary)] text-center mb-2">
                Choose the hospital you are affiliated with
              </p>
              {user && (
                <p className="text-xs text-center text-[var(--color-muted)] mb-6">
                  Signed in as <span className="font-medium text-[var(--color-text-secondary)]">{user.email}</span>
                </p>
              )}

              <div className="space-y-3">
                {hospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`w-full text-left border rounded-xl p-5 transition-all ${
                      selectedHospital?.id === hospital.id
                        ? "border-[var(--color-primary)] bg-teal-50/50 ring-2 ring-[var(--color-primary)]"
                        : "border-[var(--color-border)] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        MG
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-tight">{hospital.name}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <MapPin className="w-3 h-3 text-[var(--color-muted)]" />
                          <span className="text-xs text-[var(--color-muted)]">{hospital.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Shield className="w-3 h-3 text-[var(--color-muted)]" />
                          <span className="text-xs text-[var(--color-muted)]">{hospital.nabhId}</span>
                        </div>
                      </div>
                      {selectedHospital?.id === hospital.id && (
                        <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0 mt-1">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedHospital && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                  <p className="text-xs text-[var(--color-muted)]">Your login URL:</p>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{selectedHospital.id}.consentflow.app</p>
                </div>
              )}

              <button
                onClick={handleHospitalContinue}
                disabled={!selectedHospital}
                className="w-full mt-4 bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium text-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setStep(0)}
                className="w-full mt-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium transition-colors"
              >
                Back to sign in
              </button>
            </div>
          )}

          {/* Step 2: Doctor Select */}
          {step === 2 && selectedHospital && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-1">Welcome to MGMCRI</h1>
              <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
                Select your profile
              </p>

              <div className="space-y-3">
                {getDoctors(selectedHospital.id).map((doctor, i) => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`w-full text-left border rounded-xl p-4 transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? "border-[var(--color-primary)] bg-teal-50/50 ring-2 ring-[var(--color-primary)]"
                        : "border-[var(--color-border)] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-full ${doctorColors[i % doctorColors.length]} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                        {doctor.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{doctor.name}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-0.5">{doctor.designation}</p>
                        <p className="text-xs text-[var(--color-muted)]">{doctor.department}</p>
                      </div>
                      {selectedDoctor?.id === doctor.id && (
                        <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogin}
                disabled={!selectedDoctor}
                className="w-full mt-6 bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium text-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Login
              </button>

              <button
                onClick={() => { setStep(1); setSelectedDoctor(null); }}
                className="w-full mt-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium transition-colors"
              >
                Back to hospital selection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] py-4 text-center">
        <p className="text-xs text-[var(--color-muted)]">Secured by ConsentFlow. IT Act 2000 Compliant.</p>
      </div>
    </div>
  );
}
