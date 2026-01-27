import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Smartphone, Apple, ArrowRight, Link } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
interface SuccessScreenProps {
  onAccessNow: () => void;
}

export const SuccessScreen = ({ onAccessNow }: SuccessScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-md"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-success/20 rounded-full animate-pulse-soft" />
          <div className="absolute inset-2 bg-success/30 rounded-full" />
          <div className="absolute inset-4 bg-success rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success-foreground" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          Cadastro Realizado!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg mb-12"
        >
          Sua conta foi criada com sucesso. Agora você já pode acessar sua carteirinha digital.
        </motion.p>

        {/* App download buttons */}
        
      

        {/* Access now button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='bg-gradient-to-t from-background via-background to-transparent '
        >
          <RouterLink
            to="/login"
          
            className=" w-[250px] flex flex-col items-center gap-1 max-w-md mx-auto bg-green-500 rounded-[15px] p-5 "
     
            onClick={onAccessNow}
          >
          <p className='text-center text-white text-[1.2em] text-muted-foreground '>Acesse agora</p>
       
          </RouterLink>
        </motion.div>
      </motion.div>
    </div>
  );
};
