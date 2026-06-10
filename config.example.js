// Configuração do frontend para integração com backend real.
// Em produção, troque API_BASE_URL pela URL pública da sua API.
window.HEMP_STORE_CONFIG = {
  API_BASE_URL: "", // ex.: "https://hempstore-api.seudominio.com"
  API_CREDENTIALS: "omit", // use "include" apenas se o backend trabalhar com cookies/sessão
  CHECKOUT_MODE: "real",
  MERCADO_PAGO_PUBLIC_KEY: "",
  PAYPAL_CLIENT_ID: ""
};
