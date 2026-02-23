import Link from 'next/link';
import { ArrowRight, Network, BrainCircuit, Activity, BookOpenCheck, ShieldAlert } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-28 lg:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sky/20 text-brand-navy text-sm font-semibold tracking-wide mb-8 border border-brand-sky/40 shadow-sm">
          <BrainCircuit className="w-4 h-4" />
          Lilly Foundation Convening
        </div>
        <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-brand-navy tracking-tight leading-tight mb-6">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-sage">Insight Engine</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium text-slate-600 mb-8 max-w-3xl leading-relaxed">
          An AI Partner-Matching Dashboard for Indiana. Bridging the "Productivity Tax" gap by connecting higher education output with strategic employer needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-sage hover:from-brand-teal/90 hover:to-brand-sage/90 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
            Explore the Ecosystem Map
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/explore" className="px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-sage hover:from-brand-teal/90 hover:to-brand-sage/90 text-white border-2 border-brand-teal rounded-lg font-bold text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group">
            Imagine a Connection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* The Mandate */}
      <section className="px-6 py-16 bg-brand-navy border-y border-brand-navy/90">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading font-bold text-brand-sky mb-4">The AI Mandate: Beyond Automation</h2>
            <p className="text-brand-sky/90 text-lg leading-relaxed mb-6">
              71% of organizations are stranded in "pilot purgatory" because they are bolting AI onto broken workflows. For higher education, simply purchasing a generic Copilot license is fundamentally negative if the pedagogy remains static.
            </p>
            <p className="text-brand-sky/90 text-lg leading-relaxed">
              When we focus on teaching students mere efficiency, we graduate them into the <strong className="text-white">Productivity Tax</strong>. We must stop assessing the polished product and start scaffolding the iteration itself. This tool is designed to identify the strategic partnerships across Indiana that will actively build these systemic workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 p-6 rounded-xl border border-white/20 shadow-sm">
              <ShieldAlert className="w-8 h-8 text-brand-gold mb-4" />
              <h3 className="font-heading font-bold text-white mb-2">The Threat</h3>
              <p className="text-sm text-brand-sky/90">Bolting AI outside the curriculum as a "cheat code" produces vulnerable, unverified output.</p>
            </div>
            <div className="bg-brand-sky/20 p-6 rounded-xl border border-brand-sky/30 shadow-sm">
              <Network className="w-8 h-8 text-brand-sage mb-4" />
              <h3 className="font-heading font-bold text-white mb-2">The Solution</h3>
              <p className="text-sm text-brand-sky/90">Driving AI under the curriculum to evaluate, manage, and verify integrated enterprise knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology & Math */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-brand-navy mb-4">Deterministic AI Intelligence</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            This dashboard does not artificially inflate matches. The algorithmic mapping relies entirely on objective metadata and strict O*NET skill overlaps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-sky/20 text-brand-teal rounded-xl flex items-center justify-center mb-6">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-brand-navy mb-3">Evaluative Judgement</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Direct alignment is forged by matching an institution's curriculum mapping against regional hiring needs utilizing Bureau of Labor Statistics O*NET KSA structures.
            </p>
            <div className="text-xs font-semibold text-brand-teal uppercase tracking-wide">Primary Alignment Metric</div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-sage/20 text-brand-sage rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-brand-navy mb-3">Ecosystem & Scale</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              The Insight Engine explicitly values "Phase 5 Ecosystem Integration". Purdue and IU receive strict Carnegie R1 and high-volume talent bonuses to balance massive enterprise output requirements.
            </p>
            <div className="text-xs font-semibold text-brand-sage uppercase tracking-wide">Enterprise Scaling Bonus</div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-xl flex items-center justify-center mb-6">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-brand-navy mb-3">Connective Labor Counterweight</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              To defend against the "Connective Labor Deficit", Liberal Arts and Humanities frameworks receive powerful bonuses for navigating ambiguity, critical thinking, and ethical AI stewardship.
            </p>
            <div className="text-xs font-semibold text-brand-gold uppercase tracking-wide">Human Analytics Metric</div>
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <section className="bg-brand-navy text-white px-6 py-20 text-center border-t border-brand-navy/90">
        <h2 className="text-3xl font-heading font-bold text-brand-sky mb-6">Ready to see the ecosystem?</h2>
        <p className="text-brand-sky/90 text-lg mb-8 max-w-2xl mx-auto">
          Our AI engine is scanning 34 Indiana institutions against 249 high-impact employers, executing thousands of deterministic calculations to uncover hidden workflow synergies.
        </p>
        <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-sage hover:from-brand-teal/90 hover:to-brand-sage/90 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
          Launch Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

    </div>
  );
}
