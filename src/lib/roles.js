import { ROLES } from "./constants";

export const canCreateRequerimento = (role) =>
  [ROLES.ENCARREGADO, ROLES.FROTA, ROLES.SEGURANCA, ROLES.ADMIN].includes(role);

export const canReviewDP = (role) =>
  [ROLES.DP, ROLES.ADMIN].includes(role);

export const canActAsSeguranca = (role) =>
  [ROLES.SEGURANCA, ROLES.ADMIN].includes(role);

export const canCreateDriver = (role) =>
  [ROLES.ENCARREGADO, ROLES.ADMIN].includes(role);

export const canManageUsers = (role) => role === ROLES.ADMIN;

export const canFillChecklistDigital = (role) =>
  [ROLES.MOTORISTA, ROLES.ENCARREGADO, ROLES.ADMIN].includes(role);

export const canFillChecklistManual = (role) =>
  [ROLES.ENCARREGADO, ROLES.ADMIN].includes(role);

export const getMenuByRole = (role) => {
  const common = [
    { path: "/", label: "Dashboard", icon: "House" },
  ];

  const items = {
    [ROLES.MOTORISTA]: [
      ...common,
      { path: "/checklist/digital", label: "Novo Checklist Diário", icon: "ClipboardText" },
      { path: "/checklists", label: "Meus Checklists", icon: "ListChecks" },
    ],
    [ROLES.ENCARREGADO]: [
      ...common,
      { path: "/requerimentos/novo", label: "Novo Requerimento", icon: "PlusCircle" },
      { path: "/requerimentos", label: "Requerimentos", icon: "FileText" },
      { path: "/checklist/manual", label: "Lançar Checklist (papel)", icon: "ClipboardText" },
      { path: "/checklist/digital", label: "Checklist Diário (app)", icon: "Devices" },
      { path: "/checklists", label: "Checklists", icon: "ListChecks" },
      { path: "/motoristas", label: "Motoristas", icon: "Users" },
      { path: "/users", label: "Criar Login Motorista", icon: "UserGear" },
      { path: "/veiculos", label: "Veículos", icon: "Truck" },
    ],
    [ROLES.FROTA]: [
      ...common,
      { path: "/requerimentos/novo", label: "Novo Requerimento", icon: "PlusCircle" },
      { path: "/requerimentos", label: "Requerimentos", icon: "FileText" },
      { path: "/veiculos", label: "Veículos", icon: "Truck" },
      { path: "/frota/relatorios", label: "Relatórios Frota", icon: "ChartBar" },
      { path: "/motoristas", label: "Motoristas", icon: "Users" },
      { path: "/users", label: "Criar Login Motorista", icon: "UserGear" },
      { path: "/checklists", label: "Checklists", icon: "ListChecks" },
    ],
    [ROLES.DP]: [
      ...common,
      { path: "/requerimentos", label: "Requerimentos", icon: "FileText" },
      { path: "/teams", label: "Equipes", icon: "Users" },
      { path: "/users", label: "Criar Login Motorista", icon: "UserGear" },
    ],
    [ROLES.SEGURANCA]: [
      ...common,
      { path: "/requerimentos", label: "Requerimentos", icon: "FileText" },
      { path: "/vistorias", label: "Vistorias", icon: "ClipboardText" },
      { path: "/templates", label: "Templates Checklist", icon: "Stack" },
      { path: "/veiculos", label: "Veículos", icon: "Truck" },
    ],
    [ROLES.ADMIN]: [
      ...common,
      { path: "/requerimentos/novo", label: "Novo Requerimento", icon: "PlusCircle" },
      { path: "/requerimentos", label: "Requerimentos", icon: "FileText" },
      { path: "/veiculos", label: "Veículos", icon: "Truck" },
      { path: "/motoristas", label: "Motoristas", icon: "Users" },
      { path: "/teams", label: "Equipes", icon: "Stack" },
      { path: "/frota/relatorios", label: "Relatórios Frota", icon: "ChartBar" },
      { path: "/templates", label: "Templates Checklist", icon: "Stack" },
      { path: "/checklists", label: "Checklists", icon: "ListChecks" },
      { path: "/vistorias", label: "Vistorias", icon: "ClipboardText" },
      { path: "/users", label: "Usuários", icon: "UserGear" },
    ],
  };

  return items[role] || common;
};
