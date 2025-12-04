"use client";
import { useEffect, useState } from "react";

export default function TaskList() {
  const [plans, setPlans] = useState<any>({ approved: [], notApproved: [] });

  useEffect(() => {
    async function fetchPlans() {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data);
    }
    fetchPlans();
  }, []);

  return (
    <div>
      <h2>Chưa duyệt</h2>
      <ul>
        {plans.notApproved.map((p: any) => (
          <li key={p.id}>{p.plan_code} - {p.product_type}</li>
        ))}
      </ul>

      <h2>Đã duyệt</h2>
      <ul>
        {plans.approved.map((p: any) => (
          <li key={p.id}>{p.plan_code} - {p.product_type}</li>
        ))}
      </ul>
    </div>
  );
}
