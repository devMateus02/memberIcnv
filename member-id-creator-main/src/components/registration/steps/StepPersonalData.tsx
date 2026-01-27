import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormWrapper } from '../FormWrapper';
import { RegistrationData } from '@/types/registration';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
          <Select
            value={data.gender}
            onValueChange={(value: RegistrationData['gender']) => onUpdate({ gender: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
            </SelectContent>
          </Select>
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
