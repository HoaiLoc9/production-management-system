"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    id: 1,
    question: "Làm cách nào để tạo kế hoạch sản xuất mới?",
    answer:
      "Để tạo kế hoạch sản xuất mới, hãy vào menu 'Kế Hoạch Sản Xuất' và nhấp vào nút 'Thêm Kế Hoạch'. Điền thông tin chi tiết và nhấp 'Lưu'.",
  },
  {
    id: 2,
    question: "Làm cách nào để ghi chấm công?",
    answer: "Vào menu 'Phân Công & Chấm Công' > 'Chấm Công', nhấp 'Ghi Chấm Công', điền giờ vào/ra và nhấp 'Lưu'.",
  },
  {
    id: 3,
    question: "Làm cách nào để xuất báo cáo?",
    answer: "Vào 'Thống Kê' > 'Báo Cáo KPI', nhấp nút 'Tải Báo Cáo' để tải file báo cáo dưới dạng PDF hoặc Excel.",
  },
  {
    id: 4,
    question: "Làm cách nào để phê duyệt kế hoạch?",
    answer:
      "Nếu bạn là Ban Giám Đốc, vào 'Phê Duyệt' > 'Kế Hoạch Sản Xuất', xem danh sách chờ phê duyệt và nhấp 'Phê Duyệt' hoặc 'Từ Chối'.",
  },
  {
    id: 5,
    question: "Làm cách nào để quản lý kho hàng?",
    answer: "Vào 'Kho NVL' hoặc 'Kho Thành Phẩm', chọn 'Nhập' hoặc 'Xuất', điền thông tin giao dịch và nhấp 'Lưu'.",
  },
  {
    id: 6,
    question: "Làm cách nào để ghi nhận lỗi QC?",
    answer:
      "Vào 'QC' > 'Lỗi Sản Phẩm' hoặc 'Lỗi Nguyên Vật Liệu', nhấp 'Ghi Nhận Lỗi', điền thông tin lỗi và nhấp 'Lưu'.",
  },
]

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trợ Giúp</h1>
        <p className="text-muted-foreground mt-2">Câu hỏi thường gặp và hướng dẫn sử dụng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Câu Hỏi Thường Gặp</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liên Hệ Hỗ Trợ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">support@company.com</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Điện Thoại</p>
            <p className="font-medium">+84 (0) 123 456 789</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Giờ Làm Việc</p>
            <p className="font-medium">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
