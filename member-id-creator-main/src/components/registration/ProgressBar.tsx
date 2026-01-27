import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Dados Pessoais',
  'Filiação',
  'Contatos',
  'Endereço',
  'Senha',
  'Ministério',
  "Foto"
];

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full px-4 py-6">
      {/* Step indicator text */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-semibold text-primary">
          {stepLabels[currentStep - 1]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <motion.div
              key={stepNumber}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors duration-300 ${
                isCompleted
                  ? 'bg-primary text-primary-foreground'
                  : isCurrent
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
