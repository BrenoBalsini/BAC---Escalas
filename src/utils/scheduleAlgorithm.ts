import { type Lifeguard } from "../types/Lifeguard";
import { type BeachPost } from "../types/BeachPost";

export type ScheduleConfig = {
  period: { startDate: string; endDate: string };
  shiftQuotas: { G1: number; G2: number };
  capacityMatrix: { [postId: string]: { [date: string]: number } };
  requestedDaysOff: { [lifeguardId: string]: { [date: string]: boolean } };
  lifeguards: Lifeguard[];
  posts: BeachPost[];
  surplus: number;
};

export type FinalSchedule = {
  [date: string]: {
    [postId: string]: Lifeguard[];
  };
};

export type AssignedCompulsoryDaysOff = {
  [lifeguardId: string]: {
    [date: string]: boolean;
  };
};

export type LogEntry = {
  status: string;
  details: string;
};

export type ReasoningLog = {
  [lifeguardId: string]: {
    [date: string]: LogEntry;
  };
};

type TempSchedule = {
  [date: string]: {
    [postId: string]: string[];
  };
};

type WaitingList = {
  [date:string]: string[];
}

export const generateSchedule = (config: ScheduleConfig) => {
  const {
    period,
    shiftQuotas,
    capacityMatrix,
    requestedDaysOff,
    lifeguards,
    posts,
  } = config;

  const finalSchedule: FinalSchedule = {};
  const assignedFCs: AssignedCompulsoryDaysOff = {};
  const reasoningLog: ReasoningLog = {};

  const sortedLifeguards = [...lifeguards].sort((a, b) => a.rank - b.rank);

  const addLog = (lifeguardId: string, date: string, status: string, details: string) => {
    if (!reasoningLog[lifeguardId]) {
        reasoningLog[lifeguardId] = {};
    }
    reasoningLog[lifeguardId][date] = { status, details };
  };

  const days: string[] = [];
  const currentDate = new Date(period.startDate + "T00:00:00");
  const lastDate = new Date(period.endDate + "T00:00:00");
  while (currentDate <= lastDate) {
    days.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  days.forEach(day => {
    finalSchedule[day] = {};
    posts.forEach(post => {
      finalSchedule[day][post.id] = [];
    });
  });
  sortedLifeguards.forEach(lg => {
    assignedFCs[lg.id] = {};
    reasoningLog[lg.id] = {};
  });

  const tempSchedule: TempSchedule = {};
  days.forEach(day => {
    tempSchedule[day] = {};
    posts.forEach(post => tempSchedule[day][post.id] = []);

    sortedLifeguards.forEach(lg => {
        const isRequestedOff = requestedDaysOff[lg.id]?.[day];
        if (isRequestedOff) {
            addLog(lg.id, day, 'Folga Solicitada (FS)', 'A folga foi solicitada previamente pelo GVC.');
            return;
        }

        if (lg.preferenceA_id) {
            if (!tempSchedule[day][lg.preferenceA_id]) {
                tempSchedule[day][lg.preferenceA_id] = [];
            }
            tempSchedule[day][lg.preferenceA_id].push(lg.id);
            const postName = posts.find(p => p.id === lg.preferenceA_id)?.name || 'Desconhecido';
            addLog(lg.id, day, `Trabalhando (PA: ${postName})`, `[ETAPA A] Alocação inicial no Posto de Preferência A.`);
        } else {
            addLog(lg.id, day, 'Aguardando Alocação', '[ETAPA A] GVC não possui Posto de Preferência A definido.');
        }
    });
  });

  const waitingList: WaitingList = {};
  days.forEach(day => {
    waitingList[day] = [];
    posts.forEach(post => {
        const allocatedIds = tempSchedule[day][post.id];
        const capacity = capacityMatrix[post.id]?.[day] || 0;

        if (allocatedIds.length > capacity) {
            const confirmedIds = allocatedIds.slice(0, capacity);
            const waitingIds = allocatedIds.slice(capacity);
            
            tempSchedule[day][post.id] = confirmedIds;
            waitingList[day].push(...waitingIds);

            confirmedIds.forEach(id => {
                const lg = lifeguards.find(l => l.id === id);
                const postName = posts.find(p => p.id === post.id)?.name || 'Desconhecido';
                addLog(id, day, `Trabalhando (PA: ${postName})`, `[ETAPA B] Vaga confirmada. Rank ${lg?.rank}º está dentro da capacidade de ${capacity} do posto.`);
            });
            waitingIds.forEach(id => {
                addLog(id, day, 'Na Fila de Espera', `[ETAPA B] Excedeu a capacidade do posto de preferência. Aguardando vaga.`);
            });
        } else {
             allocatedIds.forEach(id => {
                const postName = posts.find(p => p.id === post.id)?.name || 'Desconhecido';
                addLog(id, day, `Trabalhando (PA: ${postName})`, `[ETAPA B] Vaga confirmada. Capacidade do posto (${capacity}) não foi excedida.`);
            });
        }
    });
  });

  sortedLifeguards.forEach(lg => {
    const quota = lg.group === 'G1' ? shiftQuotas.G1 : shiftQuotas.G2;
    
    const workingDays: string[] = [];
    days.forEach(day => {
        for (const postId in tempSchedule[day]) {
            if (tempSchedule[day][postId].includes(lg.id)) {
                workingDays.push(day);
                break;
            }
        }
    });
    
    let daysOffToAssign = workingDays.length - quota;
    let potentialFCDays = [...workingDays];

    while (daysOffToAssign > 0 && potentialFCDays.length > 0) {
        const existingOffDays = days.filter(day => requestedDaysOff[lg.id]?.[day] || assignedFCs[lg.id]?.[day]);
        const totalOffDays = existingOffDays.length + daysOffToAssign;
        const idealSpacing = days.length / (totalOffDays || 1);

        const scoredDays = potentialFCDays.map(day => {
            let score = 0;
            
            if (lg.group === 'G1' && lg.preferenceA_id) {
                const g1PeersAtPost = sortedLifeguards.filter(peer =>
                    peer.id !== lg.id &&
                    peer.group === 'G1' &&
                    peer.preferenceA_id === lg.preferenceA_id
                );
                const isPeerOff = g1PeersAtPost.some(peer =>
                    requestedDaysOff[peer.id]?.[day] || assignedFCs[peer.id]?.[day]
                );
                if (isPeerOff) {
                    score += 100;
                }
            }
            
            const tempOffDays = [...existingOffDays, day].sort();
            let spacingScore = 0;
            for (let i = 0; i < tempOffDays.length - 1; i++) {
                const diff = (new Date(tempOffDays[i+1]).getTime() - new Date(tempOffDays[i]).getTime()) / (1000 * 3600 * 24);
                spacingScore += Math.abs(diff - idealSpacing);
            }
            score += spacingScore;

            const date = new Date(day + "T00:00:00");
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) score += 5;

            const workingPostId = Object.keys(tempSchedule[day]).find(pId => tempSchedule[day][pId].includes(lg.id));
            if (workingPostId) {
                const capacity = capacityMatrix[workingPostId]?.[day] || 0;
                const currentStaff = tempSchedule[day][workingPostId].length;
                if(currentStaff - 1 < capacity && waitingList[day].length === 0) {
                    score += 10;
                }
            }

            return { day, score };
        }).sort((a, b) => a.score - b.score);

        if (scoredDays.length === 0) break;

        const dayToRest = scoredDays[0].day;
        const score = scoredDays[0].score;

        assignedFCs[lg.id][dayToRest] = true;
        addLog(lg.id, dayToRest, 'Folga Compulsória (FC)', `[ETAPA C] Folga atribuída para ajustar a quota e otimizar o espaçamento. Score: ${score.toFixed(2)}.`);

        for (const postId in tempSchedule[dayToRest]) {
            const index = tempSchedule[dayToRest][postId].indexOf(lg.id);
            if (index > -1) {
                tempSchedule[dayToRest][postId].splice(index, 1);
                break;
            }
        }

        potentialFCDays = potentialFCDays.filter(d => d !== dayToRest);
        daysOffToAssign--;
    }
  });

  days.forEach(day => {
    const waitingQueueForDay = [...(waitingList[day] || [])].sort((aId, bId) => {
        const aRank = lifeguards.find(l => l.id === aId)?.rank || 999;
        const bRank = lifeguards.find(l => l.id === bId)?.rank || 999;
        return aRank - bRank;
    });

    waitingQueueForDay.forEach(lgId => {
        const lg = lifeguards.find(l => l.id === lgId);
        if (!lg) return;

        const quota = lg.group === 'G1' ? shiftQuotas.G1 : shiftQuotas.G2;
        const currentWorkDays = days.filter(d => Object.values(tempSchedule[d]).some(ids => ids.includes(lg.id))).length;

        if (currentWorkDays >= quota) {
            assignedFCs[lg.id][day] = true;
            addLog(lgId, day, 'Folga por Excedente (FC)', `[ETAPA D] GVC já cumpriu a quota de ${quota} diárias. Permanece de folga para dar oportunidade a outros.`);
            return;
        }

        if (!lg.preferenceA_id) return;

        const paId = lg.preferenceA_id;
        const capacity = capacityMatrix[paId]?.[day] || 0;
        const currentStaffCount = tempSchedule[day][paId]?.length || 0;

        if (currentStaffCount < capacity) {
            tempSchedule[day][paId].push(lgId);
            const indexInWaiting = waitingList[day].indexOf(lgId);
            if (indexInWaiting > -1) {
                waitingList[day].splice(indexInWaiting, 1);
            }
            const postName = posts.find(p => p.id === paId)?.name || 'Desconhecido';
            addLog(lgId, day, `Trabalhando (PA: ${postName})`, `[ETAPA D] Realocado da fila de espera para o PA, preenchendo vaga aberta por uma Folga Compulsória.`);
        }
    });
  });

  days.forEach(day => {
      const availableLifeguards = sortedLifeguards.filter(lg => {
          const quota = lg.group === 'G1' ? shiftQuotas.G1 : shiftQuotas.G2;
          const currentWorkDays = days.filter(d => Object.values(tempSchedule[d]).some(ids => ids.includes(lg.id))).length;
          
          const isAlreadyWorking = Object.values(tempSchedule[day]).some(ids => ids.includes(lg.id));
          const isOff = requestedDaysOff[lg.id]?.[day] || assignedFCs[lg.id]?.[day];

          return currentWorkDays < quota && !isAlreadyWorking && !isOff;
      });

      if (availableLifeguards.length === 0) return;

      posts.forEach(post => {
          const capacity = capacityMatrix[post.id]?.[day] || 0;
          const currentStaffCount = tempSchedule[day][post.id]?.length || 0;
          let deficit = capacity - currentStaffCount;

          while (deficit > 0 && availableLifeguards.length > 0) {
              const lifeguardToAllocate = availableLifeguards.shift();
              if (lifeguardToAllocate) {
                  tempSchedule[day][post.id].push(lifeguardToAllocate.id);
                  addLog(lifeguardToAllocate.id, day, `Trabalhando (PX: ${post.name})`, `[ETAPA E] Alocado para preencher vaga em aberto no Posto ${post.name} e completar a quota de diárias.`);
                  
                  const quota = lifeguardToAllocate.group === 'G1' ? shiftQuotas.G1 : shiftQuotas.G2;
                  const currentWorkDays = days.filter(d => Object.values(tempSchedule[d]).some(ids => ids.includes(lifeguardToAllocate.id))).length;
                  if (currentWorkDays >= quota) {
                      const index = availableLifeguards.findIndex(lg => lg.id === lifeguardToAllocate.id);
                      if (index > -1) availableLifeguards.splice(index, 1);
                  }
                  
                  deficit--;
              }
          }
      });
  });

  days.forEach(day => {
      posts.forEach(post => {
          const lifeguardIds = tempSchedule[day][post.id];
          finalSchedule[day][post.id] = lifeguardIds.map(id => lifeguards.find(lg => lg.id === id)).filter(lg => lg !== undefined) as Lifeguard[];
      });
  });

  return {
    schedule: finalSchedule,
    compulsoryDaysOff: assignedFCs,
    reasoningLog,
  };
};