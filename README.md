# HempStore Site

Site estático (HTML/CSS/JS).

## Rodar localmente
Abra o `index.html` no navegador, ou use um servidor simples (recomendado):

### Python
```bash
python3 -m http.server 8000
```
Depois acesse: http://localhost:8000

## Publicar no GitHub Pages
1. Crie um repositório no GitHub (ex.: `hempstore-site`)
2. Faça upload **do conteúdo desta pasta** (onde está o `index.html`)
3. No GitHub: **Settings → Pages**
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/(root)`
4. A URL ficará assim:
`https://SEU_USUARIO.github.io/hempstore-site/`

## Observações
- O botão **Voltar** na página de produto retorna para a página anterior real (histórico/referrer), com fallback para `produtos.html`.


## Estrutura simplificada
- Removida a pasta duplicada/legado `hempstore-site-github-ready_responsivo_v8/` (não era usada pelo site e só confundia o projeto).
- Projeto permanece 100% estático: `*.html` + `styles.css` + `app.js`.

## Atualização do checkout transparente

Esta versão inclui `checkout.html` com visual minimalista em duas colunas:

- resumo do pedido em card claro com comportamento sticky no desktop;
- resumo recolhível no mobile;
- painel de pagamento limpo;
- botões de provedor para **Mercado Pago** e **PayPal**;
- métodos: PIX Mercado Pago, cartão Mercado Pago, boleto Mercado Pago, PayPal e Bitcoin Lightning como opção alternativa;
- payload enviado ao backend com itens, variantes, totais em centavos, dados do cliente, endereço, `paymentProvider`, `clientPaymentMethod`, `gatewayMode` e URLs de retorno.

Para produção, configure as credenciais reais no backend, nunca direto no frontend:

- Mercado Pago: `MERCADOPAGO_ACCESS_TOKEN` e public key usada no SDK/tokenização;
- PayPal: `PAYPAL_CLIENT_ID` e `PAYPAL_CLIENT_SECRET`;
- Webhooks: confirme pagamento antes de liberar o pedido.

Veja `BACKEND_INTEGRATION.md` para o contrato completo dos endpoints.


## Backend real

Esta versão inclui `config.js`, `config.example.js` e `BACKEND_INTEGRATION.md`. Edite `config.js` com a URL da sua API para conectar login, pedidos, endereço e checkout real.
