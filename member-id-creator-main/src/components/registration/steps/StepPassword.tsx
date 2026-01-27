import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormWrapper } from '../FormWrapper';
import { RegistrationData } from '@/types/registration';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  return strength;
};

const strengthLabels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
const strengthColors = ['bg-destructive', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success'];

export const StepPassword = ({ data, onUpdate, onNext, onBack, currentStep }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const strength = useMemo(() => getPasswordStrength(data.password), [data.password]);
  
  const hasMinLength = data.password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(data.password);
  const hasNumber = /\d/.test(data.password);
  const passwordsMatch = data.password === data.confirmPassword && data.confirmPassword !== '';
  
  const isValid = hasMinLength && hasLetter && hasNumber && passwordsMatch;

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={6}
      onBack={onBack}
      title="Segurança da Conta"
      description="Crie uma senha forte para proteger sua conta"
    >
      <div className="space-y-6">
        {/* Senha */}
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={data.password}
              onChange={(e) => onUpdate({ password: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password strength indicator */}
          {data.password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < strength ? strengthColors[strength] : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-sm ${strength >= 3 ? 'text-success' : 'text-muted-foreground'}`}>
                Força: {strengthLabels[strength]}
              </p>
            </div>
          )}

          {/* Password requirements */}
          {touched.password && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5 text-sm"
            >
              <div className={`flex items-center gap-2 ${hasMinLength ? 'text-success' : 'text-muted-foreground'}`}>
                {hasMinLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>Mínimo de 8 caracteres</span>
              </div>
              <div className={`flex items-center gap-2 ${hasLetter ? 'text-success' : 'text-muted-foreground'}`}>
                {hasLetter ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>Pelo menos 1 letra</span>
              </div>
              <div className={`flex items-center gap-2 ${hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                {hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>Pelo menos 1 número</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirmar senha */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Digite a senha novamente"
              value={data.confirmPassword}
              onChange={(e) => onUpdate({ confirmPassword: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, confirm: true }))}
              autoComplete="new-password"
              className={`pr-10 ${
                touched.confirm && data.confirmPassword && !passwordsMatch
                  ? 'border-destructive focus-visible:border-destructive'
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {touched.confirm && data.confirmPassword && (
            <div className={`flex items-center gap-2 text-sm ${passwordsMatch ? 'text-success' : 'text-destructive'}`}>
              {passwordsMatch ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{passwordsMatch ? 'Senhas coincidem' : 'Senhas não coincidem'}</span>
            </div>
          )}
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
