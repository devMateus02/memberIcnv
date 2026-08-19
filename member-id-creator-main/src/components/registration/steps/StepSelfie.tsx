import { useEffect } from "react";
import { FormWrapper } from "../FormWrapper";
import { RegistrationData } from "@/types/registration";
import { SelfieCapture } from "@/components/SelfieCapture";
import { uploadSelfie } from "../../../api/users.api";

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onNext: (selfieurl: string) => void;
  onBack: () => void;
  currentStep: number;
}

export const StepSelfie = ({
  data,
  onUpdate,
  onNext,
  onBack,
  currentStep,
}: Props) => {
  useEffect(() => {
    onUpdate({ selfie_url: "" });
  }, []);

  const handleConfirm = async (capturedImage: string) => {
    try {
      const selfieUrl = await uploadSelfie(capturedImage);

      if (!selfieUrl) {
        alert("Erro ao enviar selfie");
        return;
      }

      onUpdate({ selfie_url: selfieUrl });
      onNext(selfieUrl);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar selfie");
    }
  };

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={6}
      onBack={onBack}
      title="Sua Foto"
      description="Tire uma selfie para sua carteirinha digital"
    >
      <SelfieCapture onConfirm={handleConfirm} confirmLabel="Confirmar" />
    </FormWrapper>
  );
};
