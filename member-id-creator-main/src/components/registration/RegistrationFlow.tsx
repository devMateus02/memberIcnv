import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './WelcomeScreen';
import { SuccessScreen } from './SuccessScreen';
import { StepPersonalData } from './steps/StepPersonalData';
import { StepParents } from './steps/StepParents';
import { StepContacts } from './steps/StepContacts';
import { StepAddress } from './steps/StepAddress';
import { StepPassword } from './steps/StepPassword';
import { StepSelfie } from './steps/StepSelfie';
import { useRegistration } from '@/hooks/useRegistration';
import { StepChurchInfo } from './steps/StepChurchInfo';
import { registerUser } from '../../api/auth.api';


type FlowState = 'welcome' | 'form' | 'success';

export const RegistrationFlow = () => {
  const [flowState, setFlowState] = useState<FlowState>('welcome');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clipOrigin, setClipOrigin] = useState({ x: 50, y: 50 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const {
    data,
    currentStep,
    updateData,
    nextStep,
    prevStep,
    resetRegistration,
  } = useRegistration();

  const handleStartRegistration = () => {
    // Get button position for clip-path origin

    resetRegistration()

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      setClipOrigin({ x, y });
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setFlowState('form');
      setIsTransitioning(false);
    }, 800);
  };

const handleComplete = async (selfieUrl?: string) => {
  try {
    if (!selfieUrl) {
      alert("Selfie não enviada corretamente");
      return;
    }

    await registerUser({
      ...data,
      selfie_url: selfieUrl, // ✅ GARANTIDO
    });

    setFlowState("success");
    resetRegistration();
  } catch (err) {
    console.error(err);
    alert("Erro ao enviar cadastro");
  }
};



  const handleAccessNow = () => {
    setFlowState('welcome');
  };

const handleNext = () => {
  // 👇 estamos no passo da selfie
  if (currentStep === 7) {
    if (!data.selfie_url) {
      alert("Aguarde o envio da selfie antes de continuar");
      return;
    }
    handleComplete();
    return;
  }

  nextStep();
};

const handleSelfieNext = async (selfieUrl: string) => {
  try {
    await registerUser({
      ...data,
      selfie_url: selfieUrl, // 🔒 garantido
    });

    setFlowState("success");
    resetRegistration();
  } catch (err) {
    console.error(err);
    alert("Erro ao enviar cadastro");
  }
};

  const renderStep = () => {
    const stepProps = {
      data,
      onUpdate: updateData,
      onNext: handleNext,
      onBack: prevStep,
      currentStep,
    };

    switch (currentStep) {
      case 1:
        return <StepPersonalData {...stepProps} />;
      case 2:
        return <StepParents {...stepProps} />;
      case 3:
        return <StepContacts {...stepProps} />;
      case 4:
        return <StepAddress {...stepProps} />;
      case 5:
        return <StepPassword {...stepProps} />;
      case 6:
        return <StepChurchInfo {...stepProps} />;
      case 7:
        
  return (
    <StepSelfie
      data={data}
      onUpdate={updateData}
      onNext={handleSelfieNext} // 👈 AQUI
      onBack={prevStep}
      currentStep={currentStep}
    />
  );
;
      default:
        return <StepPersonalData {...stepProps} />;
    }
  };

  return (
<div className="relative min-h-screen"
    <div className="overflow-hidden">
      {/* Welcome Screen */}
      <AnimatePresence>
        {flowState === 'welcome' && !isTransitioning && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onStart={handleStartRegistration} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ 
              clipPath: `circle(0% at ${clipOrigin.x}% ${clipOrigin.y}%)` 
            }}
            animate={{ 
              clipPath: `circle(150% at ${clipOrigin.x}% ${clipOrigin.y}%)` 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-primary z-50"
          />
        )}
      </AnimatePresence>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        {flowState === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Screen */}
      <AnimatePresence mode="wait">
        {flowState === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessScreen onAccessNow={handleAccessNow} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
</div>
  );
};
