import { FaTimes, FaUserCheck } from "react-icons/fa";
import { type TriangulationOpportunity } from "./TriangulationModal";
import * as Button from "../ui/Button";

interface DonorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (opportunity: TriangulationOpportunity) => void;
  opportunities: TriangulationOpportunity[];
}

export default function DonorSelectionModal({
  isOpen,
  onClose,
  onSelect,
  opportunities,
}: DonorSelectionModalProps) {
  if (!isOpen) return null;

  const handleSelectAndClose = (opportunity: TriangulationOpportunity) => {
    onSelect(opportunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserCheck className="text-blue-500" />
            Selecione o Doador
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Múltiplos doadores foram encontrados. Escolha com qual deles você
            deseja realizar a troca para{" "}
            <strong>{opportunities[0]?.receiver.name}</strong>.
          </p>
          <ul className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {opportunities.map((opportunity, index) => {
              const formattedDate = new Date(
                opportunity.donationDay + "T00:00:00"
              ).toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
              });

              return (
                <li key={index}>
                  <button
                    onClick={() => handleSelectAndClose(opportunity)}
                    className="w-full text-left p-3 rounded-md border bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <div className="font-semibold text-gray-800">
                      <span className="font-bold text-green-700">
                        {opportunity.donor.name}
                      </span>{" "}
                      ({opportunity.donor.rank}º)
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Propõe trabalhar no dia{" "}
                      <span className="font-medium">{formattedDate}</span> para
                      ceder uma folga.
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-end mt-6">
          <Button.Root>
            <Button.ButtonComponent variant="secondary" onClick={onClose}>
              Cancelar
            </Button.ButtonComponent>
          </Button.Root>
        </div>
      </div>
    </div>
  );
}