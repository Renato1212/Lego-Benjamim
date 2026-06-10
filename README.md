# Aloja — Conformidade automática para Alojamento Local

A **Aloja** é um micro SaaS que automatiza as obrigações legais dos anfitriões de Alojamento Local (AL) em Portugal. Uma única coima da AIMA pode custar até **€2.000 por hóspede** — a Aloja garante que nada falha, por uma fração desse valor.

## O problema

Quem gere um AL em Portugal tem três obrigações recorrentes, cada uma com coimas associadas:

1. **Comunicação AIMA** — cada hóspede estrangeiro tem de ser comunicado no prazo de 3 dias úteis (coima até €2.000 por hóspede)
2. **Taxa turística municipal** — regras diferentes em cada município (tarifas, limites de noites, isenções de menores), com entrega mensal
3. **Inquérito INE** — estatísticas mensais obrigatórias, mesmo sem hóspedes

## A solução

- **Boletins de alojamento automáticos** — gerados e acompanhados a partir das reservas, com alertas antes de cada prazo
- **Taxa turística por município** — Lisboa (€4/noite, máx. 7), Porto (€3/noite, máx. 7), Cascais (€2/noite), Albufeira (€2 época alta / €1 época baixa), menores de 13 anos isentos; guia de pagamento mensal num clique
- **Relatórios INE pré-preenchidos** — dormidas, hóspedes, mercados de origem e estadia média calculados automaticamente
- **Check-in digital do hóspede** — recolha dos dados obrigatórios (nome, documento, nacionalidade, datas) no telemóvel do hóspede
- **Sincronização iCal** — Airbnb e Booking.com sem inserção manual de reservas

## Planos

| Plano | Preço | Inclui |
| --- | --- | --- |
| Anfitrião | €29/mês | 1 propriedade, boletins ilimitados, taxa turística, INE |
| Profissional | €59/mês | Até 5 propriedades, multi-calendário, faturação, SMS |
| Agência | €149/mês | Propriedades ilimitadas, API, gestor de conta dedicado |

Todos os planos com 14 dias grátis, sem cartão de crédito.

## Stack técnica

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript estrito
- Tailwind CSS v4 (`@theme inline`)
- framer-motion (animações subtis) · lucide-react (ícones) · Inter (next/font)

## Como executar

```bash
npm install
npm run dev      # desenvolvimento — http://localhost:3000
npm run build    # build de produção
npm start        # servir a build
```

## Estrutura

```
app/
  page.tsx              # landing page
  precos/               # página de preços com comparação detalhada
  demo/                 # produto em modo demonstração (sem login)
    page.tsx            # painel de conformidade
    hospedes/           # registo de hóspedes e estado dos boletins
    taxa/               # cálculo da taxa turística por município
    relatorios/         # relatórios INE pré-preenchidos
    propriedades/       # propriedades e sincronização de calendários
    definicoes/         # perfil, notificações e faturação
  api/
    guests/route.ts     # GET lista / POST registo (mock)
    tax/route.ts        # GET cálculo da taxa por município (mock)
components/
  landing/              # secções da landing page
  dashboard/            # componentes do painel
  ui/                   # primitivas (Button, Card, Badge, Input, Modal)
lib/
  mock-data.ts          # dados fictícios do modo demonstração
  tax-rules.ts          # regras da taxa turística por município
```

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_DEMO_MODE` | `true` — toda a aplicação funciona com dados fictícios, sem APIs externas |

## Deployment

Pronta para a Vercel (`vercel.json` incluído). Basta importar o repositório — não são necessárias chaves nem serviços externos no modo demonstração.

---

© 2026 Aloja · Feito em Portugal 🇵🇹 · A Aloja não presta aconselhamento jurídico.
