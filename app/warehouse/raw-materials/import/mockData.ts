// app/warehouse/raw-materials/import/mockData.ts

export interface PurchaseRequest {
  maphieumuanvl: string;
}

export interface PurchaseDetail {
  maNVL: string;
  tenNVL: string;
  soLuongYeuCau: number;
  donGia: string;
  tenNCC: string;
}

// Danh sách phiếu mua
export const purchaseRequests: PurchaseRequest[] = [
  { maphieumuanvl: "PM0001" },
  { maphieumuanvl: "PM0002" },
];

// Chi tiết NVL theo phiếu
export const purchaseDetails: Record<string, PurchaseDetail[]> = {
  PM0001: [
    { maNVL: "NVL0001", tenNVL: "Go soi tu nhien", soLuongYeuCau: 100, donGia: "350000", tenNCC: "Cong Ty TNHH Go Sai Gon" },
    { maNVL: "NVL0003", tenNVL: "Keo dan go", soLuongYeuCau: 150, donGia: "210000", tenNCC: "Cong Ty TNHH Hoa Phat" },
    { maNVL: "NVL0004", tenNVL: "Oc vit", soLuongYeuCau: 150, donGia: "21000", tenNCC: "Cong Ty TNHH Hoa Phat" },
  ],
  PM0002: [
    { maNVL: "NVL0002", tenNVL: "Go xoan", soLuongYeuCau: 200, donGia: "400000", tenNCC: "Cong Ty TNHH Go An Phat" },
    { maNVL: "NVL0004", tenNVL: "Oc vit", soLuongYeuCau: 100, donGia: "21000", tenNCC: "Cong Ty TNHH Hoa Phat" },
  ],
};
