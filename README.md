
# MACRO AMBIENTAL — Sistema de Gestão de Frota

Sistema operacional de gestão de frota, motoristas e checklists construído com **React 19 + Vite 6 + Firebase**.

## Em desenvolvimento
### Equipe Contribuinte
- Arthur
- Ester
- Rickhelme
- Yuri
---

## 🎯 Como rodar do ZERO (passo a passo blindado)

### 1️⃣ Instale as ferramentas (uma única vez)

| Ferramenta | Versão mínima | Onde baixar |
|---|---|---|
| **Node.js** | 18 LTS (recomendado **20 LTS**) | https://nodejs.org/en/download |
| **Git** | qualquer | https://git-scm.com/downloads |
| Editor (opcional) | — | https://code.visualstudio.com |

Confira que está instalado abrindo um **terminal novo** (PowerShell no Windows, Terminal no Mac/Linux):

```bash
node -v    # deve mostrar v20.x.x (ou v18.x.x)
npm -v     # deve mostrar 10.x.x (ou maior)
git --version
```

> ⚠️ **Se já tinha Node antigo instalado**, recomendo apagar e reinstalar do site oficial pra garantir versão atual.

### 2️⃣ Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO/frontend
```

### 3️⃣ Limpeza preventiva (importante se já tentou instalar antes)

Se você **já tentou rodar `npm install` antes e deu erro**, faça essa limpeza:

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction Ignore
Remove-Item -Force package-lock.json -ErrorAction Ignore
npm cache clean --force
```

**Mac / Linux:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
```

### 4️⃣ Instale as dependências

```bash
npm install
```

> Se aparecer erro de **peer dependency** (`ERESOLVE`), rode com a flag:
> ```bash
> npm install --legacy-peer-deps
> ```
> Isso é seguro nesse projeto.

### 5️⃣ Confira o arquivo `.env`

O `.env` deve estar na raiz da pasta `frontend/` com este conteúdo:

# banco de adados conta *yuritakeo*
```env
VITE_FIREBASE_API_KEY=AIzaSyCKPYdy-1T6tYWmmRr2sYhv6ewlO-sCfqo
VITE_FIREBASE_AUTH_DOMAIN=testechecklistfrota.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=testechecklistfrota
VITE_FIREBASE_STORAGE_BUCKET=testechecklistfrota.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=862111407814
VITE_FIREBASE_APP_ID=1:862111407814:web:fbde6895f3e2abb529c1c7
VITE_FIREBASE_MEASUREMENT_ID=G-0DKN0BFCTB
```

# banco de adados conta *ambientmacro*
```env
VITE_FIREBASE_API_KEY=AIzaSyCikw6eKgjuJVL-ja_aGniiwlK3eF3PGBM
VITE_FIREBASE_AUTH_DOMAIN=gestao-frota-9da3a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gestao-frota-9da3a
VITE_FIREBASE_STORAGE_BUCKET=gestao-frota-9da3a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=417897413988
VITE_FIREBASE_APP_ID=1:417897413988:web:f063242576aa2c4cccce71
VITE_FIREBASE_MEASUREMENT_ID=G-S0H02RS53D
```



Se não estiver, **crie o arquivo `.env`** na pasta `frontend/` (não em subpasta) com o conteúdo acima.

### 6️⃣ Autorize `localhost` no Firebase

1. Abra https://console.firebase.google.com
2. Selecione o projeto **<nome-do-projeto-firebase>** **testechecklistfrota (Conta yuritakeo)**
3. Menu lateral → **Authentication** → aba **Settings** → seção **Authorized domains**
4. Verifique se **`localhost`** está na lista. Se não estiver, clique em **Add domain** e adicione.

> Sem esse passo, o login local retorna erro de "unauthorized domain".

### 7️⃣ Rode o servidor de desenvolvimento

```bash
npm run dev
```

Vai abrir em **http://localhost:3000** com hot reload.

### 8️⃣ Logue no sistema

## 🔑 Credenciais

# banco de adados conta *yuritakeo*
| Perfil | E-mail | Senha |
|---|---|---|
| TI / Admin (você) | `yuri@macro.local` | `yuri12345` |
| yuri seguranca / Segurança do Trabalho | `seguranca@macro.local` | `123456` |
| yuri frota / Administrador de Frota | `frota@macro.local` | `123456` |
| yuri encarregado / Encarregado | `encarregado@macro.local` | `123456` |
| yuri dp / Departamento Pessoal | `dp@macro.local` | `123456` |
| Yuri Motorista / Motorista | `yurimotmiyazaki@macro.local` | `123456` |


# banco de adados conta *ambientmacro*
| Perfil | E-mail | Senha |
|---|---|---|
| TI / Admin (você) | `ambientmacro@gmail.com` | `123456` |
| yuri Segurança Trabalho / Segurança do Trabalho | `yurisegurancatrabalho@eng.br` | `123456` |
| yuri Frota / Administrador de Frota | `yurifrota@eng.br` | `123456` |
| yuri Encarregado / Encarregado | `yuriencarregado@eng.br` | `123456` |
| yuri DP | `yuridp@emg.br` | `123456` |
| yuri Motorista / Motorista | `yurimotorista@eng.br` | `123456` |

jair@email.com 123456

Arthur
arthur@eng.br

## Falta corrigir (ToDo)
- FLUXO DE REQUERIMENTO DO VEÍCULO TERMINA NO DP TAMBÉM, TEM QUE PASSAR PELO SEGURANÇA ANTES COM TUDO VALIDADO, E O DP QUE ARQUIVA O CONTRATO EM PAPEL NO FINAL. (VER ESSE FLUXO ATUAL COM ARTHUR COMO PROPOSTA).
R: Já visto, vamos seguir com a proposta de o fluxo finalizar no dp onde é armazenado autorizado para aprovação.


- QUEM FAZ A VISTORIA DE ENTRADA É O ADM DE FROTA E NÃO O TEC DE SEGURANÇA, O TEC DE SEG SÓ RELACIONA O CHECKLIST, MAIS O FROTA POR ENQUANTO PODE TAMBÉM E JÁ ESTÁ CERTO


- NA TELA PARA CRIAR LOGIN PARA O OPERADOR / MOTORISTA PODE SER TAMBÉM NUMEROS E LETRAS MAIUSCULA (QUANDO VAI CRIAR LOGIN PARA O MOTORISTA)
- O HEADER DO SUBMODULO DO WIZARD FICAR CONGELADO E PODER SER CLICAVEL PARA NAVEGAÇÃO
- MOVER O COMPONENTE DE Criar usuário do zero PARA CIMA DE TUDO
- NO PERFIL ADM FROTA NO RELATÓRIO DE PATRIMONIO INCLUIR DEPRECIAÇÃO? ANO OBRIGATÓRIO? PARA O CALCULO DA DEPRECIAÇÃO
- VERIFICAR SE TODA RASTREABILIDADE DA CRIAÇÃO E DESATIVAÇÃO DOS RECURSOS ESTÃO OK, SE PODE AUDITAR TRANQUILAMENTE EXEMPLO QUEM E QUANDO CRIOU USUÁRIO TAL, QUANDO FORAM QUE EDITARAM POR QUEM E TALS RECURSO (COISAS DE AUDITORIA).

- AJUSTAR O FLUXO DO WIZARD QUANDO SELECIONAR PROPRIO NÃO APARECER NO FLUXO COISAS COMO Valor de Aquisição (R$) POR EXEMPLO ASSIM COMO APARECE PARA OS ALUGADO O CAMPO Data de Aquisição AO INVÉS DATA INICIO DO ALUGUEL


- VERIFICAR SE NÃO É POSSIVEL LANÇAR 2 PLACA IGUAIS NO SISTEMA

- ZOD VALIDAÇÃO DE FORMULÁRIO

- NO FORMULÁRIO DE APROVAÇÃO DO DP, OS DADOS MOTORISTAS E VEICULOS ESTÃO VINDO TUDO JUNTO, SENDO QUE O MESMO DEVEM VIR INDIVIDUALMENTE, A REGRA É SE O REQUERIMENTO FOR OS DOIS DE UMA VEZ(MOTORISTA + VEÍCULO), VOU PRECISAR RELACIONAR UM FUNCIONÁRIO JÁ CADASTRADO E RELACIONAR ELE AO MOTORISTA TITULAR SE AMBOS FOREM APROVADOS PARA SEGUIR COM FLUXO OU SEJA, DENTRO DO WIZARD
E TAMBÉM O FUNCIONÁRIO VOU TER QUE LANÇAR E GERENCIAR SALARIO, BENEFICIOS, PLANO DE SAÚDE POR EXEMPLOS (CONFORME ESTAVA CAMINHANDO A V1)

- NA EDIÇÃO DE VEÍCULO PARA OS PERFIL DE TEC SEG OU ENCARREGADO ENTRE OUTROS NÃO PODE ALTERAR O VALOR DO ALUGUEL E DADOS DO VEÍCULO, ISSO SOMENTE O SETOR DE FROTA E O DP

- FUTURAMENTE MELHORAR O WIZARD NA HORIZONTAL
- FUTURAMENTE MELHORAR ALÉM DO KABAN E LISTA, MOSTRA EM FORMA DE FLUXO E EM QUAL MOMENTO ESTÁ IGUAL FOI DESENHADO

## Nescessário para produção
- Fazer o fluxo e cadastro com dados reais da aplicação testando a usabilidade.
- Corrigir os itens críticos acima.
- O ADM DE FROTA QUANDO SELECIONAR O MOTORISTA TITULAR E SE ESSE MOTORISTA ESTIVER EM OUTRO VEÍCULO, O MESMO DEVE SAIR PARA NÃO DAR PROBLEMA NA HORA DE PREENCHER O CHECKLIST
- INTEGRAR COM O PERFOMASE
...



## Falta analisar
- O adm frota também poderá dar acesso para os motoriste terem acesso no sistema? verificar

---

## 📦 Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload (porta 3000) |
| `npm run build` | Gera a build de produção em `build/` |
| `npm run preview` | Roda a build de produção localmente para teste |
| `npm run lint` | Executa o ESLint |

---

## 🔧 Troubleshooting (resolução de problemas comuns)

### ❌ `npm error ERESOLVE unable to resolve dependency tree`

**Causa:** conflito de peer dependencies (versões incompatíveis entre libs).

**Solução A (recomendada):**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

**Solução B:** Use `--force`:
```bash
npm install --force
```

### ❌ `Cannot find module '@/something'`

**Causa:** alias `@` não está sendo resolvido. Provavelmente o `vite.config.js` foi alterado ou está faltando.

**Solução:** Confirme que `vite.config.js` tem:
```js
resolve: {
  alias: { "@": path.resolve(__dirname, "./src") }
}
```

### ❌ Login retorna `auth/unauthorized-domain`

**Causa:** `localhost` não está autorizado no Firebase.

**Solução:** Siga o passo 6 acima.

### ❌ `Firebase: Error (auth/invalid-api-key)`

**Causa:** arquivo `.env` não foi carregado ou tem chave errada.

**Solução:**
1. Confirme que o `.env` está em `frontend/.env` (não em subpasta).
2. Confirme que cada linha começa com `VITE_FIREBASE_` (não `REACT_APP_`).
3. **Reinicie o servidor** (`Ctrl+C` e `npm run dev` de novo) — Vite só lê `.env` no startup.

### ❌ Porta 3000 já em uso

**Solução:** Vite mostra a porta disponível automaticamente (3001, 3002…). Ou mate o processo:

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_MOSTRADO> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### ❌ `Module not found: Can't resolve 'firebase/auth'`

**Causa:** `firebase` não foi instalado direito.

**Solução:**
```bash
npm install firebase
```

### ❌ Tela branca no navegador

**Solução:**
1. Abra o **Console** do navegador (F12)
2. Veja o erro real
3. Os mais comuns:
   - **`apiKey` undefined** → problema do `.env` (ver acima)
   - **`db` is undefined** → arquivo `lib/firebase.js` foi corrompido
4. Limpe cache do navegador: `Ctrl+Shift+R`

### ❌ Windows: erros de permissão / `EPERM`

**Solução:**
1. Feche o VS Code e qualquer outro programa usando a pasta
2. Rode o terminal **como Administrador**
3. Tente de novo

---

## 🔑 Credenciais

| Perfil | E-mail | Senha |
|---|---|---|
| TI / Admin (você) | `yuri@macro.local` | `yuri12345` |

Cadastro público está **desativado**. Use o usuário acima para entrar e criar os demais usuários em **Menu → Usuários → Novo Usuário**.

---

## 📁 Estrutura do projeto

```
frontend/
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes UI (shadcn + custom)
│   ├── contexts/        # AuthContext
│   ├── hooks/           # React hooks
│   ├── lib/             # Firebase init, helpers (whatsapp, pdf, roles)
│   ├── pages/           # Telas (rotas)
│   ├── App.js           # Roteamento
│   ├── main.jsx         # Entry point (Vite)
│   └── index.css        # Tailwind + global
├── index.html           # HTML root (Vite)
├── package.json
├── vite.config.js       # Config Vite (alias @, JSX em .js, porta 3000)
├── tailwind.config.js
├── postcss.config.js
└── .env                 # Credenciais Firebase
```

---

## 🛠 Stack

- **React 19** + **Vite 6**
- **Tailwind CSS 3** + **shadcn/ui** + **Phosphor Icons**
- **Firebase** Auth + Firestore + Storage
- **react-router-dom 7** · **sonner** (toasts) · **jspdf** (PDF) · **react-hook-form** + **zod**

---

## 📚 Fluxos principais

Veja o manual completo em [`MANUAL.md`](./MANUAL.md) (gere com o agente se não tiver).

Resumo:
1. **TI/Admin** cria usuários
2. **Encarregado / Admin Frota** cria Requerimento (Wizard 7 etapas dinâmicas)
3. **DP** aprova → encaminha para Segurança
4. **Segurança do Trabalho** prepara checklist (Template) + realiza Vistoria de Entrada
5. **Veículo fica ATIVO** → pode receber Checklist diário
6. **WhatsApp Click-to-Chat** abre conversa pronta a cada transição

---

## 🧱 Próximos passos sugeridos

- Migrar WhatsApp Click-to-Chat → API oficial Meta
- Cadastros próprios de Empresas, Funções, Centros de Custo
- Cursos/NRs com alertas de vencimento (CNH, ASO)
- Multi-empresa (Macro / Dinâmica / RC) com isolamento de dados
- Object Storage real (substituir base64)
- Relatórios exportáveis (CSV/Excel)
