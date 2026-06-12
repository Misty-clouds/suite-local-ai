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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password.length > 0;

  const emailError =
    touched.email && !isEmailValid ? "Enter a valid email address" : "";
  const passwordError =
    touched.password && password.length === 0 ? "Password is required" : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!isFormValid) {
      setTouched({ email: true, password: true });
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <AuthHeading title="Welcome Back!" subtitle="Enter your info to continue" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
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
            autoComplete="current-password"
          />
          <Link
            href="/reset-password"
            className="self-end text-[12px] text-[#6e7b82] transition-colors hover:text-[#dedede]"
          >
            Forgot password?
          </Link>
          {error && (
            <p className="text-[12px] text-[#FF8080]">{error}</p>
          )}
        </div>

        <AuthButton disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </AuthButton>

        <p className="flex gap-1 text-[14px] leading-[1.1] text-[#6e7b82]">
          Don&apos;t have an account?
          <Link href="/register" className="font-medium text-[#dedede]">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
