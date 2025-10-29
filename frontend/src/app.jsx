import React, { useState } from 'react';
import PlanList from './components/planlist';
import AssignmentModal from './components/assignmentmodal';

export default function App() {
  const plans = [
    { planCode: 'KH001', orderCode: '#X7K9P2M5', product: 'Ghế gỗ cao cấp', quantity: 500 },
    { planCode: 'KH002', orderCode: '#B4N8Q1W6', product: 'Bàn làm việc', quantity: 300 },
    { planCode: 'KH003', orderCode: '#R3T7Y5L9', product: 'Tủ quần áo 3 cánh', quantity: 200 }
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: 24 }}>
      <h1>Phân công công việc</h1>
      <PlanList plans={plans} onSelect={setSelected} />
      <AssignmentModal plan={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
