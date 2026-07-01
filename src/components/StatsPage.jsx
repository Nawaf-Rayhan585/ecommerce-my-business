import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './StatsPage.css';

const now = new Date();

function getRange(period) {
  const start = new Date();
  if (period === 'week')  { start.setDate(now.getDate() - 6); }
  if (period === 'month') { start.setDate(1); }
  if (period === 'year')  { start.setMonth(0, 1); }
  start.setHours(0, 0, 0, 0);
  return start;
}

function filterByPeriod(records, period) {
  const start = getRange(period);
  return records.filter(r => new Date(r.created_at) >= start);
}

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
      count:   recs.length,
      revenue: recs.reduce((s, r) => s + Number(r.total), 0),
    });
  }
  return days;
}

function getMonthlyWeeks(records) {
  const weeks  = [];
  const year   = now.getFullYear();
  const month  = now.getMonth();
  let cursor   = new Date(year, month, 1);
  let wk       = 1;
  while (cursor.getMonth() === month) {
    const start = new Date(cursor);
    const end   = new Date(cursor);
    end.setDate(end.getDate() + 7);
    const recs  = records.filter(r => {
      const t = new Date(r.created_at);
      return t >= start && t < end && t.getMonth() === month;
    });
    weeks.push({
      label:   `Wk ${wk}`,
      count:   recs.length,
      revenue: recs.reduce((s, r) => s + Number(r.total), 0),
    });
    cursor.setDate(cursor.getDate() + 7);
    wk++;
  }
  return weeks;
}

function getYearlyMonths(records) {
  const months = [];
  for (let m = 0; m < 12; m++) {
    const recs = records.filter(r => {
      const t = new Date(r.created_at);
      return t.getFullYear() === now.getFullYear() && t.getMonth() === m;
    });
    months.push({
      label:   new Date(now.getFullYear(), m, 1)
                 .toLocaleDateString('en-GB', { month: 'short' }),
      count:   recs.length,
      revenue: recs.reduce((s, r) => s + Number(r.total), 0),
    });
  }
  return months;
}

function BarChart({ data, valueKey, color, unit }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="sp-chart">
      {data.map((d, i) => (
        <div key={i} className="sp-bar-col">
          <div className="sp-bar-val">
            {unit === 'Tk'
              ? d[valueKey] >= 1000
                ? `${(d[valueKey] / 1000).toFixed(1)}k`
                : d[valueKey]
              : d[valueKey]}
          </div>
          <div className="sp-bar-track">
            <div
              className="sp-bar-fill"
              style={{
                height: `${Math.max(
                  (d[valueKey] / max) * 100,
                  d[valueKey] > 0 ? 4 : 0
                )}%`,
                background: color,
              }}
            />
          </div>
          <div className="sp-bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState('week');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error) setRecords(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const filtered     = filterByPeriod(records, period);
  const totalRevenue = filtered.reduce((s, r) => s + Number(r.total), 0);
  const totalCount   = filtered.length;
  const avgOrder     = totalCount ? Math.round(totalRevenue / totalCount) : 0;
  const topProduct   = (() => {
    const freq = {};
    filtered.forEach(r => {
      freq[r.product_name] = (freq[r.product_name] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  })();

  const chartData =
    period === 'week'  ? getWeeklyDays(records)   :
    period === 'month' ? getMonthlyWeeks(records)  :
                         getYearlyMonths(records);

  const periodLabel =
    period === 'week'  ? 'Last 7 days' :
    period === 'month' ? 'This month'  : 'This year';

  return (
    <div className="sp-wrapper">

      {/* Header */}
      <div className="sp-header">
        <div>
          <p className="sp-eyebrow">Analytics</p>
          <h1 className="sp-title">Sales <strong>Statistics</strong></h1>
        </div>
        <div className="sp-toggle">
          {['week', 'month', 'year'].map(p => (
            <button
              key={p}
              className={`sp-toggle-btn${period === p ? ' active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'Year'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="sp-loading">Loading analytics…</div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="sp-kpi-grid">

            <div className="sp-kpi-card">
              <div className="sp-kpi-icon sp-icon-green">
                <i className="ti ti-receipt" aria-hidden="true" />
              </div>
              <div>
                <div className="sp-kpi-label">Sales Count</div>
                <div className="sp-kpi-value">{totalCount}</div>
                <div className="sp-kpi-sub">{periodLabel}</div>
              </div>
            </div>

            <div className="sp-kpi-card">
              <div className="sp-kpi-icon sp-icon-blue">
                <i className="ti ti-coin" aria-hidden="true" />
              </div>
              <div>
                <div className="sp-kpi-label">Total Revenue</div>
                <div className="sp-kpi-value">{totalRevenue.toLocaleString()} Tk</div>
                <div className="sp-kpi-sub">{periodLabel}</div>
              </div>
            </div>

            <div className="sp-kpi-card">
              <div className="sp-kpi-icon sp-icon-amber">
                <i className="ti ti-chart-line" aria-hidden="true" />
              </div>
              <div>
                <div className="sp-kpi-label">Avg Order Value</div>
                <div className="sp-kpi-value">{avgOrder.toLocaleString()} Tk</div>
                <div className="sp-kpi-sub">per invoice</div>
              </div>
            </div>

            <div className="sp-kpi-card">
              <div className="sp-kpi-icon sp-icon-purple">
                <i className="ti ti-star" aria-hidden="true" />
              </div>
              <div>
                <div className="sp-kpi-label">Top Product</div>
                <div className="sp-kpi-value sp-kpi-value--sm">{topProduct}</div>
                <div className="sp-kpi-sub">{periodLabel}</div>
              </div>
            </div>

          </div>

          {/* Charts */}
          <div className="sp-charts-grid">

            <div className="sp-chart-card">
              <div className="sp-chart-head">
                <div>
                  <div className="sp-chart-title">Sales Count</div>
                  <div className="sp-chart-sub">Number of invoices · {periodLabel}</div>
                </div>
                <div className="sp-chart-total sp-total-green">{totalCount}</div>
              </div>
              <BarChart
                data={chartData}
                valueKey="count"
                color="#4a9968"
                unit="count"
              />
            </div>

            <div className="sp-chart-card">
              <div className="sp-chart-head">
                <div>
                  <div className="sp-chart-title">Sales Revenue</div>
                  <div className="sp-chart-sub">Total in Taka · {periodLabel}</div>
                </div>
                <div className="sp-chart-total sp-total-blue">
                  {totalRevenue.toLocaleString()} Tk
                </div>
              </div>
              <BarChart
                data={chartData}
                valueKey="revenue"
                color="#4a7aaa"
                unit="Tk"
              />
            </div>

          </div>

          {/* Recent invoices */}
          <div className="sp-recent-card">
            <div className="sp-recent-head">
              <div className="sp-chart-title">Recent Invoices</div>
              <span className="sp-recent-badge">{periodLabel}</span>
            </div>

            {filtered.length === 0 ? (
              <div className="sp-no-data">No invoices in this period.</div>
            ) : (
              <div className="sp-recent-list">
                {[...filtered].reverse().slice(0, 8).map(r => (
                  <div key={r.id} className="sp-recent-row">
                    <div className="sp-recent-left">
                      <div className="sp-recent-avatar">
                        {r.customer_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="sp-recent-name">{r.customer_name}</div>
                        <div className="sp-recent-product">{r.product_name}</div>
                      </div>
                    </div>
                    <div className="sp-recent-right">
                      <div className="sp-recent-total">
                        {Number(r.total).toLocaleString()} Tk
                      </div>
                      <div className="sp-recent-date">{r.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
}