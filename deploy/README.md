# Deploy na VPS (Nginx no host)

## 1. Nginx (sites-available)

1. Edite `deploy/nginx/sites-available/lab-app` e substitua **SEU_DOMINIO** pelo seu domínio (ex: `exemplo.com`).
2. Na VPS:
   ```bash
   sudo cp deploy/nginx/sites-available/lab-app /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/lab-app /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```
3. Aponte os DNS: `app.SEU_DOMINIO` e `api.SEU_DOMINIO` para o IP da VPS.

## 2. Docker Compose na VPS

1. Crie um `.env` na raiz do projeto (opcional) com variáveis de produção:
   ```env
   POSTGRES_PASSWORD=senha-forte-aqui
   JWT_SECRET=seu-jwt-secret-forte
   ```
2. Suba os containers:
   ```bash
   docker compose -f docker-compose.vps.yml up -d
   ```

O frontend fica em `127.0.0.1:9001` e o backend em `127.0.0.1:9002`; o Nginx do host faz o proxy para esses endereços.
