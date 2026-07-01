import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from './supabaseClient';
import logo from './assets/logo.png';
import './Invoice.css';

const today = new Date().toLocaleDateString('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
});

export default function Invoice({ formData, onDownloadRef, onCopyRef }) {
  const paperRef              = useRef(null);
  const [copying, setCopying]     = useState(false);
  const [copyDone, setCopyDone]   = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState(null);

  const items      = formData.items || [];
  const delivery   = Number(formData.deliveryCharge) || 0;
  const itemsTotal = items.reduce((s, it) =>
    s + Number(it.quantity) * Number(it.unitPrice || 0), 0);
  const grandTotal = itemsTotal + delivery;

  const advancePct    = Math.min(100, Math.max(0, Number(formData.advancePercent) || 0));
  const advanceAmount = Math.round(itemsTotal * advancePct / 100);
  const dueAmount     = grandTotal - advanceAmount;
  const hasAdvance    = advancePct > 0 && advancePct < 100;
  const isFullAdvance = advancePct === 100;

  const productSummary = items
    .map(it => `${it.productName} x${it.quantity}`)
    .join(', ');

  useEffect(() => {
    const saveInvoice = async () => {
      const { error } = await supabase.from('invoices').insert([{
        invoice_no:      formData.invoiceNo,
        customer_name:   formData.name,
        address:         formData.address,
        phone:           formData.phone,
        product_name:    productSummary,
        quantity:        items.reduce((s, it) => s + Number(it.quantity), 0),
        unit_price:      itemsTotal,
        delivery_charge: delivery,
        total:           grandTotal,
        date:            today,
        items_json:      JSON.stringify(items),
      }]);

      if (error) {
        console.error('Supabase save error:', error);
        setSaveError('Could not save invoice.');
      } else {
        setSaved(true);
      }
    };
    saveInvoice();
  }, []);

  const getCanvas = () =>
    html2canvas(paperRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#fdffeb',
    });

  const handleDownload = async () => {
    const canvas = await getCanvas();
    const link   = document.createElement('a');
    link.href     = canvas.toDataURL('image/png');
    link.download = `invoice_${formData.invoiceNo || 'draft'}.png`;
    link.click();
  };

  const handleCopy = async () => {
    try {
      setCopying(true);
      const canvas = await getCanvas();
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopying(false);
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), 2000);
      }, 'image/png');
    } catch (err) {
      setCopying(false);
      console.error('Copy failed:', err);
    }
  };

  const handleCSV = () => {
    const rows = [
      ['Invoice No.', 'Date', 'Customer', 'Phone', 'Address',
       'Products', 'Items Total', 'Delivery', 'Grand Total', 'Advance %', 'Advance Amt', 'Due (COD)'],
      [
        formData.invoiceNo, today, formData.name, formData.phone,
        `"${formData.address}"`, `"${productSummary}"`,
        itemsTotal, delivery, grandTotal, advancePct, advanceAmount, dueAmount,
      ],
    ];
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `invoice_${formData.invoiceNo || 'draft'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (onDownloadRef) onDownloadRef.current = handleDownload;
  if (onCopyRef)     onCopyRef.current     = handleCopy;

  return (
    <div className="inv-wrapper">

      {saved && (
        <div style={{
          textAlign: 'center', fontSize: '12px', color: '#4caf50',
          marginBottom: '6px', letterSpacing: '0.05em',
        }}>
          ✓ Invoice saved to database
        </div>
      )}
      {saveError && (
        <div style={{
          textAlign: 'center', fontSize: '12px', color: '#f44336',
          marginBottom: '6px',
        }}>
          ⚠ {saveError}
        </div>
      )}

      <div className="inv-actions">
        <button className="inv-copy-btn" onClick={handleCopy} disabled={copying}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {copying ? 'Copying…' : copyDone ? '✓ Copied!' : 'Copy Image'}
        </button>
        <button className="inv-csv-btn" onClick={handleCSV}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Download CSV
        </button>
        <button className="inv-download-btn" onClick={handleDownload}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PNG
        </button>
      </div>

      <div className="inv-paper" ref={paperRef}>
        <div className="inv-header">
          <div className="inv-logo">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="inv-title">INVOICE</div>
        </div>

        <div className="inv-info">
          <div className="inv-billed">
            <span className="inv-billed-label">BILLED TO:</span>
            <div>{formData.name}</div>
            <div>{formData.phone}</div>
            <div className="inv-address">{formData.address}</div>
          </div>
          <div className="inv-meta">
            <div>Invoice No. {formData.invoiceNo}</div>
            <div>{today}</div>
          </div>
        </div>

        <hr className="inv-hr" />

        <table className="inv-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => {
              const lineTotal = Number(it.quantity) * Number(it.unitPrice || 0);
              return (
                <tr key={i}>
                  <td>{it.productName}</td>
                  <td>{it.quantity}</td>
                  <td>{Number(it.unitPrice).toLocaleString()} Tk</td>
                  <td>{lineTotal.toLocaleString()} Tk</td>
                </tr>
              );
            })}
            <tr>
              <td>Delivery Charge</td>
              <td></td>
              <td></td>
              <td>{delivery.toLocaleString()} Tk</td>
            </tr>
          </tbody>
        </table>

        <hr className="inv-hr" />

        <div className="inv-summary">
          <div className="inv-subtotal-row">
            <span>Subtotal</span>
            <span>{itemsTotal.toLocaleString()} Tk</span>
          </div>
          <div className="inv-total-row">
            <span>Total</span>
            <span>{grandTotal.toLocaleString()} Tk</span>
          </div>

          {/* Payment breakdown */}
          {(hasAdvance || isFullAdvance) && (
            <div className="inv-payment-block">
              <div className="inv-payment-row inv-advance-row">
                <div className="inv-payment-label">
                  <span className="inv-payment-dot inv-dot-green" />
                  <span>Advance Paid <span className="inv-pct-badge">{advancePct}%</span></span>
                </div>
                <span>{advanceAmount.toLocaleString()} Tk</span>
              </div>
              {hasAdvance && (
                <div className="inv-payment-row inv-due-row">
                  <div className="inv-payment-label">
                    <span className="inv-payment-dot inv-dot-orange" />
                    <span>Due on Delivery (Delivery Charge Included)<span className="inv-cod-badge"> COD</span></span>
                  </div>
                  <span>{dueAmount.toLocaleString()} Tk</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="inv-thankyou">Thank you for ordering! ❤️</div>
      </div>
    </div>
  );
}