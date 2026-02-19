# Lab Docker Vue Nest

Sistema interno com autenticação, dashboard e CRUD de registros.

## Arquitetura

- **proxy** (Nginx): único serviço exposto nas portas 80/443
- **frontend** (Vue 3 + Vite + Tailwind + DaisyUI): app.local
- **backend** (NestJS + Prisma): api.local
- **db** (PostgreSQL): rede interna

## Pré-requisitos

- Docker e Docker Compose
- Entrada no `/etc/hosts`:
  ```
  127.0.0.1 app.local api.local
  ```

## Desenvolvimento

```bash
docker compose up -d
```

Aguardar healthchecks passarem (30-60s na primeira execução).

Acesse:
- **Frontend:** http://app.local (ou http://localhost com Host: app.local)
- **API:** http://api.local

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
