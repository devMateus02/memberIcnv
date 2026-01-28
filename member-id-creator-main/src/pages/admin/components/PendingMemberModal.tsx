import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PendingMemberModal({ member, onClose }) {
  const [lado, setLado] = useState<"frente" | "verso">("frente");

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  const refAtual = lado === "frente" ? cardFrontRef : cardBackRef;
console.log("MEMBRO NO MODAL:", member.selfie_url);
  const downloadPDF = async () => {
    if (!refAtual.current) return;

    refAtual.current.style.transform = "none";

    const canvas = await html2canvas(refAtual.current, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [450, 450],
  });

  pdf.addImage(imgData, "PNG", 12, 12, 200, 100);
  pdf.save(`carteirinha-${member.name}.pdf`);
  };

  const getTituloCarteirinha = (member) => {
    if (!member?.ministries) return "Carteirinha de Membro";

    const m = member.ministries.toLowerCase();

    if (m.includes("pastoral")) return "Carteirinha de Pastor";
    if (m.includes("diáconato") || m.includes("diaconato"))
      return "Carteirinha de Diácono";

    return "Carteirinha de Membro";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-1 ">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg max-h-[95vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-700">Dados do Membro</h3>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">

            {/* DADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm w-full max-w-xl">
              {[
                ["Nome", member.name],
                ["Status", member.status],
                ["Email", member.email],
                ["Telefone 1", member.phone1],
                ["Telefone 2", member.phone2],
                ["Sexo", member.sex],
                [
                  "Nascimento",
                  member.birth_date
                    ? format(parseISO(member.birth_date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "",
                ],
                ["Mãe", member.mother_name],
                ["Pai", member.father_name],
                ["Endereço", member.address_street],
                ["Número", member.address_number],
                ["Bairro", member.neighborhood],
                ["Cidade", member.city],
                ["Estado", member.state],
                ["CEP", member.zip_code],
                [
                  "Batismo",
                  member.baptism_date
                    ? format(parseISO(member.baptism_date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {label}
                  </label>
                  <input
                    value={value || ""}
                    readOnly
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                  />
                </div>
              ))}
            </div>

            {/* CARTEIRINHA */}
            <div className="flex flex-col items-center gap-4 px-3">
              <div className="  origin-top">
                <div className="relative w-[420px] h-[220px]">
                  <AnimatePresence mode="wait">

                    {/* ================= FRENTE ================= */}
                    {lado === "frente" && (
                      <motion.div
                        key="frente"
                        initial={{ rotateY: -180, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 180, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <div
                          ref={cardFrontRef}
                          className="w-[420px] h-[220px] rounded-xl shadow-lg overflow-hidden bg-white flex"
                        >
                          {/* BLOCO AZUL */}
                          <div className="w-[140px] bg-blue-900 relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-r-[120px] bg-blue-800" />
                            <div className="relative z-10 w-28 h-28 rounded-full border-2 border-white overflow-hidden">
                             <img
  src={member.selfie_url}
  alt={`Selfie de ${member.name}`}
  className="w-full h-full object-cover"
  crossOrigin="anonymous"
  referrerPolicy="no-referrer"
  loading="eager"
/>

                            </div>
                          </div>

                          {/* CONTEÚDO */}
                          <div
                            className="flex-1 px-4 py-3"
                            style={{
                              backgroundImage: "url('/bg_carterinha.jpg')",
                              backgroundSize: "cover",
                            }}
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="text-[11px] font-semibold">
                                  Igreja Cristã Nova Vida
                                </p>
                                <p className="text-[10px] text-gray-600">
                                  Mesquita - RJ
                                </p>
                              </div>
                              <img src="/Logo.png" className="w-12" />
                            </div>

                            <p className="text-center text-sm mt-2">
                              {getTituloCarteirinha(member)}
                            </p>

                            <div className="mt-2 text-[11px]">
                              <p><strong>Nome:</strong> {member.name}</p>
                              <p>
                                <strong>Batismo:</strong>{" "}
                                {member.baptism_date
                                  ? format(
                                      parseISO(member.baptism_date),
                                      "dd/MM/yyyy",
                                      { locale: ptBR }
                                    )
                                  : "—"}
                              </p>
                              <p>
                                <strong>Nascimento:</strong>{" "}
                                {member.birth_date
                                  ? format(
                                      parseISO(member.birth_date),
                                      "dd/MM/yyyy",
                                      { locale: ptBR }
                                    )
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ================= VERSO ================= */}
                    {lado === "verso" && (
                      <motion.div
                        key="verso"
                        initial={{ rotateY: 180, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -180, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <div
                          ref={cardBackRef}
                          className="w-[420px] h-[220px] rounded-xl shadow-lg relative overflow-hidden"
                          style={{
                            backgroundImage: "url('/bg_carterinha.jpg')",
                            backgroundSize: "cover",
                          }}
                        >
                          <svg
                            viewBox="0 0 420 120"
                            className="absolute bottom-0 w-full h-[190px]"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0,60 C80,20 160,60 240,45 320,20 360,40 420,30 L420,120 L0,120 Z"
                              fill="#1e3a8a"
                            />
                          </svg>

                          <div className="relative z-10 p-4 flex gap-4">
                            <img src="Logo_trans.png" className="w-14" />
                            <div>
                              <p className="font-semibold">
                                Igreja Cristã Nova Vida
                              </p>
                              <p className="text-xs">
                                Rua Crispim 115 – Mesquita
                              </p>
                            </div>
                          </div>

                          <div className="absolute bottom-2 w-full px-4 flex justify-center text-white text-[10px] z-20">
                            <img src="assinatura.png" className="w-42 z-[10]" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>

              <button
                onClick={() => setLado(lado === "frente" ? "verso" : "frente")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ver {lado === "frente" ? "Verso" : "Frente"}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between px-4 py-3 border-t bg-gray-50">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Baixar PDF
          </button>
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
