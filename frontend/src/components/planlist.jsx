import React from 'react';

export default function planList({ plans, onSelect }) {
  return (
    <div>
      {plans.map(p => (
        <div key={p.planCode} style={cardStyle} onClick={() => onSelect(p)}>
          <div><strong>{p.planCode} - {p.orderCode}</strong></div>
          <div>{p.product} | Số lượng: {p.quantity}</div>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  padding: '12px',
  margin: '8px 0',
  border: '1px solid #ddd',
  borderRadius: 6,
  cursor: 'pointer'
};
