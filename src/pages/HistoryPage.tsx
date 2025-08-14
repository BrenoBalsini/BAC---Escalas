import { Link } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type SavedSchedule } from "../types/SavedSchedule";
import { FaTrash } from "react-icons/fa6";

export default function HistoryPage() {
  const [scheduleHistory, setScheduleHistory] = useLocalStorage<
    SavedSchedule[]
  >("bac-schedule-history", []);

  const handleDelete = (idToDelete: string) => {
    if (
      window.confirm("Tem certeza que deseja excluir esta escala do histórico?")
    ) {
      const updatedHistory = scheduleHistory.filter(
        (schedule) => schedule.id !== idToDelete
      );
      setScheduleHistory(updatedHistory);
    }
  };

  
  const sortedHistory = [...scheduleHistory].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Histórico de Escalas
      </h1>

      <div className="space-y-4">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <div className="flex-grow text-center sm:text-left">
                <Link
                  to={`/schedule/${schedule.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-lg"
                >
                  {schedule.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Salva em:{" "}
                  {new Date(schedule.savedAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="px-6 py-4">
                <button 
								onClick={() => handleDelete(schedule.id)}
								className="text-red-600 hover:text-red-900">
									
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-500">
              Nenhuma escala foi salva no histórico ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
