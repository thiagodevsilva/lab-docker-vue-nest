# Deploy na VPS (Nginx no host)

**Domínio:** `status-sistem.thiagosilva.dev.br` (frontend) e `api.status-sistem.thiagosilva.dev.br` (API).

## 1. DNS

Aponte para o IP da VPS:

- `status-sistem.thiagosilva.dev.br`
- `api.status-sistem.thiagosilva.dev.br`

## 2. Certificado SSL (Let's Encrypt)

Gere o certificado **antes** de ativar o site (o config do Nginx já referencia os caminhos do cert).

**Opção A – standalone (Nginx parado):**

```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d status-sistem.thiagosilva.dev.br -d api.status-sistem.thiagosilva.dev.br
sudo systemctl start nginx
```

**Opção B – com Nginx rodando:**  
Se já tiver outro site servindo na 80, use:

```bash
sudo certbot certonly --nginx -d status-sistem.thiagosilva.dev.br -d api.status-sistem.thiagosilva.dev.br
```

## 3. Nginx (sites-available e sites-enabled)

Na VPS, na pasta do projeto:

```bash
sudo cp deploy/nginx/sites-available/lab-app /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/lab-app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4. Docker Compose na VPS

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

---

**Resumo:** app (frontend) e api (backend) são as divisões do monorepo; na VPS elas ficam em **status-sistem.thiagosilva.dev.br** e **api.status-sistem.thiagosilva.dev.br** respectivamente.
