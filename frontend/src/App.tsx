import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Factory,
  Leaf,
  MapPin,
  PackageCheck,
  Recycle,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import type { RecommendationResult, WasteInput } from './types';

const wasteOptions = [
  'Cotton Waste',
  'Plastic Scraps',
  'Cardboard',
  'Metal Scrap',
  'Wood Waste',
  'Used Oil',
  'Textile Offcuts',
  'Glass Cullets',
];

const defaultInput: WasteInput = {
  wasteType: 'Cotton Waste',
  quantity: 500,
  purity: 90,
  moisture: 12,
  contamination: 15,
  marketDemand: 80,
  transportDistance: 45,
  buyerAvailability: 70,
};

const mockResults: RecommendationResult[] = [
  {
    pathway: 'recycle',
    buyer: 'GreenTex Recycling',
    revenue: 8500,
    transportCost: 1800,
    processingCost: 700,
    netProfit: 6000,
    co2Saved: 1.2,
    confidence: 92,
  },
  {
    pathway: 'reuse',
    buyer: 'EcoFabric Circuit',
    revenue: 6200,
    transportCost: 1200,
    processingCost: 550,
    netProfit: 4450,
    co2Saved: 0.9,
    confidence: 88,
  },
  {
    pathway: 'recovery',
    buyer: 'Thermal Energy Recovery',
    revenue: 5100,
    transportCost: 1500,
    processingCost: 900,
    netProfit: 2700,
    co2Saved: 1.5,
    confidence: 84,
  },
];

function App() {
  const [form, setForm] = useState<WasteInput>(defaultInput);
  const [result, setResult] = useState<RecommendationResult>(mockResults[0]);
  const [loading, setLoading] = useState(false);

  const summary = useMemo(() => {
    const score =
      form.purity * 0.35 +
      form.marketDemand * 0.25 +
      (100 - form.contamination) * 0.2 +
      form.buyerAvailability * 0.2;

    return {
      score: Math.min(100, Math.max(0, score)),
      efficient: score > 70 ? 'Highly viable' : score > 55 ? 'Moderately viable' : 'Needs optimization',
    };
  }, [form]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      const fallback = mockResults.find((item) => item.pathway === (summary.score > 70 ? 'recycle' : 'reuse')) ?? mockResults[0];
      setResult({ ...fallback, confidence: Math.round(summary.score) });
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof WasteInput>(key: K, value: WasteInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40">
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Industrial Waste AI</p>
              <h1 className="text-xl font-bold">ReLoop AI</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#dashboard" className="hover:text-white">Dashboard</a>
            <a href="#analysis" className="hover:text-white">Analysis</a>
            <a href="#insights" className="hover:text-white">Insights</a>
          </nav>
          <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Launch Engine
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-soft card-glow">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Waste Evaluation</p>
                <h2 className="mt-2 text-3xl font-semibold">Operational decision engine</h2>
              </div>
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Live model
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Waste Type</span>
                  <select
                    value={form.wasteType}
                    onChange={(e) => updateField('wasteType', e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 transition focus:border-emerald-400"
                  >
                    {wasteOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Quantity (kg)</span>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => updateField('quantity', Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Purity (%)</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.purity}
                    onChange={(e) => updateField('purity', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="mt-2 block text-sm text-emerald-300">{form.purity}%</span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Moisture (%)</span>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={form.moisture}
                    onChange={(e) => updateField('moisture', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="mt-2 block text-sm text-emerald-300">{form.moisture}%</span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Contamination (%)</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.contamination}
                    onChange={(e) => updateField('contamination', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="mt-2 block text-sm text-emerald-300">{form.contamination}%</span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Market demand</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.marketDemand}
                    onChange={(e) => updateField('marketDemand', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="mt-2 block text-sm text-emerald-300">{form.marketDemand}/100</span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Transport distance (km)</span>
                  <input
                    type="number"
                    value={form.transportDistance}
                    onChange={(e) => updateField('transportDistance', Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Buyer availability</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.buyerAvailability}
                    onChange={(e) => updateField('buyerAvailability', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="mt-2 block text-sm text-emerald-300">{form.buyerAvailability}/100</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
                <div className="text-sm text-slate-400">
                  Score: <span className="font-semibold text-emerald-300">{summary.score.toFixed(0)}/100</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Analyzing...' : 'Generate Recommendation'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          <aside id="dashboard" className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-300">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Circularity index</p>
                  <h3 className="text-3xl font-bold text-white">{summary.score.toFixed(0)}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">{summary.efficient}</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-300">AI Recommendation</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4">
                  <span className="text-slate-400">Best buyer</span>
                  <span className="font-semibold text-white">{result.buyer}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4">
                  <span className="text-slate-400">Pathway</span>
                  <span className="font-semibold capitalize text-emerald-300">{result.pathway}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4">
                  <span className="text-slate-400">Net profit</span>
                  <span className="font-semibold text-white">₹{result.netProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section id="analysis" className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <PackageCheck className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Material Value</h3>
            </div>
            <p className="text-3xl font-bold text-white">₹{result.revenue.toLocaleString('en-IN')}</p>
            <p className="mt-2 text-sm text-slate-400">Expected revenue potential</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Truck className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">Logistics</h3>
            </div>
            <p className="text-3xl font-bold text-white">₹{result.transportCost.toLocaleString('en-IN')}</p>
            <p className="mt-2 text-sm text-slate-400">Estimated pickup and transport</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <h3 className="text-lg font-semibold">CO₂ Saved</h3>
            </div>
            <p className="text-3xl font-bold text-white">{result.co2Saved.toFixed(1)} t</p>
            <p className="mt-2 text-sm text-slate-400">Emission reduction potential</p>
          </div>
        </section>

        <section id="insights" className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-emerald-300" />
              <h3 className="text-xl font-semibold">Decision breakdown</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-3">
                <span>Revenue</span>
                <span className="font-semibold text-white">₹{result.revenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-3">
                <span>Processing</span>
                <span className="font-semibold text-white">₹{result.processingCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-3">
                <span>Transport</span>
                <span className="font-semibold text-white">₹{result.transportCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-3">
                <span>Confidence</span>
                <span className="font-semibold text-emerald-300">{result.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Factory className="h-5 w-5 text-emerald-300" />
              <h3 className="text-xl font-semibold">EcoLink AI logistics</h3>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4">
              <div className="mb-4 flex items-center gap-3 text-slate-300">
                <MapPin className="h-4 w-4 text-emerald-300" />
                <span>Shared pickup fleet optimization</span>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between"><span>Factory A</span><span>300 kg</span></div>
                <div className="flex justify-between"><span>Factory B</span><span>250 kg</span></div>
                <div className="flex justify-between"><span>Factory C</span><span>200 kg</span></div>
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">
                  Combined route reduces transport cost by 18%.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
