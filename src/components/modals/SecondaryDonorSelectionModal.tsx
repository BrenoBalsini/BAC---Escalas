import { FaTimes, FaUsers } from "react-icons/fa";
import { type TriangulationOpportunity } from "./TriangulationModal";
import * as Button from "../ui/Button";
import { type BeachPost } from "../../types/BeachPost";
import { useMemo } from "react";

interface SecondaryDonorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (opportunity: TriangulationOpportunity) => void;
  opportunities: TriangulationOpportunity[];
  allPosts: BeachPost[];
}

export default function SecondaryDonorSelectionModal({
  isOpen,
  onClose,
  onSelect,
  opportunities,
  allPosts,
}: SecondaryDonorSelectionModalProps) {
  const postMap = useMemo(() => {
    return new Map(allPosts.map((post) => [post.id, post.name]));
  }, [allPosts]);

  // NOVO: Hook useMemo para filtrar e remover as duplicatas antes de renderizar.
  // Isso garante que cada par (Doador -> Posto Alvo) apareça apenas uma vez.
  const uniqueOpportunities = useMemo(() => {
    const opportunityMap = new Map<string, TriangulationOpportunity>();
    for (const op of opportunities) {
      const key = `${op.donor.id}-${op.postToWork.id}`;
      // Se a chave ainda não existe no mapa, nós a adicionamos.
      if (!opportunityMap.has(key)) {
        opportunityMap.set(key, op);
      }
    }
    return Array.from(opportunityMap.values());
  }, [opportunities]);

  if (!isOpen) {
    return null;
  }

  const handleSelectAndClose = (opportunity: TriangulationOpportunity) => {
    onSelect(opportunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* MUDANÇA: Adicionado h-[36rem] e flex flex-col para controlar a altura */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg h-[36rem] flex flex-col">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            Selecionar Doador (Entre Postos)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        {/* MUDANÇA: Adicionado flex-grow e overflow-hidden para a área de conteúdo */}
        <div className="space-y-3 flex-grow overflow-hidden flex flex-col">
          <p className="text-sm text-gray-600">
            Foram encontrados doadores em outros postos. Escolha a melhor opção
            para <strong>{opportunities[0]?.receiver.name}</strong>,
            considerando a proximidade.
          </p>
          {/* MUDANÇA: Adicionado h-full para a lista ocupar o espaço disponível */}
          <ul className="space-y-2 pr-2 h-full overflow-y-auto">
            {/* MUDANÇA: Mapeando a nova lista 'uniqueOpportunities' */}
            {uniqueOpportunities.map((opportunity, index) => {
              const donorHomePost =
                postMap.get(opportunity.donor.preferenceA_id ?? "") ||
                "Não definido";
              const targetPostName = opportunity.postToWork.name;

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
                      Viria do <strong>{donorHomePost}</strong> para cobrir o
                      posto <strong>{targetPostName}</strong>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
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