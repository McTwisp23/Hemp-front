# Integração com backend real

Este frontend já está preparado para chamar uma API real por HTTP.

## 1. Configurar a URL da API

Edite `config.js`:

```js
window.HEMP_STORE_CONFIG = {
  API_BASE_URL: "https://sua-api.com",
  API_CREDENTIALS: "omit",
  CHECKOUT_MODE: "real"
};
```

Também é possível testar sem editar arquivo usando a URL:

```txt
checkout.html?api=https://sua-api.com
```

A URL informada por `?api=` fica salva no `localStorage` do navegador.

## 2. Endpoints esperados

### Login

```http
POST /auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "cliente@email.com",
  "password": "senha"
}
```

Resposta esperada:

```json
{
  "token": "jwt-ou-token-da-sessao",
  "user": { "id": "user_123", "email": "cliente@email.com" }
}
```

### Registro

```http
POST /auth/register
Content-Type: application/json
```

Resposta igual ao login.

### Endereço

```http
POST /addresses
Authorization: Bearer <token>
Content-Type: application/json
```

Resposta mínima:

```json
{ "id": "addr_123" }
```

### Checkout

```http
POST /checkout
Authorization: Bearer <token>
Content-Type: application/json
```

O frontend envia itens com `sku`, `productId`, `quantity`, `variant`, `unitPriceCents`, `currency`, dados do cliente, entrega, totais em centavos, provedor de pagamento e URLs de retorno.

Resposta aceita pelo frontend:

```json
{
  "orderId": "ord_123",
  "checkoutUrl": "https://url-do-gateway.com"
}
```

Também são aceitos os campos `approvalUrl`, `redirectUrl` ou `initPoint`. Para Pix/boleto sem redirecionamento, retorne ao menos `orderId` para o frontend abrir a página de pendência.

### Pedidos

```http
GET /orders
Authorization: Bearer <token>
```

Resposta esperada: array de pedidos.

```json
[
  {
    "id": "ord_123",
    "createdAt": "2026-06-10T12:00:00.000Z",
    "status": "created",
    "paymentStatus": "pending",
    "totalCents": 290170,
    "items": [
      { "name": "OG Kush", "sku": "strain-og-kush", "quantity": 1 }
    ]
  }
]
```

## 3. Observações importantes

O backend deve recalcular preços, frete, impostos e estoque no servidor. Os valores enviados pelo frontend servem para conferência e experiência visual, mas não devem ser a fonte final de cobrança.

Configure CORS no backend para permitir o domínio do GitHub Pages ou domínio próprio do frontend.
