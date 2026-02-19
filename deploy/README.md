# Deploy na VPS (Nginx no host)

**Domínio:** `status-sistem.thiagosilva.dev.br` (frontend) e `api.status-sistem.thiagosilva.dev.br` (API).

## 1. DNS

Aponte para o IP da VPS:

- `status-sistem.thiagosilva.dev.br`
- `api.status-sistem.thiagosilva.dev.br`

## 2. Certificado SSL

O config usa o certificado de **thiagosilva.dev.br** (`/etc/letsencrypt/live/thiagosilva.dev.br/`). Assim o Nginx sobe sem erro.

- Se o seu cert de thiagosilva.dev.br for **wildcard** (`*.thiagosilva.dev.br`), já está ok.
- Se for só para `thiagosilva.dev.br` e `www`, você precisa **incluir os subdomínios** no mesmo cert (recomendado):

```bash
sudo certbot certonly --nginx -d thiagosilva.dev.br -d www.thiagosilva.dev.br -d status-sistem.thiagosilva.dev.br -d api.status-sistem.thiagosilva.dev.br --expand
```

O cert continua em `/etc/letsencrypt/live/thiagosilva.dev.br/`. Depois: `sudo nginx -t && sudo systemctl reload nginx`.

## 3. Nginx (sites-available e sites-enabled)

Na VPS (nome do arquivo no repositório: `lab-app`; na VPS você pode usar `lab-docker-vue-nest`):

```bash
sudo cp deploy/nginx/sites-available/lab-app /etc/nginx/sites-available/lab-docker-vue-nest
sudo ln -s /etc/nginx/sites-available/lab-docker-vue-nest /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Se o reload falhar, veja o erro com: `sudo nginx -t` (mostra o motivo).

## 4. Docker Compose na VPS

**Importante:** na VPS use **só** o arquivo `docker-compose.vps.yml`. O `docker-compose.yml` sobe um proxy na porta 80, que conflita com o Nginx do host. Nunca rode `docker compose up` sem o `-f docker-compose.vps.yml` na VPS.

1. (Opcional) Crie um `.env` na raiz com variáveis de produção:

   ```env
   POSTGRES_PASSWORD=senha-forte-aqui
   JWT_SECRET=seu-jwt-secret-forte
   ```

2. Suba os containers:

   ```bash
   docker compose -f docker-compose.vps.yml up -d
   ```

O frontend fica em `localhost:9001` e o backend em `localhost:9002`; o Nginx do host faz o proxy.

### Erro "address already in use" / "failed to bind host port 80"

Você subiu o compose **errado** (com proxy). Na VPS não use o proxy em container. Faça:

```bash
docker compose down
docker compose -f docker-compose.vps.yml up -d
```

O `docker-compose.vps.yml` não tem o serviço `proxy`; só frontend (9001), backend (9002) e db. O Nginx do host faz o proxy.

### Erro "TLS handshake timeout" ao subir (pull da imagem do Postgres)

A VPS não está conseguindo falar com o Docker Hub. Tente:

1. **Rodar de novo** (às vezes é instabilidade de rede):
   ```bash
   docker compose -f docker-compose.vps.yml up -d
   ```
2. **Puxar a imagem antes**, com retry:
   ```bash
   docker pull postgres:16-alpine
   ```
   Se der timeout, teste a rede: `curl -I https://registry-1.docker.io/v2/`.
3. Se a VPS tiver **proxy/firewall**, configure o Docker para usar (HTTP/HTTPS proxy).
4. Alguns provedores têm **espelho do Docker Hub**; vale conferir na documentação deles.

---

**Resumo:** app (frontend) e api (backend) são as divisões do monorepo; na VPS elas ficam em **status-sistem.thiagosilva.dev.br** e **api.status-sistem.thiagosilva.dev.br** respectivamente.
