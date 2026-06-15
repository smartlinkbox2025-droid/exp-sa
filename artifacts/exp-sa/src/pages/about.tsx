import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-10">
      <Card className="text-center py-10">
        <CardHeader>
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <Calculator className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Exp-SA</CardTitle>
          <p className="text-muted-foreground mt-2">الإصدار 1.0.0</p>
        </CardHeader>
        <CardContent className="space-y-6 mt-6">
          <p className="text-lg">
            برنامج لحساب تكاليف الاستيراد من الصين إلى المملكة العربية السعودية. يهدف إلى مساعدة المستوردين والتجار في حساب التكلفة الإجمالية بدقة ومعرفة تكلفة الوحدة الواحدة شاملة كافة الرسوم والضرائب.
          </p>
          
          <div className="bg-muted p-4 rounded-lg text-sm text-right space-y-2">
            <h4 className="font-bold text-foreground">إخلاء مسؤولية:</h4>
            <p className="text-muted-foreground">
              هذه الحاسبة مصممة لتعطي تقديراً قريباً جداً للتكلفة النهائية، ولكنها لا تعتبر مستنداً رسمياً. الرسوم الجمركية الدقيقة تعتمد على الرمز المنسق (HS Code) الدقيق وتصنيف الجمارك السعودية وقت وصول البضاعة.
            </p>
          </div>
          
          <div className="pt-8 text-sm text-muted-foreground">
            تم التطوير لتسهيل العمل التجاري وإدارة التكاليف بفعالية.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
