import { useState } from 'react';
import './FormsPage.css';

const emptyItem = () => ({ productName: '', quantity: 1, unitPrice: '' });

export default function FormsPage({ onSubmit }) {
  const [form, setForm] = useState({
    name:           '',
    address:        '',
    phone:          '',
    invoiceNo:      '',
    deliveryCharge: '',
    advancePercent: '60',
  });
  const [items, setItems] = useState([emptyItem()]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    ));
  };

  const addItem = () => setItems(prev => [...prev, emptyItem()]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, items });
  };

  const delivery        = Number(form.deliveryCharge) || 0;
  const itemsTotal      = items.reduce((s, it) =>
    s + Number(it.quantity) * Number(it.unitPrice || 0), 0);
  const grandTotal      = itemsTotal + delivery;
  const advancePct      = Math.min(100, Math.max(0, Number(form.advancePercent) || 0));
  const advanceAmount   = Math.round(itemsTotal * advancePct / 100);
  const dueAmount       = grandTotal - advanceAmount;

  return (
    <div className="forms-page-wrapper">
      <form className="forms-page-form" onSubmit={handleSubmit}>
        <p className="forms-page-eyebrow">New Document</p>
        <h2>Invoice <strong>Details</strong></h2>

        {/* Customer info */}
        <div className="form-section-label">Customer info</div>
        <div className="form-group">
          <label>Full name</label>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="Customer Name" required
          />
        </div>
        <div className="form-group">
          <label>Delivery address</label>
          <textarea
            name="address" value={form.address} onChange={handleChange}
            placeholder="Street, city, postal code…" required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            name="phone" value={form.phone} onChange={handleChange}
            placeholder="+880 1XX XXX XXXX" required
          />
        </div>

        <div className="form-divider" />
        <div className="form-section-label">Invoice info</div>

        <div className="form-group">
          <label>Invoice no.</label>
          <input
            name="invoiceNo" value={form.invoiceNo} onChange={handleChange}
            placeholder="1234 5678 8910" required
          />
        </div>

        {/* Items */}
        <div className="form-divider" />
        <div className="form-section-label">Items</div>

        {items.map((item, index) => (
          <div key={index} className="form-item-row">
            <div className="form-item-number">{index + 1}</div>
            <div className="form-item-fields">
              <div className="form-group">
                {index === 0 && <label>Product name</label>}
                <input
                  name="productName"
                  value={item.productName}
                  onChange={e => handleItemChange(index, e)}
                  placeholder="Product or service"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  {index === 0 && <label>Qty</label>}
                  <input
                    name="quantity" type="number" min="1"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, e)}
                    required
                  />
                </div>
                <div className="form-group">
                  {index === 0 && <label>Unit price</label>}
                  <input
                    name="unitPrice" type="number" min="0"
                    value={item.unitPrice}
                    onChange={e => handleItemChange(index, e)}
                    placeholder="0" required
                  />
                </div>
                <div className="form-group">
                  {index === 0 && <label>Subtotal</label>}
                  <div className="form-item-subtotal">
                    {(Number(item.quantity) * Number(item.unitPrice || 0)).toLocaleString()} Tk
                  </div>
                </div>
              </div>
            </div>
            {items.length > 1 && (
              <button
                type="button"
                className="form-remove-btn"
                onClick={() => removeItem(index)}
                aria-label="Remove item"
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button type="button" className="form-add-btn" onClick={addItem}>
          + Add another item
        </button>

        {/* Pricing */}
        <div className="form-divider" />
        <div className="form-section-label">Pricing</div>

        <div className="form-group">
          <label>Delivery charge</label>
          <input
            name="deliveryCharge" type="number" min="0"
            value={form.deliveryCharge} onChange={handleChange}
            placeholder="0"
          />
        </div>

        {/* Advance */}
        <div className="form-divider" />
        <div className="form-section-label">Payment</div>

        <div className="form-group">
          <label>Advance percentage (%)</label>
          <div className="form-advance-row">
            <input
              name="advancePercent" type="number" min="0" max="100"
              value={form.advancePercent} onChange={handleChange}
              placeholder="60"
              className="form-advance-pct-input"
            />
            <div className="form-advance-pills">
              {[0, 25, 50, 60, 75, 100].map(p => (
                <button
                  key={p} type="button"
                  className={`form-advance-pill${advancePct === p ? ' active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, advancePercent: String(p) }))}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="form-summary">
          <div className="form-summary-row">
            <span>Items total</span>
            <span>{itemsTotal.toLocaleString()} Tk</span>
          </div>
          <div className="form-summary-row">
            <span>Delivery</span>
            <span>{delivery.toLocaleString()} Tk</span>
          </div>
          <div className="form-summary-row form-summary-total">
            <span>Grand total</span>
            <span>{grandTotal.toLocaleString()} Tk</span>
          </div>
          {grandTotal > 0 && (
            <>
              <div className="form-summary-row form-summary-advance">
                <span>Advance ({advancePct}%)</span>
                <span>{advanceAmount.toLocaleString()} Tk</span>
              </div>
              <div className="form-summary-row form-summary-due">
                <span>Due (COD)</span>
                <span>{dueAmount.toLocaleString()} Tk</span>
              </div>
            </>
          )}
        </div>

        <button className="forms-page-btn" type="submit">
          Create Invoice →
        </button>
      </form>
    </div>
  );
}