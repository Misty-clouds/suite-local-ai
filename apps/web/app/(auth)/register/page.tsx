"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid =
    fullName.trim().length > 0 &&
    isEmailValid &&
    isPasswordValid

  return (
    <div className="flex min-h-screen w-full bg-[#1A1A1A] lg:bg-[#0A0A0A] text-white font-sans overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32 relative z-10 bg-[#161616]">
        <div className="mb-10 mt-20">
          <h1 className="text-lg font-medium tracking-tight text-[#EAEAEA] mb-2">
            Create Account
          </h1>
          <p className="text-[#828282] text-sm font-normal">
            Fill in your details to get started
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Full Name */}
          {/* <div className="space-y-2">
            <label
              className="text-lg font-normal text-[#EAEAEA]"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder=""
              className="w-full rounded-xl bg-[#1F1F1F] border border-transparent p-4 text-white placeholder:text-gray-600 focus:border-[#333333] focus:ring-1 focus:ring-[#333333] focus:outline-none transition-all"
            />
          </div> */}

          {/* Email */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#DEDEDE]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="w-full max-h-11 rounded-xl bg-[#1F1F1F] border border-transparent p-4 text-white placeholder:text-gray-600 focus:border-[#333333] focus:ring-1 focus:ring-[#333333] focus:outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#DEDEDE]"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full max-h-11 rounded-xl bg-[#1F1F1F] border border-transparent p-4 pr-12 text-white placeholder:text-gray-600 focus:border-[#333333] focus:ring-1 focus:ring-[#333333] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full rounded-full py-4 text-lg font-normal transition-all mt-6 shadow-lg ${isFormValid
              ? "bg-[#045DDF] text-white hover:bg-[#034BBB] hover:shadow-xl cursor-pointer"
              : "bg-[#3A3A3A] text-[#AAAAAA] cursor-not-allowed"
              }`}
          >
            Create Account
          </button>
        </form>

        <div className="absolute bottom-8 left-8 sm:left-12">
          <Link href={"/login"} className="text-[#6E7B82] text-sm font-normal" >Already have an account?  <span className="text-[#FFFFFF]">Sign In</span></Link>
        </div>
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
