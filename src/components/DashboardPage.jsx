import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './DashboardPage.css';

function getWeeklyDays(records) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const label = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const recs  = records.filter(r => {
      const t = new Date(r.created_at);
      return t >= d && t < next;
    });
    days.push({
      label,
      revenue: recs.reduce((s, r) => s + Number(r.total), 0),
      count:   recs.length,
    });
  }
  return days;
}

function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="db-minichart">
      {data.map((d, i) => (
        <div key={i} className="db-mini-col">
          <div className="db-mini-track">
            <div
              className="db-mini-fill"
              style={{
                height: `${Math.max((d.revenue / max) * 100, d.revenue > 0 ? 5 : 0)}%`,
              }}
            />
          </div>
          <div className="db-mini-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage({ onNewInvoice }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setRecords(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const totalRevenue = records.reduce((s, r) => s + Number(r.total), 0);
  const totalCount   = records.length;
  const avgOrder     = totalCount ? Math.round(totalRevenue / totalCount) : 0;
  const topProduct   = (() => {
    const freq = {};
    records.forEach(r => { freq[r.product_name] = (freq[r.product_name] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  })();

  const weekData   = getWeeklyDays(records);
  const recentRecs = records.slice(0, 6);

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="db-wrapper">

      {/* Top bar */}
      <div className="db-topbar">
        <div>
          <p className="db-eyebrow">{todayLabel}</p>
          <h1 className="db-title">Dashboard</h1>
        </div>
        <button className="db-new-btn" onClick={onNewInvoice}>
          <i className="ti ti-plus" aria-hidden="true" />
          New Invoice
        </button>
      </div>

      {loading ? (
        <div className="db-loading">Loading…</div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="db-kpi-grid">

            <div className="db-kpi-card">
              <div className="db-kpi-top">
                <span className="db-kpi-label">Total Invoices</span>
                <div className="db-kpi-icon db-icon-green">
                  <i className="ti ti-receipt" aria-hidden="true" />
                </div>
              </div>
              <div className="db-kpi-value">{totalCount}</div>
              <div className="db-kpi-sub">all time</div>
            </div>

            <div className="db-kpi-card">
              <div className="db-kpi-top">
                <span className="db-kpi-label">Total Revenue</span>
                <div className="db-kpi-icon db-icon-blue">
                  <i className="ti ti-coin" aria-hidden="true" />
                </div>
              </div>
              <div className="db-kpi-value">{totalRevenue.toLocaleString()} Tk</div>
              <div className="db-kpi-sub">all time</div>
            </div>

            <div className="db-kpi-card">
              <div className="db-kpi-top">
                <span className="db-kpi-label">Avg Order</span>
                <div className="db-kpi-icon db-icon-amber">
                  <i className="ti ti-chart-line" aria-hidden="true" />
                </div>
              </div>
              <div className="db-kpi-value">{avgOrder.toLocaleString()} Tk</div>
              <div className="db-kpi-sub">per invoice</div>
            </div>

            <div className="db-kpi-card">
              <div className="db-kpi-top">
                <span className="db-kpi-label">Top Product</span>
                <div className="db-kpi-icon db-icon-purple">
                  <i className="ti ti-star" aria-hidden="true" />
                </div>
              </div>
              <div className="db-kpi-value db-kpi-value--sm">{topProduct}</div>
              <div className="db-kpi-sub">most ordered</div>
            </div>

          </div>

          {/* Main grid */}
          <div className="db-main-grid">

            {/* Revenue chart */}
            <div className="db-card db-chart-card">
              <div className="db-card-head">
                <div>
                  <div className="db-card-title">Weekly Revenue</div>
                  <div className="db-card-sub">Last 7 days in Taka</div>
                </div>
                <div className="db-chart-total">
                  {weekData.reduce((s, d) => s + d.revenue, 0).toLocaleString()} Tk
                </div>
              </div>
              <MiniBarChart data={weekData} />
            </div>

            {/* Quick actions */}
            <div className="db-card db-actions-card">
              <div className="db-card-title" style={{ marginBottom: '1rem' }}>Quick Actions</div>
              <button className="db-action-row db-action-primary" onClick={onNewInvoice}>
                <div className="db-action-icon db-icon-green">
                  <i className="ti ti-file-plus" aria-hidden="true" />
                </div>
                <div>
                  <div className="db-action-label">Create Invoice</div>
                  <div className="db-action-sub">Generate a new invoice</div>
                </div>
                <i className="ti ti-chevron-right db-action-arrow" aria-hidden="true" />
              </button>
              <button className="db-action-row" onClick={() => window.location.reload()}>
                <div className="db-action-icon db-icon-blue">
                  <i className="ti ti-refresh" aria-hidden="true" />
                </div>
                <div>
                  <div className="db-action-label">Refresh Data</div>
                  <div className="db-action-sub">Sync latest records</div>
                </div>
                <i className="ti ti-chevron-right db-action-arrow" aria-hidden="true" />
              </button>
              <div className="db-action-divider" />
              <div className="db-summary-row">
                <span className="db-summary-label">This week</span>
                <span className="db-summary-val">
                  {weekData.reduce((s, d) => s + d.count, 0)} invoices
                </span>
              </div>
              <div className="db-summary-row">
                <span className="db-summary-label">This week revenue</span>
                <span className="db-summary-val">
                  {weekData.reduce((s, d) => s + d.revenue, 0).toLocaleString()} Tk
                </span>
              </div>
            </div>

          </div>

          {/* Recent invoices */}
          <div className="db-card db-recent-card">
            <div className="db-card-head">
              <div>
                <div className="db-card-title">Recent Invoices</div>
                <div className="db-card-sub">Latest {recentRecs.length} records</div>
              </div>
            </div>

            {recentRecs.length === 0 ? (
              <div className="db-empty">No invoices yet. Create your first one!</div>
            ) : (
              <>
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Invoice No.</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Date</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRecs.map(r => (
                        <tr key={r.id}>
                          <td>
                            <span className="db-inv-badge">{r.invoice_no}</span>
                          </td>
                          <td>
                            <div className="db-cust-cell">
                              <div className="db-avatar">
                                {r.customer_name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="db-cust-name">{r.customer_name}</div>
                                <div className="db-cust-phone">{r.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="db-muted">{r.product_name}</td>
                          <td className="db-muted">{r.date}</td>
                          <td className="db-total">
                            {Number(r.total).toLocaleString()} Tk
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

        </>
      )}
    </div>
  );
}