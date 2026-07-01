import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './components/DashboardPage';
import FormsPage from './FormsPage';
import Invoice from './Invoice';
import CustomersPage from './components/CustomersPage';
import StatsPage from './components/StatsPage';
import './App.css';

export default function App() {
  const [page, setPage]         = useState('dashboard');
  const [formData, setFormData] = useState(null);
  const downloadRef             = useRef(null);
  const copyRef                 = useRef(null);

  const handleSubmit     = (data) => setFormData(data);
  const handleBack       = () => setFormData(null);
  const handleNewInvoice = () => { setFormData(null); setPage('invoices'); };

  const isInvoicePage = !!formData;

  return (
    <div style={{ minHeight: '100vh', background: '#f4f3ef' }}>
      <Navbar
        activePage={page}
        onNavigate={(p) => { setPage(p); setFormData(null); }}
        onNewInvoice={handleNewInvoice}
        isInvoicePage={isInvoicePage}
        onBack={handleBack}
        onDownload={() => downloadRef.current?.()}
        onCopy={() => copyRef.current?.()}
      />

      {isInvoicePage ? (
        <Invoice
          formData={formData}
          onDownloadRef={downloadRef}
          onCopyRef={copyRef}
        />
      ) : page === 'dashboard' ? (
        <DashboardPage onNewInvoice={handleNewInvoice} />
      ) : page === 'invoices' ? (
        <FormsPage onSubmit={handleSubmit} />
      ) : page === 'customers' ? (
        <CustomersPage />
      ) : page === 'stats' ? (
        <StatsPage />
      ) : null}
    </div>
  );
}