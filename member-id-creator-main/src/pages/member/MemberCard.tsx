import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer, Loader2 } from "lucide-react";
import { getUserProfile } from "../../api/users.api";
import { format } from "date-fns";

function formatDateSafe(value?: string | null): string {
  if (!value) return "—";
  const datePart = String(value).split("T")[0]; // "2000-05-15"
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return "—";
  return `${day}/${month}/${year}`;
}

interface CardFrontProps {
  user: any;
  titulo: string;
  domRef?: React.RefObject<HTMLDivElement>;
}

function CardFront({ user, titulo, domRef }: CardFrontProps) {
  return (
    <div
      ref={domRef}
      className="w-full h-full rounded-xl shadow-2xl overflow-hidden flex bg-white"
    >
      {/* BLOCO AZUL */}
      <div className="w-[140px] bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-blue-900 rounded-r-[120px]" />
        <img
          src={user.selfie_url}
          alt={user.name}
          className="relative z-10 w-28 h-28 rounded-full object-cover border-2 border-white"
        />
      </div>

      {/* CONTEÚDO */}
      <div
        className="flex-1 px-5 py-4 relative"
        style={{
          backgroundImage: "url('/bg_carterinha.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase">
              Igreja Cristã Nova Vida Vila Emil
            </p>
            <p className="text-[10px] text-gray-600">
              Rua Crispim 115 – Mesquita/RJ
            </p>
          </div>
          <img src="/Logo.png" className="w-[50px]" />
        </div>

        <p className="text-center text-[13px] mt-2 font-medium">{titulo}</p>

        <div className="mt-2 space-y-2">
          <div>
            <label className="text-[11px] text-gray-500">Nome</label>
            <div className="text-[11px]">{user.name}</div>
          </div>

          <div className="flex gap-6">
            <div>
              <label className="text-[11px] text-gray-500">Batismo</label>
              <div className="text-[11px]">{formatDateSafe(user.baptism_date)}</div>
            </div>

            <div>
              <label className="text-[11px] text-gray-500">Nascimento</label>
              <div className="text-[11px]">{formatDateSafe(user.birth_date)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardBack({ domRef }: { domRef?: React.RefObject<HTMLDivElement> }) {
  return (
    <div
      ref={domRef}
      className="w-full h-full rounded-xl shadow-lg overflow-hidden relative"
      style={{
        backgroundImage: "url('/bg_carterinha.jpg')",
        backgroundSize: "cover",
      }}
    >
      {/* ONDA SVG */}
      <svg
        viewBox="0 0 420 120"
        className="absolute bottom-0 left-0 w-full h-[180px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C80,20 160,60 240,45 320,20 360,40 420,30 L420,120 L0,120 Z"
          fill="#1e3a8a"
        />
      </svg>

      {/* CONTEÚDO */}
      <div className="relative z-10 p-4 flex">
        <img src="/Logo_trans.png" className="w-[60px]" />
        <div className="ml-6">
          <p className="text-[15px] font-semibold uppercase">Igreja Cristã Nova Vida</p>
          <p className="text-[12px] text-gray-600">Vila Emil – Mesquita/RJ</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 w-full px-4 pb-2 flex justify-between items-center text-white text-[10px] z-10">
        <span>Igreja Cristã Nova Vida</span>
        <img src="/assinatura.png" className="w-[160px]" />
        <span>Emitido em {format(new Date(), "dd/MM/yyyy")}</span>
      </div>
    </div>
  );
}

export function MemberCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lado, setLado] = useState<"frente" | "verso">("frente");
  const [printing, setPrinting] = useState(false);

  // faces ocultas (sempre montadas) usadas só pra capturar frente + verso juntos na impressão
  const printFrontRef = useRef<HTMLDivElement>(null);
  const printBackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error("Erro ao carregar usuário", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-sm text-gray-500">
        Carregando carteirinha...
      </div>
    );
  }

  if (!user || user.status !== "active") return null;

  const getTituloCarteirinha = (ministries: string[] = []) => {
    const m = ministries.filter(Boolean).map((x) => x.toLowerCase());

    if (m.some((x) => x.includes("pastoral"))) return "Carteirinha de Pastor";
    if (m.some((x) => x.includes("diáconato") || x.includes("diaconato")))
      return "Carteirinha de Diácono";

    return "Carteirinha de Membro";
  };

  const titulo = getTituloCarteirinha(user.ministries);

  const handlePrint = async () => {
    if (!printFrontRef.current || !printBackRef.current) return;

    setPrinting(true);
    try {
      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(printFrontRef.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        }),
        html2canvas(printBackRef.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        }),
      ]);

      const frontImg = frontCanvas.toDataURL("image/png");
      const backImg = backCanvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageWidth = 210;
      const cardWidth = 170;
      const cardHeight = cardWidth * (200 / 380); // mantém a proporção 380x200 do card
      const x = (pageWidth - cardWidth) / 2;
      const gap = 14;
      const topY = 34;

      pdf.setFontSize(14);
      pdf.text(titulo, pageWidth / 2, 20, { align: "center" });

      pdf.addImage(frontImg, "PNG", x, topY, cardWidth, cardHeight);
      pdf.addImage(backImg, "PNG", x, topY + cardHeight + gap, cardWidth, cardHeight);

      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    } catch (err) {
      console.error("Erro ao gerar impressão:", err);
      alert("Erro ao gerar a carteirinha para impressão");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 overflow-hidden py-6">
      {/* 📱 MOBILE ROTATION (TAILWIND) */}
      <div className="min-h-[75vh] flex justify-center items-center">
        <button
          onClick={() => setLado(lado === "frente" ? "verso" : "frente")}
          className="
            fixed top-16 right-2
            w-12 h-12
            rounded-full
            bg-blue-600 text-white
            flex items-center justify-center
            shadow-lg
            active:scale-95
            transition
            z-50
          "
          aria-label="Virar carteirinha"
        >
          {/* ÍCONE DE DUAS SETAS */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 014-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 01-4 4H3" />
          </svg>
        </button>

        <button
          onClick={handlePrint}
          disabled={printing}
          className="
            fixed top-32 right-2
            w-12 h-12
            rounded-full
            bg-blue-600 text-white
            flex items-center justify-center
            shadow-lg
            active:scale-95
            transition
            disabled:opacity-60
            z-50
          "
          aria-label="Imprimir carteirinha (frente e verso)"
        >
          {printing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Printer className="w-6 h-6" />}
        </button>

        <div
          className="
            relative w-[380px] h-[200px]

            rotate-90 scale-100
            sm:rotate-0

            transition-transform duration-300
            origin-center
          "
        >
          <AnimatePresence mode="wait">
            {/* ================== FRENTE ================== */}
            {lado === "frente" && (
              <motion.div
                key="frente"
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 180, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                <CardFront user={user} titulo={titulo} />
              </motion.div>
            )}

            {/* ================== VERSO ================== */}
            {lado === "verso" && (
              <motion.div
                key="verso"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -180, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                <CardBack />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* faces ocultas, sempre montadas, usadas só pra gerar a impressão com as 2 faces de uma vez */}
      <div className="h-0 w-0 overflow-hidden" aria-hidden="true">
        <div className="w-[380px] h-[200px]">
          <CardFront user={user} titulo={titulo} domRef={printFrontRef} />
        </div>
        <div className="w-[380px] h-[200px]">
          <CardBack domRef={printBackRef} />
        </div>
      </div>
    </div>
  );
}
