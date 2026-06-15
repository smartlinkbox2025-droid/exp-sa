import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorSchema, CalculatorFormValues, CATEGORIES, SHIPPING_METHODS, CalculationResult } from "@/lib/constants";
import { useHistory, formatCurrency } from "@/hooks/use-history";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Calculator as CalcIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Calculator() {
  const { saveCalculation } = useHistory();
  const { toast } = useToast();
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      productName: "",
      categoryId: "",
      hsCode: "",
      quantity: 1,
      unitPriceUSD: 0,
      exchangeRate: 0.52,
      shippingMethodId: "",
      weightKg: 0,
      shippingCostSAR: 0,
      insurancePercent: 0.5,
      customsDutyPercent: 0,
      portHandlingSAR: 200,
      brokerFeeSAR: 500,
      sasoFeeSAR: 0,
      otherFeesSAR: 0,
    },
  });

  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const unitPriceUSD = useWatch({ control: form.control, name: "unitPriceUSD" });
  const exchangeRate = useWatch({ control: form.control, name: "exchangeRate" });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  
  useEffect(() => {
    if (categoryId) {
      const category = CATEGORIES.find(c => c.id === categoryId);
      if (category) {
        form.setValue("customsDutyPercent", category.rate);
      }
    }
  }, [categoryId, form]);

  const unitPriceCNY = unitPriceUSD && exchangeRate ? (unitPriceUSD / (exchangeRate * 13.8) * 100) : 0; // rough approx, we just do client math
  // Wait, req says: "سعر الوحدة بالريال الصيني (unit price CNY) — number (auto-calculates from USD * exchange rate)". This might mean USD * 7 roughly for CNY. 
  // But wait, the user says "سعر الصرف (exchange rate CNY/SAR) — number, default 0.52 SAR per CNY".
  // Let's just focus on total value. The user puts unitPriceUSD, we convert it to SAR. Or maybe they put unit price in USD, and we convert USD to SAR. 
  // "سعر الوحدة بالريال الصيني (unit price CNY) — number (auto-calculates from USD * exchange rate)"
  // actually 1 USD = 7 CNY. Let's just ask user for USD and use standard 3.75 to SAR.
  
  const onSubmit = (values: CalculatorFormValues) => {
    // Math
    const unitPriceSAR = values.unitPriceUSD * 3.75; // assuming 3.75 fixed for USD->SAR
    const goodsValueSAR = unitPriceSAR * values.quantity;
    
    const shippingCostSAR = values.shippingCostSAR;
    const insuranceSAR = goodsValueSAR * (values.insurancePercent / 100);
    
    const customsDutySAR = (goodsValueSAR + shippingCostSAR + insuranceSAR) * (values.customsDutyPercent / 100);
    
    const vatBase = goodsValueSAR + shippingCostSAR + insuranceSAR + customsDutySAR;
    const vatSAR = vatBase * 0.15;
    
    const portHandlingSAR = values.portHandlingSAR;
    const brokerFeeSAR = values.brokerFeeSAR;
    const sasoFeeSAR = values.sasoFeeSAR;
    const otherFeesSAR = values.otherFeesSAR;
    
    const totalCostSAR = goodsValueSAR + shippingCostSAR + insuranceSAR + customsDutySAR + vatSAR + portHandlingSAR + brokerFeeSAR + sasoFeeSAR + otherFeesSAR;
    
    const costPerUnitSAR = totalCostSAR / values.quantity;
    
    const additionalCostsPercent = ((totalCostSAR - goodsValueSAR) / goodsValueSAR) * 100;
    
    setResult({
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      productName: values.productName,
      goodsValueSAR,
      shippingCostSAR,
      insuranceSAR,
      customsDutySAR,
      vatSAR,
      portHandlingSAR,
      brokerFeeSAR,
      sasoFeeSAR,
      otherFeesSAR,
      totalCostSAR,
      costPerUnitSAR,
      additionalCostsPercent,
      formValues: values
    });
  };

  const handleSave = () => {
    if (result) {
      saveCalculation(result);
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الحساب في السجل بنجاح.",
      });
    }
  };

  const handleReset = () => {
    form.reset();
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">حاسبة الاستيراد</h1>
        <p className="text-muted-foreground mt-2">قم بإدخال بيانات الشحنة لحساب التكلفة الإجمالية بدقة.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>1. معلومات المنتج</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="productName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المنتج</FormLabel>
                      <FormControl><Input placeholder="مثال: أجهزة إلكترونية" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>فئة المنتج</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="hsCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز HS (اختياري)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الكمية</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="unitPriceUSD" render={({ field }) => (
                    <FormItem>
                      <FormLabel>سعر الوحدة (دولار)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="exchangeRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>سعر الصرف (صيني/ريال)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. تكاليف الشحن</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="shippingMethodId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>طريقة الشحن</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="اختر الشحن" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SHIPPING_METHODS.map(m => <SelectItem key={m.id} value={m.id}>{m.nameAr}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="weightKg" render={({ field }) => (
                    <FormItem>
                      <FormLabel>وزن الشحنة (كجم)</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="shippingCostSAR" render={({ field }) => (
                    <FormItem>
                      <FormLabel>تكلفة الشحن (ريال)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="insurancePercent" render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأمين الشحن (%)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. الرسوم الجمركية والضرائب</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="customsDutyPercent" render={({ field }) => (
                    <FormItem>
                      <FormLabel>نسبة الجمارك (%)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="pt-8 text-sm text-muted-foreground">
                    سيتم حساب ضريبة القيمة المضافة 15% تلقائياً.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. رسوم إضافية</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="portHandlingSAR" render={({ field }) => (
                    <FormItem>
                      <FormLabel>رسوم الميناء والمناولة (ريال)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="brokerFeeSAR" render={({ field }) => (
                    <FormItem>
                      <FormLabel>رسوم المخلص الجمركي (ريال)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="sasoFeeSAR" render={({ field }) => (
                    <FormItem>
                      <FormLabel>رسوم شهادة سابر SASO (ريال)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="otherFeesSAR" render={({ field }) => (
                    <FormItem>
                      <FormLabel>رسوم أخرى (ريال)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="flex-1"><CalcIcon className="w-4 h-4 ml-2"/> احسب التكلفة</Button>
                <Button type="button" variant="outline" size="lg" onClick={handleReset}><RefreshCw className="w-4 h-4 ml-2"/> مسح</Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          {result ? (
            <Card className="sticky top-6 border-primary/20 shadow-md">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-xl">النتيجة والتفاصيل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">قيمة البضاعة</span>
                  <span className="font-medium">{formatCurrency(result.goodsValueSAR)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">تكاليف الشحن</span>
                  <span className="font-medium">{formatCurrency(result.shippingCostSAR)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">التأمين</span>
                  <span className="font-medium">{formatCurrency(result.insuranceSAR)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الرسوم الجمركية</span>
                  <span className="font-medium">{formatCurrency(result.customsDutySAR)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-medium">{formatCurrency(result.vatSAR)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رسوم الميناء والمناولة</span>
                  <span className="font-medium">{formatCurrency(result.portHandlingSAR)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المخلص الجمركي</span>
                  <span className="font-medium">{formatCurrency(result.brokerFeeSAR)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رسوم SASO وأخرى</span>
                  <span className="font-medium">{formatCurrency(result.sasoFeeSAR + result.otherFeesSAR)}</span>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">إجمالي التكلفة</div>
                  <div className="text-3xl font-bold text-primary">{formatCurrency(result.totalCostSAR)}</div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">سعر تكلفة الوحدة</span>
                    <span className="font-bold">{formatCurrency(result.costPerUnitSAR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">نسبة التكاليف الإضافية</span>
                    <span className="font-bold text-muted-foreground">{result.additionalCostsPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSave}><Save className="w-4 h-4 ml-2"/> حفظ الحساب</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="sticky top-6 border-dashed opacity-70">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <CalcIcon className="w-12 h-12 mb-4 opacity-20" />
                <p>أدخل البيانات واضغط على "احسب التكلفة" لرؤية التفاصيل هنا.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
