// import { NextResponse } from "next/server"
// import { kpiDrafts, finalReports } from "@/app/api/kpi/data"

// export async function GET() {
//   // Trả về danh sách báo cáo KPI cuối cùng (đã hoàn thành)
//   return NextResponse.json(finalReports)
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.json()

//     if (!data.created_by) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
//     }

//     // ✅ Nếu dữ liệu gửi lên là hợp nhất các báo cáo nháp thành báo cáo cuối cùng
//     if (data.report_name && Array.isArray(data.kpi_report_ids)) {
//       // Lọc ra các bản nháp đã được duyệt (approved)
//       const selectedDrafts = kpiDrafts.filter(
//         (d) => data.kpi_report_ids.includes(d.id) && d.status === "approved"
//       )

//       if (selectedDrafts.length === 0) {
//         return NextResponse.json(
//           { message: "No approved KPI drafts found for provided ids" },
//           { status: 400 }
//         )
//       }

//       // Tổng hợp dữ liệu từ các bản nháp
//       const aggregatedWorkshops = selectedDrafts.flatMap((d) => d.workshops || [])

//       const newFinalReport = {
//         id: `FINAL-KPI-${Date.now()}`,
//         report_name: data.report_name,
//         report_period_start: data.report_period_start,
//         report_period_end: data.report_period_end,
//         summary: data.summary,
//         recommendations: data.recommendations,
//         average_kpi: data.average_kpi,
//         kpi_report_ids: data.kpi_report_ids,
//         workshops: aggregatedWorkshops,
//         created_by: data.created_by,
//         created_at: new Date().toISOString(),
//         status: "completed",
//       }

//       finalReports.push(newFinalReport)
//       return NextResponse.json(newFinalReport, { status: 201 })
//     }

//     return NextResponse.json({ message: "Bad request" }, { status: 400 })
//   } catch (error) {
//     console.error("Error creating final KPI report:", error)
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//   }
// }
// app/api/kpi/reports/route.ts
// import { NextResponse } from "next/server";
// import { query } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       reportName,
//       periodStart,
//       periodEnd,
//       summary,
//       recommendations,
//       averageKpi,
//       createdBy,
//       kpi_report_ids, // frontend gửi mảng ở đây
//       aggregatedWorkshops,
//     } = body;

//     // Kiểm tra các trường bắt buộc
//     if (!reportName || !periodStart || !periodEnd || !createdBy) {
//       return NextResponse.json(
//         { message: "Thiếu thông tin bắt buộc" },
//         { status: 400 }
//       );
//     }

//     // Chuyển mảng JS sang PostgreSQL array literal
//     const selectedDraftIds = Array.isArray(kpi_report_ids) ? kpi_report_ids : [];
//     const kpiReportIdsLiteral = `{${selectedDraftIds.join(",")}}`; // {KPI-1761766821377}

//     // Thực hiện insert
//     const result = await query(
//       `INSERT INTO kpi_reports 
//         (report_name, report_period_start, report_period_end, summary, recommendations, average_kpi, created_by, kpi_report_ids, aggregated_workshops, created_at)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
//        RETURNING *`,
//       [
//         reportName,
//         periodStart,
//         periodEnd,
//         summary || null,
//         recommendations || null,
//         averageKpi || null,
//         createdBy,
//         kpiReportIdsLiteral, // ← dùng literal đã đúng
//         aggregatedWorkshops || null
//       ]
//     );

//     return NextResponse.json(result.rows[0]);
//   } catch (err: any) {
//     console.error("❌ POST /api/kpi/reports error:", err);
//     return NextResponse.json(
//       { message: "Lỗi server", error: err.message },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import { query } from "@/lib/db";

// // GET tất cả báo cáo KPI cuối cùng
// export async function GET() {
//   try {
//     const result = await query(
//       `SELECT * FROM kpi_reports ORDER BY created_at DESC`
//     );
//     return NextResponse.json(result.rows);
//   } catch (err: any) {
//     console.error("❌ GET /api/kpi/report error:", err);
//     return NextResponse.json(
//       { message: "Lỗi server", error: err.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("Body received:", body);

//     const reportName = body.reportName || body.report_name;
//     const periodStart = body.periodStart || body.report_period_start;
//     const periodEnd = body.periodEnd || body.report_period_end;
//     const summary = body.summary || null;
//     const recommendations = body.recommendations || null;
//     const averageKpi = body.averageKpi || null;
//     const createdBy = body.createdBy || body.created_by;
//     const kpiReportIds = Array.isArray(body.kpi_report_ids)
//       ? body.kpi_report_ids
//       : Array.isArray(body.kpiReportIds)
//       ? body.kpiReportIds
//       : [];
//     const aggregatedWorkshops = body.aggregatedWorkshops || body.aggregated_workshops || null;

//     if (!reportName || !periodStart || !periodEnd || !createdBy) {
//       return NextResponse.json(
//         { message: "Thiếu thông tin bắt buộc" },
//         { status: 400 }
//       );
//     }

//     // PostgreSQL array literal cho kpi_report_ids
//     const kpiReportIdsLiteral = kpiReportIds.length > 0
//       ? `{${kpiReportIds.map(id => `"${id}"`).join(",")}}`
//       : '{}';

//     // Chuyển aggregatedWorkshops sang JSON string nếu có dữ liệu
//     const aggregatedWorkshopsJSON = aggregatedWorkshops ? JSON.stringify(aggregatedWorkshops) : null;

//     const result = await query(
//       `INSERT INTO kpi_reports 
//         (report_name, report_period_start, report_period_end, summary, recommendations, average_kpi, created_by, kpi_report_ids, aggregated_workshops, created_at)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
//        RETURNING *`,
//       [
//         reportName,
//         periodStart,
//         periodEnd,
//         summary,
//         recommendations,
//         averageKpi || null,
//         createdBy,
//         kpiReportIdsLiteral,
//         aggregatedWorkshopsJSON
//       ]
//     );

//     return NextResponse.json(result.rows[0], { status: 201 });
//   } catch (err: any) {
//     console.error("❌ POST /api/kpi/reports error:", err);
//     return NextResponse.json(
//       { message: "Lỗi server", error: err.message },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Body received:", body)

    const {
      reportName,
      periodStart,
      periodEnd,
      summary,
      recommendations,
      averageKpi,
      createdBy,
      kpi_report_ids,
      aggregatedWorkshops,
    } = body;

    // Kiểm tra trường bắt buộc
    if (!reportName || !periodStart || !periodEnd || !createdBy) {
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // PostgreSQL text[] hỗ trợ JS array trực tiếp (pg driver sẽ convert)
    const reportIdsArray = Array.isArray(kpi_report_ids) ? kpi_report_ids : [];

    // aggregated_workshops phải stringify JSON
    const workshopsJson = JSON.stringify(aggregatedWorkshops || []);

    const result = await query(
      `INSERT INTO kpi_reports
        (report_name, report_period_start, report_period_end, summary, recommendations, average_kpi, created_by, kpi_report_ids, aggregated_workshops, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       RETURNING *`,
      [
        reportName,
        periodStart,
        periodEnd,
        summary || null,
        recommendations || null,
        averageKpi || null,
        createdBy,
        reportIdsArray,
        workshopsJson,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    console.error("❌ POST /api/kpi/reports error:", err);
    return NextResponse.json(
      { message: "Lỗi server", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await query(
      `SELECT * FROM kpi_reports ORDER BY created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("❌ GET /api/kpi/reports error:", err);
    return NextResponse.json(
      { message: "Lỗi server", error: err.message },
      { status: 500 }
    );
  }
}
