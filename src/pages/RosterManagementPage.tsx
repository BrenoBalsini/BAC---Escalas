import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type Lifeguard } from "../types/Lifeguard";
import { type BeachPost } from "../types/BeachPost";
import * as Button from "../components/ui/Button";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AddLifeguardModal from "../components/modals/AddLifeguardModal";
import EditLifeguardModal from "../components/modals/EditLifeguardModal";

export default function RosterManagementPage() {
	const [lifeguards, setLifeguards] = useLocalStorage<Lifeguard[]>(
		"bac-roster",
		[]
	);
	const [posts] = useLocalStorage<BeachPost[]>("bac-posts", []);
	const [g1Count, setG1Count] = useState(0);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [editingLifeguard, setEditingLifeguard] = useState<Lifeguard | null>(
		null
	);

	useEffect(() => {
		const currentG1Count = lifeguards.filter(
			(lg) => lg.group === "G1"
		).length;
		setG1Count(currentG1Count);
	}, [lifeguards]);

	const sortedLifeguards = useMemo(
		() => [...lifeguards].sort((a, b) => a.rank - b.rank),
		[lifeguards]
	);

	const handleG1CountChange = (countInput: number) => {
		const count = Math.max(0, Math.min(countInput, lifeguards.length));
		setG1Count(count);

		const updatedLifeguards = sortedLifeguards.map((lg, index): Lifeguard => ({
			...lg,
			group: index < count ? "G1" : "G2",
		}));

		setLifeguards(updatedLifeguards);
	};

	const handleAddLifeguard = (
		newLifeguardData: Omit<Lifeguard, "id" | "group">
	) => {
		const newLifeguard: Lifeguard = {
			...newLifeguardData,
			id: crypto.randomUUID(),
			group: "G2", // Default to G2, will be recalculated
		};

		const newList = [...lifeguards, newLifeguard].sort(
			(a, b) => a.rank - b.rank
		);
		const updatedListWithGroups = newList.map((lg, index): Lifeguard => ({
			...lg,
			group: index < g1Count ? "G1" : "G2",
		}));

		setLifeguards(updatedListWithGroups);
	};

	const handleDeleteLifeguard = (id: string) => {
		if (window.confirm("Tem certeza que deseja excluir este salva-vidas?")) {
			const newList = lifeguards.filter((lg) => lg.id !== id);
			const sortedNewList = newList.sort((a, b) => a.rank - b.rank);
			const updatedListWithGroups = sortedNewList.map((lg, index): Lifeguard => ({
				...lg,
				group: index < g1Count ? "G1" : "G2",
			}));
			setLifeguards(updatedListWithGroups);
		}
	};

	const handleUpdateLifeguard = (updatedLifeguard: Lifeguard) => {
		const updatedList = lifeguards.map((lg) =>
			lg.id === updatedLifeguard.id ? updatedLifeguard : lg
		);

		const sortedUpdatedList = updatedList.sort((a, b) => a.rank - b.rank);
		const updatedListWithGroups = sortedUpdatedList.map((lg, index): Lifeguard => ({
			...lg,
			group: index < g1Count ? "G1" : "G2",
		}));

		setLifeguards(updatedListWithGroups);
		setEditingLifeguard(null);
	};

	const handlePreferenceChange = (
		lifeguardId: string,
		prefType: "A" | "B",
		postId: string | null
	) => {
		const updatedLifeguards = lifeguards.map((lg) => {
			if (lg.id === lifeguardId) {
				return {
					...lg,
					[prefType === "A" ? "preferenceA_id" : "preferenceB_id"]: postId,
				};
			}
			return lg;
		});
		setLifeguards(updatedLifeguards);
	};

	return (
		<div className="container mx-auto p-4 sm:p-6 md:p-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
					Efetivo e Preferências
				</h1>
				<Button.Root>
					<Button.ButtonComponent
						variant="primary"
						onClick={() => setIsAddModalOpen(true)}
					>
						<Button.Icon icon={FaPlus} />
						Adicionar Salva-Vidas
					</Button.ButtonComponent>
				</Button.Root>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-bold text-gray-700 mb-4">
					Divisão de Grupos
				</h2>
				<div className="flex flex-col sm:flex-row items-center gap-4">
					<label htmlFor="g1-count" className="font-medium text-gray-600">
						Quantidade de GVCs no G1:
					</label>
					<input
						type="number"
						id="g1-count"
						value={g1Count}
						onChange={(e) => handleG1CountChange(parseInt(e.target.value, 10) || 0)}
						min="0"
						max={lifeguards.length}
						className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					<p className="text-sm text-gray-500">
						(Os {g1Count} GVCs com menor rank serão G1, o restante será G2).
					</p>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Class.
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Nome
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Grupo
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Preferência A
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Preferência B
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
								Ações
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{sortedLifeguards.map((lg) => (
							<tr key={lg.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap font-bold">
									{lg.rank}º
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{lg.name}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											lg.group === "G1"
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{lg.group}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<select
										value={lg.preferenceA_id || ""}
										onChange={(e) =>
											handlePreferenceChange(lg.id, "A", e.target.value || null)
										}
										className="block w-full p-2 border rounded-md"
									>
										<option value="">- Nenhuma -</option>
										{posts.map((p) => (
											<option key={p.id} value={p.id}>
												{p.name}
											</option>
										))}
									</select>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<select
										value={lg.preferenceB_id || ""}
										onChange={(e) =>
											handlePreferenceChange(lg.id, "B", e.target.value || null)
										}
										className="block w-full p-2 border rounded-md"
									>
										<option value="">- Nenhuma -</option>
										{posts.map((p) => (
											<option key={p.id} value={p.id}>
												{p.name}
											</option>
										))}
									</select>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
									<div className="flex justify-center gap-2">
										<Button.ButtonComponent
											
											variant="secondary"
											onClick={() => setEditingLifeguard(lg)}
										>
											<Button.Icon icon={FaEdit} />
										</Button.ButtonComponent>
										<Button.ButtonComponent
											
											variant="danger"
											onClick={() => handleDeleteLifeguard(lg.id)}
										>
											<Button.Icon icon={FaTrash} />
										</Button.ButtonComponent>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<AddLifeguardModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAddLifeguard={handleAddLifeguard}
        nextRank={sortedLifeguards.length + 1}				
			/>

			<EditLifeguardModal
				lifeguard={editingLifeguard}
				onClose={() => setEditingLifeguard(null)}
				onUpdate={handleUpdateLifeguard}
			/>
		</div>
	);
}
