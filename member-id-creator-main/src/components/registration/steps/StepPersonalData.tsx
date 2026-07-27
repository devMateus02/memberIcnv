import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormWrapper } from '../FormWrapper';
import { RegistrationData } from '@/types/registration';
import { Calendar } from 'lucide-react';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

function formatToDisplay(isoDate: string) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  if (!y) return '';
  return `${d}/${m}/${y}`;
}

function maskDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  let masked = digits;
  if (digits.length > 2) masked = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  if (digits.length > 4)
    masked = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  return masked;
}

function displayToIso(display: string) {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return '';
  const [, d, m, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const valid =
    date.getFullYear() === Number(y) &&
    date.getMonth() === Number(m) - 1 &&
    date.getDate() === Number(d) &&
    Number(y) > 1900;
  return valid ? `${y}-${m}-${d}` : '';
}

export const StepPersonalData = ({ data, onUpdate, onNext, onBack, currentStep }: Props) => {
  const [isValid, setIsValid] = useState(false);
  const [birthDateText, setBirthDateText] = useState(formatToDisplay(data.birthDate));

  useEffect(() => {
    const valid =
      data.fullName.trim().length >= 3 &&
      data.gender !== '' &&
      data.birthDate !== '';
    setIsValid(valid);
  }, [data.fullName, data.gender, data.birthDate]);

  // mantém o texto sincronizado caso data.birthDate mude por fora (ex: reset do form)
  useEffect(() => {
    setBirthDateText(formatToDisplay(data.birthDate));
  }, [data.birthDate]);

  const handleBirthDateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskDate(e.target.value);
    setBirthDateText(masked);
    const iso = displayToIso(masked);
    if (iso) onUpdate({ birthDate: iso });
    else if (masked === '') onUpdate({ birthDate: '' });
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ birthDate: e.target.value });
    setBirthDateText(formatToDisplay(e.target.value));
  };

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
            onChange={(e) => onUpdate({ gender: e.target.value })}
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
          <div className="relative">
            <Input
              id="birthDate"
              type="text"
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              value={birthDateText}
              onChange={handleBirthDateTextChange}
              maxLength={10}
              className="block pr-10"
            />
            <label
              htmlFor="birthDatePicker"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
            >
              <Calendar className="h-4 w-4" />
            </label>
            <input
              id="birthDatePicker"
              type="date"
              value={data.birthDate}
              onChange={handleNativePickerChange}
              className="absolute opacity-0 pointer-events-none"
              tabIndex={-1}
            />
          </div>
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