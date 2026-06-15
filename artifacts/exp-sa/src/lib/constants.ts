import { z } from "zod";

export const CATEGORIES = [
  { id: "food", nameAr: "المواد الغذائية", nameEn: "Food & Beverages", rate: 5 },
  { id: "clothing", nameAr: "الملابس والمنسوجات", nameEn: "Clothing & Textiles", rate: 12 },
  { id: "electronics", nameAr: "الإلكترونيات", nameEn: "Electronics & Tech", rate: 5 },
  { id: "appliances", nameAr: "الأجهزة المنزلية", nameEn: "Home Appliances", rate: 12 },
  { id: "building", nameAr: "مواد البناء", nameEn: "Building Materials", rate: 6.5 },
  { id: "furniture", nameAr: "الأثاث", nameEn: "Furniture", rate: 12 },
  { id: "toys", nameAr: "الألعاب والترفيه", nameEn: "Toys & Entertainment", rate: 12 },
  { id: "tools", nameAr: "الأدوات والمعدات", nameEn: "Tools & Equipment", rate: 5 },
  { id: "auto", nameAr: "مستلزمات السيارات", nameEn: "Auto Parts", rate: 12 },
  { id: "chemicals", nameAr: "المواد الكيميائية", nameEn: "Chemicals", rate: 6.5 },
  { id: "personal_care", nameAr: "منتجات العناية الشخصية", nameEn: "Personal Care", rate: 20 },
  { id: "jewelry", nameAr: "المجوهرات والإكسسوارات", nameEn: "Jewelry & Accessories", rate: 20 },
  { id: "pharma", nameAr: "الأدوية والمستلزمات الطبية", nameEn: "Pharmaceuticals & Medical", rate: 0 },
  { id: "raw_materials", nameAr: "المواد الخام", nameEn: "Raw Materials", rate: 0 },
  { id: "other", nameAr: "أخرى", nameEn: "Other", rate: 5 },
];

export const SHIPPING_METHODS = [
  { id: "sea", nameAr: "شحن بحري" },
  { id: "air", nameAr: "شحن جوي" },
  { id: "land", nameAr: "شحن بري" },
];

export const calculatorSchema = z.object({
  productName: z.string().min(1, "مطلوب"),
  categoryId: z.string().min(1, "مطلوب"),
  hsCode: z.string().optional(),
  quantity: z.coerce.number().min(1, "الكمية يجب أن تكون أكبر من 0"),
  unitPriceUSD: z.coerce.number().min(0.01, "مطلوب"),
  exchangeRate: z.coerce.number().min(0.01, "مطلوب"),
  
  shippingMethodId: z.string().min(1, "مطلوب"),
  weightKg: z.coerce.number().min(0.1, "مطلوب"),
  shippingCostSAR: z.coerce.number().min(0, "مطلوب"),
  insurancePercent: z.coerce.number().min(0, "مطلوب"),
  
  customsDutyPercent: z.coerce.number().min(0, "مطلوب"),
  
  portHandlingSAR: z.coerce.number().min(0),
  brokerFeeSAR: z.coerce.number().min(0),
  sasoFeeSAR: z.coerce.number().min(0),
  otherFeesSAR: z.coerce.number().min(0),
});

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;

export type CalculationResult = {
  id: string;
  date: string;
  productName: string;
  goodsValueSAR: number;
  shippingCostSAR: number;
  insuranceSAR: number;
  customsDutySAR: number;
  vatSAR: number;
  portHandlingSAR: number;
  brokerFeeSAR: number;
  sasoFeeSAR: number;
  otherFeesSAR: number;
  totalCostSAR: number;
  costPerUnitSAR: number;
  additionalCostsPercent: number;
  formValues: CalculatorFormValues;
};
