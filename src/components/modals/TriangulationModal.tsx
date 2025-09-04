import { type Lifeguard } from "../../types/Lifeguard";
import { type BeachPost } from "../../types/BeachPost";
import * as Button from "../ui/Button";
import { FaExchangeAlt, FaTimes } from "react-icons/fa";

// Interface atualizada para incluir os detalhes da troca de 2 dias
export interface TriangulationOpportunity {
  donor: Lifeguard;
  receiver: Lifeguard;
  donationDay: string; // Dia que o doador cede a FC
  receiverWorkDay: string; // Dia que o receptor vai trabalhar e o doador folgar
  postToWork: BeachPost; // Posto do donationDay
  donorOriginalWorkPostId: string; // Posto original do doador no receiverWorkDay
}

interface TriangulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (opportunity: TriangulationOpportunity) => void;
  opportunity: TriangulationOpportunity | null;
}

export default function TriangulationModal({
  isOpen,
  onClose,
  onConfirm,
  opportunity,
}: TriangulationModalProps) {
  if (!isOpen || !opportunity) return null;

  const { donor, receiver, donationDay, receiverWorkDay, postToWork } =
    opportunity;

  // Formata ambas as datas para exibição
  const formattedDonationDate = new Date(
    donationDay + "T00:00:00"
  ).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const formattedReceiverWorkDate = new Date(
    receiverWorkDay + "T00:00:00"
  ).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaExchangeAlt className="text-blue-500" />
            Proposta de Triangulação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-gray-600">
            Uma otimização foi encontrada para ajudar{" "}
            <strong className="text-orange-600">{receiver.name}</strong> a
            completar sua cota, sem alterar o total de diárias de{" "}
            <strong className="text-green-600">{donor.name}</strong>.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Mudanças Propostas:
            </h3>
            <ul className="list-disc list-inside space-y-3">
              <li>
                No dia <strong>{formattedDonationDate}</strong>:
                <ul className="list-['-_'] list-inside pl-4 mt-1 text-gray-700">
                  <li>
                    <strong className="text-green-600">{donor.name}</strong>{" "}
                    (Doador){" "}
                    <strong className="text-green-700">TRABALHARÁ</strong> no
                    posto <strong>{postToWork.name}</strong> (cobrindo o
                    déficit).
                  </li>
                </ul>
              </li>
              <li>
                No dia <strong>{formattedReceiverWorkDate}</strong>:
                <ul className="list-['-_'] list-inside pl-4 mt-1 text-gray-700">
                  <li>
                    <strong className="text-orange-600">
                      {receiver.name}
                    </strong>{" "}
                    (Receptor){" "}
                    <strong className="text-orange-700">TRABALHARÁ</strong> no
                    lugar do doador.
                  </li>
                  <li>
                    <strong className="text-green-600">{donor.name}</strong>{" "}
                    (Doador){" "}
                    <strong className="text-blue-700">RECEBERÁ A FOLGA</strong>{" "}
                    (FC) neste dia.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <p className="text-xs text-gray-500 pt-2">
            Ao confirmar, a escala será atualizada. Esta ação pode ser
            revertida manualmente se necessário.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button.Root>
            <Button.ButtonComponent variant="secondary" onClick={onClose}>
              Cancelar
            </Button.ButtonComponent>
          </Button.Root>
          <Button.Root>
            <Button.ButtonComponent
              variant="primary"
              onClick={() => onConfirm(opportunity)}
            >
              <Button.Icon icon={FaExchangeAlt} />
              Confirmar Troca
            </Button.ButtonComponent>
          </Button.Root>
        </div>
      </div>
    </div>
  );
}