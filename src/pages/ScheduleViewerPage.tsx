import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type SavedSchedule } from "../types/SavedSchedule";
import { type Lifeguard } from "../types/Lifeguard";
import { type EditContext } from "../types/EditContext"
import EditShiftModal, {
} from "../components/modals/EditShiftModal";
import LogViewerModal from "../components/modals/LogViewModal";
import * as Button from "../components/ui/Button";
import { FaArrowLeft, FaCopy, FaList } from "react-icons/fa6";

export default function ScheduleViewerPage() {
	const { scheduleId } = useParams<{ scheduleId: string }>();
	const navigate = useNavigate();

	const [scheduleHistory, setScheduleHistory] = useLocalStorage<
		SavedSchedule[]
	>("bac-schedule-history", []);

	const [scheduleData, setScheduleData] = useState<SavedSchedule | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isLogModalOpen, setIsLogModalOpen] = useState(false);
	const [editingContext, setEditingContext] = useState<EditContext | null>(
		null
	);

	useEffect(() => {
		const data = scheduleHistory.find((s) => s.id === scheduleId);
		if (data) {
			setScheduleData(JSON.parse(JSON.stringify(data)));
		} else {
			alert("Escala não encontrada!");
			navigate("/history");
		}
	}, [scheduleId, scheduleHistory, navigate]);

	const days = useMemo(() => {
		if (!scheduleData?.inputs.startDate || !scheduleData?.inputs.endDate)
			return [];
		const allDays = [];
		const currentDate = new Date(scheduleData.inputs.startDate + "T00:00:00");
		const lastDate = new Date(scheduleData.inputs.endDate + "T00:00:00");
		while (currentDate <= lastDate) {
			allDays.push(currentDate.toISOString().split("T")[0]);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return allDays;
	}, [scheduleData]);

	const lifeguardsByPost = useMemo(() => {
		if (!scheduleData) return {};
		const grouped: { [postId: string]: Lifeguard[] } = {};
		const unassigned: Lifeguard[] = [];

		for (const lifeguard of scheduleData.inputs.snapshotLifeguards) {
			const prefA = lifeguard.preferenceA_id;
			if (
				prefA &&
				scheduleData?.inputs.snapshotPosts.some((p) => p.id === prefA)
			) {
				if (!grouped[prefA]) grouped[prefA] = [];
				grouped[prefA].push(lifeguard);
			} else {
				unassigned.push(lifeguard);
			}
		}
		for (const postId in grouped) {
			grouped[postId].sort((a, b) => a.rank - b.rank);
		}
		if (unassigned.length > 0)
			grouped["unassigned"] = unassigned.sort((a, b) => a.rank - b.rank);
		return grouped;
	}, [scheduleData]);

	if (!scheduleData) {
		return (
			<div className="container mx-auto p-6 text-center">
				Carregando escala...
			</div>
		);
	}

	const handleCellClick = (lifeguard: Lifeguard, day: string) => {
		const reasoning =
			scheduleData?.outputs.reasoningLog?.[lifeguard.id]?.[day] || null;

		setEditingContext({
			lifeguardId: lifeguard.id,
			lifeguardName: lifeguard.name,
			day,
			preferenceAPostId: lifeguard.preferenceA_id,
			reasoning,
		});
		setIsEditModalOpen(true);
	};

	const handleUpdateShift = (
		action: { type: "setDayOff" } | { type: "setWork"; postId: string }
	) => {
		if (!scheduleData || !editingContext) return;

		const { lifeguardId, day } = editingContext;
		const newSchedule = { ...scheduleData.outputs.schedule };
		const newLog = { ...scheduleData.outputs.reasoningLog };

		for (const postId in newSchedule[day]) {
			newSchedule[day][postId] = newSchedule[day][postId].filter(
				(lg) => lg.id !== lifeguardId
			);
		}

		if (!newLog[lifeguardId]) newLog[lifeguardId] = {};

		const posts = scheduleData.inputs.snapshotPosts;
		const lifeguards = scheduleData.inputs.snapshotLifeguards;

		if (action.type === "setWork") {
			const lifeguard = lifeguards.find((lg) => lg.id === lifeguardId);
			if (lifeguard) {
				if (!newSchedule[day][action.postId]) {
					newSchedule[day][action.postId] = [];
				}
				newSchedule[day][action.postId].push(lifeguard);

				const postName = posts.find((p) => p.id === action.postId)?.name || "";
				newLog[lifeguardId][day] = {
					status: "Edição Manual",
					details: `Alocado manualmente no ${postName}.`,
				};
			}
		} else {
			newLog[lifeguardId][day] = {
				status: "Edição Manual",
				details: "Definido como folga manualmente.",
			};
		}

		setScheduleData({
			...scheduleData,
			outputs: {
				...scheduleData.outputs,
				schedule: newSchedule,
				reasoningLog: newLog,
			},
		});

		setIsEditModalOpen(false);
	};

	const handleSaveAsCopy = () => {
		if (!scheduleData) return;
		const newName = `${
			scheduleData.name
		} - Cópia Editada ${new Date().toLocaleTimeString("pt-BR")}`;
		const newSavedSchedule: SavedSchedule = {
			...scheduleData,
			id: crypto.randomUUID(),
			name: newName,
			savedAt: new Date().toISOString(),
		};
		setScheduleHistory([...scheduleHistory, newSavedSchedule]);
		alert(`Cópia "${newName}" salva com sucesso!`);
		navigate("/history");
	};

	const { schedule: finalSchedule, compulsoryDaysOff } = scheduleData.outputs;
	const { capacityMatrix, requestedDaysOff, snapshotPosts } =
		scheduleData.inputs;

	return (
		<>
			<div className="container mx-auto p-4 sm:p-6 md:p-8">
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
						<div className="text-center sm:text-left">
							<h1
								className="text-xl md:text-2xl font-bold text-gray-800 truncate"
								title={scheduleData.name}
							>
								{scheduleData.name}
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Salva em:{" "}
								{new Date(scheduleData.savedAt).toLocaleString("pt-BR", {
									dateStyle: "short",
									timeStyle: "short",
								})}
							</p>
						</div>
						<div className="flex items-center justify-center gap-2 flex-wrap">
							<Button.Root>
								<Link to="/history">
									<Button.ButtonComponent variant="secondary">
										<Button.Icon icon={FaArrowLeft} />
										Voltar
									</Button.ButtonComponent>
								</Link>
							</Button.Root>
							<Button.Root>
								<Button.ButtonComponent
									variant="secondary"
									onClick={() => setIsLogModalOpen(true)}
								>
									<Button.Icon icon={FaList} />
									Ver Log
								</Button.ButtonComponent>
							</Button.Root>
							<Button.Root>
								<Button.ButtonComponent
									variant="primary"
									onClick={handleSaveAsCopy}
								>
									<Button.Icon icon={FaCopy} />
									Salvar Cópia
								</Button.ButtonComponent>
							</Button.Root>
						</div>
					</div>

					<div className="overflow-x-auto mt-4">
						<p className="text-sm text-gray-500 mb-4 text-center sm:text-left">
							Clique em qualquer célula da escala (X, FC, --, etc.) para fazer
							um ajuste manual.
						</p>
						<table className="min-w-full text-sm">
							<thead className="sticky top-0 bg-white z-20">
								<tr>
									<th
										className="sticky left-0 bg-white z-30 px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
										style={{ width: "180px" }}
									>
										Salva-Vidas
									</th>
									<th
										className="px-2 sm:px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider md:sticky md:bg-white md:z-30"
										style={{ left: "180px" }}
									>
										Rank
									</th>
									{days.map((day) => {
										const date = new Date(day + "T00:00:00");
										const dayOfMonth = date
											.getDate()
											.toString()
											.padStart(2, "0");
										const dayOfWeek = date
											.toLocaleDateString("pt-BR", { weekday: "short" })
											.replace(".", "");
										return (
											<th
												key={day}
												className="px-2 sm:px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
											>
												<span>{dayOfWeek}</span>
												<span className="block">{dayOfMonth}</span>
											</th>
										);
									})}
									<th className="px-2 sm:px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Total
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{snapshotPosts
									.sort((a, b) => a.order - b.order)
									.map((post) => {
										const postLifeguards = lifeguardsByPost[post.id] || [];
										if (postLifeguards.length === 0) return null;

										return (
											<React.Fragment key={`post-group-${post.id}`}>
												<tr>
													<td
														colSpan={days.length + 3}
														className="p-2 bg-blue-50 font-bold text-base"
													>
														{post.name}
													</td>
												</tr>

												{postLifeguards.map((lifeguard) => {
													const workScheduleMap = new Map<string, string>();
													let workCount = 0;
													for (const day of days) {
														for (const postId in finalSchedule[day]) {
															if (
																finalSchedule[day][postId].some(
																	(lg) => lg.id === lifeguard.id
																)
															) {
																workScheduleMap.set(day, postId);
																workCount++;
																break;
															}
														}
													}

													return (
														<tr key={lifeguard.id} className="hover:bg-gray-50">
															<td
																className="sticky left-0 bg-white hover:bg-gray-50 z-10 px-2 sm:px-4 py-2 text-sm font-medium text-gray-800"
																style={{ width: "180px" }}
															>
																<div className="flex items-center gap-2">
																	<span className="font-bold text-gray-500">
																		{lifeguard.rank}º
																	</span>
																	<span
																		className="truncate"
																		title={lifeguard.name}
																	>
																		{lifeguard.name}
																	</span>
																</div>
															</td>
															<td
																className="px-2 sm:px-4 py-2 text-center text-sm md:sticky md:bg-white md:hover:bg-gray-50 md:z-10"
																style={{ left: "180px" }}
															>
																{lifeguard.rank}º
															</td>
															{days.map((day) => {
																const workingPostId = workScheduleMap.get(day);
																const isRequestedOff =
																	requestedDaysOff[lifeguard.id]?.[day];
																const isCompulsoryOff =
																	compulsoryDaysOff[lifeguard.id]?.[day];

																let cellContent: React.ReactNode = "--";
																let bgClass = "";

																if (workingPostId) {
																	if (workingPostId === post.id) {
																		cellContent = "X";
																	} else {
																		const workingPost = snapshotPosts.find(
																			(p) => p.id === workingPostId
																		);
																		cellContent = `P${
																			workingPost?.order || "?"
																		}`;
																		bgClass = "bg-blue-100";
																	}
																} else if (isCompulsoryOff) {
																	cellContent = "FC";
																} else if (isRequestedOff) {
																	cellContent = "FS";
																	bgClass = "bg-red-50";
																}

																return (
																	<td
																		key={day}
																		className={`p-2 text-center font-mono cursor-pointer hover:bg-blue-100 transition-colors ${bgClass}`}
																		onClick={() =>
																			handleCellClick(lifeguard, day)
																		}
																	>
																		{cellContent}
																	</td>
																);
															})}
															{(() => {
																const quota =
																	lifeguard.group === "G1"
																		? scheduleData.inputs.g1Shifts
																		: scheduleData.inputs.g2Shifts;
																const totalBgClass =
																	workCount < quota
																		? "bg-orange-100 text-orange-800"
																		: "bg-gray-100";
																return (
																	<td
																		className={`px-2 sm:px-4 py-2 text-center font-bold ${totalBgClass}`}
																	>
																		{workCount}
																	</td>
																);
															})()}
														</tr>
													);
												})}

												<tr className="bg-gray-200 font-bold">
													<td
														colSpan={2}
														className="px-2 sm:px-4 py-2 text-right text-xs uppercase text-gray-600"
													>
														Total no Posto:
													</td>
													{days.map((day) => {
														const dailyTotal =
															finalSchedule[day]?.[post.id]?.length || 0;
														const requiredTotal =
															capacityMatrix[post.id]?.[day] || 0;
														const isDeficit = dailyTotal < requiredTotal;

														return (
															<td
																key={`total-${day}`}
																className={`p-2 text-center text-xs ${
																	isDeficit
																		? "bg-red-200 text-red-800"
																		: "text-gray-700"
																}`}
															>
																{dailyTotal}/{requiredTotal}
															</td>
														);
													})}
													<td className="p-2"></td>
												</tr>
											</React.Fragment>
										);
									})}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<EditShiftModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onSave={handleUpdateShift}
				context={editingContext}
				posts={scheduleData.inputs.snapshotPosts}
			/>
			<LogViewerModal
				isOpen={isLogModalOpen}
				onClose={() => setIsLogModalOpen(false)}
				log={scheduleData.outputs.reasoningLog}
				lifeguards={scheduleData.inputs.snapshotLifeguards}
				days={days}
			/>
		</>
	);
}