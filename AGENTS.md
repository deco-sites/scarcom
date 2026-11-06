# AGENTS.md — Scarcom (deco.cx storefront)

Este documento orienta assistentes de IA e desenvolvedores que trabalham neste
repositório. O projeto é uma loja **deco.cx** (apps `deco` + `commerce` +
`website`) com runtime **Deno**, framework **Fresh** e UI **Preact**.

**Histórico de regras do Cursor:** não foi encontrado arquivo `.cursorrules` na
raiz do projeto no momento da criação deste documento; não houve conteúdo a
incorporar nem arquivo a remover.

---

## Stack e runtime

| Camada     | Tecnologia                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Runtime    | Deno (import maps em [`deno.json`](deno.json))                                                         |
| Framework  | Fresh 1.7.x (`$fresh/`)                                                                                |
| UI         | Preact 10.x, JSX `react-jsx` com `jsxImportSource: preact`                                             |
| Plataforma | deco.cx (`@deco/deco`, apps em `apps/`)                                                                |
| E-commerce | `apps/commerce` + plataforma configurada em [`apps/site.ts`](apps/site.ts) (VTEX, Shopify, Wake, etc.) |
| Estilos    | Tailwind (padrão do starter), DaisyUI referenciado no lock de imports                                  |

**Import aliases úteis (ver [`deno.json`](deno.json)):**

- `deco-sites/scarcom/` e `$store/` → raiz do projeto
- `apps/` → pacote deco apps (remoto)
- `deco/` → pacote deco core (remoto)

---

## Estrutura de pastas (o que vai onde)

| Pasta                                | Função                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| [`sections/`](sections/)             | **Sections** expostas ao CMS: cada arquivo é uma seção editável; muitas exportam `loader` + componente default |
| [`components/`](components/)         | Componentes reutilizáveis usados pelas sections                                                                |
| [`islands/`](islands/)               | **Islands** Fresh (hidratação client-side); usar só quando precisar de JS no browser                           |
| [`routes/`](routes/)                 | Rotas Fresh (`_app.tsx`, etc.)                                                                                 |
| [`loaders/`](loaders/)               | Loaders auxiliares / widgets do admin (ícones, layouts, listas)                                                |
| [`apps/`](apps/)                     | Apps Deco locais (ex.: [`apps/site.ts`](apps/site.ts), integrações VTEX, analytics)                            |
| [`.deco/blocks/`](.deco/blocks/)     | **Blocos JSON** da página: composição de sections, props guardadas pelo Site Editor                            |
| [`static/`](static/)                 | Assets estáticos servidos pelo site                                                                            |
| [`fresh.config.ts`](fresh.config.ts) | Configuração Fresh + plugin deco                                                                               |

**Não editar manualmente** [`manifest.gen.ts`](manifest.gen.ts) e
[`fresh.gen.ts`](fresh.gen.ts): são gerados pelo fluxo de desenvolvimento deco
(`deno task dev` / `dev.ts`).

---

## Fluxo de uma página (CMS → código)

1. Uma **página** (ex.: Home) é definida por um bloco em
   `.deco/blocks/pages-*.json` com lista `sections`.
2. Cada entrada `__resolveType` aponta para uma section (ex.:
   `site/sections/Content/Partners.tsx`) ou para um **container** que agrupa
   outras sections.
3. Props configuradas no admin aparecem como JSON nesses blocos e são passadas
   ao **loader** (se existir) e ao componente.

Ao adicionar uma nova section, é preciso que o manifest seja regenerado (via
`deno task dev` ou `deno task gen` conforme o fluxo do projeto).

---

## Padrões de código para sections

- Arquivos em `sections/**/*.tsx` (e frequentemente `components/**/*.tsx`).
- Props tipadas com interface `Props`; usar **JSDoc** (`@title`, `@description`,
  `@format textarea`, etc.) para o formulário no Deco admin.
- **Loader assíncrono** quando há dados remotos:

```ts
export async function loader(props: Props, req: Request) {
  // fetch, transformar, retornar objeto
  return { ...props, data };
}

export default function MySection(
  { data, ...props }: SectionProps<typeof loader>,
) {
  // ...
}
```

- Importar tipos de `@deco/deco`: `SectionProps`, `LoaderReturnType`, etc., como
  nas sections existentes (ex.:
  [`sections/Social/InstagramPosts.tsx`](sections/Social/InstagramPosts.tsx)).
- Preferir **fetch no servidor** dentro do loader; evitar expor secrets ao
  cliente.
- Ilhas: só para interatividade (carrossel com estado, modais complexos); o
  projeto já usa [`components/ui/Slider.tsx`](components/ui/Slider.tsx) e
  padrões em `islands/`.

---

## Comandos úteis

Definidos em [`deno.json`](deno.json) → `tasks`:

| Comando                       | Uso                                                             |
| ----------------------------- | --------------------------------------------------------------- |
| `deno task dev`               | Desenvolvimento local (HMR, KV instável conforme task)          |
| `deno task start`             | Início via `deco.cx/run` (ambiente configurado)                 |
| `deno task check`             | `deno fmt` + `deno lint` + `deno check` em `dev.ts` e `main.ts` |
| `deno task gen`               | Gerar manifest apenas                                           |
| `deno task build` / `preview` | Build e preview                                                 |

**Githooks:** `pre-commit` corre `check` — antes de commit, o formato e lint
devem passar.

**Formatação:** Prettier está em [`package.json`](package.json) (Tailwind
plugin); o repositório usa principalmente `deno fmt` no hook.

---

## Variáveis de ambiente e secrets

- Credenciais (tokens, API keys, OAuth) devem ficar em **secrets / env** do Deco
  ou em arquivos locais não commitados (ex.: `.env` ignorado).
- Nunca commitar chaves privadas, JSON de service account, ou tokens em blocos
  `.deco` ou código.

### Google Business — bloco de avaliações ([`sections/Content/GoogleBusinessReviews.tsx`](sections/Content/GoogleBusinessReviews.tsx))

| Variável                                                                                        | Obrigatório            | Descrição                                                                                                           |
| ----------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_BUSINESS_LOCATION_NAME`                                                                 | Sim (API)              | Nome do recurso do estabelecimento: `accounts/…/locations/…`. Pode ser sobrescrito pela prop `locationName` no CMS. |
| `GOOGLE_BUSINESS_ACCESS_TOKEN`                                                                  | Uma das opções         | Bearer token válido para `mybusiness.googleapis.com`.                                                               |
| `GOOGLE_BUSINESS_REFRESH_TOKEN` + `GOOGLE_BUSINESS_CLIENT_ID` + `GOOGLE_BUSINESS_CLIENT_SECRET` | Alternativa            | Renovam o access token via `oauth2.googleapis.com/token`.                                                           |
| `GOOGLE_BUSINESS_PUBLIC_REVIEWS_URL`                                                            | Para o CTA “ver todas” | URL da ficha/maps com avaliações; pode usar a prop `googleReviewsUrl` no bloco.                                     |

Ver [`.env.example`](.env.example) para um esqueleto seguro. O cache de lista
está em memória no worker com TTL configurável (`cacheTtlSeconds` na section,
default 3600 s).

---

## Integrações e apps

- [`apps/site.ts`](apps/site.ts): app principal do site, plataforma de commerce
  e tema global.
- [`apps/deco/`](apps/deco/): extensões Deco (VTEX, analytics, algolia, etc.) —
  alinhar com o que já está no `manifest.gen.ts`.

---

## Padrão de mensagens de commit

Usar uma linha no formato:

```text
{NÚMERO} - {tipo} - {descrição curta}
```

| Parte               | Regra                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{NÚMERO}`          | **Só dígitos:** o número da task (o mesmo da branch; ex.: branch `task8471` ou `8471-feature-x` → use `8471` na mensagem). Não usar o prefixo literal `task` no commit. |
| `{tipo}`            | Tipo convencional em inglês, minúsculas: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, etc.                                       |
| `{descrição curta}` | Resumo objetivo do que mudou; preferir imperativo e sem ponto final ao fim.                                                                                             |

**Exemplos**

```text
8471 - feat - adiciona banner promocional na home
8471 - fix - corrige overflow do menu em mobile
12003 - chore - sincroniza bloco de SEO no CMS
```

A branch pode continuar a usar um prefixo (ex.: `task9845-...`); na mensagem de
commit entra **apenas o número** `9845`, alinhado a essa task.

---

## Convenções para assistentes (IA)

1. **Mudanças mínimas:** alterar só o necessário; não refatorar arquivos não
   relacionados.
2. **Seguir o estilo existente:** imports, naming, estrutura de Props/loader das
   sections vizinhas.
3. **Comentários:** só onde a regra de negócio ou o “porquê” não for óbvio.
4. **Testes:** adicionar só se pedido ou se for crítico para o comportamento
   novo.
5. **Commits:** só quando o usuário pedir explicitamente; não alterar
   `git config`; não usar `--no-verify` salvo pedido. Quando criar commits,
   seguir o [Padrão de mensagens de commit](#padrão-de-mensagens-de-commit).

---

## Referências

- [README](README.md) — início rápido e recursos do starter
- [deco.cx docs](https://docs.deco.cx) — performance, loaders, caching
- [Deno manual](https://docs.deno.com) — fmt, lint, import maps

---

_Última atualização: env vars Google Business (avaliações) + .env.example._
