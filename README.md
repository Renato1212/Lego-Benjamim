# Aloja — Conformidade automática para Alojamento Local

A **Aloja** é um micro SaaS que automatiza as obrigações legais dos anfitriões de Alojamento Local (AL) em Portugal. Uma única coima da AIMA pode custar até **€2.000 por hóspede** — a Aloja garante que nada falha, por uma fração desse valor.

## O problema

Quem gere um AL em Portugal tem três obrigações recorrentes, cada uma com coimas associadas:

1. **Comunicação AIMA/SIBA** — cada hóspede estrangeiro tem de ser comunicado no prazo de 3 dias úteis (coima até €2.000 por hóspede)
2. **Taxa turística municipal** — regras diferentes em cada município (tarifas, limites de noites, isenções de menores), com entrega mensal
3. **Inquérito INE** — estatísticas mensais obrigatórias, mesmo sem hóspedes

## A solução

- **Boletins de alojamento reais** — registo de hóspedes e submissão direta ao webservice SIBA (AIMA), com fallback de download do XML oficial para submissão manual em [siba.sef.pt](https://siba.sef.pt)
- **Taxa turística por município** — Lisboa (€4/noite, máx. 7), Porto (€3/noite, máx. 7), Cascais (€2/noite), Albufeira (€2 época alta / €1 época baixa), menores de 13 anos isentos
- **Relatórios INE pré-preenchidos** — dormidas, hóspedes, mercados de origem e estadia média calculados automaticamente
- **Feedback integrado** — botão flutuante em todas as páginas para os beta testers reportarem problemas e sugestões

## Áreas da aplicação

| Rota | O que é | Acesso |
| --- | --- | --- |
| `/` e `/precos` | Landing page e preços | Público |
| `/demo/*` | Produto com dados fictícios (para mostrar a potenciais clientes) | Público |
| `/registar` e `/entrar` | Criação de conta e início de sessão | Público |
| `/app/*` | Produto real: painel, hóspedes, boletins SIBA, taxa, propriedades | Requer sessão |

## Stack técnica

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript estrito
- Auth.js v5 (sessões JWT, palavra-passe com bcrypt)
- Prisma 7 + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- Integração SIBA/AIMA via SOAP 1.1 (homologação e produção)
- Tailwind CSS v4 · framer-motion · lucide-react · Inter (next/font)

## Como executar localmente

```bash
cp .env.example .env.local   # preencher DATABASE_URL e AUTH_SECRET
npm install
npx prisma db push           # cria o esquema na base de dados
npm run dev                  # http://localhost:3000
```

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | PostgreSQL (Neon, Supabase, Prisma Postgres, …) |
| `AUTH_SECRET` | Segredo das sessões — gerar com `openssl rand -hex 32` |
| `SIBA_ENV` | `test` (homologação, predefinido) ou `production` |
| `NEXT_PUBLIC_DEMO_MODE` | `true` — ativa o modo demonstração em `/demo` |

## Deployment (Vercel)

O `vercel.json` trata de tudo no build (`prisma generate` + `prisma db push` + `next build`). Passos:

1. Importar o repositório na Vercel
2. Em **Settings → Environment Variables**, adicionar `DATABASE_URL`, `AUTH_SECRET` e `SIBA_ENV`
3. Em **Settings → Deployment Protection**, desativar a **Vercel Authentication** (caso contrário os visitantes recebem um erro 403)
4. Redeploy

## Guia de testes SIBA (homologação)

Com `SIBA_ENV=test`, as submissões vão para o ambiente de homologação da AIMA (`siba.sef.pt/bawsdev`) — pode testar à vontade sem comunicar dados reais. Para ativar:

1. Registar a unidade hoteleira em [siba.sef.pt](https://siba.sef.pt) e pedir acesso por webservice
2. Em **Propriedades**, preencher a unidade hoteleira, o estabelecimento e a chave de acesso
3. Registar um hóspede e carregar em **Submeter ao SIBA**

Sem credenciais SIBA, o botão **Descarregar XML** gera o ficheiro oficial `Movimento_BAL` para submissão manual.

Quando a integração estiver validada com a AIMA, mude `SIBA_ENV` para `production`.
