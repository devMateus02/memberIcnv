import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormWrapper } from '../FormWrapper';
import { RegistrationData } from '@/types/registration';
import { Check, X } from 'lucide-react';
import api from "../../../api/http"
interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers
      .replace(/^(\d{2})/, '($1) ')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .trim();
  }
  return value.slice(0, 15);
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const StepContacts = ({ data, onUpdate, onNext, onBack, currentStep }: Props) => {
  const [isValid, setIsValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
const [checkingEmail, setCheckingEmail] = useState(false);

const checkEmailExists = async (email: string) => {
  if (!isValidEmail(email)) return;

  console.log("verificando", email)

  try {
    setCheckingEmail(true);

    const { data } = await api.get(
      `/auth/checkEmail`,
      {
        params: { email }
      }

    );

    console.log('RESPOSTA API:', data);

    setEmailExists(data.exists);
  } catch (error) {
    console.error('Erro ao verificar email:', error);
  } finally {
    setCheckingEmail(false);
  }
};

useEffect(() => {
  if (!isValidEmail(data.email)) {
    setEmailExists(false);
    return;
  }

  const timer = setTimeout(() => {
    checkEmailExists(data.email);
  }, 500);

  return () => clearTimeout(timer);
}, [data.email]);

  useEffect(() => {
    const phoneValid = data.primaryPhone.replace(/\D/g, '').length >= 10;
    const emailValid = isValidEmail(data.email);
    setIsValid(phoneValid && emailValid);
  }, [data.primaryPhone, data.email]);

  const handlePhoneChange = (field: 'primaryPhone' | 'secondaryPhone', value: string) => {
    onUpdate({ [field]: formatPhone(value) });
  };

  const emailIsValid = isValidEmail(data.email);

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={6}
      onBack={onBack}
      title="Contatos"
      description="Como podemos entrar em contato com você"
    >
      <div className="space-y-6">
        {/* Contato principal */}
        <div className="space-y-2">
          <Label htmlFor="primaryPhone">Contato principal</Label>
          <Input
            id="primaryPhone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={data.primaryPhone}
            onChange={(e) => handlePhoneChange('primaryPhone', e.target.value)}
            autoComplete="tel"
          />
        </div>

        {/* Contato secundário */}
        <div className="space-y-2">
          <Label htmlFor="secondaryPhone">
            Contato secundário <span className="text-muted-foreground text-sm">(opcional)</span>
          </Label>
          <Input
            id="secondaryPhone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={data.secondaryPhone}
            onChange={(e) => handlePhoneChange('secondaryPhone', e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={data.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              onBlur={() => setEmailTouched(true)}
              autoComplete="email"
              className={`pr-10 ${
                emailTouched && !emailIsValid && data.email
                  ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
                  : ''
              }`}
            />
            {emailTouched && data.email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {emailIsValid ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <X className="w-5 h-5 text-destructive" />
                )}
              </div>
            )}
          </div>
          {emailTouched && !emailIsValid && data.email && (
            <p className="text-sm text-destructive">Digite um email válido</p>
          )}
          {checkingEmail && (
  <p className="text-sm text-muted-foreground">
    Verificando email...
  </p>
)}

{!checkingEmail && emailExists && (
  <p className="text-sm text-destructive">
    Este email já está cadastrado
  </p>
)}

{!checkingEmail &&
  !emailExists &&
  emailTouched &&
  emailIsValid && (
    <p className="text-sm text-green-600">
      Email disponível
    </p>
)}
        </div>

        {/* Botão */}
        <Button
          variant="hero"
          size="lg"
          className="w-full mt-8"
          onClick={onNext}
          disabled={!isValid || emailExists || checkingEmail}
        >
          Continuar
        </Button>
      </div>
    </FormWrapper>
  );
};
