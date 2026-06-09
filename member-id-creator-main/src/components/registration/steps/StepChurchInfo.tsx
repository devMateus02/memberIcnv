import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormWrapper } from "../FormWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { getMinistries } from "../../../api/ministries.api";

export const StepChurchInfo = ({
  data,
  onUpdate,
  onNext,
  onBack,
  currentStep,
}) => {
  const [hasMinistry, setHasMinistry] = useState(
    (data.ministries?.length ?? 0) > 0
  );

  // 🔹 NOVO
  const [isBaptized, setIsBaptized] = useState(
    Boolean(data.baptismDate)
  );

  const [ministries, setMinistries] = useState([]);

  const [selectedMinistries, setSelectedMinistries] = useState(
    data.ministries || []
  );

  // 🔹 Buscar ministérios do backend
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await getMinistries();

        console.log("MINISTERIOS:", response);

        setMinistries(response || []);
      } catch (err) {
        console.error("Erro ao buscar ministérios:", err);
      }
    };

    fetchMinistries();
  }, []);

  const toggleMinistry = (id) => {
    setSelectedMinistries((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    onUpdate({
      baptismDate: isBaptized
        ? data.baptismDate
        : "",
      ministries: hasMinistry
        ? selectedMinistries
        : [],
    });

    onNext();
  };

  return (
    <FormWrapper
      currentStep={currentStep}
      totalSteps={7}
      onBack={onBack}
      title="Vida na Igreja"
      description="Conte um pouco mais sobre sua caminhada"
    >
      <div className="space-y-6">

        {/* 🔹 BOTÃO CONDICIONAL BATISMO */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isBaptized}
              onCheckedChange={(v) =>
                setIsBaptized(Boolean(v))
              }
            />

            <span className="text-sm">
              Já é batizado?
            </span>
          </div>

          <AnimatePresence>
            {isBaptized && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <label className="text-sm font-medium">
                  Data de batismo
                </label>

                <input
                  type="date"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={data.baptismDate || ""}
                  onChange={(e) =>
                    onUpdate({
                      baptismDate: e.target.value,
                    })
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Checkbox ministério */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={hasMinistry}
            onCheckedChange={(v) =>
              setHasMinistry(Boolean(v))
            }
          />

          <span className="text-sm">
            Faz parte de algum ministério?
          </span>
        </div>

        {/* Ministérios */}
        <AnimatePresence>
          {hasMinistry && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-2"
            >
              <p className="text-sm font-medium">
                Selecione os ministérios
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                {ministries.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum ministério encontrado
                  </p>
                )}

                {ministries.map((ministry) => (
                  <label
                    key={ministry.id}
                    className="flex items-center gap-2 rounded-md border p-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedMinistries.includes(
                        ministry.id
                      )}
                      onCheckedChange={() =>
                        toggleMinistry(ministry.id)
                      }
                    />

                    <span className="text-sm">
                      {ministry.name}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleNext}
          disabled={
            hasMinistry &&
            selectedMinistries.length === 0
          }
        >
          Continuar
        </Button>
      </div>
    </FormWrapper>
  );
}