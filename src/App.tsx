import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewCase from './pages/NewCase';
import Results from './pages/Results';
import ReportEditor from './pages/ReportEditor';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/cases/new', label: 'Nuovo caso' },
  { to: '/results', label: 'Risultati' },
  { to: '/report', label: 'Report editor' }
];

function App() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="hidden min-h-screen w-60 flex-col border-r border-slate-800 bg-slate-900/60 p-6 md:flex">
        <div className="mb-10 text-2xl font-semibold text-brand-400">Ghigus</div>
        <nav className="flex flex-1 flex-col gap-2 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-medium transition-colors hover:bg-slate-800/80 ${
                  isActive ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto text-xs text-slate-500">Analytics cockpit v1.0</p>
      </aside>
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 shadow-sm">
          <span>Benvenuto in Ghigus Analytics</span>
          <span className="rounded-full bg-brand-600/20 px-3 py-1 text-brand-200">Beta</span>
        </header>
        <div className="p-4 sm:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases/new" element={<NewCase />} />
            <Route path="/results" element={<Results />} />
            <Route path="/report" element={<ReportEditor />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
