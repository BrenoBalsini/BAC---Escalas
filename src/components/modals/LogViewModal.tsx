import React from 'react';
import { FaTimes } from 'react-icons/fa';
import type { ReasoningLog } from '../../utils/scheduleAlgorithm';
import type { Lifeguard } from '../../types/Lifeguard';

type LogViewerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  log: ReasoningLog | null;
  lifeguards: Lifeguard[];
  days: string[];
};

const LogViewerModal: React.FC<LogViewerModalProps> = ({ isOpen, onClose, log, lifeguards, days }) => {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Log de Raciocínio do Algoritmo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-6 overflow-auto">
          {/* A lógica para renderizar o log virá aqui */}
          <p className="text-gray-600 mb-4">
            Aqui será exibida a tabela detalhada com o status de cada guarda-vidas em cada dia.
          </p>
          {/* Exemplo de como percorrer o log: */}
          <div className="space-y-4">
            {lifeguards.sort((a,b) => a.rank - b.rank).map(lg => (
              <div key={lg.id}>
                <h3 className="font-semibold text-blue-700">{lg.name}</h3>
                <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                  {days.map(day => {
                    const entry = log[lg.id]?.[day];
                    if (!entry) return null;
                    return (
                      <li key={day}>
                        <strong>{new Date(day + 'T00:00:00').toLocaleDateString('pt-BR')}:</strong> {entry.status} - <span className="text-gray-500">{entry.details}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewerModal;