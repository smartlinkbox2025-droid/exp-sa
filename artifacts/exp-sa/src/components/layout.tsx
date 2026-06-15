import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Calculator, History, Table, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "الرئيسية", icon: Calculator },
    { href: "/history", label: "السجل", icon: History },
    { href: "/rates", label: "جدول الرسوم", icon: Table },
    { href: "/about", label: "عن البرنامج", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row rtl" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-l border-border md:min-h-screen flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Exp-SA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">حاسبة تكاليف الاستيراد</p>
        </div>
        <nav className="px-4 pb-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
