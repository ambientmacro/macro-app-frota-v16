import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { REQ_STATUS, REQ_STATUS_LABEL, REQ_STATUS_COLOR, VEHICLE_STATUS, DRIVER_STATUS, REQ_TYPE } from "../lib/constants";
import { canActAsSeguranca, canReviewDP } from "../lib/roles";
import { notifyWhatsApp } from "../lib/whatsapp";
import { toast } from "sonner";
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, ClipboardText, ArrowLeft, PencilSimple, Trash } from "@phosphor-icons/react";

export default function RequerimentoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [req, setReq] = useState(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "requerimentos", id));
      setReq(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    })();
  }, [id]);

  if (!req) return <div className="p-10 text-sm text-[#4A564F]">Carregando…</div>;

  const refresh = async () => {
    const snap = await getDoc(doc(db, "requerimentos", id));
    setReq(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  };

  const transition = async (newStatus, action) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, "requerimentos", id), {
        status: newStatus,
        history: arrayUnion({
          at: new Date().toISOString(),
          action,
          by: profile.name,
          byRole: profile.role,
          comment: comment || null,
        }),
        updatedAt: serverTimestamp(),
      });
      // Update vehicle status
      if (req.vehicleId) {
        if (newStatus === REQ_STATUS.AGUARDANDO_VISTORIA) {
          await updateDoc(doc(db, "vehicles", req.vehicleId), { status: VEHICLE_STATUS.PENDING_ACTIVATION });
        }
        if (newStatus === REQ_STATUS.FINALIZADO) {
          await updateDoc(doc(db, "vehicles", req.vehicleId), { status: VEHICLE_STATUS.ACTIVE, activatedAt: serverTimestamp() });
        }
      }
      // Update driver status when motorista flow is finalized by DP
      if (req.driverId && newStatus === REQ_STATUS.FINALIZADO) {
        const drvSnap = await getDoc(doc(db, "drivers", req.driverId));
        const hasLogin = drvSnap.exists() && drvSnap.data().hasLogin;
        await updateDoc(doc(db, "drivers", req.driverId), {
          status: hasLogin ? DRIVER_STATUS.ACTIVE : DRIVER_STATUS.NO_LOGIN_USER,
          approvedAt: serverTimestamp(),
          approvedBy: profile.name,
        });
      }
      if (req.driverId && newStatus === REQ_STATUS.REPROVADO) {
        await updateDoc(doc(db, "drivers", req.driverId), { status: DRIVER_STATUS.INACTIVE });
      }
      // Decide recipient by role of the transition
      let recipients = [];
      let title = "Atualização de requerimento";
      if (newStatus === REQ_STATUS.APROVADO) {
        recipients = [{ userId: req.createdByUserId }];
        title = "DP aprovou seu requerimento";
      } else if (newStatus === REQ_STATUS.REPROVADO) {
        recipients = [{ userId: req.createdByUserId }];
        title = "DP reprovou requerimento";
      } else if (newStatus === REQ_STATUS.EM_ANALISE_SEGURANCA) {
        recipients = ["seguranca"];
        title = "Encaminhado para Segurança";
      } else if (newStatus === REQ_STATUS.AGUARDANDO_VISTORIA) {
        recipients = [{ userId: req.createdByUserId }, "encarregado", "admin_frota"];
        title = "Vistoria preparada — aguardando";
      } else if (newStatus === REQ_STATUS.FINALIZADO) {
        recipients = [{ userId: req.createdByUserId }, "encarregado", "admin_frota"];
        title = "Cadastro finalizado ✓";
      }
      const alvo = req.data?.motorista_nome || req.data?.tag || `${req.data?.marca || ""} ${req.data?.modelo || ""}`.trim() || "Requerimento";
      const message = `🔔 *MACRO AMBIENTAL — Atualização*

📋 Requerimento: ${alvo}
🆔 Protocolo: ${id.slice(0, 10)}
📈 Novo status: *${REQ_STATUS_LABEL[newStatus]}*
👤 Ação por: ${profile.name} (${profile.role})${comment ? `\n💬 Comentário: "${comment}"` : ""}

Acesse o sistema:
${window.location.origin}/requerimentos/${id}`;
      await notifyWhatsApp({ recipients, title, message, context: { requerimentoId: id, newStatus } });
      toast.success("Status atualizado");
      setComment("");
      await refresh();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#708278] hover:text-[#1E3A5F]">
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#708278] font-bold">Requerimento · {req.type}</div>
          <h1 className="font-[Outfit,sans-serif] text-3xl font-black tracking-tight text-[#0F1411] mt-2 flex items-center gap-3 flex-wrap">
            <span>{req.data?.motorista_nome || req.data?.tag || `${req.data?.marca || ""} ${req.data?.modelo || ""}`.trim() || "Requerimento"}</span>
            {req.data?.placa && (
              <span className="text-sm font-bold bg-[#1E3A5F] text-white px-2 py-1 rounded">{req.data.placa}</span>
            )}
          </h1>
          <div className="text-sm text-[#4A564F] mt-1">Criado por {req.createdByName}</div>
        </div>
        <span className={`inline-flex text-xs uppercase tracking-[0.15em] font-bold px-3 py-2 rounded-md border self-start ${REQ_STATUS_COLOR[req.status] || ""}`} data-testid="req-status">
          {REQ_STATUS_LABEL[req.status] || req.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <section className="lg:col-span-2 bg-white border border-[#E2E8E4] rounded-md p-6">
          <h3 className="font-[Outfit,sans-serif] text-xl font-bold text-[#1E3A5F]">Dados</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            {Object.entries(req.data || {}).filter(([k]) => k !== "documentos").map(([k, v]) => (
              <div key={k} className="border-b border-[#E2E8E4] py-2">
                <div className="text-[10px] uppercase tracking-[0.15em] text-[#708278] font-bold">{k.replace(/_/g, " ")}</div>
                <div className="text-sm text-[#0F1411] font-semibold mt-0.5">{String(v) || "—"}</div>
              </div>
            ))}
          </div>
          {req.data?.documentos?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#708278]">Documentos</h4>
              <div className="mt-2 space-y-2">
                {req.data.documentos.map((d, i) => (
                  <a key={i} href={d.dataUrl} download={d.name} className="flex items-center gap-2 border border-[#E2E8E4] rounded-md px-4 py-2 text-sm text-[#1E3A5F] hover:bg-[#EFF3F8]">
                    <ClipboardText size={16} /> {d.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="bg-white border border-[#E2E8E4] rounded-md p-6">
          <h3 className="font-[Outfit,sans-serif] text-xl font-bold text-[#1E3A5F]">Ações</h3>

          {/* RASCUNHO: dono pode continuar editando ou descartar */}
          {req.status === REQ_STATUS.RASCUNHO && req.createdByUserId === profile.id && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-[#4A564F]">Este requerimento está como <strong>rascunho</strong>. Continue editando para concluir o envio ao DP.</p>
              <button onClick={() => navigate(`/requerimentos/novo?draft=${req.id}`)} data-testid="btn-continuar-rascunho"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:from-[#1D4ED8] hover:to-[#1E40AF]">
                <PencilSimple size={16} /> Continuar editando
              </button>
              <button onClick={async () => {
                if (!window.confirm("Descartar este rascunho? Esta ação não pode ser desfeita.")) return;
                setBusy(true);
                try {
                  await deleteDoc(doc(db, "requerimentos", id));
                  toast.success("Rascunho descartado.");
                  navigate("/requerimentos");
                } catch (e) { toast.error(e.message); }
                finally { setBusy(false); }
              }} disabled={busy} data-testid="btn-descartar-rascunho"
                className="w-full flex items-center justify-center gap-2 border border-[#C25D41] text-[#C25D41] py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#C25D41] hover:text-white transition-all">
                <Trash size={16} /> Descartar rascunho
              </button>
            </div>
          )}

          {/* DP Actions — quando PENDENTE */}
          {req.status === REQ_STATUS.PENDENTE && canReviewDP(profile.role) && (
            <div className="mt-4 space-y-3">
              <textarea data-testid="dp-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
                placeholder="Comentário (opcional)" className="w-full border border-[#E2E8E4] bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[#1E3A5F]" />
              {req.type === REQ_TYPE.MOTORISTA ? (
                // Para SÓ MOTORISTA: DP aprova → FINALIZADO direto (sem Segurança/Vistoria)
                <button disabled={busy} onClick={() => transition(REQ_STATUS.FINALIZADO, "DP finalizou cadastro do motorista")} data-testid="btn-dp-finalizar-motorista"
                  className="w-full flex items-center justify-center gap-2 bg-[#2E7D32] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:opacity-90">
                  <CheckCircle size={16} /> Aprovar e Finalizar Cadastro
                </button>
              ) : (
                // Para VEÍCULO ou VEÍCULO+MOTORISTA: DP aprova → ainda precisa ir pra Segurança
                <button disabled={busy} onClick={() => transition(REQ_STATUS.APROVADO, "DP aprovou")} data-testid="btn-dp-aprovar"
                  className="w-full flex items-center justify-center gap-2 bg-[#2E7D32] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:opacity-90">
                  <CheckCircle size={16} /> Aprovar (DP)
                </button>
              )}
              <button disabled={busy} onClick={() => transition(REQ_STATUS.REPROVADO, "DP reprovou")} data-testid="btn-dp-reprovar"
                className="w-full flex items-center justify-center gap-2 bg-[#C25D41] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:opacity-90">
                <XCircle size={16} /> Reprovar
              </button>
            </div>
          )}

          {/* DP forward to Segurança — só para veículo / veículo+motorista */}
          {req.status === REQ_STATUS.APROVADO && req.type !== REQ_TYPE.MOTORISTA && canReviewDP(profile.role) && (
            <button disabled={busy} onClick={() => transition(REQ_STATUS.EM_ANALISE_SEGURANCA, "Encaminhado para Segurança")} data-testid="btn-encaminhar-seg"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#1E3A5F] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#2A4A78]">
              <ArrowRight size={16} /> Encaminhar para Segurança
            </button>
          )}

          {/* RESGATE: requerimento de motorista travado em fluxo de veículo (Aprovado / Em Análise / Aguardando Vistoria) — DP pode finalizar direto */}
          {req.type === REQ_TYPE.MOTORISTA &&
           [REQ_STATUS.APROVADO, REQ_STATUS.EM_ANALISE_SEGURANCA, REQ_STATUS.AGUARDANDO_VISTORIA].includes(req.status) &&
           canReviewDP(profile.role) && (
            <div className="mt-4 space-y-3">
              <div className="bg-[#FEF3C7] border border-[#F59E0B]/40 rounded-md p-3 text-xs text-[#92400E]">
                <strong>Atenção:</strong> este requerimento é apenas de <strong>motorista</strong>, não precisa passar por Segurança/Vistoria. Finalize o cadastro abaixo.
              </div>
              <button disabled={busy} onClick={() => transition(REQ_STATUS.FINALIZADO, "DP finalizou cadastro do motorista (resgate)")} data-testid="btn-dp-resgatar-motorista"
                className="w-full flex items-center justify-center gap-2 bg-[#2E7D32] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:opacity-90">
                <CheckCircle size={16} /> Concluir Cadastro do Motorista
              </button>
            </div>
          )}

          {/* Segurança actions — só veículo */}
          {req.status === REQ_STATUS.EM_ANALISE_SEGURANCA && req.type !== REQ_TYPE.MOTORISTA && canActAsSeguranca(profile.role) && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-[#4A564F]">Vincule um checklist ao veículo e prepare a vistoria.</p>
              <button disabled={busy} onClick={() => transition(REQ_STATUS.AGUARDANDO_VISTORIA, "Segurança preparou checklist e iniciou vistoria")} data-testid="btn-preparar-vistoria"
                className="w-full flex items-center justify-center gap-2 bg-[#1E3A5F] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#2A4A78]">
                <ShieldCheck size={16} /> Preparar Vistoria
              </button>
            </div>
          )}

          {/* Vistoria action — só veículo */}
          {req.status === REQ_STATUS.AGUARDANDO_VISTORIA && req.type !== REQ_TYPE.MOTORISTA && canActAsSeguranca(profile.role) && req.vehicleId && (
            <button onClick={() => navigate(`/vistoria/${req.id}`)} data-testid="btn-realizar-vistoria"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#1E3A5F] text-white py-3 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#2A4A78]">
              <ClipboardText size={16} /> Realizar Vistoria de Entrada
            </button>
          )}

          {/* History */}
          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#708278]">Histórico</h4>
            <div className="mt-3 space-y-3">
              {(req.history || []).map((h, i) => (
                <div key={i} className="border-l-2 border-[#1E3A5F] pl-3">
                  <div className="text-xs font-bold text-[#0F1411]">{h.action}</div>
                  <div className="text-[11px] text-[#708278]">{h.by} ({h.byRole}) · {new Date(h.at).toLocaleString("pt-BR")}</div>
                  {h.comment && <div className="text-xs text-[#4A564F] mt-1 italic">"{h.comment}"</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
