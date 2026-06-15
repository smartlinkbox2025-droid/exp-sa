import { CATEGORIES } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function Rates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">جدول الرسوم الجمركية</h1>
        <p className="text-muted-foreground mt-2">النسب التقريبية للرسوم الجمركية السعودية حسب فئة المنتج.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">النسبة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CATEGORIES.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.nameAr}</TableCell>
                    <TableCell>{cat.rate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Info className="w-5 h-5 ml-2 text-primary" />
                ملاحظة هامة
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                الرسوم المذكورة في هذا الجدول هي رسوم تقريبية وقد تتغير بناءً على تحديثات هيئة الزكاة والضريبة والجمارك السعودية.
              </p>
              <div className="space-y-2">
                <h4 className="font-bold">كيفية الحساب:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>الجمارك:</strong> تحسب بناءً على (قيمة البضاعة + تكلفة الشحن + التأمين).</li>
                  <li><strong>القيمة المضافة:</strong> 15% وتحسب على إجمالي التكلفة شاملة الجمارك.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
