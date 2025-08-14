import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type Lifeguard } from "../types/Lifeguard";
import { type BeachPost } from "../types/BeachPost";
import * as Button from "../components/ui/Button";
import { FaArrowRight, FaPlus, FaUsers, FaMapPin } from "react-icons/fa6";

export default function HomePage() {
	const navigate = useNavigate();
	const [lifeguards] = useLocalStorage<Lifeguard[]>("bac-roster", []);
	const [posts] = useLocalStorage<BeachPost[]>("bac-posts", []);

	const [isDataMissing, setIsDataMissing] = useState(true);

	useEffect(() => {
		if (lifeguards.length > 0 && posts.length > 0) {
			setIsDataMissing(false);
		} else {
			setIsDataMissing(true);
		}
	}, [lifeguards, posts]);

	const handlePrimaryAction = () => {
		if (isDataMissing) {
			navigate("/roster");
		} else {
			navigate("/generator");
		}
	};

	const primaryButtonText = isDataMissing
		? "Cadastrar Efetivo e Postos"
		: "Gerar Nova Escala";

	const primaryButtonIcon = isDataMissing ? FaPlus : FaArrowRight;

	return (
		<div className="container mx-auto p-4 sm:p-6 md:p-8">
			<div className="text-center bg-white rounded-lg shadow-md p-8">
				<h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
					Bem-vindo ao Gerador de Escalas
				</h1>
				<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
					Uma ferramenta automatizada para otimizar a distribuição do efetivo
					de Guarda-Vidas nos postos de serviço.
				</p>
			</div>

			<div className="mt-8 bg-white rounded-lg shadow-md p-8">
				<h2 className="text-2xl font-bold text-gray-700 mb-2 text-center">
					Como o Cérebro do App Monta a Escala de Trabalho
				</h2>
				<p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
					Este documento explica, passo a passo, como o nosso sistema
					inteligente constrói a escala de trabalho. O objetivo é criar uma
					escala justa, que respeite as regras e preferências, e que, ao
					mesmo tempo, garanta que todos os postos de praia tenham a cobertura
					necessária todos os dias.
				</p>

				<div className="space-y-6 text-left max-w-4xl mx-auto">
					<div className="p-4 border-l-4 border-gray-300 bg-gray-50 rounded-r-lg">
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Etapa 0: A Preparação e o Cálculo das Diárias
						</h3>
						<div className="space-y-3 text-gray-700">
							<div>
								<p className="font-semibold">O que acontece?</p>
								<p>
									O sistema soma todas as vagas que precisam ser preenchidas em
									todos os postos durante a quinzena e adiciona o total de
									folgas solicitadas (FS). Isso gera a "Necessidade Total de
									Diárias", que representa o esforço de trabalho que a equipa
									precisa fornecer.
								</p>
							</div>
							<div>
								<p className="font-semibold">Qual o resultado?</p>
								<p>
									Temos um número claro que servirá de base para as quotas de
									trabalho de cada grupo (G1 e G2) e para todo o processo de
									alocação que se segue.
								</p>
							</div>
						</div>
					</div>

					<div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Etapa A: A Alocação Inicial
						</h3>
						<div className="space-y-3 text-gray-700">
							<p>
								O algoritmo aloca cada GVC para trabalhar no seu Posto de
								Preferência A (PA) em todos os dias, exceto naqueles em que
								pediu folga (FS). O resultado é uma escala inicial onde
								alguns postos ficam superlotados e outros, vazios.
							</p>
						</div>
					</div>

					<div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Etapa B: Organizando e Criando a Fila de Espera
						</h3>
						<div className="space-y-3 text-gray-700">
							<p>
								O sistema ajusta a superlotação. Dia a dia, ele confirma os
								GVCs com melhor rank (mais antigos) nos postos até preencher
								as vagas. Os que sobram são movidos para uma "Fila de Espera"
								para aquele dia, aguardando uma vaga.
							</p>
						</div>
					</div>

					<div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Etapa C: Atribuindo as Folgas Compulsórias (FC)
						</h3>
						<div className="space-y-3 text-gray-700">
							<p>
								Para GVCs com mais dias de trabalho que a sua quota, o
								sistema atribui uma Folga Compulsória (FC) no dia "menos
								prejudicial", ou seja, o dia que menos afeta a segurança e a
								operação (evitando folgas em fins de semana, coladas a outras
								folgas ou que deixem um posto sem um GVC experiente).
							</p>
						</div>
					</div>

					<div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Etapa D: Preenchendo Vagas com a Fila de Espera
						</h3>
						<div className="space-y-3 text-gray-700">
							<p>
								Com as vagas abertas pelas FCs, o sistema revisita a Fila de
								Espera. Ele aloca os GVCs (por ordem de rank) que ainda não
								cumpriram sua quota de trabalho, prioritariamente no Posto de
								Preferência A (PA) deles, se houver vaga.
							</p>
						</div>
					</div>

					<div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Etapa E: A Alocação Final
						</h3>
						<div className="space-y-3 text-gray-700">
							<p>
								Na varredura final, o algoritmo procura por postos com vagas e
								GVCs que ainda precisam trabalhar. Ele preenche esses
								"buracos" alocando os GVCs disponíveis, tentando primeiro o
								Posto de Preferência B (PB) e, se não for possível, qualquer
								outro posto com vaga (PX).
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 text-center">
				<Button.Root>
					<Button.ButtonComponent
					
						variant="primary"
						onClick={handlePrimaryAction}
					>
						<Button.Icon icon={primaryButtonIcon} />
						{primaryButtonText}
					</Button.ButtonComponent>
				</Button.Root>

				{isDataMissing && (
					<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
						<p className="text-sm text-yellow-800">
							<strong>Atenção:</strong> É necessário cadastrar o efetivo de
							Guarda-Vidas e os Postos de Serviço antes de gerar uma escala.
						</p>
						<div className="mt-4 flex justify-center gap-4">
							<Link to="/roster">
								<Button.ButtonComponent variant="secondary">
									<Button.Icon icon={FaUsers} />
									Ir para Efetivo
								</Button.ButtonComponent>
							</Link>
							<Link to="/posts">
								<Button.ButtonComponent variant="secondary">
									<Button.Icon icon={FaMapPin} />
									Ir para Postos
								</Button.ButtonComponent>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
