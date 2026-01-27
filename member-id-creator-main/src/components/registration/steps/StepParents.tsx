import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormWrapper } from '../FormWrapper';
import { RegistrationData } from '@/types/registration';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

export const StepParents = ({ data, onUpdate, onNext, onBack, currentStep }: Props) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // At least mother's name is required
    const valid = data.motherName.trim().length >= 3;
    setIsValid(valid);
  }, [data.motherName]);

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={6}
      onBack={onBack}
      title="Filiação"
      description="Informe os nomes dos seus pais"
    >
      <div className="space-y-6">
        {/* Nome da mãe */}
        <div className="space-y-2">
          <Label htmlFor="motherName">Nome da mãe</Label>
          <Input
            id="motherName"
            type="text"
            placeholder="Nome completo da mãe"
            value={data.motherName}
            onChange={(e) => onUpdate({ motherName: e.target.value })}
          />
        </div>

        {/* Nome do pai */}
        <div className="space-y-2">
          <Label htmlFor="fatherName">
            Nome do pai <span className="text-muted-foreground text-sm">(opcional)</span>
          </Label>
          <Input
            id="fatherName"
            type="text"
            placeholder="Nome completo do pai"
            value={data.fatherName}
            onChange={(e) => onUpdate({ fatherName: e.target.value })}
          />
        </div>

        {/* Botão */}
        <Button
          variant="hero"
          size="lg"
          className="w-full mt-8"
          onClick={onNext}
          disabled={!isValid}
        >
          Continuar
        </Button>
      </div>
    </FormWrapper>
  );
};
