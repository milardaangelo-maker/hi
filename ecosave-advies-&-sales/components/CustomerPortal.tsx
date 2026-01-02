import React, { useState } from 'react';
import { EnergyData, SavingsReport } from '../types';
import { generateCustomerAdvice } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Zap, Euro, Home, Users, ArrowRight, Loader2, Leaf } from 'lucide-react';

const CustomerPortal: React.FC = () => {
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [formData, setFormData] = useState<EnergyData>({
    electricityKwh: 2500,
    gasM3: 1200,
    monthlyCost: 250,
    householdSize: 2,
    propertyType: 'terraced'
  });
  const [report, setReport] = useState<SavingsReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    try {
      const result = await generateCustomerAdvice(formData);
      setReport(result);
      setStep('results');
    } catch (error) {
      console.error(error);
      setStep('form'); // Fallback on error
    }
  };

  const chartData = report ? [
    { name: 'Huidig', kosten: report.currentAnnualCost },
    { name: 'Na Besparing', kosten: report.projectedAnnualCost }
  ] : [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Persoonlijk Besparingsadvies</h1>
        <p className="text-slate-500">Vul uw gegevens in en ontdek hoeveel u kunt besparen.</p>
      </div>

      {step === 'form' && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700 gap-2">
                  <Zap size={16} className="text-yellow-500" /> Stroomverbruik (kWh/jaar)
                </label>
                <input
                  type="number"
                  required
                  value={formData.electricityKwh}
                  onChange={(e) => setFormData({...formData, electricityKwh: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700 gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white">G</div> Gasverbruik (m³/jaar)
                </label>
                <input
                  type="number"
                  required
                  value={formData.gasM3}
                  onChange={(e) => setFormData({...formData, gasM3: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700 gap-2">
                  <Euro size={16} className="text-emerald-600" /> Maandelijks Voorschot
                </label>
                <input
                  type="number"
                  required
                  value={formData.monthlyCost}
                  onChange={(e) => setFormData({...formData, monthlyCost: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700 gap-2">
                  <Users size={16} className="text-blue-500" /> Aantal Personen
                </label>
                <select
                  value={formData.householdSize}
                  onChange={(e) => setFormData({...formData, householdSize: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} persoon{n>1?'en':''}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-slate-700 gap-2">
                  <Home size={16} className="text-purple-500" /> Type Woning
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { val: 'apartment', label: 'Appartement' },
                    { val: 'terraced', label: 'Rijtjeshuis' },
                    { val: 'semi-detached', label: '2-onder-1-kap' },
                    { val: 'detached', label: 'Vrijstaand' },
                  ].map((type) => (
                    <button
                      key={type.val}
                      type="button"
                      onClick={() => setFormData({...formData, propertyType: type.val as any})}
                      className={`py-3 px-2 rounded-lg text-sm font-medium border transition-all ${
                        formData.propertyType === type.val
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Bereken Besparing <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl">
          <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-slate-800">Gegevens Analyseren...</h3>
          <p className="text-slate-500 mt-2">Gemini AI berekent uw mogelijkheden.</p>
        </div>
      )}

      {step === 'results' && report && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Huidige Jaarkosten</p>
              <p className="text-2xl font-bold text-slate-900">€ {report.currentAnnualCost.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
              <p className="text-sm text-emerald-700 mb-1">Potentiële Besparing</p>
              <p className="text-3xl font-bold text-emerald-700">€ {report.potentialSavings.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-emerald-600 mt-1">per jaar</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Terugverdientijd</p>
              <p className="text-2xl font-bold text-slate-900">{report.roiYear} Jaar</p>
              <p className="text-xs text-slate-400 mt-1">geschatte ROI</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold mb-6">Kosten Vergelijking</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `€${val}`} />
                    <Tooltip 
                      formatter={(value: number) => [`€ ${value.toLocaleString()}`, 'Kosten']}
                      cursor={{fill: 'transparent'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="kosten" radius={[4, 4, 0, 0]} barSize={60}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#059669'} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Tips */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Leaf size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold">Advies op Maat</h3>
              </div>
              <ul className="space-y-4">
                {report.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="min-w-[24px] h-6 flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => setStep('form')}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1 mx-auto mt-8"
          >
            Opnieuw Berekenen
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
