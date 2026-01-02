import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CustomerPortal from './components/CustomerPortal';
import StaffPortal from './components/StaffPortal';
import AIChat from './components/AIChat';
import { Leaf, Users, LayoutDashboard, ChevronRight } from 'lucide-react';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-emerald-100 text-emerald-800 font-medium' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Leaf size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">EcoSave</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" icon={<LayoutDashboard size={18} />} label="Home" />
            <NavLink to="/customer" icon={<Leaf size={18} />} label="Klant Advies" />
            <NavLink to="/staff" icon={<Users size={18} />} label="Sales Portal" />
          </nav>

          <div className="md:hidden">
             {/* Mobile menu could go here, omitting for brevity */}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>

      <AIChat />
    </div>
  );
};

const LandingPage = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-8 animate-fade-in">
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
        Slimmer omgaan met <span className="text-emerald-600">Energie</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600">
        Het alles-in-één platform voor persoonlijk besparingsadvies en professionele woningopnames.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-12">
      <Link to="/customer" className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 text-left">
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
          <ChevronRight size={32} />
        </div>
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
          <Leaf size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ik ben een Klant</h2>
        <p className="text-slate-500">
          Bereken direct hoeveel u kunt besparen op uw energierekening met onze AI-gedreven analyse.
        </p>
      </Link>

      <Link to="/staff" className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-left">
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
          <ChevronRight size={32} />
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
          <Users size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ik ben Personeel</h2>
        <p className="text-slate-500">
          Beheer leads, voer woningopnames uit en laat Gemini AI rapportages genereren voor sales.
        </p>
      </Link>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer" element={<CustomerPortal />} />
          <Route path="/staff" element={<StaffPortal />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
