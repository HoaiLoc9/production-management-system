"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const kpiReviews = [
  {
    id: 1,
    period: "Tháng 1/2025",
    target: 500,
    actual: 600,
    achievement: 120,
    status: "exceeded",
  },
  {
    id: 2,
    period: "Tháng 2/2025",
    target: 550,
    actual: 480,
    achievement: 87,
    status: "below",
  },
]

export default function KPIReviewPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Đánh Giá KPI</h1>
        <p className="text-muted-foreground mt-2">Xem xét các chỉ số hiệu suất chính</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đạt Mục Tiêu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chưa Đạt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">4</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi Tiết Đánh Giá KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpiReviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{review.period}</p>
                    <p className="text-sm text-muted-foreground">
                      Mục tiêu: {review.target} | Thực tế: {review.actual}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{review.achievement}%</p>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        review.status === "exceeded" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {review.status === "exceeded" ? "Vượt Mục Tiêu" : "Chưa Đạt"}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min(review.achievement, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
