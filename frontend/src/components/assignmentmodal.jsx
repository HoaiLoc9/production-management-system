import React, { useEffect, useState } from 'react';
import API from '../api';

const productWorkflows = {
  'Ghế gỗ cao cấp': ['Cắt gỗ theo khuôn mẫu','Bào dưỡng bề mặt','Khoan lỗ và tạo then','Lắp ráp khung ghế','Sơn lót và phủ','Bọc nệm và hoàn thiện','Kiểm tra chất lượng','Đóng gói'],
  'Bàn làm việc': ['Cắt và chuẩn bị gỗ','Bào phẳng bề mặt','Tạo rãnh và ghép nối','Lắp ráp mặt bàn','Lắp chân và khung bàn','Sơn phủ và hoàn thiện','Kiểm tra và chỉnh sửa','Đóng gói'],
  'Tủ quần áo 3 cánh': ['Cắt gỗ và ván công nghiệp','Bào và mài nhẵn','Tạo rãnh khớp nối','Lắp ráp khung tủ','Lắp cánh tủ và bản lề','Sơn phủ','Lắp phụ kiện (móc, ray)','Kiểm tra chất lượng','Đóng gói']
};

export default function assignmentmodal({ plan, onClose }) {
  const [teams, setTeams] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (plan) {
      // fetch teams from backend
      API.get('/teams').then(res => setTeams(res.data)).catch(console.error);
      const steps = (productWorkflows[plan.product] || []).map((s,i) => ({ stepIndex: i, stepName: s, teamId: null }));
      setAssignments(steps);
    }
  }, [plan]);

  if (!plan) return null;

  const setTeam = (idx, teamId) => {
    const copy = [...assignments];
    copy[idx].teamId = teamId ? parseInt(teamId) : null;
    setAssignments(copy);
  };

  const save = async () => {
    // validation
    for (const a of assignments) if (!a.teamId) return alert('Vui lòng chọn tổ cho tất cả công đoạn');
    try {
      await API.post('/assignments', { planCode: plan.planCode, orderCode: plan.orderCode, product: plan.product, quantity: plan.quantity, steps: assignments });
      alert('Phân công thành công');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu');
    }
  };

  return (
    <div style={backdrop}>
      <div style={modal}>
        <h2>Phân công - {plan.product}</h2>
        <div>
          <strong>Mã kế hoạch:</strong> {plan.planCode} <br/>
          <strong>Mã đơn hàng:</strong> {plan.orderCode} <br/>
          <strong>Số lượng:</strong> {plan.quantity}
        </div>

        <table style={{width:'100%', marginTop:12, borderCollapse:'collapse'}}>
          <thead>
            <tr><th>STT</th><th>Công đoạn</th><th>Tổ thực hiện</th></tr>
          </thead>
          <tbody>
            {assignments.map((a, idx) => (
              <tr key={idx}>
                <td style={{width:40}}>{idx+1}</td>
                <td>{a.stepName}</td>
                <td>
                  <select value={a.teamId||''} onChange={e => setTeam(idx, e.target.value)}>
                    <option value=''>Chọn tổ thực hiện</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{marginTop:12, display:'flex', justifyContent:'flex-end', gap:8}}>
          <button onClick={onClose}>Hủy</button>
          <button onClick={save}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

const backdrop = { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' };
const modal = { width:800, background:'#fff', padding:20, borderRadius:8, maxHeight:'80vh', overflowY:'auto' };
