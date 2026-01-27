import { useState, useEffect } from 'react';
import { RegistrationData, initialRegistrationData } from '@/types/registration';

const STORAGE_KEY = 'church_member_registration';

export const useRegistration = () => {
  const [data, setData] = useState<RegistrationData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialRegistrationData;
      }
    }
    return initialRegistrationData;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_step`);
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_step`, currentStep.toString());
  }, [currentStep]);

  const updateData = (updates: Partial<RegistrationData>) => {
    setData(prev => ({ 
      ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 7)));
  };

  const resetRegistration = () => {
    setData(initialRegistrationData);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_step`);
  };

  return {
    data,
    currentStep,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    resetRegistration,
  };
};
