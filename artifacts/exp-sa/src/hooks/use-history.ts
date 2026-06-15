import { useState, useEffect } from 'react';
import { CalculationResult } from '../lib/constants';

const STORAGE_KEY = 'exp-sa-history';

export function useHistory() {
  const [history, setHistory] = useState<CalculationResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveCalculation = (result: CalculationResult) => {
    const updated = [result, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteCalculation = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, saveCalculation, deleteCalculation, clearHistory };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value);
}
