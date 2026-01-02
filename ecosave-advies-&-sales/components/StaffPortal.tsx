import React, { useState } from 'react';
import { AuditRecord } from '../types';
import { analyzeAudit } from '../services/geminiService';
import { ClipboardList, Plus, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, User, MapPin } from 'lucide-react';

const StaffPortal: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [audits, setAudits] = useState<AuditRecord[]>([
    {
      id: '1',
      clientName: 'Bakkerij Jansen',
      address: 'Hoofdstraat 12, Amsterdam',
      date: '2023-10-24',
      propertyType: 'Bedrijfspand (MKB)',
      notes: 'Oud pand uit 1980. Enkel glas aan de voorkant. Grote koelinstallaties die 24/7 draaien. Dak is plat en geschikt voor zonnepanelen, ongeveer 80m2.',
      status: 'completed',
    }
  ]);

  const [newAudit, setNewAudit] = useState<Partial<AuditRecord>>({
    clientName: '',
    address: '',
    propertyType: '',
    notes: ''
  });

  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const audit: AuditRecord = {
      id: Date.now().toString(),
      clientName: newAudit.clientName || 'Onbekend',
      address: newAudit.address || '',
      date: new Date().toISOString().split('T')[0],
      propertyType: newAudit.propertyType || 'Woning',
      notes: newAudit.notes || '',
      status: 'pending'
    };
    setAudits([audit, ...audits]);
    setNewAudit({ clientName: '', address: '', propertyType: '', notes: '' });
    setView('list');
  };

  const handleAnalyze = async (audit: AuditRecord) => {
    setAnalyzingId(audit.id);
    try {
      const analysis = await analyzeAudit(audit);
      setAudits(prev => prev.map(a => 
        a.id === audit.id ? { ...a, status: 'analyzed', aiAnalysis: analysis } : a
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales Dashboard</h1>
          <p className="text-slate-500 text-sm">Beheer opnames en analyses</p>
        </div>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} /> Nieuwe Opname
          </button>
        )}
      </div>

      {view === 'create' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Nieuwe Energie Opname</h2>
            <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Klantnaam</label>
              <input
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={newAudit.clientName}
                onChange={e => setNewAudit({...newAudit, clientName: e.target.value})}
                placeholder="bv. Familie de Vries"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
              <input
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={newAudit.address}
                onChange={e => setNewAudit({...newAudit, address: e.target.value})}
                placeholder="Straatnaam 1, Stad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type Object</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={newAudit.propertyType}
                onChange={e => setNewAudit({...newAudit, propertyType: e.target.value})}
              >
                <option value="">Selecteer type...</option>
                <option value="Tussenwoning">Tussenwoning</option>
                <option value="Hoekwoning">Hoekwoning</option>
                <option value="Vrijstaand">Vrijstaand</option>
                <option value="Bedrijfspand">Bedrijfspand</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notities (voor AI Analyse)</label>
              <textarea
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none h-32"
                value={newAudit.notes}
                onChange={e => setNewAudit({...newAudit, notes: e.target.value})}
                placeholder="Beschrijf de huidige situatie: isolatie, glas, verwarming, dakorientatie, specifieke wensen..."
              />
              <p className="text-xs text-slate-400 mt-1">Tip: Wees specifiek over glas, isolatie en installaties voor de beste AI analyse.</p>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium">Annuleren</button>
              <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm">Opslaan</button>
            </div>
          </form>
        </div>
      )}

      {view === 'list' && (
        <div className="grid grid-cols-1 gap-6">
          {audits.map((audit) => (
            <div key={audit.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-1">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">{audit.clientName}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {audit.address}</span>
                        <span className="flex items-center gap-1"><User size={14} /> {audit.propertyType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {audit.status === 'analyzed' ? (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Geanalyseerd
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAnalyze(audit)}
                        disabled={analyzingId === audit.id}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        {analyzingId === audit.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Genereer Analyse
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 mb-4 border border-slate-100">
                  <span className="font-semibold text-slate-700 block mb-1">Notities:</span>
                  {audit.notes}
                </div>

                {audit.aiAnalysis && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-indigo-100 rounded text-indigo-600"><Sparkles size={14} /></div>
                        <h4 className="text-sm font-bold text-slate-800">Gemini Pro Analyse</h4>
                     </div>
                     <div className="prose prose-sm prose-slate max-w-none text-slate-600 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                       <pre className="whitespace-pre-wrap font-sans text-sm">{audit.aiAnalysis}</pre>
                     </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {audits.length === 0 && (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Nog geen opnames gevonden.</p>
                <button onClick={() => setView('create')} className="text-emerald-600 font-medium mt-2 hover:underline">Maak de eerste aan</button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffPortal;
