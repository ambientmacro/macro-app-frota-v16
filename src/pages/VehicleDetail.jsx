import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { VEHICLE_STATUS, VEHICLE_STATUS_LABEL, COMBUSTIVEIS, ROLES, DRIVER_STATUS } from "../lib/constants";
import { filterOperationalDrivers } from "../lib/drivers";
import { toast } from "sonner";
import { ArrowLeft, FloppyDisk, Truck, User, ClipboardText, PencilSimple } from "@phosphor-icons/react";

const inp = "w-full border border-[#E2E8E4] bg-white px-4 py-3 rounded-md text-sm text-[#0F1411] focus:outline-none focus:border-[#2563EB] focus:border-2 transition-all";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  const canEdit = [ROLES.ADMIN, ROLES.FROTA, ROLES.SEGURANCA].includes(profile.role);
  const canLinkDriver = [ROLES.ADMIN, ROLES.FROTA, ROLES.ENCARREGADO].includes(profile.role);

  useEffect(() => {
    (async () => {
      const s = await getDoc(doc(db, "vehicles", id));
      if (s.exists()) {
        const v = { id: s.id, ...s.data() };
        setVehicle(v);
        setForm(v);
      }
      const [d, t, tm] = await Promise.all([
        getDocs(query(collection(db, "drivers"), where("status", "in", [DRIVER_STATUS.ACTIVE, DRIVER_STATUS.NO_LOGIN_USER]))),
        getDocs(collection(db, "checklistTemplates")),
        getDocs(collection(db, "teams")),
      ]);
      const rawDrivers = d.docs.map((x) => ({ id: x.id, ...x.data() }));
      setDrivers(filterOperationalDrivers(rawDrivers));
      setTemplates(t.docs.map((x) => ({ id: x.id, ...x.data() })));
      setTeams(tm.docs.map((x) => ({ id: x.id, ...x.data() })));
    })();
  }, [id]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      const driver = drivers.find((d) => d.id === form.motoristaTitularId);
      // Normaliza placa para busca/uniqueness (vide RequerimentoWizard).
      const placa = (form.placa || "").trim().toUpperCase();
      const placaNormalizada = placa.replace(/[^A-Z0-9]/g, "") || null;
      await updateDoc(doc(db, "vehicles", id), {
        tag: form.tag,
        placa: placa || null,
        placaNormalizada,
        marca: form.marca,
        modelo: form.modelo,
        ano: form.ano,
        combustivel: form.combustivel,
        capacidade: form.capacidade,
        horimetro: form.horimetro,
        quilometragem: form.quilometragem,
        centro_custo: form.centro_custo,
        unidade: form.unidade,
        empresa: form.empresa,
        origem: form.origem || "proprio",
        // Campos de custo/gestão para relatórios da Frota:
        valorAluguelMensal: Number(form.valorAluguelMensal) || 0,
        valorPatrimonio: Number(form.valorPatrimonio) || 0,
        dataAquisicao: form.dataAquisicao || null,
        vencimentoCRLV: form.vencimentoCRLV || null,
        teamId: form.teamId || null,
        motoristaTitularId: form.motoristaTitularId || null,
        motoristaTitularNome: driver?.name || null,
        checklistTemplateId: form.checklistTemplateId || null,
        updatedAt: serverTimestamp(),
        updatedBy: profile.name,
      });
      // Atualiza vínculo no motorista (defaultVehicleId)
      if (form.motoristaTitularId) {
        await updateDoc(doc(db, "drivers", form.motoristaTitularId), { defaultVehicleId: id });
      }
      toast.success("Veículo atualizado.");
      setEditing(false);
      const s = await getDoc(doc(db, "vehicles", id));
      setVehicle({ id: s.id, ...s.data() });
    } catch (e) {
      toast.error(e.message);
    } finally { setBusy(false); }
  };

  if (!vehicle) return <div className="p-10 text-sm text-[#4A564F]">Carregando…</div>;

  const titular = drivers.find((d) => d.id === vehicle.motoristaTitularId);
  const tpl = templates.find((t) => t.id === vehicle.checklistTemplateId);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#708278] hover:text-[#1E3A5F]">
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#708278] font-bold">Frota</div>
          <h1 className="font-[Outfit,sans-serif] text-3xl font-black tracking-tight text-[#0F1411] mt-2 flex items-center gap-3 flex-wrap">
            <Truck size={28} weight="duotone" className="text-[#2563EB]" /> {vehicle.tag}
            {vehicle.placa && <span className="text-base font-bold bg-[#1E3A5F] text-white px-2 py-1 rounded">{vehicle.placa}</span>}
          </h1>
          <p className="text-sm text-[#4A564F] mt-1">{vehicle.marca} {vehicle.modelo} · {vehicle.ano}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-2 rounded-md border ${
            vehicle.status === "ACTIVE" ? "bg-[#2E7D32]/15 text-[#1B5E20] border-[#2E7D32]/40" :
            vehicle.status === "PENDING_ACTIVATION" ? "bg-[#8EA694]/20 text-[#3D4F44] border-[#8EA694]/50" :
            "bg-[#D9A05B]/15 text-[#8B5E2B] border-[#D9A05B]/40"
          }`}>{VEHICLE_STATUS_LABEL[vehicle.status]}</span>
          {canEdit && !editing && (
            <button onClick={() => setEditing(true)} data-testid="btn-editar-veiculo"
              className="flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-[0.1em] hover:from-[#1D4ED8] hover:to-[#1E40AF]">
              <PencilSimple size={14} /> Editar
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white border border-[#E2E8E4] rounded-md p-6 space-y-5">
        {editing ? (
          <>
            <h3 className="text-lg font-bold text-[#0F2542] font-[Outfit,sans-serif]">Editar dados do veículo</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field l="TAG"><input value={form.tag || ""} onChange={(e) => set("tag", e.target.value)} className={inp} data-testid="ev-tag" /></Field>
              <Field l="Placa" hint="Em maiúsculas.">
                <input value={form.placa || ""}
                  onChange={(e) => set("placa", e.target.value.toUpperCase())}
                  className={inp} data-testid="ev-placa" maxLength={8} placeholder="ABC1D23" />
              </Field>
              <Field l="Marca"><input value={form.marca || ""} onChange={(e) => set("marca", e.target.value)} className={inp} /></Field>
              <Field l="Modelo"><input value={form.modelo || ""} onChange={(e) => set("modelo", e.target.value)} className={inp} /></Field>
              <Field l="Ano"><input type="number" value={form.ano || ""} onChange={(e) => set("ano", e.target.value)} className={inp} /></Field>
              <Field l="Combustível">
                <select value={form.combustivel || ""} onChange={(e) => set("combustivel", e.target.value)} className={inp}>
                  <option value="">Selecione</option>
                  {COMBUSTIVEIS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field l="Capacidade"><input value={form.capacidade || ""} onChange={(e) => set("capacidade", e.target.value)} className={inp} /></Field>
              <Field l="Horímetro"><input value={form.horimetro || ""} onChange={(e) => set("horimetro", e.target.value)} className={inp} /></Field>
              <Field l="Quilometragem"><input value={form.quilometragem || ""} onChange={(e) => set("quilometragem", e.target.value)} className={inp} /></Field>
              <Field l="Empresa"><input value={form.empresa || ""} onChange={(e) => set("empresa", e.target.value)} className={inp} /></Field>
              <Field l="Centro de custo"><input value={form.centro_custo || ""} onChange={(e) => set("centro_custo", e.target.value)} className={inp} /></Field>
              <Field l="Unidade"><input value={form.unidade || ""} onChange={(e) => set("unidade", e.target.value)} className={inp} /></Field>
            </div>

            {/* Bloco custo/gestão para Frota — campos inegociáveis para relatórios. */}
            <div className="pt-4 border-t border-[#E2E8E4]">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#0F2542] mb-3">Custos e Gestão (Frota)</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field l="Origem">
                  <select value={form.origem || "proprio"} onChange={(e) => set("origem", e.target.value)} className={inp} data-testid="ev-origem">
                    <option value="proprio">Próprio</option>
                    <option value="alugado">Alugado</option>
                    <option value="prestacao">Prestação de serviço</option>
                  </select>
                </Field>
                <Field l="Valor mensal de aluguel (R$)" hint="Inegociável. Mesmo veículos próprios têm auto-aluguel interno para relatórios.">
                  <input type="number" value={form.valorAluguelMensal || ""} onChange={(e) => set("valorAluguelMensal", e.target.value)} className={inp} placeholder="15000" data-testid="ev-aluguel" />
                </Field>
                <Field l="Valor de patrimônio (R$)" hint="Para veículos próprios.">
                  <input type="number" value={form.valorPatrimonio || ""} onChange={(e) => set("valorPatrimonio", e.target.value)} className={inp} placeholder="350000" data-testid="ev-patrimonio" />
                </Field>
                <Field l="Data de aquisição">
                  <input type="date" value={form.dataAquisicao || ""} onChange={(e) => set("dataAquisicao", e.target.value)} className={inp} data-testid="ev-data-aquisicao" />
                </Field>
                <Field l="Vencimento do CRLV" hint="Aparece no Dashboard como alerta quando próximo do vencimento.">
                  <input type="date" value={form.vencimentoCRLV || ""} onChange={(e) => set("vencimentoCRLV", e.target.value)} className={inp} data-testid="ev-crlv" />
                </Field>
                <Field l="Equipe responsável" hint="Equipe que opera o veículo (definida pelo DP em /teams).">
                  <select value={form.teamId || ""} onChange={(e) => set("teamId", e.target.value)} className={inp} data-testid="ev-team">
                    <option value="">— Nenhuma —</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8E4]">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#0F2542] mb-3">Vínculos operacionais</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field l="Motorista titular" hint="O motorista 'dono' deste equipamento. Apenas motoristas APROVADOS pelo DP aparecem aqui — pendentes ficam ocultos até a aprovação.">
                  <select value={form.motoristaTitularId || ""} onChange={(e) => set("motoristaTitularId", e.target.value)} className={inp} data-testid="ev-titular" disabled={!canLinkDriver}>
                    <option value="">— Nenhum —</option>
                    {drivers.map((d) => <option key={d.id} value={d.id}>{d.name} {d.cnh ? `(CNH ${d.cnh})` : ""}</option>)}
                  </select>
                </Field>
                <Field l="Template de checklist diário" hint="Quando alguém abrir checklist deste veículo, este template vem carregado.">
                  <select value={form.checklistTemplateId || ""} onChange={(e) => set("checklistTemplateId", e.target.value)} className={inp} data-testid="ev-template">
                    <option value="">— Nenhum —</option>
                    {templates.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.items?.length || 0} itens)</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E2E8E4]">
              <button onClick={save} disabled={busy} data-testid="ev-save"
                className="flex items-center gap-2 bg-[#0F2542] text-white px-6 py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#16294A]">
                <FloppyDisk size={16} /> {busy ? "Salvando…" : "Salvar"}
              </button>
              <button onClick={() => { setEditing(false); setForm(vehicle); }}
                className="border border-[#E2E8E4] text-[#4A564F] px-6 py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#F5F7FA]">
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-[#0F2542] font-[Outfit,sans-serif]">Dados</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Row k="TAG" v={vehicle.tag} />
              <Row k="Equipamento" v={vehicle.equipamento_tipo} />
              <Row k="Marca / Modelo" v={`${vehicle.marca || ""} ${vehicle.modelo || ""}`} />
              <Row k="Ano" v={vehicle.ano} />
              <Row k="Combustível" v={vehicle.combustivel} />
              <Row k="Capacidade" v={vehicle.capacidade} />
              <Row k="Horímetro" v={vehicle.horimetro} />
              <Row k="Quilometragem" v={vehicle.quilometragem} />
              <Row k="Empresa" v={vehicle.empresa} />
              <Row k="Centro de custo" v={vehicle.centro_custo} />
              <Row k="Unidade" v={vehicle.unidade} />
              <Row k="Origem" v={vehicle.origem} />
            </div>

            <div className="pt-4 border-t border-[#E2E8E4]">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#0F2542] mb-3">Vínculos operacionais</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#EFF3F8] border border-[#2563EB]/20 rounded-md p-4 flex items-start gap-3">
                  <User size={20} className="text-[#2563EB] mt-1" weight="duotone" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#708278]">Motorista titular</div>
                    <div className="text-sm font-bold text-[#0F2542] mt-0.5">{titular?.name || vehicle.motoristaTitularNome || "— Não vinculado —"}</div>
                    {titular?.phone && <div className="text-xs text-[#4A564F]">{titular.phone}</div>}
                  </div>
                </div>
                <div className="bg-[#EFF3F8] border border-[#2563EB]/20 rounded-md p-4 flex items-start gap-3">
                  <ClipboardText size={20} className="text-[#2563EB] mt-1" weight="duotone" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#708278]">Template de checklist</div>
                    <div className="text-sm font-bold text-[#0F2542] mt-0.5">{tpl?.name || "— Não vinculado —"}</div>
                    {tpl && <div className="text-xs text-[#4A564F]">{tpl.items?.length || 0} itens</div>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ l, children, hint }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#708278] block mb-1.5">{l}</label>
      {children}
      {hint && <div className="text-[11px] text-[#708278] mt-1 italic">{hint}</div>}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="border-b border-[#E2E8E4] py-2">
      <div className="text-[10px] uppercase tracking-[0.15em] text-[#708278] font-bold">{k}</div>
      <div className="text-sm text-[#0F1411] font-semibold mt-0.5">{v || "—"}</div>
    </div>
  );
}
