import React, { useState } from "react";
import type { Lifeguard } from "../../types/Lifeguard";
import * as Button from "../ui/Button"; // Usando nosso componente de botão
import { FaTimes } from "react-icons/fa";

// Definindo as propriedades que o modal receberá
type AddLifeguardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddLifeguard: (
    newLifeguard: Omit<
      Lifeguard,
      "id" | "group" | "preferenceA_id" | "preferenceB_id"
    >
  ) => void;
  nextRank: number;
};

const AddLifeguardModal: React.FC<AddLifeguardModalProps> = ({
  isOpen,
  onClose,
  onAddLifeguard,
  nextRank,
}) => {
  const [name, setName] = useState("");
  const [rank, setRank] = useState(nextRank);

  // Atualiza o rank no formulário se o nextRank mudar (após adicionar um GVC)
  React.useEffect(() => {
    setRank(nextRank);
  }, [nextRank]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome é obrigatório.");
      return;
    }
    onAddLifeguard({ name, rank });
    // Limpa o nome para o próximo cadastro e mantém o modal aberto
    setName("");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Adicionar Novo Salva-Vidas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="rank"
                className="block text-sm font-medium text-gray-700"
              >
                Classificação (Rank)
              </label>
              <input
                type="number"
                id="rank"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                readOnly // O Rank é automático
              />
            </div>
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg gap-2">
            <Button.Root>
              <Button.ButtonComponent
                variant="primary"
                onClick={onClose}
                type="button"
              >
                <span>Fechar</span>
              </Button.ButtonComponent>
            </Button.Root>
            <Button.Root>
              <Button.ButtonComponent
                type="submit"
              >
                <span>Salvar e Adicionar Próximo</span>
              </Button.ButtonComponent>
            </Button.Root>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLifeguardModal;