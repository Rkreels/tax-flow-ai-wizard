
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PersonalInfoForm, IncomeForm, DeductionsForm } from '@/utils/formValidation';

interface TaxReturn {
  id: string;
  name: string;
  personalInfo: PersonalInfoForm | null;
  income: IncomeForm | null;
  deductions: DeductionsForm | null;
  status: 'draft' | 'in_progress' | 'submitted' | 'approved' | 'needs_info' | 'resubmitted';
  year: string;
  type: string;
  lastUpdated: string;
  ownerUserId: string;
  ownerName?: string;
  assignedProId?: string;
  comments?: Array<{
    id: string;
    authorId: string;
    authorRole: string;
    message: string;
    createdAt: string;
    requestAdditionalInfo?: boolean;
  }>;
  requestedDocuments?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size?: string;
    uploadedAt: string;
    uploadedBy: string;
  }>;
}


export const useTaxFiling = (returnId?: string) => {
  const { user } = useAuth();
  const [taxReturn, setTaxReturn] = useState<TaxReturn | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Load existing tax return or create new one
  useEffect(() => {
    if (returnId) {
      loadTaxReturn(returnId);
    } else {
      createNewTaxReturn();
    }
  }, [returnId]);

  const loadTaxReturn = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would fetch from backend
      const stored = localStorage.getItem(`taxReturn_${id}`);
      if (stored) {
        setTaxReturn(JSON.parse(stored));
      } else {
        createNewTaxReturn(id);
      }
    } catch (error) {
      toast.error('Failed to load tax return');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTaxReturn = (id?: string) => {
    const newReturn: TaxReturn = {
      id: id || `return_${Date.now()}`,
      name: `New Tax Return ${new Date().getFullYear()}`,
      personalInfo: null,
      income: null,
      deductions: null,
      status: 'draft',
      year: new Date().getFullYear().toString(),
      lastUpdated: new Date().toISOString(),
      ownerUserId: user?.id || 'anonymous',
      ownerName: user?.name,
      assignedProId: undefined,
      comments: [],
      requestedDocuments: [],
      attachments: [],
      type: 'Individual'
    } as any;
    setTaxReturn(newReturn);
    localStorage.setItem(`taxReturn_${newReturn.id}`, JSON.stringify(newReturn));
  };

  const savePersonalInfo = async (data: PersonalInfoForm) => {
    if (!taxReturn) return;
    
    const newStatus: TaxReturn['status'] = taxReturn.status === 'draft' ? 'in_progress' : taxReturn.status;
    const updated = {
      ...taxReturn,
      personalInfo: data,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    };
    
    setTaxReturn(updated);
    localStorage.setItem(`taxReturn_${updated.id}`, JSON.stringify(updated));
    toast.success('Personal information saved');
  };

  const updateReturnName = (name: string) => {
    if (!taxReturn) return;
    const updated = { ...taxReturn, name, lastUpdated: new Date().toISOString() };
    setTaxReturn(updated);
    localStorage.setItem(`taxReturn_${updated.id}`, JSON.stringify(updated));
  };
  const saveIncome = async (data: IncomeForm) => {
    if (!taxReturn) return;
    
    const updated = {
      ...taxReturn,
      income: data,
      lastUpdated: new Date().toISOString()
    };
    
    setTaxReturn(updated);
    localStorage.setItem(`taxReturn_${updated.id}`, JSON.stringify(updated));
    toast.success('Income information saved');
  };

  const saveDeductions = async (data: DeductionsForm) => {
    if (!taxReturn) return;
    
    const updated = {
      ...taxReturn,
      deductions: data,
      lastUpdated: new Date().toISOString()
    };
    
    setTaxReturn(updated);
    localStorage.setItem(`taxReturn_${updated.id}`, JSON.stringify(updated));
    toast.success('Deductions saved');
  };

  const submitTaxReturn = async () => {
    if (!taxReturn || !taxReturn.personalInfo || !taxReturn.income || !taxReturn.deductions) {
      toast.error('Please complete all sections before submitting');
      return false;
    }

    setIsLoading(true);
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStatus: TaxReturn['status'] = taxReturn.status === 'needs_info' ? 'resubmitted' : 'submitted';
      const updated = {
        ...taxReturn,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      };
      
      setTaxReturn(updated);
      localStorage.setItem(`taxReturn_${updated.id}`, JSON.stringify(updated));
      toast.success('Tax return submitted successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to submit tax return');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRefund = () => {
    if (!taxReturn?.income || !taxReturn?.deductions) return 0;
    
    // Simplified tax calculation
    const income = taxReturn.income.wages + taxReturn.income.interestIncome;
    const standardDeduction = 13850; // 2023 standard deduction
    const taxableIncome = Math.max(0, income - standardDeduction);
    const federalTax = taxableIncome * 0.22; // Simplified tax rate
    const refund = taxReturn.income.federalWithheld - federalTax;
    
    return Math.round(refund);
  };

  return {
    taxReturn,
    isLoading,
    currentStep,
    setCurrentStep,
    savePersonalInfo,
    saveIncome,
    saveDeductions,
    submitTaxReturn,
    calculateRefund,
    updateReturnName,
    isComplete: !!(taxReturn?.personalInfo && taxReturn?.income && taxReturn?.deductions)
  };
};
