// Para que este arquivo funcione, precisamos criar placeholders para os tipos importados.
// Veja o Passo 2.
import type { FinalSchedule, AssignedCompulsoryDaysOff, ReasoningLog } from "../utils/scheduleAlgorithm";
import type { BeachPost } from "./BeachPost";
import type { Lifeguard } from "./Lifeguard";

export type SavedSchedule = {
  id: string;
  name: string;
  savedAt: string; // ISO Date String

  // Um snapshot de tudo que foi usado para gerar a escala
  inputs: {
    startDate: string;
    endDate: string;
    g1Shifts: number;
    g2Shifts: number;
    capacityMatrix: { [postId: string]: { [date: string]: number } };
    requestedDaysOff: { [lifeguardId: string]: { [date: string]: boolean } };
    snapshotLifeguards: Lifeguard[];
    snapshotPosts: BeachPost[];
  };

  // Os resultados gerados pelo algoritmo
  outputs: {
    schedule: FinalSchedule;
    compulsoryDaysOff: AssignedCompulsoryDaysOff;
    reasoningLog: ReasoningLog;
  };
};