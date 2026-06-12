"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthHeading,
  AuthField,
  AuthPasswordField,
  AuthButton,
} from "@/components/auth/fields";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid =
    fullName.trim().length > 0 && isEmailValid && isPasswordValid;

  const nameError =
    touched.fullName && fullName.trim().length === 0
      ? "Please enter your full name"
      : "";
  const emailError =
    touched.email && !isEmailValid ? "Enter a valid email address" : "";
  const passwordError =
    touched.password && !isPasswordValid
      ? "Password must be at least 8 characters"
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!isFormValid) {
      // Reveal every field's error so the user sees what's wrong.
      setTouched({ fullName: true, email: true, password: true });
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await register(fullName.trim(), email, password);
      // New accounts go through onboarding first.
      router.replace("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <AuthHeading
        title="Create Account"
        subtitle="Fill in your details to get started"
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <AuthField
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={setFullName}
            onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
            error={nameError}
            autoComplete="name"
          />
          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            error={emailError}
            autoComplete="email"
          />
          <AuthPasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={passwordError}
            hint={!passwordError ? "Use at least 8 characters" : undefined}
            autoComplete="new-password"
          />
          {error && <p className="text-[12px] text-[#FF8080]">{error}</p>}
        </div>

        <AuthButton disabled={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </AuthButton>

        <p className="flex gap-1 text-[14px] leading-[1.1] text-[#6e7b82]">
          Already have an account?
          <Link href="/login" className="font-medium text-[#dedede]">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
