import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Download, 
  FileText, 
  Radio, 
  Users, 
  MessageSquare, 
  Building2, 
  TrendingUp, 
  Plus, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { PLAN_TIERS, SMS_ADDON_PACKS } from '../data/mockData';
import { SaaSSubscriptionPlan, BillingCycle, SaaSInvoice } from '../types';

export const BillingView: React.FC = () => {
  const { 
    currentSchool, 
    students, 
    tenantUsers, 
    billingCycle, 
    setBillingCycle, 
    invoices, 
    paymentMethod, 
    updatePaymentMethod, 
    upgradePlan, 
    purchaseSMSPack, 
    addToast 
  } = useApp();

  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<SaaSInvoice | null>(null);
  const [isUpdateCardModalOpen, setIsUpdateCardModalOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [newCardBrand, setNewCardBrand] = useState('Visa');

  const currentPlanConfig = PLAN_TIERS.find((p) => p.id === currentSchool.plan) || PLAN_TIERS[1];
  const maxStudents = currentPlanConfig.maxStudents;
  const currentStudentCount = students.length;
  const studentCapacityPercent = Math.min(100, Math.round((currentStudentCount / maxStudents) * 100));

  const handleUpdateCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || newCardNumber.length < 4) {
      addToast({
        title: 'Invalid Card Number',
        message: 'Please provide a valid 16-digit card number.',
        type: 'error',
      });
      return;
    }
    const last4 = newCardNumber.slice(-4);
    updatePaymentMethod(`${newCardBrand} •••• ${last4}`);
    setIsUpdateCardModalOpen(false);
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvc('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SaaS Subscription & Account Licensing</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic text-[#1A1A1A] leading-tight tracking-tight">
            Subscription & Cloud Billing
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 mt-1.5 max-w-2xl">
            Manage your institutional SaaS tier, monitor student capacity limits, replenish telecom SMS balances, and access itemized accounting receipts.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="bg-[#E8E4DF] p-1 rounded-xl flex items-center border border-[#1A1A1A]/10 shadow-2xs self-start md:self-auto">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[9px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
              2 Mo. Free
            </span>
          </button>
        </div>
      </div>

      {/* Hero Overview: Active Plan & Capacity Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Active Subscription Overview */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/60">
                Active Tenant Plan
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Renews
              </span>
            </div>

            <h3 className="font-serif text-3xl font-bold text-[#1A1A1A] leading-tight">
              {currentSchool.plan}
            </h3>
            <p className="text-xs text-[#1A1A1A]/60 mt-1">
              {currentPlanConfig.tagline}
            </p>
          </div>

          <div className="bg-[#F4F1ED] p-4 rounded-xl border border-[#1A1A1A]/10 space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#1A1A1A]/70">Current Investment:</span>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  ${billingCycle === 'annual' ? currentPlanConfig.annualPricePerMonth : currentPlanConfig.monthlyPrice}
                </span>
                <span className="text-xs text-[#1A1A1A]/60">/mo</span>
              </div>
            </div>

            <div className="flex justify-between text-[11px] pt-2 border-t border-[#1A1A1A]/10 text-[#1A1A1A]/70">
              <span>Next Renewal Date:</span>
              <span className="font-mono font-bold text-[#1A1A1A]">Sept 15, 2026</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#1A1A1A]/70">
              <span>Payment Method:</span>
              <span className="font-mono font-medium text-[#1A1A1A]">{paymentMethod}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setIsUpdateCardModalOpen(true)}
              className="flex-1 py-2 px-3 rounded-lg border border-[#1A1A1A]/20 hover:bg-[#F4F1ED] text-xs font-bold text-[#1A1A1A] transition-colors text-center"
            >
              Update Payment Card
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing-tiers-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white transition-colors text-center"
            >
              Change Tier
            </button>
          </div>
        </div>

        {/* Card 2: Student Enrollment Meter */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/50">
                Capacity Metric
              </span>
              <span className="text-xs font-mono font-bold text-[#1A1A1A]">
                {studentCapacityPercent}% Allocated
              </span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-700" />
              Student Seat Roster
            </h3>
            <p className="text-xs text-[#1A1A1A]/60 mt-1">
              Active student profiles enrolled across all institutional classrooms.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>{currentStudentCount} Enrolled Scholars</span>
              <span className="text-[#1A1A1A]/60">Limit: {maxStudents.toLocaleString()}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#E8E4DF] rounded-full overflow-hidden p-0.5 border border-[#1A1A1A]/10">
              <div
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, studentCapacityPercent)}%` }}
              />
            </div>
          </div>

          <div className="bg-[#F4F1ED] p-3 rounded-xl border border-[#1A1A1A]/10 text-xs flex items-center justify-between">
            <span className="text-[#1A1A1A]/70">Faculty & Staff Seats:</span>
            <span className="font-bold text-[#1A1A1A] font-mono">{tenantUsers.length} Active Accounts</span>
          </div>
        </div>

        {/* Card 3: SMS Gateway Credits Meter */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/50">
                Telecom Telemetry
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Tier Allowance Active
              </span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-700" />
              Sentinel SMS Balance
            </h3>
            <p className="text-xs text-[#1A1A1A]/60 mt-1">
              Real-time broadcast credits available for parent absence alerts and notifications.
            </p>
          </div>

          <div className="bg-[#F4F1ED] p-4 rounded-xl border border-[#1A1A1A]/10 flex items-baseline justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-bold">
                Available Credits
              </div>
              <div className="font-serif text-3xl font-bold text-[#1A1A1A] font-mono">
                {currentSchool.remainingSMSCredits.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-bold">
                Sender ID
              </div>
              <div className="font-mono text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/40 mt-0.5">
                {currentSchool.smsSenderId}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('sms-store-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-800" />
            Top-up SMS Credit Pack
          </button>
        </div>
      </div>

      {/* Pricing & Plan Tier Comparison Grid */}
      <div id="pricing-tiers-section" className="space-y-5 pt-4">
        <div className="border-b border-[#1A1A1A]/10 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50">
              SaaS Model Tiers
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Institutional Subscription Plans
            </h3>
          </div>
          <p className="text-xs text-[#1A1A1A]/60 sm:text-right max-w-sm">
            Upgrade or switch tiers anytime. All upgrades unlock features instantaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAN_TIERS.map((tier) => {
            const isCurrent = currentSchool.plan === tier.id;
            const price = billingCycle === 'annual' ? tier.annualPricePerMonth : tier.monthlyPrice;

            return (
              <div
                key={tier.id}
                className={`bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-200 relative ${
                  isCurrent
                    ? 'border-amber-600 shadow-md ring-2 ring-amber-500/20'
                    : 'border-[#1A1A1A]/12 hover:border-[#1A1A1A]/30 shadow-xs'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-6 bg-[#1A1A1A] text-amber-300 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                      {tier.name}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                        CURRENT PLAN
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#1A1A1A]/65 min-h-[32px]">
                    {tier.tagline}
                  </p>

                  <div className="my-6 pb-6 border-b border-[#1A1A1A]/10">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-4xl font-bold text-[#1A1A1A]">
                        ${price}
                      </span>
                      <span className="text-xs text-[#1A1A1A]/60 font-medium">
                        /month {billingCycle === 'annual' && '(billed annually)'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-[11px] text-emerald-700 font-medium mt-1">
                        Saves ${(tier.monthlyPrice - tier.annualPricePerMonth) * 12}/year with annual commitment
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/50">
                      Tier Capabilities
                    </div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1A1A1A]/80">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1A1A1A]/10">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-[#E8E4DF] text-[#1A1A1A]/50 font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed text-center"
                    >
                      Active Current Tier
                    </button>
                  ) : (
                    <button
                      onClick={() => upgradePlan(tier.id, billingCycle)}
                      className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Select {tier.name}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SMS Add-On Pack Store */}
      <div id="sms-store-section" className="space-y-5 pt-6">
        <div className="border-b border-[#1A1A1A]/10 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50">
              Add-On Store
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Instant SMS Broadcast Credit Packs
            </h3>
          </div>
          <p className="text-xs text-[#1A1A1A]/60 sm:text-right max-w-sm">
            Top-up SMS credits instantly anytime. Credits never expire and rollover monthly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SMS_ADDON_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[#1A1A1A]">{pack.name}</span>
                  {pack.popular && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>

                <div className="font-serif text-3xl font-bold text-[#1A1A1A]">
                  +{pack.credits.toLocaleString()} <span className="text-xs font-sans font-normal text-[#1A1A1A]/60">SMS</span>
                </div>
                <div className="text-xs text-[#1A1A1A]/60 mt-0.5">
                  Unit Cost: <span className="font-mono font-bold text-[#1A1A1A]">{pack.pricePerSMS}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                <div>
                  <span className="font-serif text-2xl font-bold text-[#1A1A1A]">${pack.price}</span>
                  <span className="text-[10px] text-emerald-800 font-bold block">{pack.savings}</span>
                </div>

                <button
                  onClick={() => purchaseSMSPack(pack.id)}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Buy Pack
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing & Invoice History Table */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50">
              Accounting
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Billing History & Tax Invoices
            </h3>
          </div>
          <span className="text-xs text-[#1A1A1A]/60 font-mono">
            {invoices.length} Itemized Statements
          </span>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#1A1A1A]/12 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1A1A1A]/10 bg-[#FAF9F6] text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-bold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/5">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#1A1A1A]/50">
                      No invoices recorded yet for this school tenant.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F4F1ED]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1A1A1A]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#1A1A1A]/70">
                        {inv.date}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#1A1A1A]">
                        {inv.description}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#1A1A1A]">
                        ${inv.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#1A1A1A]/70">
                        {inv.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <Check className="w-2.5 h-2.5" /> {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceForModal(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F4F1ED] hover:bg-[#1A1A1A] hover:text-white transition-colors text-[11px] font-semibold text-[#1A1A1A] cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice PDF Preview Modal */}
      {selectedInvoiceForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#1A1A1A]/20 p-6 space-y-6 animate-in zoom-in-95 duration-150 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-900">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    Tax Invoice Receipt
                  </h4>
                  <div className="text-[11px] font-mono text-[#1A1A1A]/60">
                    {selectedInvoiceForModal.invoiceNumber}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceForModal(null)}
                className="text-gray-400 hover:text-black font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Receipt Body */}
            <div className="bg-[#FAF9F6] p-5 rounded-xl border border-[#1A1A1A]/10 space-y-4 text-xs font-mono">
              <div className="flex justify-between items-start border-b border-[#1A1A1A]/10 pb-3">
                <div>
                  <div className="font-bold text-sm font-serif text-[#1A1A1A]">Sentinel EdTech SaaS</div>
                  <div className="text-[10px] text-[#1A1A1A]/60">Tax ID: US-948201948</div>
                  <div className="text-[10px] text-[#1A1A1A]/60">500 Technology Way, Boston, MA</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#1A1A1A]">Billed To:</div>
                  <div className="font-semibold text-amber-950">{currentSchool.name}</div>
                  <div className="text-[10px] text-[#1A1A1A]/60">{currentSchool.adminEmail}</div>
                </div>
              </div>

              <div className="space-y-2 py-2">
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Item Description:</span>
                  <span className="font-bold text-[#1A1A1A] text-right">{selectedInvoiceForModal.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Billing Date:</span>
                  <span>{selectedInvoiceForModal.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Payment Method:</span>
                  <span>{selectedInvoiceForModal.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Status:</span>
                  <span className="text-emerald-800 font-bold uppercase">PAID (CONFIRMED)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-between items-center text-sm font-bold">
                <span>Total Amount Paid:</span>
                <span className="font-serif text-xl font-bold text-[#1A1A1A]">
                  ${selectedInvoiceForModal.amount.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  addToast({
                    title: 'Receipt Downloaded',
                    message: `Downloaded PDF for ${selectedInvoiceForModal.invoiceNumber}.`,
                    type: 'success',
                  });
                  setSelectedInvoiceForModal(null);
                }}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Card Modal */}
      {isUpdateCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#1A1A1A]/20 p-6 space-y-5 animate-in zoom-in-95 duration-150 font-sans">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1A1A1A]" />
                <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Update Payment Method
                </h4>
              </div>
              <button
                onClick={() => setIsUpdateCardModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCardSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                  Card Brand:
                </label>
                <select
                  value={newCardBrand}
                  onChange={(e) => setNewCardBrand(e.target.value)}
                  className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-medium"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                  Card Number:
                </label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                    Exp Date (MM/YY):
                  </label>
                  <input
                    type="text"
                    placeholder="08/29"
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(e.target.value)}
                    maxLength={5}
                    className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                    CVC Security:
                  </label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={newCardCvc}
                    onChange={(e) => setNewCardCvc(e.target.value)}
                    maxLength={4}
                    className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateCardModalOpen(false)}
                  className="px-4 py-2 bg-[#F4F1ED] hover:bg-[#E8E4DF] text-[#1A1A1A] text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
