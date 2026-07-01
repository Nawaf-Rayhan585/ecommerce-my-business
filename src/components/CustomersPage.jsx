import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './CustomersPage.css';

export default function CustomersPage() {
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [deleteId, setDeleteId]   = useState(null);
  const [search, setSearch]       = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setRecords(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const startEdit  = (row) => { setEditingId(row.id); setEditForm({ ...row }); };
  const cancelEdit = ()    => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    const { error } = await supabase
      .from('invoices')
      .update({
        customer_name:   editForm.customer_name,
        address:         editForm.address,
        phone:           editForm.phone,
        product_name:    editForm.product_name,
        delivery_charge: Number(editForm.delivery_charge),
        total:           Number(editForm.total),
      })
      .eq('id', editingId);
    if (!error) { setEditingId(null); fetchRecords(); }
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', deleteId);
    if (!error) { setDeleteId(null); fetchRecords(); }
  };

  const exportCSV = () => {
    const headers = ['Invoice No', 'Customer', 'Address', 'Phone',
                     'Products', 'Delivery', 'Total', 'Date'];
    const rows = filtered.map(r => [
      r.invoice_no, r.customer_name, `"${r.address}"`, r.phone,
      `"${r.product_name}"`, r.delivery_charge, r.total, r.date,
    ]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse items_json safely
  const parseItems = (json) => {
    try { return JSON.parse(json) || []; }
    catch { return null; }
  };

  const filtered = records.filter(r =>
    [r.customer_name, r.invoice_no, r.product_name, r.address]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue  = records.reduce((s, r) => s + Number(r.total), 0);
  const totalInvoices = records.length;

  return (
    <div className="cp-wrapper">

      {/* Header */}
      <div className="cp-header">
        <div>
          <h1 className="cp-title">Customer Data</h1>
          <p className="cp-subtitle">All invoice records from your database</p>
        </div>
        <div className="cp-header-actions">
          <button className="cp-export-btn" onClick={exportCSV}>
            <i className="ti ti-download" aria-hidden="true" /> Export CSV
          </button>
          <button className="cp-refresh-btn" onClick={fetchRecords}>
            <i className="ti ti-refresh" aria-hidden="true" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="cp-stats">
        <div className="cp-stat-card">
          <span className="cp-stat-label">Total Invoices</span>
          <span className="cp-stat-value">{totalInvoices}</span>
        </div>
        <div className="cp-stat-card">
          <span className="cp-stat-label">Total Revenue</span>
          <span className="cp-stat-value">{totalRevenue.toLocaleString()} Tk</span>
        </div>
      </div>

      {/* Search */}
      <div className="cp-search-wrap">
        <i className="ti ti-search cp-search-icon" aria-hidden="true" />
        <input
          className="cp-search"
          placeholder="Search by name, invoice no, product…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="cp-empty">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="cp-empty">No records found.</div>
      ) : (
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Delivery</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row =>
                editingId === row.id ? (
                  <tr key={row.id} className="cp-editing-row">
                    <td><span className="cp-inv-badge">{row.invoice_no}</span></td>
                    <td>
                      <input className="cp-input" value={editForm.customer_name}
                        onChange={e => setEditForm(p => ({ ...p, customer_name: e.target.value }))} />
                    </td>
                    <td>
                      <input className="cp-input" value={editForm.phone}
                        onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
                    </td>
                    <td>
                      <input className="cp-input" value={editForm.product_name}
                        onChange={e => setEditForm(p => ({ ...p, product_name: e.target.value }))} />
                    </td>
                    <td>
                      <input className="cp-input cp-input-sm" type="number"
                        value={editForm.delivery_charge}
                        onChange={e => setEditForm(p => ({ ...p, delivery_charge: e.target.value }))} />
                    </td>
                    <td>
                      <input className="cp-input cp-input-sm" type="number"
                        value={editForm.total}
                        onChange={e => setEditForm(p => ({ ...p, total: e.target.value }))} />
                    </td>
                    <td>{row.date}</td>
                    <td>
                      <div className="cp-actions">
                        <button className="cp-save-btn" onClick={saveEdit}>
                          <i className="ti ti-check" /> Save
                        </button>
                        <button className="cp-cancel-btn" onClick={cancelEdit}>
                          <i className="ti ti-x" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id}>
                    <td><span className="cp-inv-badge">{row.invoice_no}</span></td>
                    <td>
                      <div className="cp-customer-cell">
                        <div className="cp-avatar">
                          {row.customer_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="cp-customer-name">{row.customer_name}</div>
                          <div className="cp-customer-addr">{row.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cp-muted">{row.phone}</td>
                    <td>
                      {/* Show detailed breakdown if items_json exists */}
                      <div className="cp-products-cell">
                        {parseItems(row.items_json)
                          ? parseItems(row.items_json).map((it, i) => {
                              const lineTotal = Number(it.quantity) * Number(it.unitPrice || 0);
                              return (
                                <div key={i} className="cp-product-pill">
                                  <span className="cp-pill-name">{it.productName}</span>
                                  <span className="cp-pill-qty">×{it.quantity}</span>
                                  <span className="cp-pill-price">
                                    {lineTotal.toLocaleString()} Tk
                                  </span>
                                </div>
                              );
                            })
                          : row.product_name?.split(', ').map((p, i) => (
                              <div key={i} className="cp-product-pill">
                                <span className="cp-pill-name">{p}</span>
                              </div>
                            ))
                        }
                      </div>
                    </td>
                    <td className="cp-right">
                      {Number(row.delivery_charge).toLocaleString()} Tk
                    </td>
                    <td className="cp-right cp-total">
                      {Number(row.total).toLocaleString()} Tk
                    </td>
                    <td className="cp-muted">{row.date}</td>
                    <td>
                      <div className="cp-actions">
                        <button className="cp-edit-btn" onClick={() => startEdit(row)}>
                          <i className="ti ti-edit" /> Edit
                        </button>
                        <button className="cp-delete-btn" onClick={() => setDeleteId(row.id)}>
                          <i className="ti ti-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="cp-modal-overlay">
          <div className="cp-modal">
            <div className="cp-modal-icon">
              <i className="ti ti-alert-triangle" />
            </div>
            <h3 className="cp-modal-title">Delete this record?</h3>
            <p className="cp-modal-text">This action cannot be undone.</p>
            <div className="cp-modal-actions">
              <button className="cp-cancel-btn cp-cancel-lg"
                onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="cp-confirm-delete-btn"
                onClick={confirmDelete}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}