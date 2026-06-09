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

export const StepPersonalData = ({ data, onUpdate, onNext, onBack, currentStep }: Props) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid = 
      data.fullName.trim().length >= 3 &&
      data.gender !== '' &&
      data.birthDate !== '';
    setIsValid(valid);
  }, [data.fullName, data.gender, data.birthDate]);

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={6}
      onBack={onBack}
      title="Dados Pessoais"
      description="Informe seus dados básicos para começar"
    >
      <div className="space-y-6">
        {/* Nome completo */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Digite seu nome completo"
            value={data.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            autoComplete="name"
          />
        </div>

        {/* Sexo */}
        <div className="space-y-2">
  <Label htmlFor="gender">Sexo</Label>

  <select
    id="gender"
    value={data.gender}
    onChange={(e) =>
      onUpdate({ gender: e.target.value })
    }
    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
  >
    <option value="">Selecione seu sexo</option>
    <option value="Masculino">Masculino</option>
    <option value="Feminino">Feminino</option>
  </select>
</div>

        {/* Data de nascimento */}
        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de nascimento</Label>
          <Input
            id="birthDate"
            type="date"
            value={data.birthDate}
            onChange={(e) => onUpdate({ birthDate: e.target.value })}
            className="block"
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
