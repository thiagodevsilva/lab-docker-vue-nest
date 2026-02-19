# Lab Docker Vue Nest

Sistema interno com autenticação, dashboard e CRUD de registros.

## Arquitetura

- **proxy** (Nginx): único serviço exposto nas portas 80/443
- **frontend** (Vue 3 + Vite + Tailwind + DaisyUI): app.local
- **backend** (NestJS + Prisma): api.local
- **db** (PostgreSQL): rede interna

## Pré-requisitos

- Docker e Docker Compose

## Desenvolvimento (local com hot reload)

O projeto usa `docker-compose.override.yml` para montar o código local nos containers. Assim, alterações em **app/frontend** e **app/backend** são aplicadas em tempo real (Vite HMR no frontend, Nest `--watch` no backend).

**Pré-requisito:** adicione no `/etc/hosts` (ou `C:\Windows\System32\drivers\etc\hosts` no Windows):

```
127.0.0.1 app.local api.local
```

**Subir tudo:**

```bash
docker compose up -d
```

Na primeira vez, aguarde os healthchecks (30–60 s). Depois:

- **Frontend:** http://app.local:8081 (proxy Nginx na porta 8081)
- **API:** http://api.local:8081

(A porta 8081 evita conflito com a 80 ou 8080 já usadas no seu sistema.)

Edite o código em `app/frontend` ou `app/backend`; as alterações entram automaticamente (recarregue o frontend no browser se o HMR não atualizar sozinho).

### Credenciais (seed)

| Email            | Senha     | Perfil |
|------------------|-----------|--------|
| admin@lab.local  | admin123  | Admin  |

O seed é executado com `npx prisma db seed`. Para rodar manualmente:
```bash
docker compose run --rm backend npx prisma db seed
```

### Verificação

```bash
# Frontend (HTML)
curl -H "Host: app.local" http://localhost

# Backend health
curl -H "Host: api.local" http://localhost/health

# Login
curl -H "Host: api.local" -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lab.local","password":"admin123"}'
```

### Logs

```bash
docker compose logs -f
```

## Produção

1. Ver exemplo em `proxy/nginx/conf.d/prod.example.conf.disabled` e ajustar `server_name` para os domínios reais
2. Configurar TLS (certbot/Let's Encrypt)
3. Definir variáveis de ambiente:
   - `JWT_SECRET`: segredo para tokens
   - `DATABASE_URL`: connection string PostgreSQL
4. Executar migrations: `docker compose run --rm backend npx prisma migrate deploy`
5. Opcional: executar seed para criar admin inicial

## Estrutura

```
├── app/
│   ├── frontend/    # Vue 3 + Vite + Tailwind + DaisyUI
│   └── backend/     # NestJS + Prisma
├── proxy/
│   └── nginx/conf.d/
└── docker-compose.yml
```
