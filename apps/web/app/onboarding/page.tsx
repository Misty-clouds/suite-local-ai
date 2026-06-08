"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

const ONBOARDING_STEPS = [
  {
    title: "Manage Projects. Send Invoices. Get Paid Faster.",
    description: "Built for service professionals who want clarity, control, and faster payments.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  },
  {
    title: "Keep Everyone On The Same Page.",
    description:
      "Chat with your team and clients inside each project. Share updates, files, and decisions without switching apps.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2600&auto=format&fit=crop",
  },
  {
    title: "Let AI Handle The Busy Work.",
    description:
      "Automatically generate reports, send payment reminders, and get smart insights on project performance.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2600&auto=format&fit=crop",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between bg-app-bg px-6 py-10 text-white overflow-hidden">
      <div /> {/* Spacer to help center the main content */}
      {/* Content Container */}
      <div className="flex w-full max-w-[400px] flex-col items-center text-center animate-in fade-in duration-700 slide-in-from-bottom-4">
        {/* Illustration/Image Container */}
        <div className="group relative mb-8 h-32 w-[400px] overflow-hidden rounded-3xl bg-app-card shadow-2xl ring-1 ring-app-border md:h-42 lg:h-56">
          <Image
            src={ONBOARDING_STEPS[currentStep].image}
            alt="Onboarding Illustration"
            fill
            className="object-cover opacity-90 transition-all duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-app-bg via-app-bg/20 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-linear-to-b from-brand-primary/5 via-transparent to-transparent" />
        </div>

        {/* Step Indicators */}
        <div className="mb-8 flex gap-2.5">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                index === currentStep
                  ? "w-10 bg-brand-primary"
                  : "w-6 bg-app-border hover:bg-app-text-dim"
              }`}
            />
          ))}
        </div>

        {/* Text Content */}
        <div className="mb-10 min-h-[140px] space-y-4">
          <h1 className="text-xl font-medium tracking-tight text-white md:text-4xl lg:text-2xl leading-[1.1]">
            {ONBOARDING_STEPS[currentStep].title}
          </h1>
          <p className="mx-auto max-w-[340px] text-base text-app-text-muted leading-relaxed">
            {ONBOARDING_STEPS[currentStep].description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          {!isLastStep ? (
            <>
              <button
                onClick={() => setCurrentStep(ONBOARDING_STEPS.length - 1)}
                className="flex-1 rounded-full border border-app-border py-4 text-base font-semibold text-white transition-all hover:bg-app-card hover:border-app-text-dim active:scale-95"
              >
                Skip
              </button>
              <button
                onClick={nextStep}
                className="flex-1 rounded-full bg-brand-primary py-4 text-base font-semibold text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-blue-600 hover:shadow-brand-primary/40 active:scale-95 flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-brand-primary py-4.5 text-lg font-bold text-white shadow-2xl shadow-brand-primary/25 transition-all hover:bg-blue-600 hover:shadow-brand-primary/50 active:scale-95 group"
            >
              Continue
              <ArrowRight size={22} className="transition-transform group-hover:translate-x-1.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
