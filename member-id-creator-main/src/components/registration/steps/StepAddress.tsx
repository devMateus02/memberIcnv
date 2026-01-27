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

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 8) {
    return numbers.replace(/(\d{5})(\d)/, '$1-$2');
  }
  return value.slice(0, 9);
};

export const StepAddress = ({ data, onUpdate, onNext, onBack, currentStep }: Props) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid = 
      data.street.trim().length >= 3 &&
      data.number.trim().length >= 1 &&
      data.neighborhood.trim().length >= 2 &&
      data.city.trim().length >= 2 &&
      data.state !== '' &&
      data.zipCode.replace(/\D/g, '').length === 8;
    setIsValid(valid);
  }, [data.street, data.number, data.neighborhood, data.city, data.state, data.zipCode]);

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={6}
      onBack={onBack}
      title="Endereço"
      description="Onde você mora"
    >
      <div className="space-y-5">
        {/* CEP */}
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="00000-000"
            value={data.zipCode}
            onChange={(e) => onUpdate({ zipCode: formatCEP(e.target.value) })}
            autoComplete="postal-code"
          />
        </div>

        {/* Endereço */}
        <div className="space-y-2">
          <Label htmlFor="street">Endereço (rua/avenida)</Label>
          <Input
            id="street"
            type="text"
            placeholder="Nome da rua ou avenida"
            value={data.street}
            onChange={(e) => onUpdate({ street: e.target.value })}
            autoComplete="street-address"
          />
        </div>

        {/* Número e Complemento */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              type="text"
              placeholder="Nº"
              value={data.number}
              onChange={(e) => onUpdate({ number: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">
              Complemento <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Input
              id="complement"
              type="text"
              placeholder="Apto, bloco..."
              value={data.complement}
              onChange={(e) => onUpdate({ complement: e.target.value })}
            />
          </div>
        </div>

        {/* Bairro */}
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            type="text"
            placeholder="Nome do bairro"
            value={data.neighborhood}
            onChange={(e) => onUpdate({ neighborhood: e.target.value })}
          />
        </div>

        {/* Cidade e Estado */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              type="text"
              placeholder="Nome da cidade"
              value={data.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
              autoComplete="address-level2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">UF</Label>
            <Select
              value={data.state}
              onValueChange={(value) => onUpdate({ state: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                {brazilianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botão */}
        <Button
          variant="hero"
          size="lg"
          className="w-full mt-6"
          onClick={onNext}
          disabled={!isValid}
        >
          Continuar
        </Button>
      </div>
    </FormWrapper>
  );
};
