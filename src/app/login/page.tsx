"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, MapPin, Shield, ChevronRight, LogIn } from "lucide-react";
import { getHospitals, getDoctors, setCurrentDoctor } from "@/lib/auth";
import type { Hospital, Doctor } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const hospitals = getHospitals();

  function handleHospitalContinue() {
    if (selectedHospital) {
      setStep(2);
    }
  }

  function handleLogin() {
    if (selectedDoctor) {
      setCurrentDoctor(selectedDoctor.id);
      router.push("/dashboard");
    }
  }

  const doctorColors = [
    "bg-teal-600",
    "bg-blue-600",
    "bg-purple-600",
  ];

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
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-1">Select your hospital</h1>
              <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
                Choose the hospital you are affiliated with
              </p>

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

              <button
                onClick={handleHospitalContinue}
                disabled={!selectedHospital}
                className="w-full mt-6 bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium text-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

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
