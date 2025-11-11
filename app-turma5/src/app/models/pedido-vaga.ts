export interface PedidoVaga {
    id: string;
    titulo: string;
    motivo: string;
    requisitos: string[];
    quantidade: 0 | 1 | 2 | 3 | 4 | 5;
    aprovacao: 'Pendente' | 'Aprovado' | 'Reprovado';
    gestorId: string;
    departamentoId: string;
    dataSolicitacao: string;
}
