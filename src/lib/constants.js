export const ROLES = {
  ADMIN: "admin",
  MOTORISTA: "motorista",
  ENCARREGADO: "encarregado",
  FROTA: "admin_frota",
  DP: "dp",
  SEGURANCA: "seguranca",
};

export const ROLE_LABELS = {
  admin: "TI / Administrador",
  motorista: "Motorista",
  encarregado: "Encarregado",
  admin_frota: "Administrador de Frota",
  dp: "Departamento Pessoal",
  seguranca: "Segurança do Trabalho",
};

export const USER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const VEHICLE_STATUS = {
  PRE_REGISTERED: "PRE_REGISTERED",
  PENDING_ACTIVATION: "PENDING_ACTIVATION",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const VEHICLE_STATUS_LABEL = {
  PRE_REGISTERED: "Pré-cadastrado",
  PENDING_ACTIVATION: "Aguardando Vistoria",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const DRIVER_STATUS = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  NO_LOGIN_USER: "NO_LOGIN_USER",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const DRIVER_STATUS_LABEL = {
  PENDING_APPROVAL: "Aguardando DP",
  NO_LOGIN_USER: "Aprovado · sem login",
  ACTIVE: "Aprovado · com login",
  INACTIVE: "Inativo",
};

// Status considerados "habilitados para operação" (filtra Checklist, Veículo titular, etc.)
export const DRIVER_STATUS_ACTIVE = [DRIVER_STATUS.ACTIVE, DRIVER_STATUS.NO_LOGIN_USER];

export const REQ_STATUS = {
  RASCUNHO: "RASCUNHO",
  PENDENTE: "PENDENTE",
  APROVADO: "APROVADO",
  REPROVADO: "REPROVADO",
  EM_ANALISE_SEGURANCA: "EM_ANALISE_SEGURANCA",
  AGUARDANDO_VISTORIA: "AGUARDANDO_VISTORIA",
  FINALIZADO: "FINALIZADO",
};

export const REQ_STATUS_LABEL = {
  RASCUNHO: "Rascunho",
  PENDENTE: "Pendente",
  APROVADO: "Aprovado pelo DP",
  REPROVADO: "Reprovado",
  EM_ANALISE_SEGURANCA: "Em Análise (Segurança)",
  AGUARDANDO_VISTORIA: "Aguardando Vistoria",
  FINALIZADO: "Finalizado",
};

export const REQ_STATUS_COLOR = {
  RASCUNHO: "bg-[#E2E8E4]/60 text-[#4A564F] border-[#708278]/40",
  PENDENTE: "bg-[#D9A05B]/15 text-[#8B5E2B] border-[#D9A05B]/40",
  APROVADO: "bg-[#2E7D32]/15 text-[#1B5E20] border-[#2E7D32]/40",
  REPROVADO: "bg-[#C25D41]/15 text-[#8B3A26] border-[#C25D41]/40",
  EM_ANALISE_SEGURANCA: "bg-[#4A7A8C]/15 text-[#2E4F5C] border-[#4A7A8C]/40",
  AGUARDANDO_VISTORIA: "bg-[#8EA694]/20 text-[#3D4F44] border-[#8EA694]/50",
  FINALIZADO: "bg-[#1E3A5F]/15 text-[#0A1A2E] border-[#1E3A5F]/40",
};

export const REQ_TYPE = {
  VEICULO: "veiculo",
  MOTORISTA: "motorista",
  VEICULO_MOTORISTA: "veiculo_motorista",
};

export const REQ_TYPE_LABEL = {
  veiculo: "Apenas Veículo",
  motorista: "Apenas Motorista",
  veiculo_motorista: "Veículo + Motorista",
};

export const PORTE_VEICULO = [
  { id: "pesado", label: "Pesado", desc: "Caminhões, máquinas e equipamentos de grande porte." },
  { id: "leve", label: "Leve", desc: "Veículos de passeio, utilitários e pequenos." },
];

export const EQUIPAMENTO_TIPOS = [
  { id: "retroescavadeira", label: "Retroescavadeira", porte: "pesado" },
  { id: "escavadeira", label: "Escavadeira", porte: "pesado" },
  { id: "caminhao_pipa", label: "Caminhão Pipa", porte: "pesado" },
  { id: "muck", label: "Muck", porte: "pesado" },
  { id: "caminhao", label: "Caminhão", porte: "pesado" },
  { id: "trator", label: "Trator", porte: "pesado" },
  { id: "carro", label: "Carro", porte: "leve" },
  { id: "van", label: "Van / Utilitário", porte: "leve" },
  { id: "outro", label: "Outro", porte: null },
];

export const ORIGEM_TIPOS = [
  { id: "proprio", label: "Próprio", desc: "Equipamento de propriedade da empresa." },
  { id: "alugado", label: "Alugado", desc: "Equipamento alugado de terceiros." },
  { id: "prestacao", label: "Prestação de Serviço", desc: "Equipamento de empresa contratada." },
];

export const COMBUSTIVEIS = [
  "Diesel", "Gasolina", "Etanol", "Flex", "GNV", "Elétrico", "Híbrido",
];

export const CATEGORIAS_CNH = ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"];

export const WIZARD_STEPS = [
  { id: 1, label: "Tipo de Requerimento", short: "Tipo" },
  { id: 2, label: "Dados Iniciais", short: "Dados" },
  { id: 3, label: "Informações Adicionais", short: "Adicionais" },
  { id: 4, label: "Documentos", short: "Documentos" },
  { id: 5, label: "Detalhes", short: "Detalhes" },
  { id: 6, label: "Revisão", short: "Revisão" },
  { id: 7, label: "Conclusão", short: "Conclusão" },
];

export const CHECKLIST_ITEM_TYPES = [
  { id: "checkbox", label: "Conforme / Não Conforme" },
  { id: "text", label: "Texto" },
  { id: "number", label: "Número" },
  { id: "photo", label: "Foto (opcional)" },
];
