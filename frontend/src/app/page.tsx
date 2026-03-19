import Link from 'next/link';
import { ArrowRight, Globe, Activity, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1">

      {/* Hero — full teal background */}
      <section className="page-teal flex flex-col items-center justify-center text-center px-6 py-24">
        {/* Shapes */}
        <div className="shape shape-circle-lg" style={{ top: '-60px', left: '-100px' }}></div>
        <div className="shape shape-circle-sm" style={{ top: '30px', right: '80px' }}></div>
        <div className="shape shape-circle-md" style={{ bottom: '-30px', right: '20%' }}></div>
        <div className="shape-tri" style={{ bottom: '0px', left: '10%', transform: 'rotate(10deg)' }}></div>
        <div className="shape-tri" style={{ bottom: '-20px', right: '-40px', transform: 'rotate(-20deg)' }}></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-5">
            Real Traffic.<br />Real Growth.
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Earn credits by discovering new websites. Spend them to send thousands of verified visitors to yours — instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#3d9e97] font-bold text-sm rounded hover:bg-gray-50 transition-colors">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/50 text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50,000+', label: 'Members' },
            { value: '12M+', label: 'Visits Delivered' },
            { value: '500K+', label: 'Credits Earned Daily' },
            { value: '99.9%', label: 'Uptime' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-[#3d9e97]">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="page-teal py-20 px-6">
        {/* subtle extra shapes */}
        <div className="shape shape-circle-lg" style={{ bottom: '-80px', right: '-80px' }}></div>
        <div className="shape shape-circle-sm" style={{ top: '40px', left: '5%' }}></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-white/70 max-w-lg mx-auto">Three simple steps to start driving real traffic to your website.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Globe, step: '01', title: 'Add Your Website', desc: 'Register your URL in seconds. Set your target audience by country & device type.' },
              { icon: Activity, step: '02', title: 'Surf & Earn Credits', desc: "Use our autosurf module to browse members' sites. Each 15-second verified view earns credits." },
              { icon: Zap, step: '03', title: 'Boost Your Traffic', desc: 'Spend credits to push visitors to your site instantly, or buy priority traffic packages.' },
            ].map(item => (
              <div key={item.title} className="card-float p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#6dc8c2]/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#3d9e97]" />
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-200">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Built on Trust & Security</h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">Every view is verified. Every credit is backed by real engagement.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Shield, title: 'Anti-Fraud Protection', desc: 'Redis session locks, CAPTCHA challenges, and IP tracking prevent bots and abuse.' },
              { icon: Activity, title: 'Real-Time Credit Ledger', desc: 'ACID-compliant transactions update your balance instantly after every verified surf session.' },
              { icon: Zap, title: 'Fast Campaign Delivery', desc: 'Express campaigns are queued via Redis and delivered within minutes of activation.' },
              { icon: Globe, title: 'Global Network', desc: 'Members from 150+ countries surfing around the clock ensure 24/7 traffic availability.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4 p-5 border border-gray-100 rounded-lg hover:border-[#6dc8c2]/40 transition-colors">
                <div className="w-9 h-9 shrink-0 rounded-full bg-[#6dc8c2]/15 flex items-center justify-center mt-0.5">
                  <f.icon className="w-4 h-4 text-[#3d9e97]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-teal py-16 px-6 text-center">
        <div className="shape shape-circle-sm" style={{ top: '-20px', left: '10%' }}></div>
        <div className="shape shape-circle-lg" style={{ bottom: '-80px', right: '-60px' }}></div>
        <div className="relative z-10 max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to grow your audience?</h2>
          <p className="text-white/75 mb-8 text-sm">Create your free account now and earn your first credits in under 2 minutes.</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#3d9e97] font-bold text-sm rounded hover:bg-gray-50 transition-colors">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}
