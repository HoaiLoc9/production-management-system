"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, Clock, AlertTriangle, Factory, Calendar, CalendarCheck, Hash } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

interface WorkAssignment {
  id: number;
  taskDescription: string;
  status: string;
  progress: number;
  assignedDate: string;
  work_shift: string;
  planCode: number;
  orderId: number;
  customerName: string;
  startDate: string;
  endDate: string;
  workshopName: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "in_progress":
      return <Clock className="w-5 h-5 text-blue-600" />;
    case "pending":
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-600" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Hoàn thành";
    case "in_progress":
      return "Đang thực hiện";
    case "pending":
      return "Chưa thực hiện";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function WorkerAssignmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<WorkAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra quyền
  useEffect(() => {
    if (user && user.role !== "worker") {
      setError("Chỉ nhân viên sản xuất mới có quyền xem công việc của mình");
      setTimeout(() => router.push("/dashboard"), 1500);
      return;
    }
  }, [user, router]);

  // Lấy danh sách công việc
  useEffect(() => {
    if (!user || user.role !== "worker") return;

    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/worker/assignments?workerId=${user.id}`);
        if (!res.ok) throw new Error("Lỗi khi lấy danh sách công việc");

        const data = await res.json();
        setAssignments(data);
      } catch (err: any) {
        setError(err.message || "Lỗi khi lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  if (error && user?.role !== "worker") {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-8">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Công Việc Của Tôi</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Xem các công việc được phân công cho bạn
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Đang tải công việc...</span>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 size={64} className="mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold mb-2">Không có công việc nào</h3>
                <p className="text-sm text-muted-foreground">Hiện tại bạn chưa có công việc được phân công</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(assignment.status)}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{assignment.taskDescription}</h3>
                              <div className="mt-1 space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Hash className="w-4 h-4" />
                                  Kế hoạch #{assignment.planCode}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Factory className="w-4 h-4" />
                                  Xưởng phụ trách: {assignment.workshopName}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  Ngày bắt đầu kế hoạch: {new Date(assignment.startDate).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CalendarCheck className="w-4 h-4" />
                                  Ngày kết thúc kế hoạch: {new Date(assignment.endDate).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                            {getStatusLabel(assignment.status)}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Tiến độ</span>
                            <span className="text-sm font-bold text-primary">{assignment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${assignment.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="grid grid-cols-2 gap-2 pt-5 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Ngày thực hiện</p>
                            <p className="font-semibold">{new Date(assignment.assignedDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Ca làm</p>
                            <p className="font-semibold">{assignment.work_shift}</p>
                          </div>
                          
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}