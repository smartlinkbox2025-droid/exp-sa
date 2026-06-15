import { useHistory, formatCurrency } from "@/hooks/use-history";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, History as HistoryIcon, Calendar } from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

export default function History() {
  const { history, deleteCalculation, clearHistory } = useHistory();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">السجل</h1>
          <p className="text-muted-foreground mt-2">الحسابات السابقة المحفوظة.</p>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 ml-2" />
            مسح الكل
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <HistoryIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>لا توجد حسابات محفوظة بعد.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.productName}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 ml-1" />
                    {format(new Date(item.date), "dd MMMM yyyy", { locale: arSA })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">الإجمالي</div>
                    <div className="font-bold">{formatCurrency(item.totalCostSAR)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">تكلفة الوحدة</div>
                    <div className="font-bold text-primary">{formatCurrency(item.costPerUnitSAR)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">نسبة التكاليف</div>
                    <div className="font-medium text-muted-foreground">{item.additionalCostsPercent.toFixed(1)}%</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex justify-end p-3">
                <Button variant="ghost" size="sm" onClick={() => deleteCalculation(item.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
