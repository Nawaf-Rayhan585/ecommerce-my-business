import { useState } from 'react';
import logo from '../assets/logo.png';
import './Navbar.css';

const NAV_LINKS = [
  { id: 'dashboard', label: 'Dashboard',    icon: 'ti-layout-dashboard' },
  { id: 'invoices',  label: 'Invoices',      icon: 'ti-files'            },
  { id: 'customers', label: 'Customer Data', icon: 'ti-users'            },
  { id: 'stats',     label: 'Stats',         icon: 'ti-chart-bar'        },
];

export default function Navbar({
  activePage, onNavigate, onNewInvoice,
  isInvoicePage, onBack, onDownload, onCopy,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nb">

      {/* Brand */}
      <div className="nb-brand">
        <div className="nb-logo-wrap">
          <img src={logo} alt="Logo" className="nb-logo-img" />
        </div>
        <span className="nb-brand-name">
          An Nafi<span className="nb-brand-dot">.Manager</span>
        </span>
      </div>

      {/* Desktop nav links — hidden on invoice page */}
      {!isInvoicePage && (
        <div className="nb-links">
          {NAV_LINKS.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`nb-link${activePage === id ? ' active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              <i className={`ti ${icon}`} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Right side */}
      <div className="nb-right">
        {isInvoicePage ? (
          <>
            <button className="nb-ghost-btn" onClick={onBack}>
              <i className="ti ti-arrow-left" aria-hidden="true" />
              Back
            </button>
            <button className="nb-ghost-btn" onClick={onCopy}>
              <i className="ti ti-copy" aria-hidden="true" />
              Copy
            </button>
            <button className="nb-cta" onClick={onDownload}>
              <i className="ti ti-download" aria-hidden="true" />
              Download PNG
            </button>
          </>
        ) : (
          <>
            <button className="nb-cta" onClick={onNewInvoice}>
              <i className="ti ti-plus" aria-hidden="true" />
              New Invoice
            </button>
            <div className="nb-avatar" aria-label="User menu">
              <i className="ti ti-user" aria-hidden="true" />
            </div>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="nb-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'}`} aria-hidden="true" />
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="nb-drawer">
          {!isInvoicePage && NAV_LINKS.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`nb-drawer-link${activePage === id ? ' active' : ''}`}
              onClick={() => { onNavigate(id); setMenuOpen(false); }}
            >
              <i className={`ti ${icon}`} aria-hidden="true" />
              {label}
            </button>
          ))}
          {isInvoicePage ? (
            <>
              <button className="nb-drawer-link" onClick={() => { onBack(); setMenuOpen(false); }}>
                <i className="ti ti-arrow-left" aria-hidden="true" /> Back
              </button>
              <button className="nb-drawer-link" onClick={() => { onCopy(); setMenuOpen(false); }}>
                <i className="ti ti-copy" aria-hidden="true" /> Copy Image
              </button>
              <button className="nb-drawer-cta" onClick={() => { onDownload(); setMenuOpen(false); }}>
                <i className="ti ti-download" aria-hidden="true" /> Download PNG
              </button>
            </>
          ) : (
            <button className="nb-drawer-cta" onClick={() => { onNewInvoice(); setMenuOpen(false); }}>
              <i className="ti ti-plus" aria-hidden="true" /> New Invoice
            </button>
          )}
        </div>
      )}

    </nav>
  );
}