import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from './ProgressBar';

interface FormWrapperProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  showBack?: boolean;
  title: string;
  description?: string;
}

export const FormWrapper = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
  title,
  description,
}: FormWrapperProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center px-4 py-3">
          {showBack && currentStep > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1" />
        </div>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 px-6 py-6"
      >
        <div className="max-w-md mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Form content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
};
