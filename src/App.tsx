import { useState } from "react";
import {
  Boxes, Users, Truck, ReceiptText, Wallet, ChartNoAxesCombined,
  Plus, Search, Menu, Bell, Package, ArrowDownToLine
} from "lucide-react";

type ModuleKey = "Dashboard" | "Products & Stock" | "Billing" | "Customers" | "Suppliers" | "Payments" | "Expenses" | "Reports";

const modules: { name: ModuleKey; icon: typeof Boxes; hint: string }[] = [
  { name: "Products & Stock", icon: Boxes, hint: "Manage items and inventory" },
  { name: "Billing", icon: ReceiptText, hint: "Create invoices and sales" },
  { name: "Customers", icon: Users, hint: "Customer ledger and balances" },
  { name: "Suppliers", icon: Truck, hint: "Supplier accounts and purchases" },
  { name: "Payments", icon: Wallet, hint: "Record received and paid amounts" },
  { name: "Expenses", icon: ArrowDownToLine, hint: "Track business expenses" },
  { name: "Reports", icon: ChartNoAxesCombined, hint: "Review business performance" }
];

export default function App() {
  const [active, setActive] = useState<ModuleKey>("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="brand"><div className="brand-mark">N</div><div><strong>NEXORA</strong><small>WHOLESALE MANAGER</small></div></div>
        <div className="nav-label">WORKSPACE</div>
        <button className={active === "Dashboard" ? "nav-item selected" : "nav-item"} onClick={() => setActive("Dashboard")}><ChartNoAxesCombined size={18}/>Dashboard</button>
        {modules.map(({ name, icon: Icon }) => <button key={name} className={active === name ? "nav-item selected" : "nav-item"} onClick={() => { setActive(name); setMenuOpen(false); }}><Icon size={18}/>{name}</button>)}
        <div className="sidebar-foot"><span className="status-dot"/> Offline-ready workspace</div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu/></button>
          <div className="breadcrumb">Workspace <span>/</span> {active}</div>
          <div className="top-actions"><span className="offline-pill"><span className="status-dot"/> Offline mode</span><button className="icon-button" aria-label="Notifications"><Bell size={19}/></button><div className="avatar">A</div></div>
        </header>

        <section className="page-content">
          <div className="welcome-row"><div><p className="eyebrow">BUSINESS OVERVIEW</p><h1>{active === "Dashboard" ? "Good morning" : active}</h1><p className="muted">{active === "Dashboard" ? "Here’s what’s happening with your wholesale business today." : modules.find(m => m.name === active)?.hint}</p></div><button className="primary-button" onClick={() => setActive("Billing")}><Plus size={18}/> Create new bill</button></div>

          {active === "Dashboard" ? <>
            <div className="stats-grid">
              <article className="stat-card"><span className="stat-icon blue"><Wallet/></span><p>Total Sales</p><strong>₹0.00</strong><small>For this month</small></article>
              <article className="stat-card"><span className="stat-icon green"><ChartNoAxesCombined/></span><p>Amount Received</p><strong>₹0.00</strong><small>Payments collected</small></article>
              <article className="stat-card"><span className="stat-icon orange"><Users/></span><p>Customer Due</p><strong>₹0.00</strong><small>Outstanding balance</small></article>
              <article className="stat-card"><span className="stat-icon violet"><Package/></span><p>Stock Items</p><strong>0</strong><small>Products in inventory</small></article>
            </div>
            <div className="section-heading"><div><h2>Quick actions</h2><p className="muted">Common tasks for your business</p></div></div>
            <div className="quick-grid">{modules.slice(0, 6).map(({ name, icon: Icon, hint }) => <button className="quick-card" key={name} onClick={() => setActive(name)}><span className="quick-icon"><Icon size={21}/></span><strong>{name}</strong><small>{hint}</small></button>)}</div>
            <div className="bottom-grid"><section className="panel"><div className="panel-head"><div><h2>Recent transactions</h2><p className="muted">Your latest business activity</p></div><button className="text-button" onClick={() => setActive("Reports")}>View reports</button></div><div className="empty-state"><div className="empty-icon"><ReceiptText/></div><strong>No transactions yet</strong><p>Your sales and payments will appear here.</p><button className="secondary-button" onClick={() => setActive("Billing")}><Plus size={16}/> Create first bill</button></div></section><section className="panel"><div className="panel-head"><div><h2>Getting started</h2><p className="muted">Set up your workspace</p></div></div><div className="setup-list"><div><span>1</span><p><strong>Add products</strong><small>Create your product catalogue</small></p></div><div><span>2</span><p><strong>Add customers</strong><small>Keep customer balances organised</small></p></div><div><span>3</span><p><strong>Create your first bill</strong><small>Start recording sales</small></p></div></div></section></div>
          </> : <section className="panel module-placeholder"><div className="empty-icon"><Search/></div><h2>{active} workspace</h2><p className="muted">This section is being prepared. Your existing billing workflow will be preserved as features are added.</p><button className="secondary-button" onClick={() => setActive("Dashboard")}>Back to dashboard</button></section>}
          <footer>© 2026 Nexora Wholesale Business Manager <span>Designed for simple, reliable business management.</span></footer>
        </section>
      </main>
    </div>
  );
}