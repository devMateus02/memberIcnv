import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '../FormWrapper';
import { RegistrationData } from '@/types/registration';
import {
  Camera,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { FaceDetection } from '@mediapipe/face_detection';
import { Camera as MPCamera } from '@mediapipe/camera_utils';
import { uploadSelfie } from '@/api/users.api';
interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

type CameraStatus = 'loading' | 'ready' | 'error' | 'captured';
type FaceStatus = 'no_face' | 'too_far' | 'not_centered' | 'ready';

export const StepSelfie = ({
  data,
  onUpdate,
  onNext,
  onBack,
  currentStep,
}: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const mpCameraRef = useRef<MPCamera | null>(null);

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading');
  const [capturedImage, setCapturedImage] = useState<string | null>(
   
  );
  const [faceStatus, setFaceStatus] = useState<FaceStatus>('no_face');
  const [canCapture, setCanCapture] = useState(false);

  const handleUserMedia = useCallback(() => {
    setCameraStatus('ready');
  }, []);

  const handleUserMediaError = useCallback(() => {
    setCameraStatus('error');
  }, []);

  /* 🔥 IA LOCAL – MediaPipe */
  useEffect(() => {
    if (cameraStatus !== 'ready') return;
    if (!webcamRef.current?.video) return;

    const video = webcamRef.current.video;

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.6,
    });

    faceDetection.onResults((results) => {
      if (!results.detections || results.detections.length !== 1) {
        setFaceStatus('no_face');
        setCanCapture(false);
        return;
      }

      const box = results.detections[0].boundingBox;
      if (!box) return;

      const { width, height, xCenter, yCenter } = box;

      // 🔎 Distância do rosto
      if (width < 0.25 || height < 0.35) {
        setFaceStatus('too_far');
        setCanCapture(false);
        return;
      }

      // 🎯 Centralização
      if (
        xCenter < 0.4 ||
        xCenter > 0.6 ||
        yCenter < 0.35 ||
        yCenter > 0.65
      ) {
        setFaceStatus('not_centered');
        setCanCapture(false);
        return;
      }

      setFaceStatus('ready');
      setCanCapture(true);
    });

    mpCameraRef.current = new MPCamera(video, {
      onFrame: async () => {
        await faceDetection.send({ image: video });
      },
      width: 480,
      height: 640,
    });

    mpCameraRef.current.start();

    return () => {
      mpCameraRef.current?.stop();
    };
  }, [cameraStatus]);

  const capture = useCallback(() => {
    if (!canCapture) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setCameraStatus('captured');
    }
  }, [canCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setCameraStatus('ready');
  }, []);

const confirm = useCallback(async () => {
  if (!capturedImage) return;

  try {
    const selfieUrl = await uploadSelfie(capturedImage);
    onUpdate({ selfie_url: selfieUrl });
    onNext();
  } catch (err) {
    console.error(err);
    alert("Erro ao enviar selfie");
  }
}, [capturedImage, onUpdate, onNext]);


  const getFaceStatusMessage = () => {
    switch (faceStatus) {
      case 'no_face':
        return { text: 'Posicione seu rosto na câmera', color: 'text-warning' };
      case 'too_far':
        return { text: 'Aproxime o rosto', color: 'text-warning' };
      case 'not_centered':
        return { text: 'Centralize o rosto', color: 'text-warning' };
      case 'ready':
        return {
          text: 'Rosto alinhado – pronto para capturar',
          color: 'text-success',
        };
    }
  };

  const statusMessage = getFaceStatusMessage();

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={6}
      onBack={onBack}
      title="Sua Foto"
      description="Tire uma selfie para sua carteirinha digital"
    >
      <div className="space-y-6">
        <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-2xl bg-muted">
          <AnimatePresence mode="wait">
            {cameraStatus === 'loading' && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p>Iniciando câmera...</p>
              </motion.div>
            )}

            {cameraStatus === 'error' && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p>Câmera não disponível</p>
              </motion.div>
            )}

            {(cameraStatus === 'ready' || cameraStatus === 'loading') &&
              !capturedImage && (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: 'user',
                    aspectRatio: 3 / 4,
                  }}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                  className="absolute inset-0 w-full h-full object-cover"
                  mirrored
                />
              )}

            {cameraStatus === 'captured' && capturedImage && (
              <img
                src={capturedImage}
                alt="Selfie"
                className="w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>

        {cameraStatus === 'ready' && (
          <p className={`text-center font-medium ${statusMessage.color}`}>
            {statusMessage.text}
          </p>
        )}

        {cameraStatus === 'ready' && (
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={capture}
            disabled={!canCapture}
          >
            <Camera className="w-5 h-5 mr-2" />
            Tirar Foto
          </Button>
        )}

        {cameraStatus === 'captured' && capturedImage && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={retake}>
              <RotateCcw className="w-5 h-5 mr-2" />
              Refazer
            </Button>
            <Button variant="hero" className="flex-1" onClick={confirm}>
              <Check className="w-5 h-5 mr-2" />
              Confirmar
            </Button>
          </div>
        )}
      </div>
    </FormWrapper>
  );
};
