export interface PurchaseRequest {
  maphieumuanvl: string;
}

export interface PurchaseDetail {
  maNVL: string;
  tenNVL: string;
  soLuongYeuCau: number;
  donVi: string;  
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
    { maNVL: "NVL0001", tenNVL: "Gỗ sồi tự nhiên", soLuongYeuCau: 100, donGia: "350000", donVi: "m³", tenNCC: "Công Ty TNHH Gỗ Sài Gòn" },
    { maNVL: "NVL0003", tenNVL: "Keo dán gỗ", soLuongYeuCau: 150, donGia: "210000", donVi: "kg", tenNCC: "Công Ty TNHH Hòa Phát" },
    { maNVL: "NVL0004", tenNVL: "Ốc vít", soLuongYeuCau: 150, donGia: "21000", donVi: "cái", tenNCC: "Công Ty TNHH Hòa Phát" },
  ],
  PM0002: [
    { maNVL: "NVL0002", tenNVL: "Gỗ xoan", soLuongYeuCau: 200, donGia: "400000", donVi: "m³", tenNCC: "Công Ty TNHH Gỗ An Phát" },
    { maNVL: "NVL0004", tenNVL: "Ốc vít", soLuongYeuCau: 100, donGia: "21000", donVi: "cái", tenNCC: "Công Ty TNHH Hòa Phát" },
  ],
};