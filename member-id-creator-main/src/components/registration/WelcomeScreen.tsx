import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <CreditCard className="w-10 h-10 text-primary" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Bem-vindo ao cadastro de membros icnv
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-12"
          >
            Preencha seus dados para gerar sua carteirinha digital
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-5"
          >
            <div className="bg-accent/50 rounded-xl p-4 text-left">
              <Shield className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">Dados seguros</p>
              <p className="text-xs text-muted-foreground">Criptografados</p>
            </div>
            <div className="bg-accent/50 rounded-xl p-4 text-left">
              <Sparkles className="w-6 h-6 text-secondary mb-2" />
              <p className="text-sm font-medium text-foreground">Rápido e fácil</p>
              <p className="text-xs text-muted-foreground">Em 5 minutos</p>
            </div>
          </motion.div>
        </motion.div>
      {/* CTA Button - Fixed at bottom on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="sticky bottom-0 p-6 bg-gradient-to-t from-background via-background to-transparent"
      >
        <Button
          variant="hero"
          size="xl"
          className="w-full max-w-md mx-auto block"
          onClick={onStart}
        >
          Cadastrar
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Ao continuar, você concorda com nossos termos de uso
        </p>
      </motion.div>
      </div>

    </div>
  );
};
