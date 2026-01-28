import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "../FormWrapper";
import { RegistrationData } from "@/types/registration";
import {
  Camera,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { uploadSelfie } from "@/api/users.api";

import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

type CameraStatus = "loading" | "ready" | "error" | "captured";

type FaceStatus =
  | "no_face"
  | "too_far"
  | "too_close"
  | "not_centered"
  | "ready";

export const StepSelfie = ({
  data,
  onUpdate,
  onNext,
  onBack,
  currentStep,
}: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>("loading");
  const [capturedImage, setCapturedImage] =
    useState<string | null>(null);
  const [faceStatus, setFaceStatus] =
    useState<FaceStatus>("no_face");
  const [canCapture, setCanCapture] = useState(false);

  const lastFaceStatus = useRef<FaceStatus>("no_face");
  const lastCanCapture = useRef(false);

  const updateStatus = (status: FaceStatus, capture: boolean) => {
    if (lastFaceStatus.current !== status) {
      lastFaceStatus.current = status;
      setFaceStatus(status);
    }

    if (lastCanCapture.current !== capture) {
      lastCanCapture.current = capture;
      setCanCapture(capture);
    }
  };

  const handleUserMedia = useCallback(() => {
    setCameraStatus("ready");
  }, []);

  const handleUserMediaError = useCallback(() => {
    setCameraStatus("error");
  }, []);

  /* 🔥 Inicializa MediaPipe */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (cancelled) return;

        landmarkerRef.current =
          await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          });
      } catch (err) {
        console.error("Erro MediaPipe:", err);
        updateStatus("ready", true); // fallback
      }
    };

    init();

    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  /* 🔥 Loop de detecção (ROI SAFE) */
  useEffect(() => {
    if (cameraStatus !== "ready") return;

    let rafId = 0;
    let lastTime = -1;

    const loop = () => {
      const video = webcamRef.current?.video;
      const landmarker = landmarkerRef.current;

      // ⛔ GUARDA DEFINITIVA (evita ROI 0x0)
      if (
        !video ||
        !landmarker ||
        video.readyState < 2 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime;

        let result;
        try {
          result = landmarker.detectForVideo(video, Date.now());
        } catch (err) {
          console.warn("Frame inválido, pulando");
          rafId = requestAnimationFrame(loop);
          return;
        }

        if (!result.faceLandmarks?.length) {
          updateStatus("no_face", false);
        } else {
          const landmarks = result.faceLandmarks[0];
// 📐 Altura do rosto (testa → queixo)
const forehead = landmarks[10];
const chin = landmarks[152];

const faceHeight = Math.abs(forehead.y - chin.y);

// 🔍 limites dinâmicos (funcionam em celular)
if (faceHeight < 0.28) {
  updateStatus("too_far", false);
} else if (faceHeight > 0.45) {
  updateStatus("too_close", false);
} else {

            const nose = landmarks[1];

            if (
              nose.x < 0.35 ||
              nose.x > 0.65 ||
              nose.y < 0.30 ||
              nose.y > 0.70
            ) {
              updateStatus("not_centered", false);
            } else {
              updateStatus("ready", true);
            }
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [cameraStatus]);

  const capture = useCallback(() => {
    if (!canCapture) return;

    const image = webcamRef.current?.getScreenshot();
    if (image) {
      setCapturedImage(image);
      setCameraStatus("captured");
    }
  }, [canCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setCameraStatus("ready");
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
      case "no_face":
        return { text: "Posicione seu rosto na câmera", color: "text-warning" };
      case "too_far":
        return { text: "Aproxime o rosto", color: "text-warning" };
      case "too_close":
        return { text: "Afaste um pouco o rosto", color: "text-warning" };
      case "not_centered":
        return { text: "Centralize o rosto", color: "text-warning" };
      case "ready":
        return {
          text: "Rosto na posição ideal – pronto para capturar",
          color: "text-success",
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
            {cameraStatus === "loading" && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p>Iniciando câmera...</p>
              </motion.div>
            )}

            {cameraStatus === "error" && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p>Câmera não disponível</p>
              </motion.div>
            )}

            {cameraStatus !== "captured" && (
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {cameraStatus === "captured" && capturedImage && (
              <img
                src={capturedImage}
                alt="Selfie"
                className="w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>

        {cameraStatus === "ready" && (
          <p className={`text-center font-medium ${statusMessage.color}`}>
            {statusMessage.text}
          </p>
        )}

        {cameraStatus === "ready" && (
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

        {cameraStatus === "captured" && (
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
