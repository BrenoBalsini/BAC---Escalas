# BAC – Gerador de Escalas

Uma ferramenta automatizada para otimizar a distribuição do efetivo de Guarda-Vidas nos postos de serviço. Desenvolvido com **React**, **TypeScript** e **TailwindCSS**.

## Visão Geral

O BAC é um sistema inteligente de geração de escalas que considera regras, preferências e necessidades para montar **escalas justas e eficientes**, cobrindo todos os postos de serviço diariamente.

## Principais Funcionalidades

- **Cadastro de Efetivo:** Registre os Guarda-Vidas e defina preferências de postos para cada um.
- **Gerenciamento de Postos:** Cadastre, edite e organize os postos de serviço disponíveis.
- **Configuração de Quinzena:** Defina data de início e término da escala, ajustando para o período desejado.
- **Geração Automática de Escalas:** Um algoritmo que aloca o efetivo conforme as regras e preferências, com etapas transparentes:
  - Cálculo de diárias necessárias
  - Alocação inicial por posto de preferência
  - Folgas compulsórias otimizadas
  - Preenchimento final para garantir cobertura total
- **Histórico de Escalas:** Salve e acesse escalas geradas para consulta e comparação.

## Como o Algoritmo Monta a Escala

1. **Preparação e Cálculo das Diárias**  
   Soma todas as vagas nos postos e folgas solicitadas para calcular a necessidade total do período.
2. **Alocação Inicial**  
   Cada guarda-vidas é alocado na sua preferência principal de posto — exceto nos dias de folga.
3. **Fila de Espera e Superlotação**  
   Se um posto estiver superlotado, apenas os mais antigos permanecem; os demais aguardam vaga.
4. **Folgas Compulsórias**  
   GVCs excedentes recebem folga no dia menos prejudicial para o serviço.
5. **Alocação Final**  
   Postos restantes são preenchidos priorizando as preferências secundárias.
