"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { ArrowLeft } from "lucide-react";

type Step = "email" | "code";

// Dummy email that "exists" in the system
const DUMMY_EMAIL = "cloudstech@gmail.com";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [codeError, setCodeError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isCodeComplete = code.every((d) => d !== "");

  // ── Step 1: Email submit ──────────────────────────────────────────────────
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmailValid) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    // Dummy validation — only the known email "exists"
    if (email.toLowerCase() !== DUMMY_EMAIL) {
      setEmailError("No account found with that email address.");
      return;
    }
    setEmailError("");
    setStep("code");
  }

  // ── Step 2: OTP input helpers ─────────────────────────────────────────────
  function handleCodeChange(index: number, value: string) {
    // Accept only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setCodeError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleCodeKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (code[index]) {
        const next = [...code];
        next[index] = "";
        setCode(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleCodePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setCode(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  }

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isCodeComplete) {
      setCodeError("Please enter all 6 digits.");
      return;
    }
    // Dummy validation — correct code is 123456
    if (code.join("") !== "123456") {
      setCodeError("Invalid code. Please try again.");
      return;
    }
    setCodeError("");
    setSuccess(true);
  }

  // ── Shared layout wrapper ─────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full bg-[#1A1A1A] lg:bg-[#0A0A0A] text-white font-sans overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32 relative z-10 bg-[#161616]">
        {success ? (
          <SuccessView onBack={() => { setStep("email"); setEmail(""); setCode(Array(6).fill("")); setSuccess(false); }} />
        ) : step === "email" ? (
          <EmailStep
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            isEmailValid={isEmailValid}
            onSubmit={handleEmailSubmit}
          />
        ) : (
          <CodeStep
            email={email}
            code={code}
            codeError={codeError}
            isCodeComplete={isCodeComplete}
            inputRefs={inputRefs}
            onCodeChange={handleCodeChange}
            onCodeKeyDown={handleCodeKeyDown}
            onCodePaste={handleCodePaste}
            onSubmit={handleCodeSubmit}
            onBack={() => { setStep("email"); setCode(Array(6).fill("")); setCodeError(""); }}
          />
        )}
      </div>

      {/* Right Side - Image */}
      <div className="hidden w-1/2 lg:flex relative bg-[#0A0A0A] items-center justify-center p-4">
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl border border-[#333333]/30">
          <Image
            src="/assets/images/auth.png"
            alt="Dashboard Preview"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Email ─────────────────────────────────────────────────────────────
function EmailStep({
  email,
  setEmail,
  emailError,
  isEmailValid,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  emailError: string;
  isEmailValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="w-full">
      <div className="mb-10 mt-20">
        <h1 className="text-lg font-medium tracking-tight text-[#EAEAEA] mb-2">
          Forgot Your Password?
        </h1>
        <p className="text-[#6E7B82] text-sm font-normal">
          Enter your email to reset it
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-normal text-[#EAEAEA]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-[#1F1F1F] border border-transparent p-4 text-white placeholder:text-gray-600 focus:border-[#333333] focus:ring-1 focus:ring-[#333333] focus:outline-none transition-all"
          />
          {emailError && (
            <p className="text-sm text-[#FF8080]">{emailError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isEmailValid}
          className={`w-full rounded-full py-4 text-lg font-normal transition-all shadow-lg ${
            isEmailValid
              ? "bg-[#045DDF] text-white hover:bg-[#034BBB] hover:shadow-xl cursor-pointer"
              : "bg-[#3A3A3A] text-[#AAAAAA] cursor-not-allowed"
          }`}
        >
          Continue
        </button>

        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#333333] py-4 text-lg font-normal text-[#AAAAAA] hover:text-white hover:border-[#555555] transition-all"
        >
          <ArrowLeft size={18} />
          Back to login
        </Link>
      </form>
    </div>
  );
}

// ── Step 2: OTP Code ──────────────────────────────────────────────────────────
function CodeStep({
  email,
  code,
  codeError,
  isCodeComplete,
  inputRefs,
  onCodeChange,
  onCodeKeyDown,
  onCodePaste,
  onSubmit,
  onBack,
}: {
  email: string;
  code: string[];
  codeError: string;
  isCodeComplete: boolean;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onCodeChange: (i: number, v: string) => void;
  onCodeKeyDown: (i: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onCodePaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <div className="w-full">
      <div className="mb-10 mt-20">
        <h1 className="text-lg font-medium tracking-tight text-[#DEDEDE] mb-2">
          Reset Password
        </h1>
        <p className="text-[#6E7B82] text-sm font-light">
          Enter the code sent to{" "}
          <span className="text-[#EAEAEA] font-normal">{email}</span>
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-3">
          <label className="text-sm font-normal text-[#EAEAEA]">
            Enter Code
          </label>

          {/* OTP inputs — 3 digits, dash, 3 digits */}
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i]}
                onChange={(e) => onCodeChange(i, e.target.value)}
                onKeyDown={(e) => onCodeKeyDown(i, e)}
                onPaste={onCodePaste}
                className="h-16 w-full rounded-xl bg-[#1F1F1F] border border-transparent text-center text-2xl font-medium text-white focus:border-[#333333] focus:ring-1 focus:ring-[#333333] focus:outline-none transition-all caret-transparent"
              />
            ))}

            <span className="text-2xl text-[#555555] select-none shrink-0">—</span>

            {[3, 4, 5].map((i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i]}
                onChange={(e) => onCodeChange(i, e.target.value)}
                onKeyDown={(e) => onCodeKeyDown(i, e)}
                onPaste={onCodePaste}
                className="h-16 w-full rounded-xl bg-[#1F1F1F] border border-transparent text-center text-2xl font-medium text-white focus:border-[#333333] focus:ring-1 focus:ring-[#333333] focus:outline-none transition-all caret-transparent"
              />
            ))}
          </div>

          {codeError && (
            <p className="text-sm text-[#FF8080]">{codeError}</p>
          )}

          <p className="text-sm text-[#555555]">
            Hint: the dummy code is{" "}
            <span className="text-[#888888] font-medium">123456</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={!isCodeComplete}
          className={`w-full rounded-full py-4 text-lg font-normal transition-all shadow-lg ${
            isCodeComplete
              ? "bg-[#045DDF] text-white hover:bg-[#034BBB] hover:shadow-xl cursor-pointer"
              : "bg-[#3A3A3A] text-[#AAAAAA] cursor-not-allowed"
          }`}
        >
          Continue
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#333333] py-4 text-lg font-normal text-[#AAAAAA] hover:text-white hover:border-[#555555] transition-all"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </form>
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────
function SuccessView({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full text-center">
      <div className="mb-10 mt-20 flex flex-col items-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#045DDF]/15 border border-[#045DDF]/30">
          <svg
            className="h-9 w-9 text-[#045DDF]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-normal tracking-tight text-[#EAEAEA] mb-2">
          Code Verified!
        </h1>
        <p className="text-[#888888] text-lg font-light max-w-xs">
          Your identity has been confirmed. You can now set a new password.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/login"
          className="block w-full rounded-full bg-[#045DDF] py-4 text-lg font-normal text-white hover:bg-[#034BBB] transition-all shadow-lg hover:shadow-xl"
        >
          Set New Password
        </Link>
        <button
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#333333] py-4 text-lg font-normal text-[#AAAAAA] hover:text-white hover:border-[#555555] transition-all"
        >
          <ArrowLeft size={18} />
          Back to login
        </button>
      </div>
    </div>
  );
}
