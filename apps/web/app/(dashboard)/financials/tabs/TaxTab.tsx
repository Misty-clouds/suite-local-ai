"use client";

import { useState } from "react";
import { 
  Check, 
  ChevronLeft, 
  Building2, 
  User, 
  Info,
  Calendar,
  Upload,
  ChevronDown,
  Star
} from "lucide-react";

type TaxStep = 1 | 2 | 3 | 4 | 5;

export function TaxTab() {
  const [step, setStep] = useState<TaxStep>(1);
  const [formData, setFormData] = useState({
    // Step 1: Business
    businessName: "Cloudstech LTD",
    rcNumber: "",
    businessStructure: "Private Ltd",
    stateOfOperation: "Lagos",
    industry: "Technology / Software",

    // Step 2: Tax IDs
    tin: "",
    firsUsername: "",
    isVatRegistered: "Yes",
    vatNumber: "",
    vatDate: "",
    withholdingTax: "Yes",

    // Step 3: Fiscal Year
    fiscalYearStart: "January (Most common)",
    currentTaxYear: "2026 (Jan 1 - Dec 31)",
    citRate: "0%",
    vatFrequency: "Monthly",

    // Step 4: Employees
    hasEmployees: "Yes",
    numEmployees: "",
    monthlyPayroll: "",
    statePayrollTax: "Lagos - 1%",
    payrollProvider: "Cloudstech Payroll",

    // Step 5: Prior Filings
    filedBefore: "Yes",
    lastYearFiled: "2025",
    outstandingLiabilities: "No",
    carryForwardLosses: "",
    unremittedWht: "",
  });

  const nextStep = () => {
    if (step < 5) setStep((s) => (s + 1) as TaxStep);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => (s - 1) as TaxStep);
  };

  return (
    <div className="flex flex-col items-center py-10 px-6 max-w-4xl mx-auto w-full min-h-[calc(100vh-120px)]">
      {/* Header Info */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-surface border border-app-border text-app-text-muted text-[11px] mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          One-time setup • Takes about 3 minutes
        </div>
        <h1 className="text-2xl font-semibold text-app-text-main mb-2">Set up your tax profile</h1>
        <p className="text-app-text-muted text-sm max-w-lg">
          Before we can track your obligations, generate filings, and surface AI insights, 
          we need a few details about your business and tax status.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-12 relative">
        {/* Connecting lines */}
        <div className="absolute top-5 left-0 w-full h-[1px] bg-app-border -z-10" />
        <div 
          className="absolute top-5 left-0 h-[1px] bg-brand-primary transition-all duration-300 -z-10" 
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />

        {[
          { num: 1, label: "Business" },
          { num: 2, label: "Tax IDs" },
          { num: 3, label: "Fiscal year" },
          { num: 4, label: "Employees" },
          { num: 5, label: "Prior fillings" },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step > s.num 
                  ? "bg-[#162C1E] border border-[#354A3A] text-[#DEDEDE]" 
                  : step === s.num 
                    ? "bg-brand-primary text-white shadow-[0_0_15px_rgba(0,85,255,0.4)]" 
                    : "bg-app-surface border border-app-border text-app-text-dim"
              }`}
            >
              {step > s.num ? <Check size={18} /> : s.num}
            </div>
            <span className={`text-xs ${step === s.num ? "text-app-text-main font-medium" : "text-app-text-muted"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="w-full bg-app-bg border border-app-border rounded-2xl p-8 mb-8">
        {step === 1 && <Step1 formData={formData} setFormData={setFormData} />}
        {step === 2 && <Step2 formData={formData} setFormData={setFormData} />}
        {step === 3 && <Step3 formData={formData} setFormData={setFormData} />}
        {step === 4 && <Step4 formData={formData} setFormData={setFormData} />}
        {step === 5 && <Step5 formData={formData} setFormData={setFormData} />}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between w-full max-w-4xl px-2">
        <div>
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-app-border bg-app-surface text-app-text-main hover:bg-app-card transition-colors"
            >
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-app-text-muted text-sm font-medium">Step {step} of 5</span>
          <button 
            onClick={nextStep}
            className="px-8 py-2.5 rounded-xl bg-brand-primary text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20"
          >
            {step === 5 ? "Finish setup" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({ formData, setFormData }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-app-text-main">Tell us about your business</h2>
        <p className="text-app-text-muted text-sm">
          This determines which tax obligations apply to you and at what rates. We've pre-filled what we know from your account.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">Business name</label>
          <input 
            type="text" 
            value={formData.businessName}
            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
            placeholder="Cloudstech LTD"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">RC / Business No. (CAC registration)</label>
          <input 
            type="text" 
            value={formData.rcNumber}
            onChange={(e) => setFormData({...formData, rcNumber: e.target.value})}
            className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
            placeholder="e.g. 1234567"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-app-text-light">Business structure</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "Sole trader", label: "Sole trader", desc: "Individual owner", icon: <User size={20} className="text-amber-500" /> },
            { id: "Private Ltd", label: "Private Ltd", desc: "Incorporated company", icon: <Building2 size={20} className="text-cyan-500" /> },
            { id: "NGO / NPO", label: "NGO / NPO", desc: "Non-profit entity", icon: <Star size={20} className="text-rose-500" /> },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({...formData, businessStructure: item.id})}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${
                formData.businessStructure === item.id 
                  ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                  : "bg-app-card border-app-border hover:border-app-text-dim"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${formData.businessStructure === item.id ? "bg-brand-primary/20" : "bg-app-surface"}`}>
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-app-text-main">{item.label}</div>
                <div className="text-[11px] text-app-text-muted">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">State of operation</label>
          <div className="relative">
            <select 
              value={formData.stateOfOperation}
              onChange={(e) => setFormData({...formData, stateOfOperation: e.target.value})}
              className="w-full appearance-none bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors pr-10"
            >
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Rivers</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" size={18} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">Industry (Optional)</label>
          <div className="relative">
            <select 
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              className="w-full appearance-none bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors pr-10"
            >
              <option>Technology / Software</option>
              <option>Finance</option>
              <option>Retail</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, setFormData }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-app-text-main">Your tax identifiers</h2>
        <p className="text-app-text-muted text-sm">
          These are issued by FIRS. If you don't have a TIN yet, you can still continue — but you'll need it before generating any filing.
        </p>
      </div>

      <div className="flex gap-4 p-4 rounded-xl bg-app-surface border border-app-border">
        <Info className="text-brand-primary shrink-0" size={20} />
        <p className="text-xs text-app-text-muted leading-relaxed">
          Your TIN and VAT number are only used to pre-fill your tax filings and verify your registration status. 
          <span className="text-app-text-main font-medium ml-1">We never share this with third parties.</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">Tax Identification Number (TIN)</label>
          <input 
            type="text" 
            value={formData.tin}
            className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
            placeholder="e.g. 1234567-0009"
          />
          <p className="text-[10px] text-app-text-muted">11—13 digit number issued by FIRS. Found on your TIN certificate or FIRS letter.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">FIRS e-filing username (optional)</label>
          <input 
            type="text" 
            value={formData.firsUsername}
            className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
            placeholder="Enter FIRS username"
          />
          <p className="text-[10px] text-app-text-muted">Enables direct filing from Cloudstech in the future.</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-app-text-light">Are you VAT registered?</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "Yes", label: "Yes, I am registered", desc: "I collect and remit VAT" },
            { id: "No", label: "No, not registered", desc: "Annual turnover below ₦25M" },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({...formData, isVatRegistered: item.id})}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                formData.isVatRegistered === item.id 
                  ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                  : "bg-app-card border-app-border hover:border-app-text-dim"
              }`}
            >
              <div>
                <div className="text-sm font-medium text-app-text-main">{item.label}</div>
                <div className="text-[11px] text-app-text-muted">{item.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                formData.isVatRegistered === item.id ? "bg-brand-primary border-brand-primary" : "border-app-border"
              }`}>
                {formData.isVatRegistered === item.id && <Check size={12} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {formData.isVatRegistered === "Yes" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-app-text-light">VAT registration number</label>
            <input 
              type="text" 
              className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
              placeholder="e.g. 1234567-0009"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-app-text-light">VAT registration date</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
                placeholder="mm/dd/yyyy"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <label className="text-sm font-medium text-app-text-light">Withholding tax — do you deduct WHT from vendor payments?</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "Yes", label: "Yes, I deduct WHT", desc: "Consultants, lawyers, landlords etc." },
            { id: "No", label: "Not sure / No", desc: "We'll help you figure this out" },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({...formData, withholdingTax: item.id})}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                formData.withholdingTax === item.id 
                  ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                  : "bg-app-card border-app-border hover:border-app-text-dim"
              }`}
            >
              <div>
                <div className="text-sm font-medium text-app-text-main">{item.label}</div>
                <div className="text-[11px] text-app-text-muted">{item.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                formData.withholdingTax === item.id ? "bg-brand-primary border-brand-primary" : "border-app-border"
              }`}>
                {formData.withholdingTax === item.id && <Check size={12} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ formData, setFormData }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-app-text-main">Fiscal year & tax period</h2>
        <p className="text-app-text-muted text-sm">
          Your fiscal year determines how we group your income and expenses for CIT purposes. Most Nigerian businesses run January to December. 
          <span className="text-brand-primary cursor-pointer ml-1">What's a Fiscal year?</span> <span className="text-brand-primary cursor-pointer ml-1">What's CIT?</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">Fiscal year start</label>
          <div className="relative">
            <select className="w-full appearance-none bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors pr-10">
              <option>January (Most common)</option>
              <option>April</option>
              <option>July</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" size={18} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">Current tax year</label>
          <div className="relative">
            <select className="w-full appearance-none bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors pr-10">
              <option>2026 (Jan 1 - Dec 31)</option>
              <option>2025 (Jan 1 - Dec 31)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-app-text-light">Your applicable CIT rate</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "0%", label: "0%", desc: "Turnover below ₦25M" },
            { id: "20%", label: "20%", desc: "₦25M — ₦100M turnover" },
            { id: "30%", label: "30%", desc: "Above ₦100M turnover" },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({...formData, citRate: item.id})}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                formData.citRate === item.id 
                  ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                  : "bg-app-card border-app-border hover:border-app-text-dim"
              }`}
            >
              <div className="text-sm font-medium text-app-text-main">{item.label}</div>
              <div className="text-[10px] text-app-text-muted">{item.desc}</div>
              <div className={`mt-2 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                formData.citRate === item.id ? "bg-brand-primary border-brand-primary" : "border-app-border"
              }`}>
                {formData.citRate === item.id && <Check size={12} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-app-text-muted">Not sure? Our AI will estimate your applicable rate based on your transaction history once setup is complete.</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-app-text-light">VAT filing frequency</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "Monthly", label: "Monthly", desc: "Standard for most businesses" },
            { id: "Quarterly", label: "Quarterly", desc: "If approved by FIRS" },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({...formData, vatFrequency: item.id})}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                formData.vatFrequency === item.id 
                  ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                  : "bg-app-card border-app-border hover:border-app-text-dim"
              }`}
            >
              <div>
                <div className="text-sm font-medium text-app-text-main">{item.label}</div>
                <div className="text-[11px] text-app-text-muted">{item.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                formData.vatFrequency === item.id ? "bg-brand-primary border-brand-primary" : "border-app-border"
              }`}>
                {formData.vatFrequency === item.id && <Check size={12} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, setFormData }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-app-text-main">Do you have employees?</h2>
        <p className="text-app-text-muted text-sm">
          If you pay salaries, you are legally required to deduct and remit PAYE tax monthly on behalf of your employees. This unlocks the PAYE module.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-app-text-light">Employee status</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "Yes", label: "Yes, I have employees", desc: "Full-time, part-time, or contract staff on payroll" },
            { id: "No", label: "No employees yet", desc: "Solo or using only freelancers" },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({...formData, hasEmployees: item.id})}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                formData.hasEmployees === item.id 
                  ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                  : "bg-app-card border-app-border hover:border-app-text-dim"
              }`}
            >
              <div>
                <div className="text-sm font-medium text-app-text-main">{item.label}</div>
                <div className="text-[11px] text-app-text-muted">{item.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                formData.hasEmployees === item.id ? "bg-brand-primary border-brand-primary" : "border-app-border"
              }`}>
                {formData.hasEmployees === item.id && <Check size={12} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {formData.hasEmployees === "Yes" && (
        <>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text-light">Number of employees</label>
              <input 
                type="text" 
                className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
                placeholder="e.g. 8"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text-light">Monthly payroll total</label>
              <input 
                type="text" 
                className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
                placeholder="e.g. ₦4,500,000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text-light">State payroll tax (SDL)</label>
              <div className="relative">
                <select className="w-full appearance-none bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors pr-10">
                  <option>Lagos - 1%</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-app-text-light">Payroll provider (optional)</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "Cloudstech Payroll", label: "Cloudstech Payroll", desc: "Auto-sync, no extra setup needed" },
                { id: "External / Manual", label: "External / Manual", desc: "Upload payslips each month" },
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setFormData({...formData, payrollProvider: item.id})}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    formData.payrollProvider === item.id 
                      ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                      : "bg-app-card border-app-border hover:border-app-text-dim"
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium text-app-text-main">{item.label}</div>
                    <div className="text-[11px] text-app-text-muted">{item.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    formData.payrollProvider === item.id ? "bg-brand-primary border-brand-primary" : "border-app-border"
                  }`}>
                    {formData.payrollProvider === item.id && <Check size={12} className="text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-app-surface border border-app-border">
            <Info className="text-brand-primary shrink-0" size={20} />
            <p className="text-xs text-app-text-muted leading-relaxed">
              PAYE must be remitted to the relevant State Internal Revenue Service (SIRS) by the <span className="text-app-text-main font-medium">10th of every month</span>. We'll remind you before each deadline and pre-fill the schedule from your payroll data.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function Step5({ formData, setFormData }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-app-text-main">Prior tax filings</h2>
        <p className="text-app-text-muted text-sm">
          This helps us pick up where you left off, carry-forward losses, outstanding liabilities, and unremitted credits all affect your current year position.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-app-text-light">Have you filed taxes before?</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "Yes", label: "Yes, I have filed before", desc: "Upload last year's return below" },
            { id: "No", label: "No, this is my first time", desc: "We'll start fresh from your data" },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setFormData({...formData, filedBefore: item.id})}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                formData.filedBefore === item.id 
                  ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                  : "bg-app-card border-app-border hover:border-app-text-dim"
              }`}
            >
              <div>
                <div className="text-sm font-medium text-app-text-main">{item.label}</div>
                <div className="text-[11px] text-app-text-muted">{item.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                formData.filedBefore === item.id ? "bg-brand-primary border-brand-primary" : "border-app-border"
              }`}>
                {formData.filedBefore === item.id && <Check size={12} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {formData.filedBefore === "Yes" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-app-text-light">Last year filed</label>
            <div className="relative">
              <select className="w-full appearance-none bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors pr-10">
                <option>2025</option>
                <option>2024</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none" size={18} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-app-text-light">Any outstanding tax liabilities?</label>
            <div className="flex bg-app-card border border-app-border rounded-xl p-1">
              <button 
                onClick={() => setFormData({...formData, outstandingLiabilities: "Yes"})}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  formData.outstandingLiabilities === "Yes" ? "bg-app-surface text-app-text-main" : "text-app-text-muted hover:text-app-text-dim"
                }`}
              >
                Yes
              </button>
              <button 
                onClick={() => setFormData({...formData, outstandingLiabilities: "No"})}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  formData.outstandingLiabilities === "No" ? "bg-brand-primary text-white" : "text-app-text-muted hover:text-app-text-dim"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-app-text-light">Upload last year's tax return (optional but recommended)</label>
        <div className="border-2 border-dashed border-app-border rounded-2xl p-10 flex flex-col items-center gap-3 bg-app-bg hover:bg-app-surface transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-app-surface flex items-center justify-center text-app-text-muted group-hover:text-app-text-light transition-colors">
            <Upload size={20} />
          </div>
          <div className="text-center">
            <p className="text-sm text-app-text-light font-medium">Drop your PDF here or click to browse</p>
            <p className="text-xs text-app-text-muted mt-1">Supports PDF • Max 20MB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">Carry-forward losses (if any)</label>
          <input 
            type="text" 
            className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
            placeholder="e.g. ₦4,500"
          />
          <p className="text-[10px] text-app-text-muted">Losses from prior years that can be offset against current year profit.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-light">Unremitted WHT credits (if any)</label>
          <input 
            type="text" 
            className="w-full bg-app-card border border-app-border rounded-xl px-4 py-3 text-app-text-main focus:border-brand-primary outline-none transition-colors"
            placeholder="e.g. ₦4,500"
          />
          <p className="text-[10px] text-app-text-muted">WHT deducted from your income by clients that you haven't yet claimed back.</p>
        </div>
      </div>
    </div>
  );
}
