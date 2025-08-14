import * as Button from "../../components/ui/Button";
import { useState, useEffect } from "react";
import type { Lifeguard } from "../../types/Lifeguard";
import { FaSave } from "react-icons/fa";

interface EditLifeguardModalProps {
	lifeguard: Lifeguard | null;
	onClose: () => void;
	onUpdate: (updatedLifeguard: Lifeguard) => void;
}

function EditLifeguardModal({
	lifeguard,
	onClose,
	onUpdate,
}: EditLifeguardModalProps) {
	const [editedLifeguard, setEditedLifeguard] = useState<Lifeguard | null>(
		null
	);

	useEffect(() => {
		setEditedLifeguard(lifeguard ? { ...lifeguard } : null);
	}, [lifeguard]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editedLifeguard) {
			onUpdate(editedLifeguard);
		}
	};

	if (!editedLifeguard) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">Editar Salva-Vidas</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium">Rank</label>
						<input
							type="number"
							value={editedLifeguard.rank}
							onChange={(e) =>
								setEditedLifeguard({
									...editedLifeguard,
									rank: Number(e.target.value),
								})
							}
							className="mt-1 block w-full p-2 border rounded-md"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Nome</label>
						<input
							type="text"
							value={editedLifeguard.name}
							onChange={(e) =>
								setEditedLifeguard({
									...editedLifeguard,
									name: e.target.value,
								})
							}
							className="mt-1 block w-full p-2 border rounded-md"
						/>
					</div>
					<div className="flex justify-end gap-4 pt-4">
						<Button.ButtonComponent
							type="button"
							variant="secondary"
							onClick={onClose}
						>
							Cancelar
						</Button.ButtonComponent>
						<Button.ButtonComponent type="submit" variant="primary">
							<Button.Icon icon={FaSave} />
							Salvar
						</Button.ButtonComponent>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditLifeguardModal;