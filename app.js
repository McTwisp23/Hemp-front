/* =========================
   HEMP Store - app.js (FULL)
   - i18n (PT/EN/IT/FR/DE/ES/ZH)
   - Language wheel (iPhone style) + flags
   - Featured products render
   - Products catalog (categories + variants)
   - Cart + Checkout + Login (demo)
========================= */

/* ---------- Languages ---------- */
const LANGS = [
  { code:"pt", flag:"🇧🇷", name:"Português", meta:"Brasil" },
  { code:"en", flag:"🇺🇸", name:"English", meta:"United States" },
  { code:"fr", flag:"🇫🇷", name:"Français", meta:"France" },
  { code:"it", flag:"🇮🇹", name:"Italiano", meta:"Italia" },
  { code:"es", flag:"🇪🇸", name:"Español", meta:"España" },
  { code:"de", flag:"🇩🇪", name:"Deutsch", meta:"Deutschland" },
  { code:"ja", flag:"🇯🇵", name:"日本語", meta:"日本" },
  { code:"zh", flag:"🇨🇳", name:"中文", meta:"简体" },
];
  
  /* ---------- Storage ---------- */
  const LS = {
    langKey: "hemp_lang",
    userKey: "hemp_user",
    cartKey: "hemp_cart",
    orderKey:"hemp_last_order",
    tokenKey:"hemp_token",
    apiKey:"hemp_api",
  };
  
  function getLang(){
    const stored = (localStorage.getItem(LS.langKey) || "pt").toLowerCase();
    return LANGS.some(l=>l.code===stored) ? stored : "pt";
  }
  function setLang(code){
    const clean = String(code || "pt").toLowerCase();
    localStorage.setItem(LS.langKey, clean);
    // A moeda acompanha automaticamente o idioma selecionado.
    if(typeof setCurrency === "function" && typeof currencyForLang === "function"){
      setCurrency(currencyForLang(clean));
    }
  }
  function getUser(){ try { return JSON.parse(localStorage.getItem(LS.userKey) || "null"); } catch { return null; } }
  function setUser(user){ localStorage.setItem(LS.userKey, JSON.stringify(user)); }
  function logout(){ localStorage.removeItem(LS.userKey); localStorage.removeItem(LS.tokenKey); location.href = "index.html"; }
  
  function getCart(){ try { return JSON.parse(localStorage.getItem(LS.cartKey) || "[]"); } catch { return []; } }
  function setCart(cart){ localStorage.setItem(LS.cartKey, JSON.stringify(cart)); updateCartBadge(); }
  function cartCount(){
    const items = (typeof isValidCartItem === "function") ? getCart().filter(isValidCartItem) : getCart();
    return items.reduce((sum,i)=>sum + i.qty, 0);
  }
  
  
  /* ---------- API (localhost default) ---------- */
  function getApiBase(){
    const q = new URLSearchParams(location.search);
    const fromQuery = q.get("api");
    if(fromQuery){
      const clean = String(fromQuery).replace(/\/$/, "");
      localStorage.setItem(LS.apiKey, clean);
      return clean;
    }
    const stored = localStorage.getItem(LS.apiKey);
    return String(stored || "http://localhost:3001").replace(/\/$/, "");
  }
  function getToken(){ return localStorage.getItem(LS.tokenKey) || ""; }
  function setToken(tok){
    if(tok) localStorage.setItem(LS.tokenKey, tok);
    else localStorage.removeItem(LS.tokenKey);
  }

  async function apiFetch(path, opts={}){
    const url = getApiBase() + path;
    const headers = Object.assign({ "Content-Type":"application/json" }, (opts.headers||{}));
    const tok = getToken();
    if(tok) headers["Authorization"] = "Bearer " + tok;
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    let data = null;
    const ct = res.headers.get("content-type") || "";
    if(ct.includes("application/json")){
      try{ data = await res.json(); }catch{ data = null; }
    } else {
      try{ data = await res.text(); }catch{ data = null; }
    }
    if(!res.ok){
      const msg = (data && data.error) ? data.error : `HTTP ${res.status}`;
      const err = new Error(msg);
      // @ts-ignore
      err.status = res.status;
      // @ts-ignore
      err.data = data;
      throw err;
    }
    return data;
  }

  function setAuthSession(payload){
    // payload: { token, user }
    if(payload?.token) setToken(payload.token);
    if(payload?.user) setUser(payload.user);
  }

/* ---------- i18n dictionary ---------- */
  const I18N = {
    pt: {
      or:"ou",
      installment_of:"de",
      password_min:"A senha precisa ter no mínimo 8 caracteres.",
      home:"Home", products:"Produtos", about:"Sobre", contact:"Contato",
      cart:"Carrinho", checkout:"Checkout", login:"Login",
      my_orders:"Minhas compras",
      language:"Idioma", ok:"OK",
      hero_title:"Lifestyle canábico",
      hero_sub:"Catálogo digital premium com navegação clara, produtos destacados e experiência pensada para mobile.",
      hero_image_label:"Imagem do produto",
      see_products:"Ver produtos",
      featured:"Produtos em Destaque",
      search_ph:"Buscar produtos…",
      all_categories:"Todas categorias",
      cat_oils:"Óleos",
      cat_strains:"Strains",
      cat_cigars:"Charutaria",
      cat_gummies:"Gomas",
      cat_extracts:"Extrações",
      cat_drinks:"Bebidas",
      cat_accessories:"Acessórios",
      cat_beverages:"Bebidas",
      cat_vapes:"Vapes",
      cat_pets:"Pets",
      cat_edibles:"Comestíveis",
  
      back:"← Voltar para Produtos",
      product_page:"Página de Produto",
      choose:"Escolha as opções",
      choose_volume_strain:"Selecione a configuração do produto",
      your_config:"Sua configuração",
      desc:"Descrição",
      add_cart:"Adicionar ao carrinho",
      view_cart:"Ver carrinho",
      continue:"Continuar comprando",
  
      sign_in:"Entrar",
      sign_out:"Sair",
      email:"E-mail",
      password:"Senha",
      create_demo:"(Conta real) Use seu e-mail e senha (mín. 8 caracteres)",
  
      empty_cart:"Seu carrinho está vazio.",
      item:"Item",
      price:"Preço",
      qty:"Quantidade",
      remove:"Remover",
      subtotal:"Subtotal",
      shipping:"Frete",
      tax:"Impostos",
      total:"Total",
      go_checkout:"Ir para checkout",
  
      checkout_title:"Checkout detalhado",
      step1:"Dados do cliente",
      step2:"Endereço de entrega",
      step3:"Frete",
      step4:"Pagamento",
      step5:"Resumo",
      first:"Nome", last:"Sobrenome", phone:"Telefone",
      doc:"CPF/CNPJ",
      address1:"Rua e número", address2:"Complemento",
      city:"Cidade", state:"Estado", zip:"CEP", country:"País",
      shipping_method:"Método de frete",
      ship_std:"Padrão (3–7 dias)",
      ship_exp:"Expresso (1–3 dias)",
      pay_method:"Método de pagamento",
      pay_pix:"PIX",
      pay_boleto:"Boleto",
      pay_ted:"TED",
      pay_doc:"DOC",
      pay_btc:"Bitcoin (Lightning)",
      pay_hint_btc:"Você paga como preferir — a Hemp Store recebe em BTC via Lightning.",
      pay_hint_fiat:"Pagamentos em reais (PIX/Boleto/TED/DOC) ficam como \"aguardando\" até a compensação.",
      invoice_title:"Pagamento em BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copiar invoice",
      invoice_copied:"Copiado!",
      open_wallet:"Abrir na carteira",
      fiat_title:"Instruções do pagamento em reais",
      fiat_pix_key:"Chave PIX",
      fiat_pix_payload:"Copia e cola",
      fiat_boleto_code:"Código do boleto",
      fiat_bank_title:"Dados bancários",
      fiat_bank_name:"Banco",
      fiat_agency:"Agência",
      fiat_account:"Conta",
      fiat_holder:"Favorecido",
      fiat_cnpj:"CPF/CNPJ",
      place_order:"Gerar cobrança",
      order_ok:"Cobrança gerada! (demo)",
      checkout_terms:"Ao finalizar, você concorda com os termos (demo).",
  
      // product option labels
      opt_type:"Tipo",
      opt_profile:"Perfil",
      opt_cannabinoid:"Cannabinoide",
      opt_size:"Tamanho",
      opt_color:"Cor",
      opt_flavor:"Sabor",
      opt_puffs:"Puxadas",
      opt_ice:"Gelo",
      opt_variety:"Variedade",
      opt_weight:"Peso",
      opt_ml:"ML",
      opt_strain:"Strain",
      opt_strength:"Potência",
      opt_format:"Formato",
      opt_spectrum:"Espectro",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Unidades",
  
      // medical-style friendly disclaimer
      med_note_title:"Nota (bem de boa):",
      med_note:"Cannabinoides e terpenos podem apoiar relaxamento, sono, apetite e bem-estar em algumas pessoas — mas cada corpo é um corpo. Isso aqui é conteúdo informativo, não substitui orientação médica. Se você usa remédios, está grávida(o) ou tem alguma condição, converse com um profissional.",
      pay_debit:"Débito",
      pay_credit:"Crédito",
      pay_hint_card:"Pagamento por cartão (débito/crédito). (demo) Em produção, processe via adquirente/gateway e só libere após confirmação.",
      checkout_receive_ln:"A Hemp Store recebe em BTC via Lightning.",
      order_summary:"Revise seu pedido",
      card_name:"Nome no cartão",
      card_name_ph:"Como no cartão",
      card_number:"Número do cartão",
      card_exp:"Validade",
      card_cvv:"CVV",
      card_installments:"Parcelamento",
      company:"Empresa",
      footer_nav:"Navegação",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Digite um termo e pressione Enter para navegar pelo catálogo.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Receba novidades, prévias de catálogo e lançamentos selecionados.",
      subscribe:"Inscrever",
      email_placeholder:"seuemail@exemplo.com",
      terms:"Termos",
      privacy:"Privacidade",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Catálogo premium com curadoria visual, informações claras e experiência digital responsiva.",
      footer_desc_hoc:"Pesquisa, qualidade, documentação e supply chain para operações em mercados regulados.",
      newsletter_success:"Cadastro recebido! (demo)",
      newsletter_invalid:"Digite um e-mail válido.",
      cannabinoids_title:"Principais canabinoides",
      cannabinoids_sub:"Informações gerais sobre compostos presentes em produtos de cannabis e cânhamo, com linguagem simples e foco educativo.",
      cann_label_props:"Propriedades comuns:",
      cann_label_studied:"Estudado para:",
      cann_cbd_title:"CBD (Canabidiol)",
      cann_cbd_props:"Possível ação anti-inflamatória*, ansiolítica* e analgésica*.",
      cann_cbd_studied:"Bem-estar, relaxamento, sono e conforto — a evidência varia por condição e produto.",
      cann_cbd_more:"CBD é geralmente não intoxicante e aparece em óleos, gomas e produtos pet. Leia rótulos e verifique conformidade local.",
      cann_thc_title:"THC (Tetrahidrocanabinol)",
      cann_thc_props:"Pode ser euforizante*, analgésico* e antiemético*.",
      cann_thc_studied:"Dor, náusea e apetite — somente onde permitido; a evidência varia.",
      cann_thc_more:"THC é regulado e pode ser intoxicante. Use apenas onde permitido e com responsabilidade.",
      cann_cbg_title:"CBG (Canabigerol)",
      cann_cbg_props:"Possível ação anti-inflamatória* e antioxidante* (evidência ainda emergente).",
      cann_cbg_studied:"Suporte de bem-estar e inflamação — evidência ainda preliminar.",
      cann_cbg_more:"CBG é menos comum e costuma aparecer em fórmulas específicas (isolado ou blend).",
      learn_more:"Saiba mais",
      cann_note:"*Efeitos variam. Este conteúdo é educativo e não substitui orientação médica."

    },
  
    en: {
      or:"or",
      installment_of:"of",
      password_min:"Password must be at least 8 characters long.",
      home:"Home", products:"Products", about:"About", contact:"Contact",
      cart:"Cart", checkout:"Checkout", login:"Login",
      my_orders:"My orders",
      language:"Language", ok:"OK",
      hero_title:"Cannabis lifestyle",
      hero_sub:"Premium hemp-based products. Design, wellness and sustainability in one place.",
      hero_image_label:"Product image",
      see_products:"See products",
      featured:"Featured Products",
      search_ph:"Search products…",
      all_categories:"All categories",
      cat_oils:"Oils",
      cat_strains:"Strains",
      cat_cigars:"Cigars & pre-rolls",
      cat_gummies:"Gummies",
      cat_extracts:"Extracts",
      cat_drinks:"Drinks",
      cat_accessories:"Accessories",
      cat_beverages:"Beverages",
      cat_vapes:"Vapes",
      cat_pets:"Pets",
      cat_edibles:"Edibles",
  
      back:"← Back to Products",
      product_page:"Product Page",
      choose:"Choose options",
      choose_volume_strain:"Choose volume and variety",
      your_config:"Your configuration",
      desc:"Description",
      add_cart:"Add to cart",
      view_cart:"View cart",
      continue:"Continue shopping",
  
      sign_in:"Sign in",
      sign_out:"Sign out",
      email:"Email",
      password:"Password",
      create_demo:"(Demo) Use any email/password",
  
      empty_cart:"Your cart is empty.",
      item:"Item",
      price:"Price",
      qty:"Quantity",
      remove:"Remove",
      subtotal:"Subtotal",
      shipping:"Shipping",
      tax:"Tax",
      total:"Total",
      go_checkout:"Go to checkout",
  
      checkout_title:"Detailed checkout",
      step1:"Customer details",
      step2:"Shipping address",
      step3:"Shipping",
      step4:"Payment",
      step5:"Summary",
      first:"First name", last:"Last name", phone:"Phone",
      doc:"ID / Tax number",
      address1:"Street and number", address2:"Apt / Suite",
      city:"City", state:"State", zip:"ZIP", country:"Country",
      shipping_method:"Shipping method",
      ship_std:"Standard (3–7 days)",
      ship_exp:"Express (1–3 days)",
      pay_method:"Payment method",
      pay_card:"Card",
      pay_pix:"PIX",
      card_name:"Name on card",
      card_number:"Card number",
      card_exp:"Expiry (MM/YY)",
      card_cvv:"CVV",
      pix_note:"PIX key will be generated at place order (demo).",
      place_order:"Place order",
      order_ok:"Order placed (demo)! Thank you.",
      checkout_terms:"By placing the order, you agree to the terms (demo).",
  
      opt_type:"Type",
      opt_profile:"Profile",
      opt_cannabinoid:"Cannabinoid",
      opt_size:"Size",
      opt_color:"Color",
      opt_flavor:"Flavor",
      opt_puffs:"Puffs",
      opt_ice:"Ice",
      opt_variety:"Variety",
      opt_weight:"Weight",
      opt_ml:"ML",
      opt_strain:"Strain",
      opt_strength:"Strength",
      opt_format:"Format",
      opt_spectrum:"Spectrum",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Units",
  
      med_note_title:"Friendly note:",
      med_note:"Cannabinoids and terpenes may support relaxation, sleep, appetite and wellness for some people — but everyone’s different. This is informational content, not medical advice. If you take meds, are pregnant, or have a condition, talk to a professional.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Bank transfer (TED)",
      pay_doc:"Bank transfer (DOC)",
      pay_debit:"Debit",
      pay_credit:"Credit",
      pay_hint_btc:"Pay however you want — Hemp Store receives BTC via Lightning.",
      pay_hint_fiat:"BRL payments (PIX/Boleto/TED/DOC) stay as pending until cleared.",
      pay_hint_card:"Card payment (debit/credit). (demo) In production, process via your acquirer/gateway and only release after confirmation.",
      invoice_title:"BTC payment (Lightning)",
      invoice_label:"Lightning invoice",
      invoice_copy:"Copy invoice",
      invoice_copied:"Copied!",
      open_wallet:"Open wallet",
      fiat_title:"BRL payment instructions",
      fiat_pix_key:"PIX key",
      fiat_pix_payload:"Copy & paste",
      fiat_boleto_code:"Boleto code",
      fiat_bank_name:"Bank",
      fiat_agency:"Branch",
      fiat_account:"Account",
      fiat_holder:"Account holder",
      fiat_cnpj:"Tax ID",
      checkout_receive_ln:"Hemp Store receives BTC via Lightning.",
      order_summary:"Review your order",
      card_name_ph:"As on card",
      card_installments:"Installments",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Press Enter to search the catalog.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Key cannabinoids",
      cannabinoids_sub:"Learn about common cannabinoids found in hemp-based products (informational only).",
      cann_label_props:"Common properties:",
      cann_label_studied:"Studied for:",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Potential anti-inflammatory*, calming* and analgesic* effects.",
      cann_cbd_studied:"Well-being, relaxation, sleep and comfort — evidence varies by condition and product.",
      cann_cbd_more:"CBD is generally non-intoxicating and appears in oils, gummies and pet products. Check labels and local compliance.",
      cann_thc_title:"THC (Tetrahydrocannabinol)",
      cann_thc_props:"May be euphoric*, analgesic* and antiemetic*.",
      cann_thc_studied:"Pain, nausea and appetite — where permitted; evidence varies.",
      cann_thc_more:"THC is regulated and can be intoxicating. Use only where permitted and responsibly.",
      cann_cbg_title:"CBG (Cannabigerol)",
      cann_cbg_props:"Potential anti-inflammatory* and antioxidant* activity (early evidence).",
      cann_cbg_studied:"Wellness support and inflammation — evidence is still preliminary.",
      cann_cbg_more:"CBG is less common and often appears in targeted formulas (isolates or blends).",
      learn_more:"Learn more",
      cann_note:"*Effects vary. Educational content; not medical advice."

    },
  
    it: {
      or:"oppure",
      installment_of:"di",
      password_min:"La password deve contenere almeno 8 caratteri.",
      home:"Home", products:"Prodotti", about:"Chi siamo", contact:"Contatto",
      cart:"Carrello", checkout:"Checkout", login:"Login",
      my_orders:"I miei ordini",
      language:"Lingua", ok:"OK",
      hero_title:"Lifestyle cannabico",
      hero_sub:"Prodotti premium a base di canapa. Design, benessere e sostenibilità in un unico posto.",
      hero_image_label:"Immagine del prodotto",
      see_products:"Vedi prodotti",
      featured:"Prodotti in evidenza",
      search_ph:"Cerca prodotti…",
      all_categories:"Tutte le categorie",
      cat_oils:"Oli",
      cat_strains:"Strains",
      cat_cigars:"Sigari & pre-roll",
      cat_gummies:"Caramelle",
      cat_extracts:"Estratti",
      cat_drinks:"Bevande",
      cat_accessories:"Accessori",
      cat_beverages:"Bevande",
      cat_vapes:"Vape",
      cat_pets:"Animali",
      cat_edibles:"Edibili",
  
      back:"← Torna ai Prodotti",
      product_page:"Pagina Prodotto",
      choose:"Scegli le opzioni",
      choose_volume_strain:"Scegli volume e varietà",
      your_config:"La tua configurazione",
      desc:"Descrizione",
      add_cart:"Aggiungi al carrello",
      view_cart:"Vedi carrello",
      continue:"Continua lo shopping",
  
      sign_in:"Accedi",
      sign_out:"Esci",
      email:"Email",
      password:"Password",
      create_demo:"(Demo) Usa qualsiasi email/password",
  
      empty_cart:"Il carrello è vuoto.",
      item:"Articolo",
      price:"Prezzo",
      qty:"Quantità",
      remove:"Rimuovi",
      subtotal:"Subtotale",
      shipping:"Spedizione",
      tax:"Tasse",
      total:"Totale",
      go_checkout:"Vai al checkout",
  
      checkout_title:"Checkout dettagliato",
      step1:"Dati cliente",
      step2:"Indirizzo di consegna",
      step3:"Spedizione",
      step4:"Pagamento",
      step5:"Riepilogo",
      first:"Nome", last:"Cognome", phone:"Telefono",
      doc:"ID / Codice fiscale",
      address1:"Via e numero", address2:"Interno",
      city:"Città", state:"Provincia", zip:"CAP", country:"Paese",
      shipping_method:"Metodo di spedizione",
      ship_std:"Standard (3–7 giorni)",
      ship_exp:"Espresso (1–3 giorni)",
      pay_method:"Metodo di pagamento",
      pay_card:"Carta",
      pay_pix:"PIX",
      card_name:"Nome sulla carta",
      card_number:"Numero carta",
      card_exp:"Scadenza (MM/AA)",
      card_cvv:"CVV",
      pix_note:"La chiave PIX verrà generata al termine (demo).",
      place_order:"Conferma ordine",
      order_ok:"Ordine confermato (demo)! Grazie.",
      checkout_terms:"Confermando, accetti i termini (demo).",
  
      opt_type:"Tipo",
      opt_profile:"Profilo",
      opt_cannabinoid:"Cannabinoide",
      opt_size:"Dimensione",
      opt_flavor:"Gusto",
      opt_puffs:"Tiri",
      opt_ice:"Ghiaccio",
      opt_strain:"Strain",
      opt_strength:"Potenza",
      opt_format:"Formato",
      opt_spectrum:"Spettro",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Unità",
  
      med_note_title:"Nota (tranquilla):",
      med_note:"Cannabinoidi e terpeni possono supportare relax, sonno e benessere in alcune persone — ma ognuno è diverso. Informativo, non è consiglio medico.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Bonifico (TED)",
      pay_doc:"Bonifico (DOC)",
      pay_debit:"Debito",
      pay_credit:"Credito",
      pay_hint_btc:"Paga come preferisci — Hemp Store riceve BTC via Lightning.",
      pay_hint_fiat:"Pagamenti in BRL (PIX/Boleto/TED/DOC) restano in attesa fino alla compensazione.",
      pay_hint_card:"Pagamento con carta (debito/credito). (demo) In produzione, elabora tramite acquirer/gateway e rilascia solo dopo conferma.",
      invoice_title:"Pagamento in BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copia invoice",
      invoice_copied:"Copiato!",
      open_wallet:"Apri wallet",
      fiat_title:"Istruzioni pagamento in BRL",
      fiat_pix_key:"Chiave PIX",
      fiat_pix_payload:"Copia e incolla",
      fiat_boleto_code:"Codice boleto",
      fiat_bank_name:"Banca",
      fiat_agency:"Filiale",
      fiat_account:"Conto",
      fiat_holder:"Intestatario",
      fiat_cnpj:"ID fiscale",
      checkout_receive_ln:"Hemp Store riceve BTC via Lightning.",
      order_summary:"Riepilogo ordine",
      card_name_ph:"Come sulla carta",
      card_installments:"Rate",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Premi Invio per cercare nel catalogo.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Cannabinoidi principali",
      cannabinoids_sub:"Scopri cannabinoidi comuni nei prodotti a base di canapa (solo informativo).",
      cann_label_props:"Proprietà comuni:",
      cann_label_studied:"Studiato per:",
      cann_cbd_title:"CBD (Cannabidiolo)",
      cann_cbd_props:"Possibili effetti antinfiammatori*, calmanti* e analgesici*.",
      cann_cbd_studied:"Benessere, relax, sonno e comfort — l’evidenza varia.",
      cann_cbd_more:"Il CBD è generalmente non inebriante e si trova in oli, caramelle/gummies e prodotti per animali. Controlla etichette e conformità locale.",
      cann_thc_title:"THC (Tetraidrocannabinolo)",
      cann_thc_props:"Può essere euforizzante*, analgesico* e antiemetico*.",
      cann_thc_studied:"Dolore, nausea e appetito — solo dove consentito; evidenza variabile.",
      cann_thc_more:"Il THC è regolamentato e può essere inebriante. Usalo solo dove consentito e con responsabilità.",
      cann_cbg_title:"CBG (Cannabigerolo)",
      cann_cbg_props:"Possibile attività antinfiammatoria* e antiossidante* (evidenza iniziale).",
      cann_cbg_studied:"Supporto al benessere e infiammazione — evidenza preliminare.",
      cann_cbg_more:"Il CBG è meno comune e spesso appare in formule mirate (isolati o mix).",
      learn_more:"Scopri di più",
      cann_note:"*Gli effetti variano. Contenuto educativo; non è un consiglio medico."

    },
  
    fr: {
      or:"ou",
      installment_of:"de",
      password_min:"Le mot de passe doit comporter au moins 8 caractères.",
      home:"Accueil", products:"Produits", about:"À propos", contact:"Contact",
      cart:"Panier", checkout:"Paiement", login:"Connexion",
      my_orders:"Mes achats",
      language:"Langue", ok:"OK",
      hero_title:"Lifestyle cannabique",
      hero_sub:"Produits premium à base de chanvre. Design, bien-être et durabilité au même endroit.",
      hero_image_label:"Image du produit",
      see_products:"Voir les produits",
      featured:"Produits en vedette",
      search_ph:"Rechercher…",
      all_categories:"Toutes catégories",
      cat_oils:"Huiles",
      cat_strains:"Strains",
      cat_cigars:"Cigares & pré-roulés",
      cat_gummies:"Gommes",
      cat_extracts:"Extraits",
      cat_drinks:"Boissons",
      cat_accessories:"Accessoires",
      cat_beverages:"Boissons",
      cat_vapes:"Vapes",
      cat_pets:"Animaux",
      cat_edibles:"Comestibles",
  
      back:"← Retour aux Produits",
      product_page:"Page Produit",
      choose:"Choisissez les options",
      choose_volume_strain:"Choisissez le volume et la variété",
      your_config:"Votre configuration",
      desc:"Description",
      add_cart:"Ajouter au panier",
      view_cart:"Voir le panier",
      continue:"Continuer vos achats",
  
      sign_in:"Se connecter",
      sign_out:"Se déconnecter",
      email:"Email",
      password:"Mot de passe",
      create_demo:"(Démo) Utilisez n'importe quel email/mot de passe",
  
      empty_cart:"Votre panier est vide.",
      item:"Article",
      price:"Prix",
      qty:"Quantité",
      remove:"Retirer",
      subtotal:"Sous-total",
      shipping:"Livraison",
      tax:"Taxes",
      total:"Total",
      go_checkout:"Aller au paiement",
  
      checkout_title:"Paiement détaillé",
      step1:"Infos client",
      step2:"Adresse de livraison",
      step3:"Livraison",
      step4:"Paiement",
      step5:"Résumé",
      first:"Prénom", last:"Nom", phone:"Téléphone",
      doc:"ID / N° fiscal",
      address1:"Rue et numéro", address2:"Complément",
      city:"Ville", state:"Région", zip:"Code postal", country:"Pays",
      shipping_method:"Mode de livraison",
      ship_std:"Standard (3–7 jours)",
      ship_exp:"Express (1–3 jours)",
      pay_method:"Moyen de paiement",
      pay_card:"Carte",
      pay_pix:"PIX",
      card_name:"Nom sur la carte",
      card_number:"Numéro de carte",
      card_exp:"Expiration (MM/AA)",
      card_cvv:"CVV",
      pix_note:"Clé PIX générée à la validation (démo).",
      place_order:"Valider la commande",
      order_ok:"Commande validée (démo) ! Merci.",
      checkout_terms:"En validant, vous acceptez les conditions (démo).",
  
      opt_type:"Type",
      opt_profile:"Profil",
      opt_cannabinoid:"Cannabinoïde",
      opt_size:"Taille",
      opt_color:"Couleur",
      opt_flavor:"Saveur",
      opt_puffs:"Bouffées",
      opt_ice:"Glaçons",
      opt_strain:"Strain",
      opt_strength:"Puissance",
      opt_format:"Format",
      opt_spectrum:"Spectre",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Unités",
  
      med_note_title:"Petite note :",
      med_note:"Cannabinoïdes et terpènes peuvent aider le bien-être chez certains — mais chacun est différent. Info seulement, pas un avis médical.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Virement (TED)",
      pay_doc:"Virement (DOC)",
      pay_debit:"Débit",
      pay_credit:"Crédit",
      pay_hint_btc:"Payez comme vous voulez — Hemp Store reçoit du BTC via Lightning.",
      pay_hint_fiat:"Les paiements en BRL (PIX/Boleto/TED/DOC) restent en attente jusqu’à compensation.",
      pay_hint_card:"Paiement par carte (débit/crédit). (démo) En production, traitez via votre acquéreur/gateway et validez avant d’expédier.",
      invoice_title:"Paiement en BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copier l’invoice",
      invoice_copied:"Copié !",
      open_wallet:"Ouvrir le wallet",
      fiat_title:"Instructions de paiement en BRL",
      fiat_pix_key:"Clé PIX",
      fiat_pix_payload:"Copier-coller",
      fiat_boleto_code:"Code boleto",
      fiat_bank_name:"Banque",
      fiat_agency:"Agence",
      fiat_account:"Compte",
      fiat_holder:"Bénéficiaire",
      fiat_cnpj:"ID fiscal",
      checkout_receive_ln:"Hemp Store reçoit du BTC via Lightning.",
      order_summary:"Récapitulatif de commande",
      card_name_ph:"Comme sur la carte",
      card_installments:"Paiement en plusieurs fois",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Appuyez sur Entrée pour rechercher dans le catalogue.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Cannabinoïdes principaux",
      cannabinoids_sub:"Découvrez des cannabinoïdes courants dans les produits à base de chanvre (informatif uniquement).",
      cann_label_props:"Propriétés courantes :",
      cann_label_studied:"Étudié pour :",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Effets potentiellement anti-inflammatoires*, apaisants* et antalgiques*.",
      cann_cbd_studied:"Bien-être, relaxation, sommeil et confort — les preuves varient.",
      cann_cbd_more:"Le CBD est généralement non intoxicant et se trouve dans les huiles, gummies et produits pour animaux. Vérifiez l’étiquette et la conformité locale.",
      cann_thc_title:"THC (Tétrahydrocannabinol)",
      cann_thc_props:"Peut être euphorisant*, antalgique* et antiémétique*.",
      cann_thc_studied:"Douleur, nausées et appétit — seulement là où c’est autorisé; preuves variables.",
      cann_thc_more:"Le THC est réglementé et peut être intoxicant. Utilisez uniquement là où c’est autorisé et avec prudence.",
      cann_cbg_title:"CBG (Cannabigérol)",
      cann_cbg_props:"Activité potentiellement anti-inflammatoire* et antioxydante* (preuves initiales).",
      cann_cbg_studied:"Soutien du bien-être et inflammation — preuves préliminaires.",
      cann_cbg_more:"Le CBG est moins courant et apparaît souvent dans des formules ciblées (isolats ou mélanges).",
      learn_more:"En savoir plus",
      cann_note:"*Les effets varient. Contenu éducatif; pas un avis médical."

    },
  
    de: {
      or:"oder",
      installment_of:"von",
      password_min:"Das Passwort muss mindestens 8 Zeichen lang sein.",
      home:"Start", products:"Produkte", about:"Über uns", contact:"Kontakt",
      cart:"Warenkorb", checkout:"Kasse", login:"Login",
      my_orders:"Meine Bestellungen",
      language:"Sprache", ok:"OK",
      hero_title:"Cannabis-Lifestyle",
      hero_sub:"Premium-Hanfprodukte. Design, Wohlbefinden und Nachhaltigkeit an einem Ort.",
      hero_image_label:"Produktbild",
      see_products:"Produkte ansehen",
      featured:"Highlights",
      search_ph:"Produkte suchen…",
      all_categories:"Alle Kategorien",
      cat_oils:"Öle",
      cat_strains:"Strains",
      cat_cigars:"Zigarren & Pre-Rolls",
      cat_gummies:"Gummis",
      cat_extracts:"Extrakte",
      cat_drinks:"Getränke",
      cat_accessories:"Zubehör",
      cat_beverages:"Getränke",
      cat_vapes:"Vapes",
      cat_pets:"Haustiere",
      cat_edibles:"Esswaren",
  
      back:"← Zurück zu Produkten",
      product_page:"Produktseite",
      choose:"Optionen wählen",
      choose_volume_strain:"Volumen und Variante wählen",
      your_config:"Ihre Konfiguration",
      desc:"Beschreibung",
      add_cart:"In den Warenkorb",
      view_cart:"Warenkorb ansehen",
      continue:"Weiter einkaufen",
  
      sign_in:"Anmelden",
      sign_out:"Abmelden",
      email:"E-Mail",
      password:"Passwort",
      create_demo:"(Demo) Beliebige E-Mail/Passwort verwenden",
  
      empty_cart:"Dein Warenkorb ist leer.",
      item:"Artikel",
      price:"Preis",
      qty:"Menge",
      remove:"Entfernen",
      subtotal:"Zwischensumme",
      shipping:"Versand",
      tax:"Steuern",
      total:"Gesamt",
      go_checkout:"Zur Kasse",
  
      checkout_title:"Detaillierter Checkout",
      step1:"Kundendaten",
      step2:"Lieferadresse",
      step3:"Versand",
      step4:"Zahlung",
      step5:"Zusammenfassung",
      first:"Vorname", last:"Nachname", phone:"Telefon",
      doc:"ID / Steuernummer",
      address1:"Straße und Nr.", address2:"Zusatz",
      city:"Stadt", state:"Bundesland", zip:"PLZ", country:"Land",
      shipping_method:"Versandart",
      ship_std:"Standard (3–7 Tage)",
      ship_exp:"Express (1–3 Tage)",
      pay_method:"Zahlungsmethode",
      pay_card:"Karte",
      pay_pix:"PIX",
      card_name:"Name auf Karte",
      card_number:"Kartennummer",
      card_exp:"Ablauf (MM/JJ)",
      card_cvv:"CVV",
      pix_note:"PIX-Schlüssel wird beim Abschluss erzeugt (Demo).",
      place_order:"Bestellung abschließen",
      order_ok:"Bestellung abgeschlossen (Demo)! Danke.",
      checkout_terms:"Mit Abschluss akzeptierst du die Bedingungen (Demo).",
  
      opt_type:"Typ",
      opt_profile:"Profil",
      opt_cannabinoid:"Cannabinoid",
      opt_size:"Größe",
      opt_color:"Farbe",
      opt_flavor:"Geschmack",
      opt_puffs:"Züge",
      opt_ice:"Eis",
      opt_strain:"Strain",
      opt_strength:"Stärke",
      opt_format:"Format",
      opt_spectrum:"Spektrum",
      opt_mg:"MG",
      opt_dose:"Dosis",
      opt_units:"Einheiten",
  
      med_note_title:"Kurz & locker:",
      med_note:"Cannabinoide und Terpene können bei manchen Menschen Entspannung, Schlaf und Wohlbefinden unterstützen — aber jeder ist anders. Info, kein medizinischer Rat.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Überweisung (TED)",
      pay_doc:"Überweisung (DOC)",
      pay_debit:"Debitkarte",
      pay_credit:"Kreditkarte",
      pay_hint_btc:"Zahle wie du willst — Hemp Store erhält BTC via Lightning.",
      pay_hint_fiat:"BRL-Zahlungen (PIX/Boleto/TED/DOC) bleiben bis zur Bestätigung ausstehend.",
      pay_hint_card:"Kartenzahlung (Debit/Kredit). (Demo) In Produktion über Acquirer/Gateway abwickeln und erst nach Bestätigung freigeben.",
      invoice_title:"BTC-Zahlung (Lightning)",
      invoice_label:"Lightning-Invoice",
      invoice_copy:"Invoice kopieren",
      invoice_copied:"Kopiert!",
      open_wallet:"Wallet öffnen",
      fiat_title:"BRL-Zahlungsinfos",
      fiat_pix_key:"PIX-Schlüssel",
      fiat_pix_payload:"Copy & Paste",
      fiat_boleto_code:"Boleto-Code",
      fiat_bank_name:"Bank",
      fiat_agency:"Filiale",
      fiat_account:"Konto",
      fiat_holder:"Empfänger",
      fiat_cnpj:"Steuer-ID",
      checkout_receive_ln:"Hemp Store erhält BTC via Lightning.",
      order_summary:"Bestellung prüfen",
      card_name_ph:"Wie auf der Karte",
      card_installments:"Raten",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Drücke Enter, um im Katalog zu suchen.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Wichtige Cannabinoide",
      cannabinoids_sub:"Mehr über gängige Cannabinoide in hanfbasierten Produkten (nur informativ).",
      cann_label_props:"Typische Eigenschaften:",
      cann_label_studied:"Untersucht für:",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Mögliche entzündungshemmende*, beruhigende* und schmerzlindernde* Effekte.",
      cann_cbd_studied:"Wohlbefinden, Entspannung, Schlaf und Komfort — Evidenz variiert.",
      cann_cbd_more:"CBD ist meist nicht berauschend und kommt in Ölen, Gummies und Tierprodukten vor. Etikett und lokale Vorgaben prüfen.",
      cann_thc_title:"THC (Tetrahydrocannabinol)",
      cann_thc_props:"Kann euphorisierend*, schmerzlindernd* und antiemetisch* sein.",
      cann_thc_studied:"Schmerz, Übelkeit und Appetit — nur wo erlaubt; Evidenz variiert.",
      cann_thc_more:"THC ist reguliert und kann berauschend wirken. Nur wo erlaubt und verantwortungsvoll nutzen.",
      cann_cbg_title:"CBG (Cannabigerol)",
      cann_cbg_props:"Mögliche entzündungshemmende* und antioxidative* Aktivität (frühe Evidenz).",
      cann_cbg_studied:"Wellness-Unterstützung und Entzündung — Evidenz noch vorläufig.",
      cann_cbg_more:"CBG ist weniger verbreitet und findet sich oft in gezielten Formeln (Isolate oder Blends).",
      learn_more:"Mehr erfahren",
      cann_note:"*Wirkungen variieren. Nur zu Bildungszwecken; keine medizinische Beratung."

    },
  
    es: {
      or:"o",
      installment_of:"de",
      password_min:"La contraseña debe tener al menos 8 caracteres.",
      home:"Inicio", products:"Productos", about:"Sobre", contact:"Contacto",
      cart:"Carrito", checkout:"Checkout", login:"Login",
      my_orders:"Mis compras",
      language:"Idioma", ok:"OK",
      hero_title:"Lifestyle cannábico",
      hero_sub:"Productos premium a base de cáñamo. Diseño, bienestar y sostenibilidad en un solo lugar.",
      hero_image_label:"Imagen del producto",
      see_products:"Ver productos",
      featured:"Productos Destacados",
      search_ph:"Buscar…",
      all_categories:"Todas las categorías",
      cat_oils:"Aceites",
      cat_strains:"Strains",
      cat_cigars:"Charutos & pre-rolls",
      cat_gummies:"Gomitas",
      cat_extracts:"Extractos",
      cat_drinks:"Bebidas",
      cat_accessories:"Accesorios",
      cat_beverages:"Bebidas",
      cat_vapes:"Vapes",
      cat_pets:"Mascotas",
      cat_edibles:"Comestibles",
  
      back:"← Volver a Productos",
      product_page:"Página de Producto",
      choose:"Elige opciones",
      choose_volume_strain:"Elige volumen y variedad",
      your_config:"Tu configuración",
      desc:"Descripción",
      add_cart:"Agregar al carrito",
      view_cart:"Ver carrito",
      continue:"Seguir comprando",
  
      sign_in:"Entrar",
      sign_out:"Salir",
      email:"Email",
      password:"Contraseña",
      create_demo:"(Demo) Usa cualquier email/contraseña",
  
      empty_cart:"Tu carrito está vacío.",
      item:"Artículo",
      price:"Precio",
      qty:"Cantidad",
      remove:"Quitar",
      subtotal:"Subtotal",
      shipping:"Envío",
      tax:"Impuestos",
      total:"Total",
      go_checkout:"Ir al checkout",
  
      checkout_title:"Checkout detallado",
      step1:"Datos del cliente",
      step2:"Dirección de envío",
      step3:"Envío",
      step4:"Pago",
      step5:"Resumen",
      first:"Nombre", last:"Apellido", phone:"Teléfono",
      doc:"ID / NIF",
      address1:"Calle y número", address2:"Complemento",
      city:"Ciudad", state:"Estado", zip:"CP", country:"País",
      shipping_method:"Método de envío",
      ship_std:"Estándar (3–7 días)",
      ship_exp:"Express (1–3 días)",
      pay_method:"Método de pago",
      pay_card:"Tarjeta",
      pay_pix:"PIX",
      card_name:"Nombre en la tarjeta",
      card_number:"Número de tarjeta",
      card_exp:"Vencimiento (MM/AA)",
      card_cvv:"CVV",
      pix_note:"La clave PIX se generará al finalizar (demo).",
      place_order:"Finalizar compra",
      order_ok:"¡Pedido finalizado (demo)! Gracias.",
      checkout_terms:"Al finalizar aceptas los términos (demo).",
  
      opt_type:"Tipo",
      opt_profile:"Perfil",
      opt_cannabinoid:"Cannabinoide",
      opt_size:"Tamaño",
      opt_color:"Color",
      opt_flavor:"Sabor",
      opt_puffs:"Puffs",
      opt_ice:"Hielo",
      opt_variety:"Variedade",
      opt_weight:"Peso",
      opt_ml:"ML",
      opt_strain:"Strain",
      opt_strength:"Potencia",
      opt_format:"Formato",
      opt_spectrum:"Espectro",
      opt_mg:"MG",
      opt_dose:"Dosis",
      opt_units:"Unidades",
  
      med_note_title:"Nota rápida:",
      med_note:"Cannabinoides y terpenos pueden apoyar relajación, sueño y bienestar en algunas personas — pero cada uno es diferente. Info, no consejo médico.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Transferencia (TED)",
      pay_doc:"Transferencia (DOC)",
      pay_debit:"Débito",
      pay_credit:"Crédito",
      pay_hint_btc:"Paga como prefieras — Hemp Store recibe BTC vía Lightning.",
      pay_hint_fiat:"Pagos en BRL (PIX/Boleto/TED/DOC) quedan pendientes hasta confirmación.",
      pay_hint_card:"Pago con tarjeta (débito/crédito). (demo) En producción, procesa con tu adquirente/gateway y libera solo tras confirmación.",
      invoice_title:"Pago en BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copiar invoice",
      invoice_copied:"¡Copiado!",
      open_wallet:"Abrir wallet",
      fiat_title:"Instrucciones de pago en BRL",
      fiat_pix_key:"Clave PIX",
      fiat_pix_payload:"Copiar y pegar",
      fiat_boleto_code:"Código de boleto",
      fiat_bank_name:"Banco",
      fiat_agency:"Sucursal",
      fiat_account:"Cuenta",
      fiat_holder:"Beneficiario",
      fiat_cnpj:"ID fiscal",
      checkout_receive_ln:"Hemp Store recibe BTC vía Lightning.",
      order_summary:"Resumen del pedido",
      card_name_ph:"Como en la tarjeta",
      card_installments:"Cuotas",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Presiona Enter para buscar en el catálogo.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email."
    },

    ja: {
      or:"または",
      installment_of:"/",
      password_min:"パスワードは8文字以上で入力してください。",
      home:"ホーム", products:"商品", about:"概要", contact:"お問い合わせ",
      cart:"カート", checkout:"チェックアウト", login:"ログイン",
      my_orders:"購入履歴",
      language:"言語", ok:"OK",
      hero_title:"カンナビス・ライフスタイル",
      hero_sub:"高品質ヘンプ製品。デザイン、ウェルネス、サステナビリティをひとつに。",
      hero_image_label:"商品画像",
      see_products:"商品を見る",
      featured:"おすすめ商品",
      search_ph:"商品を検索…",
      all_categories:"すべてのカテゴリー",
      cat_oils:"オイル",
      cat_strains:"ストレイン",
      cat_cigars:"シガー／プレロール",
      cat_gummies:"グミ",
      cat_extracts:"エキス",
      cat_drinks:"ドリンク",
      cat_accessories:"アクセサリー",
      cat_beverages:"ドリンク",
      cat_vapes:"ベイプ",
      cat_pets:"ペット",
      cat_edibles:"エディブル",

      back:"← 商品一覧へ戻る",
      product_page:"商品ページ",
      choose:"オプションを選択",
      choose_volume_strain:"容量とバリエーションを選択",
      your_config:"選択内容",
      desc:"説明",
      add_cart:"カートに追加",
      view_cart:"カートを見る",
      continue:"買い物を続ける",

      sign_in:"ログイン",
      sign_out:"ログアウト",
      email:"メール",
      password:"パスワード",
      create_demo:"（デモ）任意のメール／パスワードでOK",

      empty_cart:"カートは空です。",
      item:"商品",
      price:"価格",
      qty:"数量",
      remove:"削除",
      subtotal:"小計",
      shipping:"送料",
      tax:"税",
      total:"合計",
      go_checkout:"チェックアウトへ",

      checkout_title:"詳細チェックアウト",
      step1:"お客様情報",
      step2:"配送先住所",
      step3:"配送",
      step4:"お支払い",
      step5:"内容確認",
      first:"名", last:"姓", phone:"電話",
      doc:"ID / 税番号",
      address1:"住所（番地まで）", address2:"建物名・部屋番号",
      city:"市区町村", state:"都道府県", zip:"郵便番号", country:"国",
      shipping_method:"配送方法",
      ship_std:"通常（3〜7日）",
      ship_exp:"速達（1〜3日）",
      pay_method:"支払い方法",
      pay_card:"カード",
      pay_pix:"PIX",
      card_name:"名義",
      card_number:"カード番号",
      card_exp:"有効期限 (MM/YY)",
      card_cvv:"CVV",
      pix_note:"注文確定時に PIX キーを生成します（デモ）。",
      place_order:"注文を確定",
      order_ok:"注文完了（デモ）！ありがとうございます。",
      checkout_terms:"注文確定により利用規約に同意したものとみなします（デモ）。",

      opt_type:"タイプ",
      opt_profile:"プロフィール",
      opt_cannabinoid:"カンナビノイド",
      opt_size:"サイズ",
      opt_flavor:"フレーバー",
      opt_puffs:"吸引回数",
      opt_ice:"氷",
      opt_variety:"バリエーション",
      opt_weight:"重量",
      opt_ml:"ML",
      opt_strain:"ストレイン",
      opt_strength:"強さ",
      opt_format:"形式",
      opt_spectrum:"スペクトラム",
      opt_mg:"mg",
      opt_dose:"用量",
      opt_units:"個数",
      opt_spectrum:"スペクトラム",
      opt_mg:"MG",
      opt_dose:"用量",
      opt_units:"個数",

      med_note_title:"メモ：",
      med_note:"カンナビノイドやテルペンはリラックスや睡眠、食欲、ウェルネスをサポートする場合がありますが、感じ方には個人差があります。医療アドバイスではありません。服薬中、妊娠中、疾患がある場合は専門家に相談してください。",


      pay_btc:"ビットコイン（Lightning）",
      pay_boleto:"ボレート",
      pay_ted:"銀行振込（TED）",
      pay_doc:"銀行振込（DOC）",
      pay_debit:"デビット",
      pay_credit:"クレジット",
      pay_hint_btc:"支払い方法は自由 — Hemp Store は Lightning で BTC を受け取ります。",
      pay_hint_fiat:"BRL（PIX/ボレート/TED/DOC）は入金確定まで保留になります。",
      pay_hint_card:"カード決済（デビット/クレジット）。（デモ）本番では決済代行/ゲートウェイで処理し、確認後に確定してください。",
      invoice_title:"BTC 支払い（Lightning）",
      invoice_label:"Lightning インボイス",
      invoice_copy:"コピー",
      invoice_copied:"コピーしました！",
      open_wallet:"ウォレットで開く",
      fiat_title:"BRL 支払い手順",
      fiat_pix_key:"PIX キー",
      fiat_pix_payload:"コピー＆ペースト",
      fiat_boleto_code:"ボレートコード",
      fiat_bank_name:"銀行",
      fiat_agency:"支店",
      fiat_account:"口座",
      fiat_holder:"名義",
      fiat_cnpj:"税ID",
      checkout_receive_ln:"Hemp Store は Lightning で BTC を受け取ります。",
      order_summary:"注文内容の確認",
      card_name_ph:"カード記載通り",
      card_installments:"分割",
      company:"会社",
      footer_nav:"ナビゲーション",
      footer_legal:"リーガル",
      footer_search:"",
      footer_search_hint:"Enterでカタログ検索",
      footer_newsletter:"ニュースレター",
      footer_newsletter_sub:"最新情報・新作をお届け（デモ）。",
      subscribe:"登録",
      email_placeholder:"you@example.com",
      terms:"利用規約",
      privacy:"プライバシー",
      cookies:"クッキー",
      lgpd:"LGPD",
      footer_desc_store:"高品質ヘンプ製品。ウェルネス、デザイン、サステナビリティ。",
      footer_desc_hoc:"規制市場向けのR&D、品質、サプライチェーン。",
      newsletter_success:"登録しました（デモ）",
      newsletter_invalid:"有効なメールを入力してください。",
      cannabinoids_title:"Cannabinoides principales",
      cannabinoids_sub:"Conoce canabinoides comunes en productos a base de cáñamo (solo informativo).",
      cann_label_props:"Propiedades comunes:",
      cann_label_studied:"Estudiado para:",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Posibles efectos antiinflamatorios*, calmantes* y analgésicos*.",
      cann_cbd_studied:"Bienestar, relajación, sueño y confort — la evidencia varía.",
      cann_cbd_more:"El CBD suele no ser intoxicante y aparece en aceites, gomitas y productos para mascotas. Revisa etiquetas y normativa local.",
      cann_thc_title:"THC (Tetrahidrocannabinol)",
      cann_thc_props:"Puede ser euforizante*, analgésico* y antiemético*.",
      cann_thc_studied:"Dolor, náuseas y apetito — solo donde esté permitido; la evidencia varía.",
      cann_thc_more:"El THC está regulado y puede ser intoxicante. Úsalo solo donde sea legal y con responsabilidad.",
      cann_cbg_title:"CBG (Cannabigerol)",
      cann_cbg_props:"Posible actividad antiinflamatoria* y antioxidante* (evidencia inicial).",
      cann_cbg_studied:"Soporte de bienestar e inflamación — evidencia preliminar.",
      cann_cbg_more:"El CBG es menos común y suele aparecer en fórmulas específicas (aislado o mezcla).",
      learn_more:"Saber más",
      cann_note:"*Los efectos varían. Contenido educativo; no es consejo médico."

    },
  
    zh: {
      or:"或",
      installment_of:"共",
      password_min:"密码至少需要 8 个字符。",
      home:"首页", products:"产品", about:"关于", contact:"联系",
      cart:"购物车", checkout:"结账", login:"登录",
      my_orders:"我的订单",
      language:"语言", ok:"好",
      hero_title:"大麻生活方式",
      hero_sub:"优质工业大麻产品：设计、健康与可持续，一站式体验。",
      hero_image_label:"产品图片",
      see_products:"查看产品",
      featured:"精选推荐",
      search_ph:"搜索…",
      all_categories:"全部分类",
      cat_oils:"精油",
      cat_strains:"品系",
      cat_cigars:"雪茄/预卷",
      cat_gummies:"软糖",
      cat_extracts:"提取物",
      cat_drinks:"饮料",
      cat_accessories:"配件",
      cat_beverages:"饮料",
      cat_vapes:"电子烟",
      cat_pets:"宠物",
      cat_edibles:"食用",
  
      back:"← 返回产品",
      product_page:"产品页",
      choose:"选择选项",
      choose_volume_strain:"选择容量和款式",
      your_config:"你的配置",
      desc:"描述",
      add_cart:"加入购物车",
      view_cart:"查看购物车",
      continue:"继续购物",
  
      sign_in:"登录",
      sign_out:"退出",
      email:"邮箱",
      password:"密码",
      create_demo:"(演示) 任意邮箱/密码都可以",
  
      empty_cart:"购物车为空。",
      item:"商品",
      price:"价格",
      qty:"数量",
      remove:"删除",
      subtotal:"小计",
      shipping:"运费",
      tax:"税费",
      total:"合计",
      go_checkout:"去结账",
  
      checkout_title:"详细结账",
      step1:"客户信息",
      step2:"收货地址",
      step3:"配送",
      step4:"支付",
      step5:"订单汇总",
      first:"名", last:"姓", phone:"电话",
      doc:"证件/税号",
      address1:"街道门牌", address2:"补充信息",
      city:"城市", state:"省/州", zip:"邮编", country:"国家",
      shipping_method:"配送方式",
      ship_std:"标准（3–7天）",
      ship_exp:"加急（1–3天）",
      pay_method:"支付方式",
      pay_card:"银行卡",
      pay_pix:"PIX",
      card_name:"持卡人",
      card_number:"卡号",
      card_exp:"有效期 (MM/YY)",
      card_cvv:"CVV",
      pix_note:"下单时生成 PIX（演示）。",
      place_order:"提交订单",
      order_ok:"下单成功（演示）！谢谢。",
      checkout_terms:"提交即同意条款（演示）。",
  
      opt_type:"类型",
      opt_profile:"谱系",
      opt_cannabinoid:"成分",
      opt_size:"规格",
      opt_flavor:"口味",
      opt_puffs:"抽吸次数",
      opt_ice:"加冰",
      opt_strain:"品系",
      opt_strength:"强度",
      opt_format:"形式",
  
      med_note_title:"小提示：",
      med_note:"大麻素与萜烯可能帮助放松、睡眠与身心舒适——但因人而异。本内容仅供参考，不构成医疗建议。",
      pay_btc:"比特币（Lightning）",
      pay_boleto:"Boleto",
      pay_ted:"银行转账（TED）",
      pay_doc:"银行转账（DOC）",
      pay_debit:"借记卡",
      pay_credit:"信用卡",
      pay_hint_btc:"随你选择支付方式——Hemp Store 通过 Lightning 接收 BTC。",
      pay_hint_fiat:"BRL（PIX/Boleto/TED/DOC）在入账前会保持待处理。",
      pay_hint_card:"银行卡支付（借记/信用）。（演示）生产环境请通过收单机构/网关处理，并在确认后再放行订单。",
      invoice_title:"BTC 支付（Lightning）",
      invoice_label:"Lightning 发票",
      invoice_copy:"复制发票",
      invoice_copied:"已复制！",
      open_wallet:"打开钱包",
      fiat_title:"BRL 支付说明",
      fiat_pix_key:"PIX 密钥",
      fiat_pix_payload:"复制粘贴",
      fiat_boleto_code:"Boleto 代码",
      fiat_bank_name:"银行",
      fiat_agency:"分行",
      fiat_account:"账户",
      fiat_holder:"收款人",
      fiat_cnpj:"税号",
      checkout_receive_ln:"Hemp Store 通过 Lightning 接收 BTC。",
      order_summary:"订单摘要",
      card_name_ph:"与卡一致",
      card_installments:"分期",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"按 Enter 搜索目录",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"主要大麻素",
      cannabinoids_sub:"了解常见的大麻素及其在大麻（工业大麻）产品中的应用（仅供科普）。",
      cann_label_props:"常见特性：",
      cann_label_studied:"研究方向：",
      cann_cbd_title:"CBD（大麻二酚）",
      cann_cbd_props:"可能具有抗炎*、舒缓*与镇痛*等作用。",
      cann_cbd_studied:"放松、睡眠与舒适感——证据因产品与情境而异。",
      cann_cbd_more:"CBD 通常不致醉，常见于油剂、软糖与宠物产品。请查看标签并遵守当地法规。",
      cann_thc_title:"THC（四氢大麻酚）",
      cann_thc_props:"可能致愉悦*、镇痛*与止吐*。",
      cann_thc_studied:"疼痛、恶心与食欲——仅限合法地区；证据不一。",
      cann_thc_more:"THC 受监管且可能致醉。请仅在合法地区并负责任使用。",
      cann_cbg_title:"CBG（大麻萜酚/大麻根酚）",
      cann_cbg_props:"可能具有抗炎*与抗氧化*活性（早期证据）。",
      cann_cbg_studied:"健康支持与炎症——证据仍较初步。",
      cann_cbg_more:"CBG 相对少见，常出现在特定配方（单体或复配）中。",
      learn_more:"了解更多",
      cann_note:"*效果因人而异。科普内容，不构成医疗建议。"

    }
  };
  
  
  /* ---------- i18n extra (products, options, institutional pages) ---------- */
  const I18N_EXTRA={"pt":{"Charuto San Juan":"Charuto San Juan","Charuto • unitário • (demo)":"Charuto • unitário • (demo)","pdesc_oil-cbd":"O que é — óleo de CBD (canabidiol) em frasco de 30ml, com diferentes concentrações (mg/mL).\nComo funciona — o CBD interage com o sistema endocanabinoide e é usado por algumas pessoas para bem‑estar e rotina diária (não é promessa de efeito terapêutico).\nComo usar — comece baixo e ajuste devagar. Uso sublingual é comum: pingue sob a língua, aguarde ~60s e engula. Leia o rótulo para dose por gota.\nAtenção: pode dar sonolência, boca seca ou desconforto gastrointestinal. Evite dirigir se sentir sedação. Se usa medicamentos (ex.: anticoagulantes, anticonvulsivantes) ou está grávida/amamentando, converse com profissional de saúde.","pdesc_oil-cbg":"O que é — óleo de CBG (canabigerol) em 30ml, com variações de concentração (mg/mL).\nComo funciona — o CBG é um canabinoide “precursor” na planta e vem ganhando interesse em rotinas de bem‑estar (sem promessas médicas).\nComo usar — comece com dose baixa e aumente lentamente conforme tolerância. Sublingual é comum. Siga dose do rótulo.\nAtenção: pode causar sonolência ou desconforto leve. Se usa outros medicamentos, gestantes/lactantes ou menores, procure orientação profissional.","pdesc_oil-thc":"O que é — óleo com THC (tetrahidrocanabinol) em 30ml, com diferentes potências (mg/mL).\nComo funciona — o THC é psicoativo e pode alterar percepção, coordenação e humor.\nComo usar — “start low, go slow” — comece com a menor dose possível e espere o tempo de ação antes de repetir (efeitos podem durar horas).\nAtenção: NÃO dirija/operar máquinas. Pode causar ansiedade, taquicardia, sonolência e prejuízo cognitivo. Mantenha fora do alcance de crianças/pets. Uso apenas onde permitido por lei e por maiores de idade. Evite se grávida/amamentando.","pdesc_oil-full-spectrum":"O que é — óleo Full Spectrum (espectro completo) em 30ml, com diferentes potências (mg/mL).\nComo funciona — reúne múltiplos compostos do cânhamo (ex.: canabinoides e terpenos). Pode conter THC mesmo em baixa quantidade.\nComo usar — dose baixa inicialmente e ajuste devagar. Sublingual é comum. Siga o rótulo e a concentração escolhida.\nAtenção: por poder conter THC, pode causar efeitos psicoativos e impactar testes toxicológicos. Não dirija se houver sedação/alteração. Verifique conformidade legal e idade mínima.","pdesc_strain-gorilla-glue":"O que é — flor/variedade (strain) “Gorilla Glue”, vendida em pesos selecionáveis (ex.: 5g/10g).\nComo usar — destinado a consumo conforme legislação local. Armazene em recipiente fechado, em local fresco e longe de luz.\nAtenção: pode causar efeitos psicoativos (dependendo do teor de THC) e prejudicar direção/coordenação. Evite misturar com álcool. Não indicado para menores, gestantes ou lactantes.","pdesc_strain-purple-haze":"O que é — flor/variedade (strain) “Purple Haze”, com pesos selecionáveis.\nComo usar — consumo conforme legislação local. Guarde fechado para preservar aroma e umidade.\nAtenção: pode causar efeitos psicoativos e sonolência. Não dirija após uso. Mantenha fora do alcance de crianças e pets.","pdesc_strain-og-kush":"O que é — flor/variedade (strain) “OG Kush”, com pesos selecionáveis.\nComo usar — consumo conforme legislação local. Armazenar em pote hermético e local fresco.\nAtenção: pode causar efeitos psicoativos, ansiedade ou sonolência. Comece com pouco, especialmente se iniciante.","pdesc_cigar-san-juan":"O que é — charuto “San Juan” (unitário), com escolha de strain e tamanho/peso (10g/15g/20g).\nComo usar — consumo apenas onde permitido. Prefira ambiente ventilado e vá com calma.\nAtenção: fumar pode irritar vias respiratórias. Evite se tem problemas pulmonares/cardiovasculares. Não dirija após uso. Mantenha longe de crianças/pets.","pdesc_juanitos":"O que é — pre‑roll (cigarro pré‑enrolado) de 1g, com strain selecionável.\nComo usar — pronto para uso onde permitido. Puxe devagar e espere alguns minutos para avaliar efeito.\nAtenção: pode causar tosse, sonolência e prejuízo de coordenação. Não dirigir/operar máquinas. Evite misturar com álcool.","pdesc_extract-dry":"O que é — extração “Dry” (kief/dry sift) — concentrado obtido por separação a seco.\nComo usar — por ser mais concentrado, use pequenas quantidades. Pode ser usado conforme práticas locais (ex.: vaporização/infusão) onde permitido.\nAtenção: concentração maior = risco maior de excesso. Comece com pouco. Não dirija após uso. Mantenha longe de crianças/pets.","pdesc_extract-bubble-hash":"O que é — Bubble Hash (ice/water hash) — concentrado feito com água e gelo, filtrando tricomas.\nComo usar — utilize pequenas quantidades. Pode ser consumido conforme legislação local (ex.: vaporização) onde permitido.\nAtenção: é mais potente que flor. Evite exceder dose. Não dirija após uso. Armazene refrigerado/ao abrigo de calor para manter textura.","pdesc_extract-rosin":"O que é — Rosin — concentrado extraído por pressão e calor, sem solventes.\nComo usar — pequenas quantidades; consumo onde permitido (ex.: dabs/vaporização) com equipamento adequado.\nAtenção: alta potência. Pode causar irritação ao inalar e efeitos intensos. Comece com dose mínima e não dirija.","pdesc_extract-live-rosin":"O que é — Live Rosin — rosin feito a partir de material “fresco/congelado”, preservando perfil aromático.\nComo usar — consumo em pequenas quantidades com equipamento apropriado, onde permitido.\nAtenção: potente. Evite uso excessivo. Não dirija/operar máquinas. Armazenar refrigerado ajuda a manter qualidade.","pdesc_extract-diamonds":"Diamonds são cristais de canabinoides, normalmente de alta pureza — por isso entregam um efeito bem mais intenso do que flor.\nComo usar — use micro‑doses e aumente só se necessário. Idealmente com equipamento adequado e sempre dentro do que é permitido na sua região.\nAtenção: potência muito alta. Risco maior de ansiedade, taquicardia e sedação. Não dirija/operar máquinas. Mantenha fora do alcance de crianças e pets.","pdesc_edible-gummies":"Gummies são gomas mastigáveis — uma forma prática e discreta de consumo, com sabores e tamanhos (50g/100g).\nComo usar — comestíveis podem demorar de 30 a 120 minutos para fazer efeito. Comece com uma porção pequena e espere antes de repetir.\nAtenção: o risco de exagerar é maior justamente porque demora a “bater”. Evite álcool. Mantenha fora do alcance de crianças (parecem doces).","pdesc_edible-honey":"O que é — mel infundido (com THC onde permitido), frasco de 100ml.\nComo usar — misture em bebidas/receitas. Comece com pequena quantidade e aguarde o efeito (pode demorar).\nAtenção: THC é psicoativo. Não dirija após consumo. Atenção redobrada com crianças/pets. Evite se grávida/amamentando.","pdesc_edible-butter":"O que é — manteiga trufada infundida (com THC onde permitido), 100g.\nComo usar — ideal para cozinhar/receitas. Meça porções pequenas para controlar dose.\nAtenção: comestíveis podem bater forte e durar horas. Não consuma novamente antes de 2h. Não dirija após uso.","pdesc_edible-chocolate":"O que é — chocolate (ao leite/amargo/branco) em porções de 50g/100g.\nComo usar — comece com um pedaço pequeno e espere o efeito se houver canabinoides na formulação.\nAtenção: comestíveis têm início mais lento e podem durar mais. Mantenha fora do alcance de crianças.","pdesc_edible-gum":"O que é — chicletes com opção CBD ou THC (onde permitido), em sabores.\nComo usar — mastigue lentamente. Para THC, comece com 1 unidade e espere para avaliar.\nAtenção: THC pode causar efeitos psicoativos. Não dirija. Evite em menores e gestantes/lactantes.","pdesc_edible-lollipops":"Pirulitos com THC (onde permitido), com sabores selecionáveis.\nComo usar — consuma devagar e espere o efeito antes de repetir (como todo comestível, pode demorar).\nAtenção: parecem doces — risco alto para crianças. THC é psicoativo. Não dirija após consumo.","pdesc_bev-soda":"O que é — refrigerante infundido THC ou CBD (onde permitido), sabores variados.\nComo usar — beba devagar. Se for THC, espere 30–120 min para avaliar efeito.\nAtenção: não misture com álcool. Para THC, não dirija após uso. Mantenha fora do alcance de crianças.","pdesc_bev-tea":"O que é — chá infundido com THC (onde permitido), sabores como camomila/hibisco/chá verde.\nComo usar — beba devagar e aguarde o efeito. Ideal começar com meia porção.\nAtenção: THC é psicoativo. Não dirija após consumo. Evite se grávida/amamentando.","pdesc_bev-lemonade":"O que é — limonada infundida com THC (onde permitido), sabores.\nComo usar — beba devagar e aguarde o efeito antes de repetir.\nAtenção: THC é psicoativo. Não dirija. Evite misturar com álcool. Mantenha fora do alcance de crianças.","pdesc_vape-thc":"Vape com THC (onde permitido), com opção de quantidade de puxadas e sabores.\nComo usar — dê 1–2 puxadas e aguarde alguns minutos antes de repetir. Ajuste aos poucos.\nAtenção: vaporização pode irritar garganta/pulmões. THC é psicoativo — não dirija/operar máquinas. Não recomendado para menores, gestantes/lactantes e pessoas com problemas respiratórios.","pdesc_pet-pet-oil":"O que é — óleo de CBD para pets (derivado de cânhamo), em volumes como 30ml/60ml.\nComo usar — siga orientação veterinária e a dose do rótulo (geralmente por peso do animal). Administre com conta‑gotas ou misture na comida.\nAtenção: use apenas produtos específicos para pets e SEM THC. Observe sonolência/diarreia e suspenda se houver reação. Mantenha fora do alcance de crianças.","pdesc_pet-pet-calming":"O que é — petiscos mastigáveis com CBD (calming chews) para pets.\nComo usar — ofereça conforme peso do animal e orientação veterinária, como parte da rotina.\nAtenção: apenas para pets; não substitui tratamento. Evite THC. Se o animal tiver doença ou usar medicamentos, consulte veterinário.","pdesc_pet-pet-joints":"O que é — suplemento/petisco com CBD focado em suporte articular (uso pet).\nComo usar — dose conforme peso e orientação veterinária; pode ser diário.\nAtenção: confira ingredientes (alergênicos). Não usar em filhotes sem orientação. Suspenda se houver reação.","pdesc_pet-pet-balm":"O que é — bálsamo tópico com CBD para pets (uso externo).\nComo usar — aplique pequena quantidade na área externa indicada e faça teste em uma área pequena antes.\nAtenção: evite olhos/mucosas e não deixe o pet lamber em excesso. Se irritar, lave e suspenda. Consulte veterinário se persistir.","pdesc_acc-hemp-pen":"O que é — canetas temáticas (Hemp) para uso diário/coleção.\nComo usar — escrita comum; escolha a cor/modelo.\nAtenção: mantenha tampada para evitar ressecamento e longe de crianças pequenas.","pdesc_acc-tshirt":"O que é — camisetas (tamanhos P–GG) com estilo minimalista.\nComo usar — confira tabela de tamanhos; lave do avesso para preservar estampa.\nAtenção: siga instruções de lavagem para evitar encolhimento.","pdesc_acc-cap":"O que é — bonés estilo trucker, tamanho único.\nComo usar — ajuste traseiro para conforto.\nAtenção: limpeza com pano úmido é recomendada para preservar estrutura.","pdesc_acc-grinder":"O que é — dichavador (grinder) para triturar material de forma uniforme.\nComo usar — coloque pequena quantidade, gire e remova o material triturado.\nAtenção: mantenha limpo para evitar acúmulo e mau funcionamento. Longe de crianças.","pdesc_acc-tips":"O que é — piteiras (slim/regular) para conforto e melhor fluxo de ar.\nComo usar — encaixe na ponta do papel ou do pre‑roll.\nAtenção: descarte após uso se forem descartáveis.","pdesc_acc-papers":"O que é — sedas/papéis para enrolar (King Size, 1 1/4, Slim).\nComo usar — escolha o tamanho, coloque o conteúdo, enrole e sele.\nAtenção: manter em local seco para não rasgar/umidificar.","pdesc_acc-roller":"O que é — bolador (rolling machine) para facilitar enrolar com consistência.\nComo usar — siga o trilho do bolador, adicione a seda e gire.\nAtenção: pratique com pequenas quantidades até pegar o jeito.","pdesc_acc-bong":"O que é — bong (pequeno/médio/grande) para uso com água.\nComo usar — encha com água até o nível adequado e mantenha higienização frequente.\nAtenção: vidro pode quebrar; manuseie com cuidado. Use apenas onde permitido e nunca dirija após consumo.","age18":"+18","footer_company":"","footer_group":"Grupo JP. DIETERICH","privacy_title":"Política de Privacidade","legal_model_note":"Documento informativo (modelo). Ajuste com seu advogado para uso real.","privacy_li1":"Podemos coletar dados básicos para operação do carrinho, login (demo) e preferências de idioma.","privacy_li2":"Os dados podem ser armazenados localmente no seu navegador (localStorage) para melhorar a experiência.","privacy_li3":"Você pode solicitar remoção/ajustes conforme legislação aplicável (LGPD).","privacy_li4":"Não vendemos seus dados. Utilizamos apenas para operação e melhoria do serviço.","terms_title":"Termos de Uso","terms_li1":"Ao acessar este site, você concorda com estes termos e com a legislação aplicável.","terms_li2":"As informações aqui contidas têm caráter informativo e podem mudar sem aviso.","terms_li3":"É proibido uso indevido da marca, cópia integral do conteúdo e práticas de scraping abusivas.","terms_li4":"Compras e pagamentos seguem as condições exibidas no checkout.","terms_li5":"Em caso de dúvidas, utilize a página de contato.","cookies_title":"Política de Cookies","cookies_li1":"Este site pode usar armazenamento local/cookies para manter idioma e carrinho.","cookies_li2":"Você pode limpar dados do navegador a qualquer momento para remover preferências.","cookies_li3":"Ferramentas de analytics/marketing só devem ser habilitadas com consentimento (se aplicável).","lgpd_title":"LGPD (Direitos do Titular)","lgpd_li1":"Você pode solicitar: acesso, correção, portabilidade, revogação de consentimento e exclusão.","lgpd_li2":"Canal: privacidade@hempstore.com.br (substitua pelo seu e-mail real).","lgpd_li3":"Base legal e retenção dependem do tipo de dado e obrigações regulatórias/fiscais.","institutional":"Institucional","back_simple":"Voltar","notice":"Aviso","notice_sub":"Conteúdo institucional. Operações e portfólio estão sujeitos à legislação e normas vigentes.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"A Hemp Oil Company é uma empresa focada em qualidade, sustentabilidade e bem-estar, entregando produtos à base de cannabis com padrão premium e cuidado em cada etapa.","hoc_btn_solutions":"Ver soluções","hoc_btn_store":"Ir para a loja (Hemp Store)","hoc_areas_title":"Áreas principais","hoc_badge_rd":"P&D","hoc_card_rd_title":"Pesquisa e desenvolvimento","hoc_card_rd_sub":"Especificações, estabilidade, formulação e inovação com linguagem simples e documentação completa.","hoc_badge_quality":"Qualidade","hoc_card_quality_title":"Qualidade e rastreabilidade","hoc_card_quality_sub":"Controle por lote, rastreabilidade e padrões internos para consistência e confiança.","hoc_badge_compliance":"Compliance","hoc_card_compliance_title":"Governança e conformidade","hoc_card_compliance_sub":"Governança, rotulagem e processos alinhados às normas aplicáveis (conforme escopo e jurisdição).","hoc_contact_title":"Contato B2B","hoc_contact_sub":"Fale com a equipe comercial/técnica para parcerias, distribuição, desenvolvimento de portfólio e projetos sob demanda.","label_email":"Email:","label_partnerships":"Parcerias:","hoc_quick_msg":"Mensagem rápida","label_name":"Nome","label_message":"Mensagem","send":"Enviar","hoc_form_demo":"Formulário demonstrativo. Solicite a integração para envio real.","sol_title":"Soluções (B2B)","sol_sub":"Módulos para qualidade, documentação e cadeia de suprimentos, mantendo o mesmo estilo visual da Hemp Store.","sol_btn_compliance":"P&D + Compliance","sol_deliver_title":"O que entregamos","sol_badge_docs":"Docs","sol_docs_title":"Especificações e documentação","sol_docs_sub":"Fichas técnicas, requisitos de rotulagem, padrões internos e consistência.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain e parceiros","sol_scm_sub":"Curadoria de fornecedores, padronização e rastreabilidade.","sol_badge_brand":"Brand","sol_brand_title":"Estratégia de portfólio","sol_brand_sub":"Arquitetura de linhas e guias de distribuição.","sol_integration_title":"Integração com a Hemp Store","sol_integration_sub":"A operação B2C acontece na  (e-commerce). A Hemp Oil Company é uma empresa focada em qualidade, sustentabilidade e bem-estar, entregando produtos à base de cannabis com padrão premium e cuidado em cada etapa.","sol_btn_store_products":"Ver produtos na loja","comp_title":"P&D + Compliance","comp_sub":"Hub institucional para padrões internos, qualidade e rastreabilidade, com linguagem clara e objetiva.","comp_btn_talk":"Falar com a equipe","comp_pillars":"Pilares","comp_badge_sop":"SOP","comp_sop_title":"Procedimentos e padrões","comp_sop_sub":"Documentação orientada a consistência e melhoria contínua.","comp_badge_qa":"QA","comp_qa_title":"Controle de qualidade","comp_qa_sub":"Diretrizes para controle por lote e registros.","comp_badge_legal":"Legal","comp_legal_title":"Conformidade","comp_legal_sub":"Adequação às normas aplicáveis conforme escopo/regulação.","product_about_title":"Ficha do produto","product_disclaimer":"Aviso: conteúdo informativo e demonstrativo. A disponibilidade, composição e rotulagem devem seguir a legislação local, restrições de idade e laudos do lote.","hoc_about_title":"Quem somos","hoc_about_p1":"A Hemp Oil Company S.A. nasceu para elevar o padrão: qualidade real, transparência e uma cadeia de suprimentos responsável — de parceiros a clientes.","hoc_about_p2":"Unimos bem-estar, sustentabilidade e respeito às pessoas. Sem promessas milagrosas — apenas processos, testes e consistência em que você pode confiar.","hoc_about_points":"• Qualidade e rastreabilidade por lote\n• Padrões internos (SOPs) e documentação\n• Seleção de parceiros e matérias‑primas\n• Design de portfólio com foco em conformidade","hoc_commitment_title":"Nosso compromisso","hoc_commitment_p":"Claros no que fazemos, rigorosos no que testamos e humanos na forma como atendemos — sempre dentro do que a lei permite."},"en":{"Charuto San Juan":"San Juan Cigar","Charuto • unitário • (demo)":"Cigar • single unit • (demo)","pdesc_oil-cbd":"What it is — CBD (cannabidiol) oil in a 30ml dropper, with selectable strength (mg/mL).\nHow it works — CBD interacts with the endocannabinoid system; this is not a medical claim.\nHow to use — start low and increase slowly. Sublingual use is common: place under the tongue ~60s, then swallow.\nWarning: may cause drowsiness, dry mouth, or mild stomach discomfort. If you take medicines (e.g., blood thinners) or are pregnant/breastfeeding, talk to a healthcare professional.","pdesc_oil-cbg":"What it is — CBG (cannabigerol) oil in a 30ml bottle, with selectable strength (mg/mL).\nHow it works — CBG is a cannabinoid that some people include in wellness routines (no medical promises).\nHow to use — start with a low dose and adjust slowly. Sublingual use is common.\nWarning: may cause drowsiness or mild discomfort. If you use other medicines, or are pregnant/breastfeeding, seek professional guidance.","pdesc_oil-thc":"What it is — THC oil in a 30ml bottle, with selectable strength (mg/mL).\nHow it works — THC is psychoactive and can affect perception, coordination, and mood.\nHow to use — start very low and go slow. Wait long enough before repeating; effects can last for hours.\nWarning: DO NOT drive or operate machines. Higher risk of anxiety, fast heartbeat, drowsiness, and impaired judgement. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_oil-full-spectrum":"What it is — Full‑spectrum hemp extract oil (30ml) with multiple plant compounds; it may contain THC.\nHow it works — a broader cannabinoid/terpene profile can change aroma and experience (no medical promises).\nHow to use — start low and increase slowly. Sublingual use is common.\nWarning: may be psychoactive and can affect drug tests. Do not drive if you feel altered. Adults 18+ only. Follow local law.","pdesc_strain-gorilla-glue":"What it is — cannabis flower/strain “Gorilla Glue”, with selectable weight (5g/10g).\nHow to use — store sealed, cool, and away from light to preserve aroma and humidity.\nWarning: may be psychoactive and impair coordination. Avoid mixing with alcohol. Adults 18+ only. Follow local law.","pdesc_strain-purple-haze":"What it is — cannabis flower/strain “Purple Haze”, with selectable weight (5g/10g).\nHow to use — keep sealed to preserve freshness.\nWarning: may cause psychoactive effects and sleepiness. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_strain-og-kush":"What it is — cannabis flower/strain “OG Kush”, with selectable weight (5g/10g).\nHow to use — store in an airtight jar, cool and dry.\nWarning: can be intense for beginners. Start small, don’t drive, and avoid alcohol. Adults 18+ only. Follow local law.","pdesc_cigar-san-juan":"What it is — “San Juan” cigar (single unit), choose strain and size/weight (10g/15g/20g).\nHow to use — use in a ventilated area and with moderation.\nWarning: smoking can irritate the airways. Avoid if you have lung/heart conditions. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_juanitos":"What it is — 1g pre‑roll with selectable strain.\nHow to use — take small puffs and wait a few minutes to gauge intensity.\nWarning: may cause cough, drowsiness, and impaired coordination. Do not drive. Avoid alcohol. Adults 18+ only. Follow local law.","pdesc_extract-dry":"What it is — “Dry” (dry sift/kief) concentrate obtained by dry separation.\nHow to use — it’s more concentrated than flower: use tiny amounts and increase slowly.\nWarning: higher potency increases the risk of overdoing it. Do not drive after use. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_extract-bubble-hash":"What it is — Bubble Hash (ice/water hash), concentrate made with ice-water filtration.\nHow to use — use small amounts; keep cool to preserve texture.\nWarning: more potent than flower. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-rosin":"What it is — Rosin, a solventless concentrate extracted with heat and pressure.\nHow to use — micro‑doses only; use proper equipment where legal.\nWarning: high potency; intense effects are possible. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-live-rosin":"What it is — Live Rosin made from fresh‑frozen material to preserve aroma.\nHow to use — micro‑doses with appropriate equipment; keep refrigerated for best quality.\nWarning: potent. Avoid overuse and don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-diamonds":"What it is — cannabinoid “diamonds”, high‑purity crystals (very strong). Choose THC or CBD in the configuration.\nHow to use — micro‑dose and increase only if needed, using proper equipment where legal.\nWarning: very high potency. Higher risk of anxiety, fast heartbeat, and heavy sedation. Don’t drive. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-gummies":"What it is — gummies (chewable candies) with selectable flavors and sizes (50g/100g).\nHow to use — edibles can take 30–120 minutes to kick in. Start small and wait before taking more.\nWarning: easier to overconsume because onset is slow. Keep away from children (looks like candy). Adults 18+ only. Follow local law.","pdesc_edible-honey":"What it is — infused honey (THC where legal), 100ml.\nHow to use — mix into drinks/recipes. Start with a small amount and wait for effects.\nWarning: psychoactive if THC. Do not drive after use; keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-butter":"What it is — infused “truffle butter” (THC where legal), 100g.\nHow to use — for cooking/recipes; measure carefully to control dose.\nWarning: edibles can hit hard and last hours. Wait at least 2 hours before taking more. Adults 18+ only. Follow local law.","pdesc_edible-chocolate":"What it is — chocolate (milk/dark/white) in 50g/100g portions.\nHow to use — start with a small piece; edibles may take longer to feel.\nWarning: keep away from children. If formula includes THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-gum":"What it is — chewing gum with CBD or THC (where legal), with selectable flavors.\nHow to use — chew slowly. If THC, start with 1 piece and wait to gauge effect.\nWarning: THC is psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-lollipops":"What it is — THC lollipops (where legal) with selectable flavors.\nHow to use — consume slowly and wait before repeating (edibles are delayed).\nWarning: looks like candy—high child risk. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_bev-soda":"What it is — infused soda (THC or CBD where legal) with selectable flavors.\nHow to use — drink slowly. If THC, wait 30–120 minutes before more.\nWarning: do not mix with alcohol. If THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_bev-tea":"What it is — THC infused tea (where legal), selectable flavors.\nHow to use — drink slowly; effects may be delayed.\nWarning: psychoactive. Don’t drive after use; avoid alcohol. Adults 18+ only. Follow local law.","pdesc_bev-lemonade":"What it is — THC infused lemonade (where legal), selectable size and ice.\nHow to use — drink slowly; wait before taking more.\nWarning: psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_vape-thc":"What it is — THC vape (where legal) with selectable flavor and puff count (100/1000).\nHow to use — start with 1–2 puffs, wait a few minutes, then decide if you need more.\nWarning: inhalation can irritate airways. Do not drive after use. Keep out of reach of minors. Adults 18+ only. Follow local law.","pdesc_pet-oil":"What it is — CBD/hemp oil designed for pets (30ml).\nHow to use — follow the label and your veterinarian’s guidance; start with small amounts.\nWarning: pets have different sensitivity. Avoid THC for animals. Keep products out of children’s reach.","pdesc_pet-chews":"What it is — CBD chewable treats for pets (units).\nHow to use — give as directed on the label; consider size/species.\nWarning: check ingredients and allergies. Consult a vet if your pet uses medication.","pdesc_pet-balm":"What it is — topical balm with hemp/CBD (external use).\nHow to use — apply a small amount on a small area first; avoid eyes and mouth.\nWarning: stop use if irritation occurs. Keep away from children/pets ingestion.","pdesc_pet-shampoo":"What it is — calming pet shampoo with hemp ingredients.\nHow to use — wet coat, apply, rinse well; avoid eyes/ears.\nWarning: for external use only. Stop if irritation occurs.","pdesc_acc-pen":"What it is — Hemp pen (everyday accessory).\nHow to use — standard pen use.\nNote: keep away from small children.","pdesc_acc-shirt":"What it is — basic minimalist t‑shirt (apparel).\nHow to use — choose size and care as usual.","pdesc_acc-cap":"What it is — trucker-style cap (apparel).\nHow to use — adjustable fit; clean gently.","pdesc_acc-grinder":"What it is — grinder for a more even grind.\nHow to use — load, twist, and clean regularly.\nWarning: keep sharp parts away from children.","pdesc_acc-tips":"What it is — tips/mouthpieces for comfort and airflow.\nHow to use — insert and replace when needed.","pdesc_acc-papers":"What it is — rolling papers.\nHow to use — roll as desired; store dry.","pdesc_acc-roller":"What it is — rolling tool to help with consistent rolls.\nHow to use — follow the tool’s guide; keep clean.","pdesc_acc-bong":"What it is — bong/water pipe accessory.\nHow to use — fill to the correct water level and clean frequently.\nWarning: glass can break—handle with care. Use only where legal; do not drive after use.","age18":"+18","footer_company":"","footer_group":"JP. DIETERICH Group","privacy_title":"Privacy Policy","legal_model_note":"Informational document (template). Review with your lawyer before real use.","privacy_li1":"We may collect basic data to operate the cart, demo login, and language preferences.","privacy_li2":"Data may be stored locally in your browser (localStorage) to improve the experience.","privacy_li3":"You may request deletion/changes as allowed by applicable law (e.g., LGPD).","privacy_li4":"We do not sell your data. We use it only to operate and improve the service.","terms_title":"Terms of Use","terms_li1":"By accessing this site, you agree to these terms and applicable laws.","terms_li2":"Information provided here is for informational purposes and may change without notice.","terms_li3":"Misuse of the brand, full content copying, and abusive scraping practices are prohibited.","terms_li4":"Purchases and payments follow the conditions shown at checkout.","terms_li5":"If you have questions, use the contact page.","cookies_title":"Cookie Policy","cookies_li1":"This site may use local storage/cookies to keep your language and cart.","cookies_li2":"You can clear browser data at any time to remove preferences.","cookies_li3":"Analytics/marketing tools should only be enabled with consent (if applicable).","lgpd_title":"LGPD (Data Subject Rights)","lgpd_li1":"You may request: access, correction, portability, consent withdrawal, and deletion.","lgpd_li2":"Channel: privacidade@hempstore.com.br (replace with your real email).","lgpd_li3":"Legal basis and retention depend on the data type and regulatory/tax obligations.","institutional":"Institutional","back_simple":"Back","notice":"Notice","notice_sub":"Institutional content. Operations and portfolio are subject to current laws and regulations.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"Hemp Oil Company focuses on quality, sustainability, and well-being, delivering premium cannabis-based products with care at every step.","hoc_btn_solutions":"View solutions","hoc_btn_store":"Go to the store (Hemp Store)","hoc_areas_title":"Key areas","hoc_badge_rd":"R&D","hoc_card_rd_title":"Research & development","hoc_card_rd_sub":"Specifications, stability, formulation, and innovation with clear language and complete documentation.","hoc_badge_quality":"Quality","hoc_card_quality_title":"Quality & traceability","hoc_card_quality_sub":"Lot-based control, traceability, and internal standards for consistency and trust.","hoc_badge_compliance":"Compliance","hoc_card_compliance_title":"Governance & compliance","hoc_card_compliance_sub":"Governance, labeling, and processes aligned with applicable standards (by scope and jurisdiction).","hoc_contact_title":"B2B contact","hoc_contact_sub":"Talk to our commercial/technical team about partnerships, distribution, portfolio development, and custom projects.","label_email":"Email:","label_partnerships":"Partnerships:","hoc_quick_msg":"Quick message","label_name":"Name","label_message":"Message","send":"Send","hoc_form_demo":"Demo form. Request a real sending integration.","sol_title":"Solutions (B2B)","sol_sub":"Modules for quality, documentation, and supply chain—keeping the same visual style as Hemp Store.","sol_btn_compliance":"R&D + Compliance","sol_deliver_title":"What we deliver","sol_badge_docs":"Docs","sol_docs_title":"Specifications & documentation","sol_docs_sub":"Tech sheets, labeling requirements, internal standards, and consistency.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain & partners","sol_scm_sub":"Supplier curation, standardization, and traceability.","sol_badge_brand":"Brand","sol_brand_title":"Portfolio strategy","sol_brand_sub":"Line architecture and distribution guides.","sol_integration_title":"Integration with Hemp Store","sol_integration_sub":"B2C runs on  (e-commerce). Hemp Oil Company structures the supply chain and R&D.","sol_btn_store_products":"View store products","comp_title":"R&D + Compliance","comp_sub":"Institutional hub for internal standards, quality, and traceability—with clear, objective language.","comp_btn_talk":"Talk to the team","comp_pillars":"Pillars","comp_badge_sop":"SOP","comp_sop_title":"Procedures & standards","comp_sop_sub":"Documentation focused on consistency and continuous improvement.","comp_badge_qa":"QA","comp_qa_title":"Quality control","comp_qa_sub":"Guidelines for lot-based control and records.","comp_badge_legal":"Legal","comp_legal_title":"Compliance","comp_legal_sub":"Alignment with applicable standards based on scope/regulation.","Acessórios":"Accessories","Bebida":"Beverage","Charutaria":"Cigars","Comestíveis":"Edibles","Extração":"Extract","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Oil","Óleo CBD Isolado":"CBD Isolate Oil","Óleo Full Spectrum":"Full Spectrum Oil","Óleo CBG":"CBG Oil","Charutos San Juan":"San Juan Cigars","Juanitos • Pré-enrolado 01g":"Juanitos • Pre-roll 1g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (Ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds":"THC/CBD Diamonds","Gummies":"Gummies","Mel infusionado de THC":"THC-Infused Honey","Manteiga Trufada de THC":"THC-Infused Butter","Chocolate":"Chocolate","Chicletes CBD e THC":"CBD & THC Chewing Gum","Refrigerante infusionado (THC/CBD)":"Infused Soda (THC/CBD)","Chá infusionado THC":"THC-Infused Tea","Limonada infusionada THC":"THC-Infused Lemonade","Vape THC":"THC Vape","Óleo CBD Pet":"CBD Pet Oil","Petiscos mastigáveis CBD":"CBD Chews (Pets)","Bálsamo tópico com cânhamo/CBD":"Hemp/CBD Topical Balm","Shampoo calmante com cânhamo":"Calming Hemp Shampoo","Canetas Hemp":"Hemp Pens","Camisetas":"T-Shirts","Bonés (estilo trucker)":"Trucker Caps","Dichavadores":"Grinders","Piteiras":"Tips / Mouthpieces","Sedas":"Rolling Papers","Bolador":"Roller","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolate • 30ml (demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Full Spectrum • 30ml (demo)","CBG • Isolado • 30ml (demo)":"CBG • Isolate • 30ml (demo)","Configuração por peso e strain (demo)":"Configure by weight & strain (demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Pre-roll • 1g • selectable strain (demo)","Extração (demo) • strain selecionável":"Extract (demo) • selectable strain","Comestível (demo) • sabores • 50g / 100g":"Edible (demo) • flavors • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Edible (demo) • THC (where legal) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Edible (demo) • THC (where legal) • 100g","Comestível (demo) • CBD/THC • 100g":"Edible (demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Edible (demo) • CBD/THC • units","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Beverage • THC/CBD • 330ml / 500ml (demo, where legal)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Beverage • THC • 300ml / 500ml (demo, where legal)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Beverage • THC • 400ml / 700ml (demo, where legal)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 puffs (demo, where legal)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (demo) • hemp/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (demo) • snacks • units","Pet (demo) • uso tópico":"Pet (demo) • topical","Pet (demo) • higiene":"Pet (demo) • hygiene","Acessório • escrita/coleção":"Accessory • writing/collectible","Acessório • apparel":"Accessory • apparel","Acessório • boné":"Accessory • cap","Acessório • diversos modelos":"Accessory • various models","Acessório • enrolar":"Accessory • rolling","Acessório • papéis":"Accessory • papers","Acessório • tamanhos P / M / G":"Accessory • sizes S / M / L","Acessório • vidro/acrílico":"Accessory • glass/acrylic","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Selectable variety • 5g / 10g (demo, where legal)","Bolador (demo). Ajuda a manter consistência na montagem.":"Roller (demo). Helps keep consistency when rolling.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (demo). Use safely and keep them clean.","Bonés trucker (demo). Leve e ventilado.":"Trucker caps (demo). Light and breathable.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Topical balm (demo). Common in pet hemp lines—check ingredients and patch test first.","Camisetas (demo). Modelagem básica e minimalista.":"T-Shirts (demo). Basic, minimalist fit.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hemp Pens (demo). A touch of style for everyday.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San Juan Cigars (demo). Select weight and strain. Where legal, the experience often involves aroma and ritual. Use responsibly.","Chicletes (demo). Discretos e fáceis de dosar.":"Chewing gum (demo). Discreet and easy to dose.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Chocolate (demo). A classic edible—remember onset can be slower.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infused tea (demo). Choose flavor and volume. Always check local legality and use responsibly.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinders (demo). An even grind improves consistency and reduces waste.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extracts (demo). Generally more concentrated—start low and use responsibly (and comply with local law).","Gummies (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gummies (demo). Practical and discreet. Edibles may take longer to kick in—go slow.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (demo). 1g pre-roll with selectable strain. Prefer safe settings and smaller doses.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infused lemonade (demo). Select volume and ice. Always check local legality and use responsibly.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Truffle butter (demo). Great for recipes—dose control is essential.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Infused honey (demo). Great with tea and recipes—watch the dose.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBD chews (demo). Chew snacks for routine/training. Check ingredient/label compliance in your jurisdiction.","Piteiras (demo). Conforto e melhor fluxo.":"Tips (demo). Comfort and better airflow.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Infused soda (demo). Select cannabinoid, volume, and flavor. Always check local legality and use responsibly.","Sedas (demo). Papéis clássicos e práticos.":"Rolling papers (demo). Classic, practical papers.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Hemp shampoo (demo). A hygiene product with wellness appeal—choose gentle formulas suitable for pets.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THC vape (demo). Select puff count and flavor. Always check local legality and use responsibly.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBD Isolate Oil (demo). Isolate focuses on a primary cannabinoid with a more neutral profile. Always confirm local legality and use responsibly.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"CBD pet oil (demo). Hemp-based CBD pet products are common where legal; avoid medical claims and follow veterinary guidance.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBG Oil (demo). Often formulated with cannabigerol. Check the label and local compliance/legal status.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Full Spectrum Oil (demo). Typically includes a broader set of hemp compounds (including terpenes), which can change aroma and experience. Check label and compliance.","Isolado":"Isolate","THC (onde permitido)":"THC (where legal)","100 puxadas":"100 puffs","1000 puxadas":"1000 puffs","10 un.":"10 pcs","30 un.":"30 pcs","32 un.":"32 pcs","50 un.":"50 pcs","60 un.":"60 pcs","01g":"1g","Com gelo":"With ice","Sem gelo":"No ice","Pequeno":"Small","Médio":"Medium","Grande":"Large","Branco":"White","Branca":"White","Preto":"Black","Preta":"Black","Verde":"Green","Madeira":"Wood","Metal":"Metal","Vidro":"Glass","Acrílico":"Acrylic","Cão":"Dog","Gato":"Cat","Frango":"Chicken","Salmão":"Salmon","Amargo":"Dark","Ao leite":"Milk","Camomila":"Chamomile","Gengibre":"Ginger","Hortelã":"Mint","Menta":"Mint","Mint":"Mint","Morango":"Strawberry","Melancia":"Watermelon","Uva":"Grape","Laranja":"Orange","Limão":"Lemon","Tangerina":"Tangerine","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"S","M":"M","G":"L","GG":"XL","product_about_title":"About this product","product_disclaimer":"Notice: informational content. This site is a demo/template. Follow local laws and the label instructions. If in doubt, talk to a healthcare professional.","hoc_about_title":"Who we are","hoc_about_p1":"Hemp Oil Company S.A. exists to raise the bar: real quality, transparency, and a responsible supply chain — from suppliers to customers.","hoc_about_p2":"We believe wellness, sustainability, and care for others can go together. Our job is to build robust processes so you can buy with confidence.","hoc_about_points":"• Lot traceability and quality\n• Internal standards (SOPs) and documentation\n• Partner and raw material curation\n• Compliance-first portfolio design","hoc_commitment_title":"Our commitment","hoc_commitment_p":"Clear delivery, rigorous testing, and a human way of serving. No miracle claims — just consistency, responsibility, and care."},"es":{"Charuto San Juan":"Puro San Juan","Charuto • unitário • (demo)":"Puro • unidad • (demo)","pdesc_oil-cbd":"Qué es — CBD (cannabidiol) oil in a 30ml dropper, with selectable strength (mg/mL).\nCómo funciona — CBD interacts with the endocannabinoid system; this is not a medical claim.\nCómo usar — start low and increase slowly. Sublingual use is common: place under the tongue ~60s, then swallow.\nAdvertencia: may cause drowsiness, dry mouth, or mild stomach discomfort. If you take medicines (e.g., blood thinners) or are pregnant/breastfeeding, talk to a healthcare professional.","pdesc_oil-cbg":"Qué es — CBG (cannabigerol) oil in a 30ml bottle, with selectable strength (mg/mL).\nCómo funciona — CBG is a cannabinoid that some people include in wellness routines (no medical promises).\nCómo usar — start with a low dose and adjust slowly. Sublingual use is common.\nAdvertencia: may cause drowsiness or mild discomfort. If you use other medicines, or are pregnant/breastfeeding, seek professional guidance.","pdesc_oil-thc":"Qué es — THC oil in a 30ml bottle, with selectable strength (mg/mL).\nCómo funciona — THC is psychoactive and can affect perception, coordination, and mood.\nCómo usar — start very low and go slow. Wait long enough before repeating; effects can last for hours.\nAdvertencia: DO NOT drive or operate machines. Higher risk of anxiety, fast heartbeat, drowsiness, and impaired judgement. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_oil-full-spectrum":"Qué es — Full‑spectrum hemp extract oil (30ml) with multiple plant compounds; it may contain THC.\nCómo funciona — a broader cannabinoid/terpene profile can change aroma and experience (no medical promises).\nCómo usar — start low and increase slowly. Sublingual use is common.\nAdvertencia: may be psychoactive and can affect drug tests. Do not drive if you feel altered. Adults 18+ only. Follow local law.","pdesc_strain-gorilla-glue":"Qué es — cannabis flower/strain “Gorilla Glue”, with selectable weight (5g/10g).\nCómo usar — store sealed, cool, and away from light to preserve aroma and humidity.\nAdvertencia: may be psychoactive and impair coordination. Avoid mixing with alcohol. Adults 18+ only. Follow local law.","pdesc_strain-purple-haze":"Qué es — cannabis flower/strain “Purple Haze”, with selectable weight (5g/10g).\nCómo usar — keep sealed to preserve freshness.\nAdvertencia: may cause psychoactive effects and sleepiness. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_strain-og-kush":"Qué es — cannabis flower/strain “OG Kush”, with selectable weight (5g/10g).\nCómo usar — store in an airtight jar, cool and dry.\nAdvertencia: can be intense for beginners. Start small, don’t drive, and avoid alcohol. Adults 18+ only. Follow local law.","pdesc_cigar-san-juan":"Qué es — “San Juan” cigar (single unit), choose strain and size/weight (10g/15g/20g).\nCómo usar — use in a ventilated area and with moderation.\nAdvertencia: smoking can irritate the airways. Avoid if you have lung/heart conditions. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_juanitos":"Qué es — 1g pre‑roll with selectable strain.\nCómo usar — take small puffs and wait a few minutes to gauge intensity.\nAdvertencia: may cause cough, drowsiness, and impaired coordination. Do not drive. Avoid alcohol. Adults 18+ only. Follow local law.","pdesc_extract-dry":"Qué es — “Dry” (dry sift/kief) concentrate obtained by dry separation.\nCómo usar — it’s more concentrated than flower: use tiny amounts and increase slowly.\nAdvertencia: higher potency increases the risk of overdoing it. Do not drive after use. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_extract-bubble-hash":"Qué es — Bubble Hash (ice/water hash), concentrate made with ice-water filtration.\nCómo usar — use small amounts; keep cool to preserve texture.\nAdvertencia: more potent than flower. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-rosin":"Qué es — Rosin, a solventless concentrate extracted with heat and pressure.\nCómo usar — micro‑doses only; use proper equipment where legal.\nAdvertencia: high potency; intense effects are possible. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-live-rosin":"Qué es — Live Rosin made from fresh‑frozen material to preserve aroma.\nCómo usar — micro‑doses with appropriate equipment; keep refrigerated for best quality.\nAdvertencia: potent. Avoid overuse and don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-diamonds":"Qué es — cannabinoid “diamonds”, high‑purity crystals (very strong). Choose THC or CBD in the configuration.\nCómo usar — micro‑dose and increase only if needed, using proper equipment where legal.\nAdvertencia: very high potency. Higher risk of anxiety, fast heartbeat, and heavy sedation. Don’t drive. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-gummies":"Qué es — gummies (chewable candies) with selectable flavors and sizes (50g/100g).\nCómo usar — edibles can take 30–120 minutes to kick in. Start small and wait before taking more.\nAdvertencia: easier to overconsume because onset is slow. Keep away from children (looks like candy). Adults 18+ only. Follow local law.","pdesc_edible-honey":"Qué es — infused honey (THC where legal), 100ml.\nCómo usar — mix into drinks/recipes. Start with a small amount and wait for effects.\nAdvertencia: psychoactive if THC. Do not drive after use; keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-butter":"Qué es — infused “truffle butter” (THC where legal), 100g.\nCómo usar — for cooking/recipes; measure carefully to control dose.\nAdvertencia: edibles can hit hard and last hours. Wait at least 2 hours before taking more. Adults 18+ only. Follow local law.","pdesc_edible-chocolate":"Qué es — chocolate (milk/dark/white) in 50g/100g portions.\nCómo usar — start with a small piece; edibles may take longer to feel.\nAdvertencia: keep away from children. If formula includes THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-gum":"Qué es — chewing gum with CBD or THC (where legal), with selectable flavors.\nCómo usar — chew slowly. If THC, start with 1 piece and wait to gauge effect.\nAdvertencia: THC is psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-lollipops":"Qué es — THC lollipops (where legal) with selectable flavors.\nCómo usar — consume slowly and wait before repeating (edibles are delayed).\nAdvertencia: looks like candy—high child risk. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_bev-soda":"Qué es — infused soda (THC or CBD where legal) with selectable flavors.\nCómo usar — drink slowly. If THC, wait 30–120 minutes before more.\nAdvertencia: do not mix with alcohol. If THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_bev-tea":"Qué es — THC infused tea (where legal), selectable flavors.\nCómo usar — drink slowly; effects may be delayed.\nAdvertencia: psychoactive. Don’t drive after use; avoid alcohol. Adults 18+ only. Follow local law.","pdesc_bev-lemonade":"Qué es — THC infused lemonade (where legal), selectable size and ice.\nCómo usar — drink slowly; wait before taking more.\nAdvertencia: psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_vape-thc":"Qué es — THC vape (where legal) with selectable flavor and puff count (100/1000).\nCómo usar — start with 1–2 puffs, wait a few minutes, then decide if you need more.\nAdvertencia: inhalation can irritate airways. Do not drive after use. Keep out of reach of minors. Adults 18+ only. Follow local law.","pdesc_acc-cap":"Qué es — trucker-style cap (apparel).\nCómo usar — adjustable fit; clean gently.","pdesc_acc-grinder":"Qué es — grinder for a more even grind.\nCómo usar — load, twist, and clean regularly.\nAdvertencia: keep sharp parts away from children.","pdesc_acc-tips":"Qué es — tips/mouthpieces for comfort and airflow.\nCómo usar — insert and replace when needed.","pdesc_acc-papers":"Qué es — rolling papers.\nCómo usar — roll as desired; store dry.","pdesc_acc-roller":"Qué es — rolling tool to help with consistent rolls.\nCómo usar — follow the tool’s guide; keep clean.","pdesc_acc-bong":"Qué es — bong/water pipe accessory.\nCómo usar — fill to the correct water level and clean frequently.\nAdvertencia: glass can break—handle with care. Use only where legal; do not drive after use.","age18":"+18","footer_company":"","footer_group":"Grupo JP. DIETERICH","privacy_title":"Política de Privacidad","legal_model_note":"Documento informativo (modelo). Ajuste con su abogado para uso real.","privacy_li1":"Podemos recopilar datos básicos para operar el carrito, el login (demo) y las preferencias de idioma.","privacy_li2":"Los datos pueden almacenarse localmente en su navegador (localStorage) para mejorar la experiencia.","privacy_li3":"Puede solicitar eliminación/ajustes según la legislación aplicable (LGPD).","privacy_li4":"No vendemos sus datos. Los usamos solo para operar y mejorar el servicio.","terms_title":"Términos de Uso","terms_li1":"Al acceder a este sitio, usted acepta estos términos y la legislación aplicable.","terms_li2":"La información aquí contenida es informativa y puede cambiar sin previo aviso.","terms_li3":"Está prohibido el uso indebido de la marca, la copia íntegra del contenido y prácticas de scraping abusivas.","terms_li4":"Compras y pagos siguen las condiciones mostradas en el checkout.","terms_li5":"En caso de dudas, use la página de contacto.","cookies_title":"Política de Cookies","cookies_li1":"Este sitio puede usar almacenamiento local/cookies para mantener el idioma y el carrito.","cookies_li2":"Puede borrar los datos del navegador en cualquier momento para eliminar preferencias.","cookies_li3":"Herramientas de analítica/marketing solo deben habilitarse con consentimiento (si aplica).","lgpd_title":"LGPD (Derechos del Titular)","lgpd_li1":"Puede solicitar: acceso, corrección, portabilidad, revocación del consentimiento y eliminación.","lgpd_li2":"Canal: privacidade@hempstore.com.br (reemplace por su correo real).","lgpd_li3":"La base legal y la retención dependen del tipo de dato y obligaciones regulatorias/fiscales.","institutional":"institutional","back_simple":"Volver","notice":"notice","notice_sub":"Contenido institucional. Operaciones y portafolio están sujetos a la legislación y normas vigentes.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"Hemp Oil Company se enfoca en la calidad, la sostenibilidad y el bienestar, entregando productos a base de cannabis con estándar premium y cuidado en cada etapa.","hoc_btn_solutions":"Ver soluciones","hoc_btn_store":"Ir a la tienda (Hemp Store)","hoc_areas_title":"Áreas principales","hoc_badge_rd":"I+D","hoc_card_rd_title":"Investigación y desarrollo","hoc_card_rd_sub":"Estructura para especificaciones, estabilidad, documentación e innovación.","hoc_badge_quality":"Calidad","hoc_card_quality_title":"Calidad y trazabilidad","hoc_card_quality_sub":"Directrices de cadena de custodia, control por lote y consistencia.","hoc_badge_compliance":"Cumplimiento","hoc_card_compliance_title":"Gobernanza y cumplimiento","hoc_card_compliance_sub":"Políticas internas y adecuación a normas aplicables (cuando se requiera).","hoc_contact_title":"Contacto B2B","hoc_contact_sub":"Hable con el equipo comercial/técnico para alianzas, distribución y desarrollo de portafolio.","label_email":"Email:","label_partnerships":"Alianzas:","hoc_quick_msg":"Mensaje rápido","label_name":"Nombre","label_message":"Mensaje","send":"send","hoc_form_demo":"Formulario demo. Solicite integración de envío real.","sol_title":"Soluciones (B2B)","sol_sub":"Módulos para calidad, documentación y cadena de suministro, manteniendo el mismo estilo visual de Hemp Store.","sol_btn_compliance":"I+D + Cumplimiento","sol_deliver_title":"Qué entregamos","sol_badge_docs":"Docs","sol_docs_title":"Especificaciones y documentación","sol_docs_sub":"Fichas técnicas, requisitos de etiquetado, estándares internos y consistencia.","sol_badge_scm":"SCM","sol_scm_title":"Cadena de suministro y socios","sol_scm_sub":"Curaduría de proveedores, estandarización y trazabilidad.","sol_badge_brand":"Marca","sol_brand_title":"Estrategia de portafolio","sol_brand_sub":"Arquitectura de líneas y guías de distribución.","sol_integration_title":"Integración con Hemp Store","sol_integration_sub":"La operación B2C sucede en  (e-commerce). Hemp Oil Company estructura la cadena e I+D.","sol_btn_store_products":"Ver productos en la tienda","comp_title":"I+D + Cumplimiento","comp_sub":"Hub institucional para estándares internos, calidad y trazabilidad, con lenguaje claro y objetivo.","comp_btn_talk":"Hablar con el equipo","comp_pillars":"Pilares","comp_badge_sop":"SOP","comp_sop_title":"Procedimientos y estándares","comp_sop_sub":"Documentación orientada a la consistencia y mejora continua.","comp_badge_qa":"QA","comp_qa_title":"Control de calidad","comp_qa_sub":"Directrices para control por lote y registros.","comp_badge_legal":"Legal","comp_legal_title":"Cumplimiento","comp_legal_sub":"Adecuación a las normas aplicables según el alcance/regulación.","Acessórios":"Accesorios","Bebida":"Bebida","Charutaria":"Charutería","Comestíveis":"Comestibles","Extração":"Extracción","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Aceite","Óleo CBD Isolado":"Aceite CBD Aislado","Óleo Full Spectrum":"Aceite Espectro completo","Óleo CBG":"Aceite CBG","Charutos San Juan":"Puros San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds":"Diamonds","Gummies":"Gummies","Mel infusionado de THC":"Miel infusionada de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Chocolate","Chicletes CBD e THC":"Chicles CBD e THC","Refrigerante infusionado (THC/CBD)":"Refresco infusionado (THC/CBD)","Chá infusionado THC":"Té infusionado THC","Limonada infusionada THC":"Limonada infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Aceite CBD Pet","Petiscos mastigáveis CBD":"Snacks mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Bálsamo tópico com cáñamo/CBD","Shampoo calmante com cânhamo":"Champú calmante com cáñamo","Canetas Hemp":"Bolígrafos Hemp","Camisetas":"Camisetas","Bonés (estilo trucker)":"Gorras (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Liadora","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Aislado • 30ml (demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Espectro completo • 30ml (demo)","CBG • Isolado • 30ml (demo)":"CBG • Aislado • 30ml (demo)","Configuração por peso e strain (demo)":"Configuración por peso y cepa (demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Cigarrillo pre-rolado • 01g • cepa seleccionable (demo)","Extração (demo) • strain selecionável":"Extracción (demo) • cepa seleccionable","Comestível (demo) • sabores • 50g / 100g":"Comestible (demo) • sabores • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Comestible (demo) • THC (donde esté permitido) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Comestible (demo) • THC (donde esté permitido) • 100g","Comestível (demo) • CBD/THC • 100g":"Comestible (demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Comestible (demo) • CBD/THC • unidades","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Bebida • THC/CBD • 330ml / 500ml (demo, donde esté permitido)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Bebida • THC • 300ml / 500ml (demo, donde esté permitido)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Bebida • THC • 400ml / 700ml (demo, donde esté permitido)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 caladas (demo, donde esté permitido)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (demo) • cáñamo/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (demo) • snacks • unidades","Pet (demo) • uso tópico":"Pet (demo) • uso tópico","Pet (demo) • higiene":"Pet (demo) • higiene","Acessório • escrita/coleção":"Accesorio • escritura/colección","Acessório • apparel":"Accesorio • apparel","Acessório • boné":"Accesorio • boné","Acessório • diversos modelos":"Accesorio • diversos modelos","Acessório • enrolar":"Accesorio • enrolar","Acessório • papéis":"Accesorio • papéis","Acessório • tamanhos P / M / G":"Accesorio • tamanhos P / M / G","Acessório • vidro/acrílico":"Accesorio • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Varíedad seleccionable • 5g / 10g (demo, donde esté permitido)","Bolador (demo). Ajuda a manter consistência na montagem.":"Liadora (demo). Ayuda a mantener la consistencia al armar.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (demo). Úselos con seguridad y mantenga la limpieza.","Bonés trucker (demo). Leve e ventilado.":"Gorras trucker (demo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Bálsamo tópico (demo). Opción común en líneas pet con cáñamo: revise la composición y haga una prueba en un área pequeña.","Camisetas (demo). Modelagem básica e minimalista.":"Camisetas (demo). Corte básico y minimalista.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Bolígrafos Hemp (demo). Un toque de estilo para el día a día.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"Puros San Juan (demo). Seleccione peso y cepa. Donde esté permitido, la experiencia suele incluir aroma y ritual. Úselo con responsabilidad.","Chicletes (demo). Discretos e fáceis de dosar.":"Chicles (demo). Discretos y fáciles de dosificar.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Chocolate (demo). Una forma clásica de consumo; recuerde que la absorción puede ser más lenta.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"Té infusionado con THC (demo). Elija sabor y volumen. Verifique siempre la legalidad local y consuma con responsabilidad.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Trituradores (demo). Una molienda uniforme ayuda a la consistencia y reduce el desperdicio.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extracciones (demo). Por lo general son más concentradas: empiece con poco y úselo con responsabilidad (según la legislación local).","Gummies (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gomitas (demo). Prácticas y discretas. Los comestibles pueden tardar más en hacer efecto: vaya con calma.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (demo). Pre-rolado de 01g con selección de cepa. Prefiera ambientes seguros y dosis menores.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"Limonada infusionada con THC (demo). Seleccione volumen y hielo. Verifique siempre la legalidad local y consuma con responsabilidad.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Mantequilla trufada (demo). Ideal para recetas: el control de dosis es esencial.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Miel infusionada (demo). Combina con tés y recetas: atención a la dosis.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"Snacks de CBD (demo). Línea de bocados masticables para rutina/entrenamiento. Verifique ingredientes y etiquetado según su jurisdicción.","Piteiras (demo). Conforto e melhor fluxo.":"Boquillas (demo). Más comodidad y mejor flujo.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Refresco infusionado (demo). Seleccione cannabinoide, volumen y sabor. Verifique siempre la legalidad local y consuma con responsabilidad.","Sedas (demo). Papéis clássicos e práticos.":"Papeles (demo). Clásicos y prácticos.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Champú con cáñamo (demo). Producto de higiene con enfoque de bienestar: elija fórmulas suaves y aptas para mascotas.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"Vape de THC (demo). Seleccione cantidad de caladas y sabor. Verifique siempre la legalidad local y úselo con responsabilidad.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"Aceite de CBD aislado (demo). Se centra en un cannabinoide principal, con un perfil más neutro. Confirme siempre la legalidad local y úselo con responsabilidad.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"Aceite de CBD para mascotas (demo). Son comunes en mercados donde está permitido; evite afirmaciones médicas y siga orientación veterinaria.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"Aceite de CBG (demo). Generalmente formulado con cannabigerol. Revise la etiqueta y la conformidad/legalidad local.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Aceite Full Spectrum (demo). Suele incluir más compuestos del cáñamo (incluidos terpenos), lo que puede cambiar aroma y experiencia. Revise etiqueta y cumplimiento.","Isolado":"Aislado","THC (onde permitido)":"THC (donde esté permitido)","100 puxadas":"100 caladas","1000 puxadas":"1000 caladas","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com hielo","Sem gelo":"Sem hielo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Blanco","Branca":"Blanca","Preto":"Negro","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Vidrio","Acrílico":"Acrílico","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Amargo","Ao leite":"Con leche","Camomila":"Manzanilla","Gengibre":"Jengibre","Hortelã":"Menta","Menta":"Menta","Mint":"Mint","Morango":"Fresa","Melancia":"Sandía","Uva":"Uva","Laranja":"Naranja","Limão":"Limón","Tangerina":"Mandarina","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"fr":{"Charuto San Juan":"Cigare San Juan","Charuto • unitário • (demo)":"Cigare • à l’unité • (démo)","pdesc_oil-cbd":"Ce que c’est — CBD (cannabidiol) oil in a 30ml dropper, with selectable strength (mg/mL).\nComment ça fonctionne — CBD interacts with the endocannabinoid system; this is not a medical claim.\nUtilisation — start low and increase slowly. Sublingual use is common: place under the tongue ~60s, then swallow.\nAvertissement: may cause drowsiness, dry mouth, or mild stomach discomfort. If you take medicines (e.g., blood thinners) or are pregnant/breastfeeding, talk to a healthcare professional.","pdesc_oil-cbg":"Ce que c’est — CBG (cannabigerol) oil in a 30ml bottle, with selectable strength (mg/mL).\nComment ça fonctionne — CBG is a cannabinoid that some people include in wellness routines (no medical promises).\nUtilisation — start with a low dose and adjust slowly. Sublingual use is common.\nAvertissement: may cause drowsiness or mild discomfort. If you use other medicines, or are pregnant/breastfeeding, seek professional guidance.","pdesc_oil-thc":"Ce que c’est — THC oil in a 30ml bottle, with selectable strength (mg/mL).\nComment ça fonctionne — THC is psychoactive and can affect perception, coordination, and mood.\nUtilisation — start very low and go slow. Wait long enough before repeating; effects can last for hours.\nAvertissement: DO NOT drive or operate machines. Higher risk of anxiety, fast heartbeat, drowsiness, and impaired judgement. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_oil-full-spectrum":"Ce que c’est — Full‑spectrum hemp extract oil (30ml) with multiple plant compounds; it may contain THC.\nComment ça fonctionne — a broader cannabinoid/terpene profile can change aroma and experience (no medical promises).\nUtilisation — start low and increase slowly. Sublingual use is common.\nAvertissement: may be psychoactive and can affect drug tests. Do not drive if you feel altered. Adults 18+ only. Follow local law.","pdesc_strain-gorilla-glue":"Ce que c’est — cannabis flower/strain “Gorilla Glue”, with selectable weight (5g/10g).\nUtilisation — store sealed, cool, and away from light to preserve aroma and humidity.\nAvertissement: may be psychoactive and impair coordination. Avoid mixing with alcohol. Adults 18+ only. Follow local law.","pdesc_strain-purple-haze":"Ce que c’est — cannabis flower/strain “Purple Haze”, with selectable weight (5g/10g).\nUtilisation — keep sealed to preserve freshness.\nAvertissement: may cause psychoactive effects and sleepiness. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_strain-og-kush":"Ce que c’est — cannabis flower/strain “OG Kush”, with selectable weight (5g/10g).\nUtilisation — store in an airtight jar, cool and dry.\nAvertissement: can be intense for beginners. Start small, don’t drive, and avoid alcohol. Adults 18+ only. Follow local law.","pdesc_cigar-san-juan":"Ce que c’est — “San Juan” cigar (single unit), choose strain and size/weight (10g/15g/20g).\nUtilisation — use in a ventilated area and with moderation.\nAvertissement: smoking can irritate the airways. Avoid if you have lung/heart conditions. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_juanitos":"Ce que c’est — 1g pre‑roll with selectable strain.\nUtilisation — take small puffs and wait a few minutes to gauge intensity.\nAvertissement: may cause cough, drowsiness, and impaired coordination. Do not drive. Avoid alcohol. Adults 18+ only. Follow local law.","pdesc_extract-dry":"Ce que c’est — “Dry” (dry sift/kief) concentrate obtained by dry separation.\nUtilisation — it’s more concentrated than flower: use tiny amounts and increase slowly.\nAvertissement: higher potency increases the risk of overdoing it. Do not drive after use. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_extract-bubble-hash":"Ce que c’est — Bubble Hash (ice/water hash), concentrate made with ice-water filtration.\nUtilisation — use small amounts; keep cool to preserve texture.\nAvertissement: more potent than flower. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-rosin":"Ce que c’est — Rosin, a solventless concentrate extracted with heat and pressure.\nUtilisation — micro‑doses only; use proper equipment where legal.\nAvertissement: high potency; intense effects are possible. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-live-rosin":"Ce que c’est — Live Rosin made from fresh‑frozen material to preserve aroma.\nUtilisation — micro‑doses with appropriate equipment; keep refrigerated for best quality.\nAvertissement: potent. Avoid overuse and don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-diamonds":"Ce que c’est — cannabinoid “diamonds”, high‑purity crystals (very strong). Choose THC or CBD in the configuration.\nUtilisation — micro‑dose and increase only if needed, using proper equipment where legal.\nAvertissement: very high potency. Higher risk of anxiety, fast heartbeat, and heavy sedation. Don’t drive. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-gummies":"Ce que c’est — gummies (chewable candies) with selectable flavors and sizes (50g/100g).\nUtilisation — edibles can take 30–120 minutes to kick in. Start small and wait before taking more.\nAvertissement: easier to overconsume because onset is slow. Keep away from children (looks like candy). Adults 18+ only. Follow local law.","pdesc_edible-honey":"Ce que c’est — infused honey (THC where legal), 100ml.\nUtilisation — mix into drinks/recipes. Start with a small amount and wait for effects.\nAvertissement: psychoactive if THC. Do not drive after use; keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-butter":"Ce que c’est — infused “truffle butter” (THC where legal), 100g.\nUtilisation — for cooking/recipes; measure carefully to control dose.\nAvertissement: edibles can hit hard and last hours. Wait at least 2 hours before taking more. Adults 18+ only. Follow local law.","pdesc_edible-chocolate":"Ce que c’est — chocolate (milk/dark/white) in 50g/100g portions.\nUtilisation — start with a small piece; edibles may take longer to feel.\nAvertissement: keep away from children. If formula includes THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-gum":"Ce que c’est — chewing gum with CBD or THC (where legal), with selectable flavors.\nUtilisation — chew slowly. If THC, start with 1 piece and wait to gauge effect.\nAvertissement: THC is psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-lollipops":"Ce que c’est — THC lollipops (where legal) with selectable flavors.\nUtilisation — consume slowly and wait before repeating (edibles are delayed).\nAvertissement: looks like candy—high child risk. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_bev-soda":"Ce que c’est — infused soda (THC or CBD where legal) with selectable flavors.\nUtilisation — drink slowly. If THC, wait 30–120 minutes before more.\nAvertissement: do not mix with alcohol. If THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_bev-tea":"Ce que c’est — THC infused tea (where legal), selectable flavors.\nUtilisation — drink slowly; effects may be delayed.\nAvertissement: psychoactive. Don’t drive after use; avoid alcohol. Adults 18+ only. Follow local law.","pdesc_bev-lemonade":"Ce que c’est — THC infused lemonade (where legal), selectable size and ice.\nUtilisation — drink slowly; wait before taking more.\nAvertissement: psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_vape-thc":"Ce que c’est — THC vape (where legal) with selectable flavor and puff count (100/1000).\nUtilisation — start with 1–2 puffs, wait a few minutes, then decide if you need more.\nAvertissement: inhalation can irritate airways. Do not drive after use. Keep out of reach of minors. Adults 18+ only. Follow local law.","pdesc_acc-cap":"Ce que c’est — trucker-style cap (apparel).\nUtilisation — adjustable fit; clean gently.","pdesc_acc-grinder":"Ce que c’est — grinder for a more even grind.\nUtilisation — load, twist, and clean regularly.\nAvertissement: keep sharp parts away from children.","pdesc_acc-tips":"Ce que c’est — tips/mouthpieces for comfort and airflow.\nUtilisation — insert and replace when needed.","pdesc_acc-papers":"Ce que c’est — rolling papers.\nUtilisation — roll as desired; store dry.","pdesc_acc-roller":"Ce que c’est — rolling tool to help with consistent rolls.\nUtilisation — follow the tool’s guide; keep clean.","pdesc_acc-bong":"Ce que c’est — bong/water pipe accessory.\nUtilisation — fill to the correct water level and clean frequently.\nAvertissement: glass can break—handle with care. Use only where legal; do not drive after use.","age18":"+18","footer_company":"","footer_group":"Groupe JP. DIETERICH","privacy_title":"Politique de confidentialité","legal_model_note":"Document informatif (modèle). Ajustez avec votre avocat pour un usage réel.","privacy_li1":"Nous pouvons collecter des données de base pour le panier, le login (démo) et les préférences de langue.","privacy_li2":"Les données peuvent être stockées localement dans votre navigateur (localStorage) pour améliorer l’expérience.","privacy_li3":"Vous pouvez demander suppression/ajustements selon la législation applicable (LGPD).","privacy_li4":"Nous ne vendons pas vos données. Nous les utilisons uniquement pour opérer et améliorer le service.","terms_title":"Conditions d’utilisation","terms_li1":"En accédant à ce site, vous acceptez ces conditions et la législation applicable.","terms_li2":"Les informations ici sont à titre indicatif et peuvent changer sans préavis.","terms_li3":"L’usage abusif de la marque, la copie intégrale du contenu et le scraping abusif sont interdits.","terms_li4":"Les achats et paiements suivent les conditions affichées au checkout.","terms_li5":"En cas de doute, utilisez la page de contact.","cookies_title":"Politique de cookies","cookies_li1":"Ce site peut utiliser le stockage local/cookies pour conserver la langue et le panier.","cookies_li2":"Vous pouvez effacer les données du navigateur à tout moment pour supprimer les préférences.","cookies_li3":"Les outils d’analytics/marketing ne doivent être activés qu’avec consentement (si applicable).","lgpd_title":"LGPD (Droits de la personne)","lgpd_li1":"Vous pouvez demander : accès, correction, portabilité, retrait du consentement et suppression.","lgpd_li2":"Canal : privacidade@hempstore.com.br (remplacez par votre e-mail réel).","lgpd_li3":"La base légale et la rétention dépendent du type de donnée et des obligations réglementaires/fiscales.","institutional":"institutional","back_simple":"Retour","notice":"notice","notice_sub":"Contenu institutionnel. Les opérations et le portefeuille sont soumis aux lois et normes en vigueur.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"Hemp Oil Company est axée sur la qualité, la durabilité et le bien-être, en livrant des produits à base de cannabis au standard premium, avec soin à chaque étape.","hoc_btn_solutions":"Voir les solutions","hoc_btn_store":"Aller à la boutique (Hemp Store)","hoc_areas_title":"Domaines principaux","hoc_badge_rd":"R&D","hoc_card_rd_title":"Recherche & développement","hoc_card_rd_sub":"Cadre pour spécifications, stabilité, documentation et innovation.","hoc_badge_quality":"Qualité","hoc_card_quality_title":"Qualité et traçabilité","hoc_card_quality_sub":"Directives de chaîne de possession, contrôle par lot et cohérence.","hoc_badge_compliance":"Conformité","hoc_card_compliance_title":"Gouvernance et conformité","hoc_card_compliance_sub":"Politiques internes et conformité aux normes applicables (lorsque requis).","hoc_contact_title":"Contact B2B","hoc_contact_sub":"Contactez l’équipe commerciale/technique pour partenariats, distribution et développement de portefeuille.","label_email":"E-mail :","label_partnerships":"Partenariats :","hoc_quick_msg":"Message rapide","label_name":"Nom","label_message":"Message","send":"send","hoc_form_demo":"Formulaire démo. Demandez l’intégration d’un envoi réel.","sol_title":"Solutions (B2B)","sol_sub":"Modules pour qualité, documentation et supply chain, en conservant le style visuel de Hemp Store.","sol_btn_compliance":"R&D + Conformité","sol_deliver_title":"Ce que nous livrons","sol_badge_docs":"Docs","sol_docs_title":"Spécifications et documentation","sol_docs_sub":"Fiches techniques, exigences d’étiquetage, standards internes et cohérence.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain et partenaires","sol_scm_sub":"Sélection de fournisseurs, standardisation et traçabilité.","sol_badge_brand":"Marque","sol_brand_title":"Stratégie de portefeuille","sol_brand_sub":"Architecture des gammes et guides de distribution.","sol_integration_title":"Intégration avec Hemp Store","sol_integration_sub":"L’activité B2C se fait sur  (e-commerce). Hemp Oil Company structure la chaîne et la R&D.","sol_btn_store_products":"Voir les produits en boutique","comp_title":"R&D + Conformité","comp_sub":"Hub institutionnel pour standards internes, qualité et traçabilité, avec un langage clair et objectif.","comp_btn_talk":"Parler à l’équipe","comp_pillars":"Piliers","comp_badge_sop":"SOP","comp_sop_title":"Procédures et standards","comp_sop_sub":"Documentation orientée vers la cohérence et l’amélioration continue.","comp_badge_qa":"QA","comp_qa_title":"Contrôle qualité","comp_qa_sub":"Directives pour le contrôle par lot et les enregistrements.","comp_badge_legal":"Légal","comp_legal_title":"Conformité","comp_legal_sub":"Mise en conformité avec les normes applicables selon le périmètre/la réglementation.","Acessórios":"Accessoires","Bebida":"Boisson","Charutaria":"Cigares","Comestíveis":"Comestibles","Extração":"Extrait","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Huile","Óleo CBD Isolado":"Huile CBD Isolat","Óleo Full Spectrum":"Huile Spectre complet","Óleo CBG":"Huile CBG","Charutos San Juan":"Cigares San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds":"Diamonds","Gummies":"Gummies","Mel infusionado de THC":"Miel infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Chocolat","Chicletes CBD e THC":"Chewing-gums CBD e THC","Refrigerante infusionado (THC/CBD)":"Soda infusionado (THC/CBD)","Chá infusionado THC":"Thé infusionado THC","Limonada infusionada THC":"Limonade infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Huile CBD Pet","Petiscos mastigáveis CBD":"Friandises mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Baume tópico com chanvre/CBD","Shampoo calmante com cânhamo":"Shampooing calmante com chanvre","Canetas Hemp":"Stylos Hemp","Camisetas":"T-shirts","Bonés (estilo trucker)":"Casquettes (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Rouleur","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolat • 30ml (démo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Spectre complet • 30ml (démo)","CBG • Isolado • 30ml (demo)":"CBG • Isolat • 30ml (démo)","Configuração por peso e strain (demo)":"Configuration par poids et variété (démo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Cigarette pré-roulée • 01g • variété au choix (démo)","Extração (demo) • strain selecionável":"Extrait (démo) • variété au choix","Comestível (demo) • sabores • 50g / 100g":"Comestible (démo) • saveurs • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Comestible (démo) • THC (là où c’est autorisé) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Comestible (démo) • THC (là où c’est autorisé) • 100g","Comestível (demo) • CBD/THC • 100g":"Comestible (démo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Comestible (démo) • CBD/THC • unités","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Boisson • THC/CBD • 330ml / 500ml (démo, là où c’est autorisé)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Boisson • THC • 300ml / 500ml (démo, là où c’est autorisé)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Boisson • THC • 400ml / 700ml (démo, là où c’est autorisé)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 bouffées (démo, là où c’est autorisé)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (démo) • chanvre/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (démo) • snacks • unités","Pet (demo) • uso tópico":"Pet (démo) • usage topique","Pet (demo) • higiene":"Pet (démo) • hygiène","Acessório • escrita/coleção":"Accessoire • escrita/coleção","Acessório • apparel":"Accessoire • apparel","Acessório • boné":"Accessoire • boné","Acessório • diversos modelos":"Accessoire • diversos modelos","Acessório • enrolar":"Accessoire • enrolar","Acessório • papéis":"Accessoire • papéis","Acessório • tamanhos P / M / G":"Accessoire • tamanhos P / M / G","Acessório • vidro/acrílico":"Accessoire • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Variété au choix • 5g / 10g (démo, là où c’est autorisé)","Bolador (demo). Ajuda a manter consistência na montagem.":"Rouleur (démo). Aide à garder une consistance lors du roulage.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (démo). Utilisez en toute sécurité et entretenez la propreté.","Bonés trucker (demo). Leve e ventilado.":"Casquettes trucker (démo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Baume topique (démo). Option courante en gammes pet au chanvre — vérifiez la composition et testez sur une petite zone.","Camisetas (demo). Modelagem básica e minimalista.":"T-shirts (démo). Coupe basique et minimaliste.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Stylos Hemp (démo). Une touche de style au quotidien.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"Cigares San Juan (démo). Sélectionnez le poids et la variété. Là où c’est autorisé, l’expérience implique souvent arôme et rituel. Utilisez de manière responsable.","Chicletes (demo). Discretos e fáceis de dosar.":"Chewing-gums (démo). Discrets et faciles à doser.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Chocolat (démo). Une forme classique ; n’oubliez pas que l’absorption peut être plus lente.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"Thé infusé au THC (démo). Choisissez saveur et volume. Vérifiez toujours la légalité locale et consommez de manière responsable.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinders (démo). Une mouture uniforme améliore la cohérence et réduit le gaspillage.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extraits (démo). En général plus concentrés — commencez doucement et utilisez de manière responsable (selon la législation locale).","Gummies (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gummies (démo). Pratiques et discrets. Les comestibles peuvent agir plus lentement — allez-y doucement.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (démo). Pré-roulé de 01g avec sélection de variété. Privilégiez des environnements sûrs et de petites doses.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"Limonade infusée au THC (démo). Sélectionnez volume et glaçons. Vérifiez toujours la légalité locale et consommez de manière responsable.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Beurre truffé (démo). Idéal pour les recettes — le contrôle de dose est essentiel.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Miel infusé (démo). Parfait avec thés et recettes — attention au dosage.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"Friandises CBD (démo). Snacks à mâcher pour routine/entraînement. Vérifiez la conformité des ingrédients et l’étiquetage selon votre juridiction.","Piteiras (demo). Conforto e melhor fluxo.":"Embouts (démo). Plus de confort et meilleur tirage.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Soda infusé (démo). Sélectionnez cannabinoïde, volume et saveur. Vérifiez toujours la légalité locale et consommez de manière responsable.","Sedas (demo). Papéis clássicos e práticos.":"Papiers (démo). Classiques et pratiques.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Shampooing au chanvre (démo). Produit d’hygiène axé bien-être — choisissez des formules douces adaptées aux animaux.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"Vape THC (démo). Sélectionnez le nombre de bouffées et la saveur. Vérifiez toujours la légalité locale et utilisez de manière responsable.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"Huile CBD Isolat (démo). Axée sur un cannabinoïde principal, au profil plus neutre. Confirmez la légalité locale et utilisez de manière responsable.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"Huile CBD pour animaux (démo). Courante là où c’est autorisé ; évitez les allégations médicales et suivez les conseils vétérinaires.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"Huile CBG (démo). Généralement formulée avec du cannabigérol. Vérifiez l’étiquette et la conformité/légalité locale.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Huile Full Spectrum (démo). Contient généralement davantage de composés du chanvre (dont des terpènes), ce qui peut modifier l’arôme et l’expérience. Vérifiez l’étiquette et la conformité.","Isolado":"Isolat","THC (onde permitido)":"THC (là où c’est autorisé)","100 puxadas":"100 bouffées","1000 puxadas":"1000 bouffées","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Blanc","Branca":"Blanche","Preto":"Noir","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Verre","Acrílico":"Acrylique","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Noir","Ao leite":"Au lait","Camomila":"Camomille","Gengibre":"Gingembre","Hortelã":"Menthe","Menta":"Menta","Mint":"Mint","Morango":"Fraise","Melancia":"Pastèque","Uva":"Raisin","Laranja":"Orange","Limão":"Citron","Tangerina":"Mandarine","Manga":"Mangue","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"it":{"Charuto San Juan":"Sigaro San Juan","Charuto • unitário • (demo)":"Sigaro • singolo • (demo)","pdesc_oil-cbd":"Cos’è — CBD (cannabidiol) oil in a 30ml dropper, with selectable strength (mg/mL).\nCome funziona — CBD interacts with the endocannabinoid system; this is not a medical claim.\nCome usare — start low and increase slowly. Sublingual use is common: place under the tongue ~60s, then swallow.\nAvvertenza: may cause drowsiness, dry mouth, or mild stomach discomfort. If you take medicines (e.g., blood thinners) or are pregnant/breastfeeding, talk to a healthcare professional.","pdesc_oil-cbg":"Cos’è — CBG (cannabigerol) oil in a 30ml bottle, with selectable strength (mg/mL).\nCome funziona — CBG is a cannabinoid that some people include in wellness routines (no medical promises).\nCome usare — start with a low dose and adjust slowly. Sublingual use is common.\nAvvertenza: may cause drowsiness or mild discomfort. If you use other medicines, or are pregnant/breastfeeding, seek professional guidance.","pdesc_oil-thc":"Cos’è — THC oil in a 30ml bottle, with selectable strength (mg/mL).\nCome funziona — THC is psychoactive and can affect perception, coordination, and mood.\nCome usare — start very low and go slow. Wait long enough before repeating; effects can last for hours.\nAvvertenza: DO NOT drive or operate machines. Higher risk of anxiety, fast heartbeat, drowsiness, and impaired judgement. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_oil-full-spectrum":"Cos’è — Full‑spectrum hemp extract oil (30ml) with multiple plant compounds; it may contain THC.\nCome funziona — a broader cannabinoid/terpene profile can change aroma and experience (no medical promises).\nCome usare — start low and increase slowly. Sublingual use is common.\nAvvertenza: may be psychoactive and can affect drug tests. Do not drive if you feel altered. Adults 18+ only. Follow local law.","pdesc_strain-gorilla-glue":"Cos’è — cannabis flower/strain “Gorilla Glue”, with selectable weight (5g/10g).\nCome usare — store sealed, cool, and away from light to preserve aroma and humidity.\nAvvertenza: may be psychoactive and impair coordination. Avoid mixing with alcohol. Adults 18+ only. Follow local law.","pdesc_strain-purple-haze":"Cos’è — cannabis flower/strain “Purple Haze”, with selectable weight (5g/10g).\nCome usare — keep sealed to preserve freshness.\nAvvertenza: may cause psychoactive effects and sleepiness. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_strain-og-kush":"Cos’è — cannabis flower/strain “OG Kush”, with selectable weight (5g/10g).\nCome usare — store in an airtight jar, cool and dry.\nAvvertenza: can be intense for beginners. Start small, don’t drive, and avoid alcohol. Adults 18+ only. Follow local law.","pdesc_cigar-san-juan":"Cos’è — “San Juan” cigar (single unit), choose strain and size/weight (10g/15g/20g).\nCome usare — use in a ventilated area and with moderation.\nAvvertenza: smoking can irritate the airways. Avoid if you have lung/heart conditions. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_juanitos":"Cos’è — 1g pre‑roll with selectable strain.\nCome usare — take small puffs and wait a few minutes to gauge intensity.\nAvvertenza: may cause cough, drowsiness, and impaired coordination. Do not drive. Avoid alcohol. Adults 18+ only. Follow local law.","pdesc_extract-dry":"Cos’è — “Dry” (dry sift/kief) concentrate obtained by dry separation.\nCome usare — it’s more concentrated than flower: use tiny amounts and increase slowly.\nAvvertenza: higher potency increases the risk of overdoing it. Do not drive after use. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_extract-bubble-hash":"Cos’è — Bubble Hash (ice/water hash), concentrate made with ice-water filtration.\nCome usare — use small amounts; keep cool to preserve texture.\nAvvertenza: more potent than flower. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-rosin":"Cos’è — Rosin, a solventless concentrate extracted with heat and pressure.\nCome usare — micro‑doses only; use proper equipment where legal.\nAvvertenza: high potency; intense effects are possible. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-live-rosin":"Cos’è — Live Rosin made from fresh‑frozen material to preserve aroma.\nCome usare — micro‑doses with appropriate equipment; keep refrigerated for best quality.\nAvvertenza: potent. Avoid overuse and don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-diamonds":"Cos’è — cannabinoid “diamonds”, high‑purity crystals (very strong). Choose THC or CBD in the configuration.\nCome usare — micro‑dose and increase only if needed, using proper equipment where legal.\nAvvertenza: very high potency. Higher risk of anxiety, fast heartbeat, and heavy sedation. Don’t drive. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-gummies":"Cos’è — gummies (chewable candies) with selectable flavors and sizes (50g/100g).\nCome usare — edibles can take 30–120 minutes to kick in. Start small and wait before taking more.\nAvvertenza: easier to overconsume because onset is slow. Keep away from children (looks like candy). Adults 18+ only. Follow local law.","pdesc_edible-honey":"Cos’è — infused honey (THC where legal), 100ml.\nCome usare — mix into drinks/recipes. Start with a small amount and wait for effects.\nAvvertenza: psychoactive if THC. Do not drive after use; keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-butter":"Cos’è — infused “truffle butter” (THC where legal), 100g.\nCome usare — for cooking/recipes; measure carefully to control dose.\nAvvertenza: edibles can hit hard and last hours. Wait at least 2 hours before taking more. Adults 18+ only. Follow local law.","pdesc_edible-chocolate":"Cos’è — chocolate (milk/dark/white) in 50g/100g portions.\nCome usare — start with a small piece; edibles may take longer to feel.\nAvvertenza: keep away from children. If formula includes THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-gum":"Cos’è — chewing gum with CBD or THC (where legal), with selectable flavors.\nCome usare — chew slowly. If THC, start with 1 piece and wait to gauge effect.\nAvvertenza: THC is psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-lollipops":"Cos’è — THC lollipops (where legal) with selectable flavors.\nCome usare — consume slowly and wait before repeating (edibles are delayed).\nAvvertenza: looks like candy—high child risk. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_bev-soda":"Cos’è — infused soda (THC or CBD where legal) with selectable flavors.\nCome usare — drink slowly. If THC, wait 30–120 minutes before more.\nAvvertenza: do not mix with alcohol. If THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_bev-tea":"Cos’è — THC infused tea (where legal), selectable flavors.\nCome usare — drink slowly; effects may be delayed.\nAvvertenza: psychoactive. Don’t drive after use; avoid alcohol. Adults 18+ only. Follow local law.","pdesc_bev-lemonade":"Cos’è — THC infused lemonade (where legal), selectable size and ice.\nCome usare — drink slowly; wait before taking more.\nAvvertenza: psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_vape-thc":"Cos’è — THC vape (where legal) with selectable flavor and puff count (100/1000).\nCome usare — start with 1–2 puffs, wait a few minutes, then decide if you need more.\nAvvertenza: inhalation can irritate airways. Do not drive after use. Keep out of reach of minors. Adults 18+ only. Follow local law.","pdesc_acc-cap":"Cos’è — trucker-style cap (apparel).\nCome usare — adjustable fit; clean gently.","pdesc_acc-grinder":"Cos’è — grinder for a more even grind.\nCome usare — load, twist, and clean regularly.\nAvvertenza: keep sharp parts away from children.","pdesc_acc-tips":"Cos’è — tips/mouthpieces for comfort and airflow.\nCome usare — insert and replace when needed.","pdesc_acc-papers":"Cos’è — rolling papers.\nCome usare — roll as desired; store dry.","pdesc_acc-roller":"Cos’è — rolling tool to help with consistent rolls.\nCome usare — follow the tool’s guide; keep clean.","pdesc_acc-bong":"Cos’è — bong/water pipe accessory.\nCome usare — fill to the correct water level and clean frequently.\nAvvertenza: glass can break—handle with care. Use only where legal; do not drive after use.","age18":"+18","footer_company":"","footer_group":"Gruppo JP. DIETERICH","privacy_title":"Informativa sulla privacy","legal_model_note":"Documento informativo (modello). Adattalo con il tuo avvocato per uso reale.","privacy_li1":"Possiamo raccogliere dati di base per il carrello, il login (demo) e le preferenze di lingua.","privacy_li2":"I dati possono essere salvati localmente nel tuo browser (localStorage) per migliorare l’esperienza.","privacy_li3":"Puoi richiedere rimozione/aggiustamenti secondo la normativa applicabile (LGPD).","privacy_li4":"Non vendiamo i tuoi dati. Li usiamo solo per operare e migliorare il servizio.","terms_title":"Termini di utilizzo","terms_li1":"Accedendo a questo sito, accetti questi termini e la normativa applicabile.","terms_li2":"Le informazioni qui presenti sono informative e possono cambiare senza preavviso.","terms_li3":"È vietato l’uso improprio del marchio, la copia integrale dei contenuti e pratiche di scraping abusive.","terms_li4":"Acquisti e pagamenti seguono le condizioni mostrate nel checkout.","terms_li5":"In caso di dubbi, usa la pagina contatti.","cookies_title":"Informativa sui cookie","cookies_li1":"Questo sito può usare storage locale/cookie per mantenere lingua e carrello.","cookies_li2":"Puoi cancellare i dati del browser in qualsiasi momento per rimuovere preferenze.","cookies_li3":"Strumenti di analytics/marketing devono essere abilitati solo con consenso (se applicabile).","lgpd_title":"LGPD (Diritti dell’interessato)","lgpd_li1":"Puoi richiedere: accesso, correzione, portabilità, revoca del consenso e cancellazione.","lgpd_li2":"Canale: privacidade@hempstore.com.br (sostituisci con la tua email reale).","lgpd_li3":"Base giuridica e conservazione dipendono dal tipo di dato e da obblighi regolatori/fiscali.","institutional":"institutional","back_simple":"Indietro","notice":"notice","notice_sub":"Contenuto istituzionale. Operazioni e portafoglio sono soggetti a leggi e norme vigenti.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"Hemp Oil Company è focalizzata su qualità, sostenibilità e benessere, offrendo prodotti a base di cannabis di standard premium con cura in ogni fase.","hoc_btn_solutions":"Vedi soluzioni","hoc_btn_store":"Vai al negozio (Hemp Store)","hoc_areas_title":"Aree principali","hoc_badge_rd":"R&S","hoc_card_rd_title":"Ricerca e sviluppo","hoc_card_rd_sub":"Struttura per specifiche, stabilità, documentazione e innovazione.","hoc_badge_quality":"Qualità","hoc_card_quality_title":"Qualità e tracciabilità","hoc_card_quality_sub":"Linee guida su catena di custodia, controllo per lotto e coerenza.","hoc_badge_compliance":"Conformità","hoc_card_compliance_title":"Governance e conformità","hoc_card_compliance_sub":"Policy interne e conformità alle norme applicabili (quando richiesto).","hoc_contact_title":"Contatto B2B","hoc_contact_sub":"Contatta il team commerciale/tecnico per partnership, distribuzione e sviluppo del portafoglio.","label_email":"Email:","label_partnerships":"Partnership:","hoc_quick_msg":"Messaggio rapido","label_name":"Nome","label_message":"Messaggio","send":"send","hoc_form_demo":"Modulo demo. Richiedi integrazione di invio reale.","sol_title":"Soluzioni (B2B)","sol_sub":"Moduli per qualità, documentazione e supply chain, mantenendo lo stesso stile visivo di Hemp Store.","sol_btn_compliance":"R&S + Conformità","sol_deliver_title":"Cosa consegniamo","sol_badge_docs":"Docs","sol_docs_title":"Specifiche e documentazione","sol_docs_sub":"Schede tecniche, requisiti di etichettatura, standard interni e coerenza.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain e partner","sol_scm_sub":"Selezione fornitori, standardizzazione e tracciabilità.","sol_badge_brand":"Brand","sol_brand_title":"Strategia di portafoglio","sol_brand_sub":"Architettura delle linee e guide di distribuzione.","sol_integration_title":"Integrazione con Hemp Store","sol_integration_sub":"L’operatività B2C avviene su  (e-commerce). Hemp Oil Company struttura la catena e la R&S.","sol_btn_store_products":"Vedi prodotti in negozio","comp_title":"R&S + Conformità","comp_sub":"Hub istituzionale per standard interni, qualità e tracciabilità, con linguaggio chiaro e diretto.","comp_btn_talk":"Parla con il team","comp_pillars":"Pilastri","comp_badge_sop":"SOP","comp_sop_title":"Procedure e standard","comp_sop_sub":"Documentazione orientata a coerenza e miglioramento continuo.","comp_badge_qa":"QA","comp_qa_title":"Controllo qualità","comp_qa_sub":"Linee guida per controllo per lotto e registri.","comp_badge_legal":"Legale","comp_legal_title":"Conformità","comp_legal_sub":"Adeguamento alle norme applicabili secondo ambito/regolazione.","Acessórios":"Accessori","Bebida":"Bevanda","Charutaria":"Sigari","Comestíveis":"Commestibili","Extração":"Estrazione","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Olio","Óleo CBD Isolado":"Olio CBD Isolato","Óleo Full Spectrum":"Olio Spettro completo","Óleo CBG":"Olio CBG","Charutos San Juan":"Sigari San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds":"Diamonds","Gummies":"Gummies","Mel infusionado de THC":"Miele infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Cioccolato","Chicletes CBD e THC":"Gomme CBD e THC","Refrigerante infusionado (THC/CBD)":"Bibita infusionado (THC/CBD)","Chá infusionado THC":"Tè infusionado THC","Limonada infusionada THC":"Limonata infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Olio CBD Pet","Petiscos mastigáveis CBD":"Snack mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Balsamo tópico com canapa/CBD","Shampoo calmante com cânhamo":"Shampoo calmante com canapa","Canetas Hemp":"Penne Hemp","Camisetas":"T-shirt","Bonés (estilo trucker)":"Cappellini (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Rullatore","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolato • 30ml (demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Spettro completo • 30ml (demo)","CBG • Isolado • 30ml (demo)":"CBG • Isolato • 30ml (demo)","Configuração por peso e strain (demo)":"Configurazione per peso e strain (demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Sigaretta pre-rollata • 01g • strain selezionabile (demo)","Extração (demo) • strain selecionável":"Estrazione (demo) • strain selezionabile","Comestível (demo) • sabores • 50g / 100g":"Commestibile (demo) • gusti • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Commestibile (demo) • THC (dove consentito) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Commestibile (demo) • THC (dove consentito) • 100g","Comestível (demo) • CBD/THC • 100g":"Commestibile (demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Commestibile (demo) • CBD/THC • unità","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Bevanda • THC/CBD • 330ml / 500ml (demo, dove consentito)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Bevanda • THC • 300ml / 500ml (demo, dove consentito)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Bevanda • THC • 400ml / 700ml (demo, dove consentito)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 tiri (demo, dove consentito)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (demo) • canapa/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (demo) • snacks • unità","Pet (demo) • uso tópico":"Pet (demo) • uso topico","Pet (demo) • higiene":"Pet (demo) • igiene","Acessório • escrita/coleção":"Accessorio • escrita/coleção","Acessório • apparel":"Accessorio • apparel","Acessório • boné":"Accessorio • boné","Acessório • diversos modelos":"Accessorio • diversos modelos","Acessório • enrolar":"Accessorio • enrolar","Acessório • papéis":"Accessorio • papéis","Acessório • tamanhos P / M / G":"Accessorio • tamanhos P / M / G","Acessório • vidro/acrílico":"Accessorio • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Variatà selezionabile • 5g / 10g (demo, dove consentito)","Bolador (demo). Ajuda a manter consistência na montagem.":"Rullatore (demo). Aiuta a mantenere la consistenza nel rollaggio.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bong (demo). Usalo in sicurezza e cura la pulizia.","Bonés trucker (demo). Leve e ventilado.":"Cappellini trucker (demo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Balsamo topico (demo). Opzione comune nelle linee pet con canapa: controlla la composizione e fai una prova su una piccola area.","Camisetas (demo). Modelagem básica e minimalista.":"T-shirt (demo). Vestibilità base e minimalista.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Penne Hemp (demo). Un tocco di stile per tutti i giorni.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"Sigari San Juan (demo). Seleziona peso e strain. Dove consentito, l’esperienza include spesso aroma e rituale. Usalo in modo responsabile.","Chicletes (demo). Discretos e fáceis de dosar.":"Gomme (demo). Discrete e facili da dosare.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Cioccolato (demo). Un classico; ricorda che l’assorbimento può essere più lento.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"Tè infuso al THC (demo). Varia gusto e volume. Verifica sempre la legalità locale e consuma in modo responsabile.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinder (demo). Una macinatura uniforme aiuta la consistenza e riduce gli sprechi.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Estrazioni (demo). In genere più concentrate: inizia con poco e usale in modo responsabile (secondo la normativa locale).","Gummies (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gommose (demo). Pratiche e discrete. I commestibili possono impiegare più tempo a fare effetto: vai con calma.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (demo). Pre-rollato da 01g con selezione di strain. Preferisci ambienti sicuri e dosi più piccole.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"Limonata infusa al THC (demo). Seleziona volume e ghiaccio. Verifica sempre la legalità locale e consuma in modo responsabile.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Burro tartufato (demo). Ideale per ricette: il controllo della dose è essenziale.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Miele infuso (demo). Perfetto con tè e ricette: attenzione alla dose.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"Snack CBD (demo). Snack masticabili per routine/allenamento. Verifica ingredienti ed etichettatura secondo la tua giurisdizione.","Piteiras (demo). Conforto e melhor fluxo.":"Filtri (demo). Più comfort e miglior flusso.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Bibita infusa (demo). Seleziona cannabinoide, volume e gusto. Verifica sempre la legalità locale e consuma in modo responsabile.","Sedas (demo). Papéis clássicos e práticos.":"Cartine (demo). Classiche e pratiche.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Shampoo alla canapa (demo). Prodotto per l’igiene con focus benessere: scegli formule delicate adatte agli animali.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"Vape THC (demo). Seleziona numero di tiri e gusto. Verifica sempre la legalità locale e usalo in modo responsabile.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"Olio CBD Isolato (demo). Punta su un singolo cannabinoide, con un profilo più neutro. Conferma la legalità locale e usalo in modo responsabile.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"Olio CBD per animali (demo). Comune dove consentito; evita affermazioni mediche e segui le indicazioni veterinarie.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"Olio CBG (demo). Di solito formulato con cannabigerolo. Controlla etichetta e conformità/legalità locale.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Olio Full Spectrum (demo). Di solito include più composti della canapa (anche terpeni), che possono cambiare aroma ed esperienza. Controlla etichetta e conformità.","Isolado":"Isolato","THC (onde permitido)":"THC (dove consentito)","100 puxadas":"100 tiri","1000 puxadas":"1000 tiri","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Bianco","Branca":"Bianca","Preto":"Nero","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Vetro","Acrílico":"Acrilico","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Fondente","Ao leite":"Al latte","Camomila":"Camomilla","Gengibre":"Zenzero","Hortelã":"Menta","Menta":"Menta","Mint":"Mint","Morango":"Fragola","Melancia":"Anguria","Uva":"Uva","Laranja":"Arancia","Limão":"Limone","Tangerina":"Mandarino","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"de":{"Charuto San Juan":"San Juan Zigarre","Charuto • unitário • (demo)":"Zigarre • einzeln • (Demo)","pdesc_oil-cbd":"Was es ist — CBD (cannabidiol) oil in a 30ml dropper, with selectable strength (mg/mL).\nWie es wirkt — CBD interacts with the endocannabinoid system; this is not a medical claim.\nAnwendung — start low and increase slowly. Sublingual use is common: place under the tongue ~60s, then swallow.\nWarnhinweis: may cause drowsiness, dry mouth, or mild stomach discomfort. If you take medicines (e.g., blood thinners) or are pregnant/breastfeeding, talk to a healthcare professional.","pdesc_oil-cbg":"Was es ist — CBG (cannabigerol) oil in a 30ml bottle, with selectable strength (mg/mL).\nWie es wirkt — CBG is a cannabinoid that some people include in wellness routines (no medical promises).\nAnwendung — start with a low dose and adjust slowly. Sublingual use is common.\nWarnhinweis: may cause drowsiness or mild discomfort. If you use other medicines, or are pregnant/breastfeeding, seek professional guidance.","pdesc_oil-thc":"Was es ist — THC oil in a 30ml bottle, with selectable strength (mg/mL).\nWie es wirkt — THC is psychoactive and can affect perception, coordination, and mood.\nAnwendung — start very low and go slow. Wait long enough before repeating; effects can last for hours.\nWarnhinweis: DO NOT drive or operate machines. Higher risk of anxiety, fast heartbeat, drowsiness, and impaired judgement. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_oil-full-spectrum":"Was es ist — Full‑spectrum hemp extract oil (30ml) with multiple plant compounds; it may contain THC.\nWie es wirkt — a broader cannabinoid/terpene profile can change aroma and experience (no medical promises).\nAnwendung — start low and increase slowly. Sublingual use is common.\nWarnhinweis: may be psychoactive and can affect drug tests. Do not drive if you feel altered. Adults 18+ only. Follow local law.","pdesc_strain-gorilla-glue":"Was es ist — cannabis flower/strain “Gorilla Glue”, with selectable weight (5g/10g).\nAnwendung — store sealed, cool, and away from light to preserve aroma and humidity.\nWarnhinweis: may be psychoactive and impair coordination. Avoid mixing with alcohol. Adults 18+ only. Follow local law.","pdesc_strain-purple-haze":"Was es ist — cannabis flower/strain “Purple Haze”, with selectable weight (5g/10g).\nAnwendung — keep sealed to preserve freshness.\nWarnhinweis: may cause psychoactive effects and sleepiness. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_strain-og-kush":"Was es ist — cannabis flower/strain “OG Kush”, with selectable weight (5g/10g).\nAnwendung — store in an airtight jar, cool and dry.\nWarnhinweis: can be intense for beginners. Start small, don’t drive, and avoid alcohol. Adults 18+ only. Follow local law.","pdesc_cigar-san-juan":"Was es ist — “San Juan” cigar (single unit), choose strain and size/weight (10g/15g/20g).\nAnwendung — use in a ventilated area and with moderation.\nWarnhinweis: smoking can irritate the airways. Avoid if you have lung/heart conditions. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_juanitos":"Was es ist — 1g pre‑roll with selectable strain.\nAnwendung — take small puffs and wait a few minutes to gauge intensity.\nWarnhinweis: may cause cough, drowsiness, and impaired coordination. Do not drive. Avoid alcohol. Adults 18+ only. Follow local law.","pdesc_extract-dry":"Was es ist — “Dry” (dry sift/kief) concentrate obtained by dry separation.\nAnwendung — it’s more concentrated than flower: use tiny amounts and increase slowly.\nWarnhinweis: higher potency increases the risk of overdoing it. Do not drive after use. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_extract-bubble-hash":"Was es ist — Bubble Hash (ice/water hash), concentrate made with ice-water filtration.\nAnwendung — use small amounts; keep cool to preserve texture.\nWarnhinweis: more potent than flower. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-rosin":"Was es ist — Rosin, a solventless concentrate extracted with heat and pressure.\nAnwendung — micro‑doses only; use proper equipment where legal.\nWarnhinweis: high potency; intense effects are possible. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-live-rosin":"Was es ist — Live Rosin made from fresh‑frozen material to preserve aroma.\nAnwendung — micro‑doses with appropriate equipment; keep refrigerated for best quality.\nWarnhinweis: potent. Avoid overuse and don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-diamonds":"Was es ist — cannabinoid “diamonds”, high‑purity crystals (very strong). Choose THC or CBD in the configuration.\nAnwendung — micro‑dose and increase only if needed, using proper equipment where legal.\nWarnhinweis: very high potency. Higher risk of anxiety, fast heartbeat, and heavy sedation. Don’t drive. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-gummies":"Was es ist — gummies (chewable candies) with selectable flavors and sizes (50g/100g).\nAnwendung — edibles can take 30–120 minutes to kick in. Start small and wait before taking more.\nWarnhinweis: easier to overconsume because onset is slow. Keep away from children (looks like candy). Adults 18+ only. Follow local law.","pdesc_edible-honey":"Was es ist — infused honey (THC where legal), 100ml.\nAnwendung — mix into drinks/recipes. Start with a small amount and wait for effects.\nWarnhinweis: psychoactive if THC. Do not drive after use; keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-butter":"Was es ist — infused “truffle butter” (THC where legal), 100g.\nAnwendung — for cooking/recipes; measure carefully to control dose.\nWarnhinweis: edibles can hit hard and last hours. Wait at least 2 hours before taking more. Adults 18+ only. Follow local law.","pdesc_edible-chocolate":"Was es ist — chocolate (milk/dark/white) in 50g/100g portions.\nAnwendung — start with a small piece; edibles may take longer to feel.\nWarnhinweis: keep away from children. If formula includes THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-gum":"Was es ist — chewing gum with CBD or THC (where legal), with selectable flavors.\nAnwendung — chew slowly. If THC, start with 1 piece and wait to gauge effect.\nWarnhinweis: THC is psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-lollipops":"Was es ist — THC lollipops (where legal) with selectable flavors.\nAnwendung — consume slowly and wait before repeating (edibles are delayed).\nWarnhinweis: looks like candy—high child risk. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_bev-soda":"Was es ist — infused soda (THC or CBD where legal) with selectable flavors.\nAnwendung — drink slowly. If THC, wait 30–120 minutes before more.\nWarnhinweis: do not mix with alcohol. If THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_bev-tea":"Was es ist — THC infused tea (where legal), selectable flavors.\nAnwendung — drink slowly; effects may be delayed.\nWarnhinweis: psychoactive. Don’t drive after use; avoid alcohol. Adults 18+ only. Follow local law.","pdesc_bev-lemonade":"Was es ist — THC infused lemonade (where legal), selectable size and ice.\nAnwendung — drink slowly; wait before taking more.\nWarnhinweis: psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_vape-thc":"Was es ist — THC vape (where legal) with selectable flavor and puff count (100/1000).\nAnwendung — start with 1–2 puffs, wait a few minutes, then decide if you need more.\nWarnhinweis: inhalation can irritate airways. Do not drive after use. Keep out of reach of minors. Adults 18+ only. Follow local law.","pdesc_acc-cap":"Was es ist — trucker-style cap (apparel).\nAnwendung — adjustable fit; clean gently.","pdesc_acc-grinder":"Was es ist — grinder for a more even grind.\nAnwendung — load, twist, and clean regularly.\nWarnhinweis: keep sharp parts away from children.","pdesc_acc-tips":"Was es ist — tips/mouthpieces for comfort and airflow.\nAnwendung — insert and replace when needed.","pdesc_acc-papers":"Was es ist — rolling papers.\nAnwendung — roll as desired; store dry.","pdesc_acc-roller":"Was es ist — rolling tool to help with consistent rolls.\nAnwendung — follow the tool’s guide; keep clean.","pdesc_acc-bong":"Was es ist — bong/water pipe accessory.\nAnwendung — fill to the correct water level and clean frequently.\nWarnhinweis: glass can break—handle with care. Use only where legal; do not drive after use.","age18":"+18","footer_company":"","footer_group":"Gruppe JP. DIETERICH","privacy_title":"Datenschutzerklärung","legal_model_note":"Informationsdokument (Vorlage). Für den realen Einsatz mit Ihrem Anwalt anpassen.","privacy_li1":"Wir können Basisdaten für Warenkorb, Login (Demo) und Spracheinstellungen erfassen.","privacy_li2":"Daten können lokal in Ihrem Browser (localStorage) gespeichert werden, um das Erlebnis zu verbessern.","privacy_li3":"Sie können Löschung/Anpassungen gemäß geltendem Recht (LGPD) anfordern.","privacy_li4":"Wir verkaufen Ihre Daten nicht. Wir nutzen sie nur für Betrieb und Verbesserung des Dienstes.","terms_title":"Nutzungsbedingungen","terms_li1":"Mit dem Zugriff auf diese Website stimmen Sie diesen Bedingungen und dem geltenden Recht zu.","terms_li2":"Die Informationen hier dienen der Orientierung und können ohne Vorankündigung geändert werden.","terms_li3":"Missbräuchliche Markennutzung, vollständiges Kopieren von Inhalten und exzessives Scraping sind verboten.","terms_li4":"Käufe und Zahlungen folgen den im Checkout angezeigten Bedingungen.","terms_li5":"Bei Fragen nutzen Sie bitte die Kontaktseite.","cookies_title":"Cookie-Richtlinie","cookies_li1":"Diese Website kann lokalen Speicher/Cookies verwenden, um Sprache und Warenkorb zu speichern.","cookies_li2":"Sie können Browserdaten jederzeit löschen, um Einstellungen zu entfernen.","cookies_li3":"Analytics-/Marketing-Tools sollten nur mit Einwilligung aktiviert werden (falls zutreffend).","lgpd_title":"LGPD (Betroffenenrechte)","lgpd_li1":"Sie können anfordern: Auskunft, Berichtigung, Datenübertragbarkeit, Widerruf der Einwilligung und Löschung.","lgpd_li2":"Kanal: privacidade@hempstore.com.br (ersetzen Sie dies durch Ihre echte E-Mail).","lgpd_li3":"Rechtsgrundlage und Aufbewahrung hängen von Datentyp sowie regulatorischen/steuerlichen Pflichten ab.","institutional":"institutional","back_simple":"Zurück","notice":"notice","notice_sub":"Institutioneller Inhalt. Betrieb und Portfolio unterliegen den geltenden Gesetzen und Normen.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"Hemp Oil Company steht für Qualität, Nachhaltigkeit und Wohlbefinden und liefert cannabisbasierte Premiumprodukte mit Sorgfalt in jeder Phase.","hoc_btn_solutions":"Lösungen ansehen","hoc_btn_store":"Zum Shop (Hemp Store)","hoc_areas_title":"Hauptbereiche","hoc_badge_rd":"F&E","hoc_card_rd_title":"Forschung & Entwicklung","hoc_card_rd_sub":"Rahmen für Spezifikationen, Stabilität, Dokumentation und Innovation.","hoc_badge_quality":"Qualität","hoc_card_quality_title":"Qualität & Rückverfolgbarkeit","hoc_card_quality_sub":"Leitlinien zu Chain of Custody, Chargenkontrolle und Konsistenz.","hoc_badge_compliance":"Compliance","hoc_card_compliance_title":"Governance & Compliance","hoc_card_compliance_sub":"Interne Richtlinien und Einhaltung anwendbarer Normen (wenn erforderlich).","hoc_contact_title":"B2B-Kontakt","hoc_contact_sub":"Sprechen Sie mit dem Vertriebs-/Technikteam über Partnerschaften, Distribution und Portfolioentwicklung.","label_email":"E-Mail:","label_partnerships":"Partnerschaften:","hoc_quick_msg":"Kurznachricht","label_name":"Name","label_message":"Nachricht","send":"send","hoc_form_demo":"Demo-Formular. Fordern Sie eine echte Versand-Integration an.","sol_title":"Lösungen (B2B)","sol_sub":"Module für Qualität, Dokumentation und Lieferkette – im gleichen visuellen Stil der Hemp Store.","sol_btn_compliance":"F&E + Compliance","sol_deliver_title":"Was wir liefern","sol_badge_docs":"Docs","sol_docs_title":"Spezifikationen & Dokumentation","sol_docs_sub":"Datenblätter, Kennzeichnungsanforderungen, interne Standards und Konsistenz.","sol_badge_scm":"SCM","sol_scm_title":"Supply Chain & Partner","sol_scm_sub":"Lieferantenauswahl, Standardisierung und Rückverfolgbarkeit.","sol_badge_brand":"Brand","sol_brand_title":"Portfoliostrategie","sol_brand_sub":"Linienarchitektur und Distributionsleitfäden.","sol_integration_title":"Integration mit Hemp Store","sol_integration_sub":"Der B2C-Betrieb findet in der  (E-Commerce) statt. Die Hemp Oil Company strukturiert Lieferkette und F&E.","sol_btn_store_products":"Produkte im Shop ansehen","comp_title":"F&E + Compliance","comp_sub":"Institutioneller Hub für interne Standards, Qualität und Rückverfolgbarkeit – klar und objektiv formuliert.","comp_btn_talk":"Mit dem Team sprechen","comp_pillars":"Säulen","comp_badge_sop":"SOP","comp_sop_title":"Verfahren und Standards","comp_sop_sub":"Dokumentation mit Fokus auf Konsistenz und kontinuierliche Verbesserung.","comp_badge_qa":"QA","comp_qa_title":"Qualitätskontrolle","comp_qa_sub":"Richtlinien für Chargenkontrolle und Aufzeichnungen.","comp_badge_legal":"Rechtliches","comp_legal_title":"Konformität","comp_legal_sub":"Einhaltung der anwendbaren Normen je nach Umfang/Regulierung.","Acessórios":"Zubehör","Bebida":"Getränk","Charutaria":"Zigarren","Comestíveis":"Edibles","Extração":"Extrakt","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Öl","Óleo CBD Isolado":"Öl CBD Isolat","Óleo Full Spectrum":"Öl Vollspektrum","Óleo CBG":"Öl CBG","Charutos San Juan":"Zigarren San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds":"Diamonds","Gummies":"Gummies","Mel infusionado de THC":"Honig infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Schokolade","Chicletes CBD e THC":"Kaugummis CBD e THC","Refrigerante infusionado (THC/CBD)":"Limo infusionado (THC/CBD)","Chá infusionado THC":"Tee infusionado THC","Limonada infusionada THC":"Limonade infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Öl CBD Pet","Petiscos mastigáveis CBD":"Snacks mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Balsam tópico com Hanf/CBD","Shampoo calmante com cânhamo":"Shampoo calmante com Hanf","Canetas Hemp":"Stifte Hemp","Camisetas":"T-Shirts","Bonés (estilo trucker)":"Caps (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Roller","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolat • 30ml (Demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Vollspektrum • 30ml (Demo)","CBG • Isolado • 30ml (demo)":"CBG • Isolat • 30ml (Demo)","Configuração por peso e strain (demo)":"Konfiguration nach Gewicht und Strain (Demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Vorgerollte Zigarette • 01g • Strain wählbar (Demo)","Extração (demo) • strain selecionável":"Extrakt (Demo) • Strain wählbar","Comestível (demo) • sabores • 50g / 100g":"Edible (Demo) • Geschmacksrichtungen • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Edible (Demo) • THC (wo erlaubt) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Edible (Demo) • THC (wo erlaubt) • 100g","Comestível (demo) • CBD/THC • 100g":"Edible (Demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Edible (Demo) • CBD/THC • Einheiten","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Getränk • THC/CBD • 330ml / 500ml (Demo, wo erlaubt)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Getränk • THC • 300ml / 500ml (Demo, wo erlaubt)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Getränk • THC • 400ml / 700ml (Demo, wo erlaubt)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 Züge (Demo, wo erlaubt)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (Demo) • Hanf/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (Demo) • snacks • Einheiten","Pet (demo) • uso tópico":"Pet (Demo) • topische Anwendung","Pet (demo) • higiene":"Pet (Demo) • Hygiene","Acessório • escrita/coleção":"Zubehör • escrita/coleção","Acessório • apparel":"Zubehör • apparel","Acessório • boné":"Zubehör • boné","Acessório • diversos modelos":"Zubehör • diversos modelos","Acessório • enrolar":"Zubehör • enrolar","Acessório • papéis":"Zubehör • papéis","Acessório • tamanhos P / M / G":"Zubehör • tamanhos P / M / G","Acessório • vidro/acrílico":"Zubehör • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Variante wählbar • 5g / 10g (Demo, wo erlaubt)","Bolador (demo). Ajuda a manter consistência na montagem.":"Roller (Demo). Hilft, beim Drehen eine gleichmäßige Konsistenz zu erreichen.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (Demo). Sicher verwenden und auf Sauberkeit achten.","Bonés trucker (demo). Leve e ventilado.":"Caps trucker (Demo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Topischer Balsam (Demo). Gängige Option in Pet-Linien mit Hanf — Zusammensetzung prüfen und an kleiner Stelle testen.","Camisetas (demo). Modelagem básica e minimalista.":"T-Shirts (Demo). Basic- und minimalistischer Schnitt.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hemp-Stifte (Demo). Ein Hauch Stil für den Alltag.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San-Juan-Zigarren (Demo). Gewicht und Strain wählen. Wo erlaubt, geht es oft um Aroma und Ritual. Verantwortungsvoll verwenden.","Chicletes (demo). Discretos e fáceis de dosar.":"Kaugummis (Demo). Diskret und leicht zu dosieren.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Schokolade (Demo). Eine klassische Form; bedenken Sie, dass die Aufnahme langsamer sein kann.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infundierter Tee (Demo). Geschmack und Menge wählen. Lokale Rechtslage prüfen und verantwortungsvoll konsumieren.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinder (Demo). Gleichmäßiges Mahlen verbessert die Konsistenz und reduziert Verschwendung.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extrakte (Demo). In der Regel konzentrierter – niedrig dosieren und verantwortungsvoll verwenden (gemäß lokaler Gesetzgebung).","Gummies (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gummis (Demo). Praktisch und diskret. Edibles wirken oft später – langsam angehen.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (Demo). 01g vorgerollt mit Strain-Auswahl. Bevorzugen Sie sichere Umgebungen und kleinere Dosen.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infundierte Limonade (Demo). Menge und Eis wählen. Lokale Rechtslage prüfen und verantwortungsvoll konsumieren.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Trüffelbutter (Demo). Ideal für Rezepte – Dosiskontrolle ist entscheidend.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Infundierter Honig (Demo). Passt zu Tee und Rezepten – achten Sie auf die Dosierung.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBD-Snacks (Demo). Kaubare Snacks für Routine/Training. Zutaten und Kennzeichnung gemäß Ihrer Rechtsordnung prüfen.","Piteiras (demo). Conforto e melhor fluxo.":"Mundstücke (Demo). Mehr Komfort und besserer Zug.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Infundierte Limo (Demo). Cannabinoid, Menge und Geschmack wählen. Lokale Rechtslage prüfen und verantwortungsvoll konsumieren.","Sedas (demo). Papéis clássicos e práticos.":"Papers (Demo). Klassisch und praktisch.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Hanf-Shampoo (Demo). Hygieneprodukt mit Wellness-Fokus – milde, für Haustiere geeignete Formeln wählen.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THC-Vape (Demo). Anzahl der Züge und Geschmack wählen. Lokale Rechtslage prüfen und verantwortungsvoll verwenden.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBD-Isolat-Öl (Demo). Fokussiert auf ein Hauptcannabinoid, mit neutralerem Profil. Lokale Rechtslage prüfen und verantwortungsvoll verwenden.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"CBD-Öl für Haustiere (Demo). Häufig dort, wo erlaubt; vermeiden Sie medizinische Aussagen und folgen Sie tierärztlicher Empfehlung.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBG-Öl (Demo). Meist mit Cannabigerol formuliert. Etikett und Konformität/Rechtslage prüfen.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Vollspektrum-Öl (Demo). Enthält meist mehr Hanfstoffe (inkl. Terpene), was Aroma und Erlebnis verändern kann. Etikett und Konformität prüfen.","Isolado":"Isolat","THC (onde permitido)":"THC (wo erlaubt)","100 puxadas":"100 Züge","1000 puxadas":"1000 Züge","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Weiß","Branca":"Weiß","Preto":"Schwarz","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Glas","Acrílico":"Acryl","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Bitter","Ao leite":"Vollmilch","Camomila":"Kamille","Gengibre":"Ingwer","Hortelã":"Minze","Menta":"Menta","Mint":"Mint","Morango":"Erdbeere","Melancia":"Wassermelone","Uva":"Traube","Laranja":"Orange","Limão":"Zitrone","Tangerina":"Mandarine","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"ja":{"Charuto San Juan":"San Juan シガー","Charuto • unitário • (demo)":"シガー・単品（デモ）","pdesc_oil-cbd":"概要 — CBD (cannabidiol) oil in a 30ml dropper, with selectable strength (mg/mL).\nしくみ — CBD interacts with the endocannabinoid system; this is not a medical claim.\n使い方 — start low and increase slowly. Sublingual use is common: place under the tongue ~60s, then swallow.\n注意: may cause drowsiness, dry mouth, or mild stomach discomfort. If you take medicines (e.g., blood thinners) or are pregnant/breastfeeding, talk to a healthcare professional.","pdesc_oil-cbg":"概要 — CBG (cannabigerol) oil in a 30ml bottle, with selectable strength (mg/mL).\nしくみ — CBG is a cannabinoid that some people include in wellness routines (no medical promises).\n使い方 — start with a low dose and adjust slowly. Sublingual use is common.\n注意: may cause drowsiness or mild discomfort. If you use other medicines, or are pregnant/breastfeeding, seek professional guidance.","pdesc_oil-thc":"概要 — THC oil in a 30ml bottle, with selectable strength (mg/mL).\nしくみ — THC is psychoactive and can affect perception, coordination, and mood.\n使い方 — start very low and go slow. Wait long enough before repeating; effects can last for hours.\n注意: DO NOT drive or operate machines. Higher risk of anxiety, fast heartbeat, drowsiness, and impaired judgement. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_oil-full-spectrum":"概要 — Full‑spectrum hemp extract oil (30ml) with multiple plant compounds; it may contain THC.\nしくみ — a broader cannabinoid/terpene profile can change aroma and experience (no medical promises).\n使い方 — start low and increase slowly. Sublingual use is common.\n注意: may be psychoactive and can affect drug tests. Do not drive if you feel altered. Adults 18+ only. Follow local law.","pdesc_strain-gorilla-glue":"概要 — cannabis flower/strain “Gorilla Glue”, with selectable weight (5g/10g).\n使い方 — store sealed, cool, and away from light to preserve aroma and humidity.\n注意: may be psychoactive and impair coordination. Avoid mixing with alcohol. Adults 18+ only. Follow local law.","pdesc_strain-purple-haze":"概要 — cannabis flower/strain “Purple Haze”, with selectable weight (5g/10g).\n使い方 — keep sealed to preserve freshness.\n注意: may cause psychoactive effects and sleepiness. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_strain-og-kush":"概要 — cannabis flower/strain “OG Kush”, with selectable weight (5g/10g).\n使い方 — store in an airtight jar, cool and dry.\n注意: can be intense for beginners. Start small, don’t drive, and avoid alcohol. Adults 18+ only. Follow local law.","pdesc_cigar-san-juan":"概要 — “San Juan” cigar (single unit), choose strain and size/weight (10g/15g/20g).\n使い方 — use in a ventilated area and with moderation.\n注意: smoking can irritate the airways. Avoid if you have lung/heart conditions. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_juanitos":"概要 — 1g pre‑roll with selectable strain.\n使い方 — take small puffs and wait a few minutes to gauge intensity.\n注意: may cause cough, drowsiness, and impaired coordination. Do not drive. Avoid alcohol. Adults 18+ only. Follow local law.","pdesc_extract-dry":"概要 — “Dry” (dry sift/kief) concentrate obtained by dry separation.\n使い方 — it’s more concentrated than flower: use tiny amounts and increase slowly.\n注意: higher potency increases the risk of overdoing it. Do not drive after use. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_extract-bubble-hash":"概要 — Bubble Hash (ice/water hash), concentrate made with ice-water filtration.\n使い方 — use small amounts; keep cool to preserve texture.\n注意: more potent than flower. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-rosin":"概要 — Rosin, a solventless concentrate extracted with heat and pressure.\n使い方 — micro‑doses only; use proper equipment where legal.\n注意: high potency; intense effects are possible. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-live-rosin":"概要 — Live Rosin made from fresh‑frozen material to preserve aroma.\n使い方 — micro‑doses with appropriate equipment; keep refrigerated for best quality.\n注意: potent. Avoid overuse and don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-diamonds":"概要 — cannabinoid “diamonds”, high‑purity crystals (very strong). Choose THC or CBD in the configuration.\n使い方 — micro‑dose and increase only if needed, using proper equipment where legal.\n注意: very high potency. Higher risk of anxiety, fast heartbeat, and heavy sedation. Don’t drive. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-gummies":"概要 — gummies (chewable candies) with selectable flavors and sizes (50g/100g).\n使い方 — edibles can take 30–120 minutes to kick in. Start small and wait before taking more.\n注意: easier to overconsume because onset is slow. Keep away from children (looks like candy). Adults 18+ only. Follow local law.","pdesc_edible-honey":"概要 — infused honey (THC where legal), 100ml.\n使い方 — mix into drinks/recipes. Start with a small amount and wait for effects.\n注意: psychoactive if THC. Do not drive after use; keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-butter":"概要 — infused “truffle butter” (THC where legal), 100g.\n使い方 — for cooking/recipes; measure carefully to control dose.\n注意: edibles can hit hard and last hours. Wait at least 2 hours before taking more. Adults 18+ only. Follow local law.","pdesc_edible-chocolate":"概要 — chocolate (milk/dark/white) in 50g/100g portions.\n使い方 — start with a small piece; edibles may take longer to feel.\n注意: keep away from children. If formula includes THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-gum":"概要 — chewing gum with CBD or THC (where legal), with selectable flavors.\n使い方 — chew slowly. If THC, start with 1 piece and wait to gauge effect.\n注意: THC is psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-lollipops":"概要 — THC lollipops (where legal) with selectable flavors.\n使い方 — consume slowly and wait before repeating (edibles are delayed).\n注意: looks like candy—high child risk. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_bev-soda":"概要 — infused soda (THC or CBD where legal) with selectable flavors.\n使い方 — drink slowly. If THC, wait 30–120 minutes before more.\n注意: do not mix with alcohol. If THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_bev-tea":"概要 — THC infused tea (where legal), selectable flavors.\n使い方 — drink slowly; effects may be delayed.\n注意: psychoactive. Don’t drive after use; avoid alcohol. Adults 18+ only. Follow local law.","pdesc_bev-lemonade":"概要 — THC infused lemonade (where legal), selectable size and ice.\n使い方 — drink slowly; wait before taking more.\n注意: psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_vape-thc":"概要 — THC vape (where legal) with selectable flavor and puff count (100/1000).\n使い方 — start with 1–2 puffs, wait a few minutes, then decide if you need more.\n注意: inhalation can irritate airways. Do not drive after use. Keep out of reach of minors. Adults 18+ only. Follow local law.","pdesc_acc-cap":"概要 — trucker-style cap (apparel).\n使い方 — adjustable fit; clean gently.","pdesc_acc-grinder":"概要 — grinder for a more even grind.\n使い方 — load, twist, and clean regularly.\n注意: keep sharp parts away from children.","pdesc_acc-tips":"概要 — tips/mouthpieces for comfort and airflow.\n使い方 — insert and replace when needed.","pdesc_acc-papers":"概要 — rolling papers.\n使い方 — roll as desired; store dry.","pdesc_acc-roller":"概要 — rolling tool to help with consistent rolls.\n使い方 — follow the tool’s guide; keep clean.","pdesc_acc-bong":"概要 — bong/water pipe accessory.\n使い方 — fill to the correct water level and clean frequently.\n注意: glass can break—handle with care. Use only where legal; do not drive after use.","age18":"18+","footer_company":"","footer_group":"JP. DIETERICH グループ","privacy_title":"プライバシーポリシー","legal_model_note":"参考用ドキュメント（テンプレート）。実運用は弁護士と調整してください。","privacy_li1":"カート、ログイン（デモ）、言語設定のために基本情報を取得する場合があります。","privacy_li2":"体験向上のため、データはブラウザ（localStorage）にローカル保存される場合があります。","privacy_li3":"適用法（LGPD）に基づき削除／修正を依頼できます。","privacy_li4":"データを販売しません。運用と改善のためにのみ使用します。","terms_title":"利用規約","terms_li1":"本サイトにアクセスすると、これらの条件および適用法令に同意したものとみなされます。","terms_li2":"掲載情報は参考であり、予告なく変更される場合があります。","terms_li3":"ブランドの不正使用、内容の無断複製、過度なスクレイピングは禁止です。","terms_li4":"購入と支払いはチェックアウトに表示される条件に従います。","terms_li5":"不明点はお問い合わせページをご利用ください。","cookies_title":"Cookieポリシー","cookies_li1":"本サイトは言語とカート保持のためにローカルストレージ／Cookieを使用する場合があります。","cookies_li2":"ブラウザのデータをいつでも削除して設定をリセットできます。","cookies_li3":"分析／マーケティングツールは同意がある場合のみ有効化してください（該当する場合）。","lgpd_title":"LGPD（本人の権利）","lgpd_li1":"請求できる内容：開示、訂正、移転（ポータビリティ）、同意撤回、削除。","lgpd_li2":"窓口：privacidade@hempstore.com.br（実際のメールに置き換えてください）。","lgpd_li3":"法的根拠と保存期間はデータ種別および規制／税務義務により異なります。","institutional":"institutional","back_simple":"戻る","notice":"notice","notice_sub":"機関向け内容。運用とポートフォリオは現行法令・基準に従います。","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"Hemp Oil Companyは品質・サステナビリティ・ウェルビーイングを重視し、プレミアムなカンナビス由来製品を各工程で丁寧にお届けします。","hoc_btn_solutions":"ソリューションを見る","hoc_btn_store":"ストアへ（Hemp Store）","hoc_areas_title":"主な領域","hoc_badge_rd":"R&D","hoc_card_rd_title":"研究開発","hoc_card_rd_sub":"仕様、安定性、ドキュメント、イノベーションの枠組み。","hoc_badge_quality":"品質","hoc_card_quality_title":"品質とトレーサビリティ","hoc_card_quality_sub":"チェーン・オブ・カストディ、ロット管理、一貫性のガイドライン。","hoc_badge_compliance":"コンプライアンス","hoc_card_compliance_title":"ガバナンスとコンプライアンス","hoc_card_compliance_sub":"社内ポリシーと適用される基準への適合（必要に応じて）。","hoc_contact_title":"B2Bお問い合わせ","hoc_contact_sub":"パートナーシップ、流通、ポートフォリオ開発について営業／技術チームにご相談ください。","label_email":"メール:","label_partnerships":"パートナーシップ:","hoc_quick_msg":"クイックメッセージ","label_name":"お名前","label_message":"メッセージ","send":"send","hoc_form_demo":"デモフォーム。実運用の送信連携をご依頼ください。","sol_title":"ソリューション（B2B）","sol_sub":"品質、ドキュメント、サプライチェーン向けモジュール。Hemp Storeと同じビジュアルスタイルを維持。","sol_btn_compliance":"R&D + コンプライアンス","sol_deliver_title":"提供内容","sol_badge_docs":"ドキュメント","sol_docs_title":"仕様とドキュメント","sol_docs_sub":"仕様書、表示要件、社内標準、一貫性。","sol_badge_scm":"SCM","sol_scm_title":"サプライチェーンとパートナー","sol_scm_sub":"サプライヤー選定、標準化、トレーサビリティ。","sol_badge_brand":"ブランド","sol_brand_title":"ポートフォリオ戦略","sol_brand_sub":"ライン設計と流通ガイド。","sol_integration_title":"Hemp Storeとの連携","sol_integration_sub":"B2C運用は（EC）で行います。Hemp Oil CompanyがサプライチェーンとR&Dを整備します。","sol_btn_store_products":"ストアの商品を見る","comp_title":"R&D + コンプライアンス","comp_sub":"社内標準、品質、トレーサビリティのためのインスティテューショナル・ハブ。明確で客観的な表現。","comp_btn_talk":"チームに相談","comp_pillars":"柱","comp_badge_sop":"SOP","comp_sop_title":"手順と標準","comp_sop_sub":"一貫性と継続的改善に向けたドキュメント。","comp_badge_qa":"QA","comp_qa_title":"品質管理","comp_qa_sub":"ロット管理と記録のためのガイドライン。","comp_badge_legal":"法務","comp_legal_title":"コンプライアンス","comp_legal_sub":"範囲／規制に応じて適用される基準への適合。","Acessórios":"アクセサリー","Bebida":"ドリンク","Charutaria":"葉巻","Comestíveis":"エディブル","Extração":"エキス","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"オイル","Óleo CBD Isolado":"オイル CBD アイソレート","Óleo Full Spectrum":"オイル フルスペクトラム","Óleo CBG":"オイル CBG","Charutos San Juan":"葉巻 San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash（ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds":"Diamonds","Gummies":"Gummies","Mel infusionado de THC":"ハチミツ infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"チョコレート","Chicletes CBD e THC":"ガム CBD e THC","Refrigerante infusionado (THC/CBD)":"ソーダ infusionado（THC/CBD)","Chá infusionado THC":"お茶 infusionado THC","Limonada infusionada THC":"レモネード infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"オイル CBD Pet","Petiscos mastigáveis CBD":"おやつ mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"バーム tópico com ヘンプ/CBD","Shampoo calmante com cânhamo":"シャンプー calmante com ヘンプ","Canetas Hemp":"ペン Hemp","Camisetas":"Tシャツ","Bonés (estilo trucker)":"キャップ（estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"ローラー","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • アイソレート • 30ml （デモ）","CBD • Full Spectrum • 30ml (demo)":"CBD • フルスペクトラム • 30ml （デモ）","CBG • Isolado • 30ml (demo)":"CBG • アイソレート • 30ml （デモ）","Configuração por peso e strain (demo)":"重量とストレインでカスタマイズ（デモ）","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"プレロール • 01g • ストレイン選択可 （デモ）","Extração (demo) • strain selecionável":"エキス （デモ） • ストレイン選択可","Comestível (demo) • sabores • 50g / 100g":"エディブル （デモ） • フレーバー • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"エディブル （デモ） • THC（許可されている地域のみ）• 100ml","Comestível (demo) • THC (onde permitido) • 100g":"エディブル （デモ） • THC（許可されている地域のみ）• 100g","Comestível (demo) • CBD/THC • 100g":"エディブル （デモ） • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"エディブル （デモ） • CBD/THC • 個数","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"ドリンク • THC/CBD • 330ml / 500ml （デモ：許可されている地域のみ）","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"ドリンク • THC • 300ml / 500ml （デモ：許可されている地域のみ）","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"ドリンク • THC • 400ml / 700ml （デモ：許可されている地域のみ）","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 吸引回数 （デモ：許可されている地域のみ）","Pet (demo) • cânhamo/CBD • 30ml":"Pet （デモ） • ヘンプ/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet （デモ） • snacks • 個数","Pet (demo) • uso tópico":"Pet （デモ） • 外用","Pet (demo) • higiene":"Pet （デモ） • 衛生","Acessório • escrita/coleção":"アクセサリー • escrita/coleção","Acessório • apparel":"アクセサリー • apparel","Acessório • boné":"アクセサリー • boné","Acessório • diversos modelos":"アクセサリー • diversos modelos","Acessório • enrolar":"アクセサリー • enrolar","Acessório • papéis":"アクセサリー • papéis","Acessório • tamanhos P / M / G":"アクセサリー • tamanhos P / M / G","Acessório • vidro/acrílico":"アクセサリー • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"バリエーション選択可 • 5g / 10g （デモ：許可されている地域のみ）","Bolador (demo). Ajuda a manter consistência na montagem.":"ローラー（デモ）。巻き上げの仕上がりを一定に保つのに役立ちます。","Bongs (demo). Utilize com segurança e cuide da limpeza.":"ボング（デモ）。安全に使用し、清潔に保ってください。","Bonés trucker (demo). Leve e ventilado.":"キャップ trucker （デモ）. Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"外用バーム（デモ）。ヘンプ配合のペット向け製品でよくあるタイプです。成分を確認し、狭い範囲で試してください。","Camisetas (demo). Modelagem básica e minimalista.":"Tシャツ（デモ）。ベーシックでミニマルなシルエット。","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hempペン（デモ）。日常にさりげないスタイルを。","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San Juan 葉巻（デモ）。重量とストレインを選択。許可されている地域では、香りと儀式性を楽しむ体験になりがちです。責任を持って使用してください。","Chicletes (demo). Discretos e fáceis de dosar.":"ガム（デモ）。目立たず、量を調整しやすい。","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"チョコレート（デモ）。定番の形ですが、吸収は遅くなる場合があります。","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THCインフューズドティー（デモ）。フレーバーと量を選択。必ず現地の法令を確認し、責任を持って摂取してください。","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"グラインダー（デモ）。均一に挽くことで仕上がりが安定し、無駄を減らします。","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"エキス（デモ）。一般的に高濃度です。少量から始め、現地の法令に従って責任を持って使用してください。","Gummies (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"グミ（デモ）。手軽で目立ちません。エディブルは効くまで時間がかかることがあるので、ゆっくり。","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos（デモ）。01gのプレロールでストレインを選べます。安全な環境と少量からを推奨します。","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THCインフューズドレモネード（デモ）。量と氷を選択。必ず現地の法令を確認し、責任を持って摂取してください。","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"トリュフバター（デモ）。レシピに最適ですが、用量管理が重要です。","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"インフューズドハチミツ（デモ）。お茶やレシピに合いますが、用量に注意。","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBDおやつ（デモ）。日常／トレーニング向けの噛めるスナック。原材料と表示が地域の規制に適合しているか確認してください。","Piteiras (demo). Conforto e melhor fluxo.":"マウスピース（デモ）。快適さとフロー向上。","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"インフューズドソーダ（デモ）。カンナビノイド、量、フレーバーを選択。必ず現地の法令を確認し、責任を持って摂取してください。","Sedas (demo). Papéis clássicos e práticos.":"ペーパー（デモ）。クラシックで使いやすい。","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"ヘンプシャンプー（デモ）。ウェルネス志向の衛生用品。ペットに合うやさしい処方を選んでください。","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THCベイプ（デモ）。吸引回数とフレーバーを選択。必ず現地の法令を確認し、責任を持って使用してください。","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBDアイソレートオイル（デモ）。主成分のカンナビノイドに焦点を当て、よりニュートラルなプロファイルです。必ず現地の法令を確認し、責任を持って使用してください。","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"ペット用CBDオイル（デモ）。許可されている市場で一般的です。医療的な断定は避け、獣医の指導に従ってください。","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBGオイル（デモ）。通常カンナビゲロール配合。ラベル表示と現地での適法性／適合性を確認してください。","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"フルスペクトラムオイル（デモ）。ヘンプ由来成分（テルペン含む）がより多く含まれることが多く、香りや体験が変わる場合があります。ラベル表示と適合性を確認してください。","Isolado":"アイソレート","THC (onde permitido)":"THC（許可されている地域のみ)","100 puxadas":"100 吸引回数","1000 puxadas":"1000 吸引回数","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"白","Branca":"白","Preto":"黒","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"ガラス","Acrílico":"アクリル","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"ビター","Ao leite":"ミルク","Camomila":"カモミール","Gengibre":"ジンジャー","Hortelã":"ミント","Menta":"Menta","Mint":"Mint","Morango":"いちご","Melancia":"スイカ","Uva":"ぶどう","Laranja":"オレンジ","Limão":"レモン","Tangerina":"みかん","Manga":"マンゴー","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"zh":{"Charuto San Juan":"San Juan 雪茄","Charuto • unitário • (demo)":"雪茄 • 单支（演示）","pdesc_oil-cbd":"是什么 — CBD (cannabidiol) oil in a 30ml dropper, with selectable strength (mg/mL).\n原理 — CBD interacts with the endocannabinoid system; this is not a medical claim.\n如何使用 — start low and increase slowly. Sublingual use is common: place under the tongue ~60s, then swallow.\n警告: may cause drowsiness, dry mouth, or mild stomach discomfort. If you take medicines (e.g., blood thinners) or are pregnant/breastfeeding, talk to a healthcare professional.","pdesc_oil-cbg":"是什么 — CBG (cannabigerol) oil in a 30ml bottle, with selectable strength (mg/mL).\n原理 — CBG is a cannabinoid that some people include in wellness routines (no medical promises).\n如何使用 — start with a low dose and adjust slowly. Sublingual use is common.\n警告: may cause drowsiness or mild discomfort. If you use other medicines, or are pregnant/breastfeeding, seek professional guidance.","pdesc_oil-thc":"是什么 — THC oil in a 30ml bottle, with selectable strength (mg/mL).\n原理 — THC is psychoactive and can affect perception, coordination, and mood.\n如何使用 — start very low and go slow. Wait long enough before repeating; effects can last for hours.\n警告: DO NOT drive or operate machines. Higher risk of anxiety, fast heartbeat, drowsiness, and impaired judgement. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_oil-full-spectrum":"是什么 — Full‑spectrum hemp extract oil (30ml) with multiple plant compounds; it may contain THC.\n原理 — a broader cannabinoid/terpene profile can change aroma and experience (no medical promises).\n如何使用 — start low and increase slowly. Sublingual use is common.\n警告: may be psychoactive and can affect drug tests. Do not drive if you feel altered. Adults 18+ only. Follow local law.","pdesc_strain-gorilla-glue":"是什么 — cannabis flower/strain “Gorilla Glue”, with selectable weight (5g/10g).\n如何使用 — store sealed, cool, and away from light to preserve aroma and humidity.\n警告: may be psychoactive and impair coordination. Avoid mixing with alcohol. Adults 18+ only. Follow local law.","pdesc_strain-purple-haze":"是什么 — cannabis flower/strain “Purple Haze”, with selectable weight (5g/10g).\n如何使用 — keep sealed to preserve freshness.\n警告: may cause psychoactive effects and sleepiness. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_strain-og-kush":"是什么 — cannabis flower/strain “OG Kush”, with selectable weight (5g/10g).\n如何使用 — store in an airtight jar, cool and dry.\n警告: can be intense for beginners. Start small, don’t drive, and avoid alcohol. Adults 18+ only. Follow local law.","pdesc_cigar-san-juan":"是什么 — “San Juan” cigar (single unit), choose strain and size/weight (10g/15g/20g).\n如何使用 — use in a ventilated area and with moderation.\n警告: smoking can irritate the airways. Avoid if you have lung/heart conditions. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_juanitos":"是什么 — 1g pre‑roll with selectable strain.\n如何使用 — take small puffs and wait a few minutes to gauge intensity.\n警告: may cause cough, drowsiness, and impaired coordination. Do not drive. Avoid alcohol. Adults 18+ only. Follow local law.","pdesc_extract-dry":"是什么 — “Dry” (dry sift/kief) concentrate obtained by dry separation.\n如何使用 — it’s more concentrated than flower: use tiny amounts and increase slowly.\n警告: higher potency increases the risk of overdoing it. Do not drive after use. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_extract-bubble-hash":"是什么 — Bubble Hash (ice/water hash), concentrate made with ice-water filtration.\n如何使用 — use small amounts; keep cool to preserve texture.\n警告: more potent than flower. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-rosin":"是什么 — Rosin, a solventless concentrate extracted with heat and pressure.\n如何使用 — micro‑doses only; use proper equipment where legal.\n警告: high potency; intense effects are possible. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-live-rosin":"是什么 — Live Rosin made from fresh‑frozen material to preserve aroma.\n如何使用 — micro‑doses with appropriate equipment; keep refrigerated for best quality.\n警告: potent. Avoid overuse and don’t drive after use. Adults 18+ only. Follow local law.","pdesc_extract-diamonds":"是什么 — cannabinoid “diamonds”, high‑purity crystals (very strong). Choose THC or CBD in the configuration.\n如何使用 — micro‑dose and increase only if needed, using proper equipment where legal.\n警告: very high potency. Higher risk of anxiety, fast heartbeat, and heavy sedation. Don’t drive. Keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-gummies":"是什么 — gummies (chewable candies) with selectable flavors and sizes (50g/100g).\n如何使用 — edibles can take 30–120 minutes to kick in. Start small and wait before taking more.\n警告: easier to overconsume because onset is slow. Keep away from children (looks like candy). Adults 18+ only. Follow local law.","pdesc_edible-honey":"是什么 — infused honey (THC where legal), 100ml.\n如何使用 — mix into drinks/recipes. Start with a small amount and wait for effects.\n警告: psychoactive if THC. Do not drive after use; keep away from children/pets. Adults 18+ only. Follow local law.","pdesc_edible-butter":"是什么 — infused “truffle butter” (THC where legal), 100g.\n如何使用 — for cooking/recipes; measure carefully to control dose.\n警告: edibles can hit hard and last hours. Wait at least 2 hours before taking more. Adults 18+ only. Follow local law.","pdesc_edible-chocolate":"是什么 — chocolate (milk/dark/white) in 50g/100g portions.\n如何使用 — start with a small piece; edibles may take longer to feel.\n警告: keep away from children. If formula includes THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-gum":"是什么 — chewing gum with CBD or THC (where legal), with selectable flavors.\n如何使用 — chew slowly. If THC, start with 1 piece and wait to gauge effect.\n警告: THC is psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_edible-lollipops":"是什么 — THC lollipops (where legal) with selectable flavors.\n如何使用 — consume slowly and wait before repeating (edibles are delayed).\n警告: looks like candy—high child risk. Do not drive after use. Adults 18+ only. Follow local law.","pdesc_bev-soda":"是什么 — infused soda (THC or CBD where legal) with selectable flavors.\n如何使用 — drink slowly. If THC, wait 30–120 minutes before more.\n警告: do not mix with alcohol. If THC, don’t drive after use. Adults 18+ only. Follow local law.","pdesc_bev-tea":"是什么 — THC infused tea (where legal), selectable flavors.\n如何使用 — drink slowly; effects may be delayed.\n警告: psychoactive. Don’t drive after use; avoid alcohol. Adults 18+ only. Follow local law.","pdesc_bev-lemonade":"是什么 — THC infused lemonade (where legal), selectable size and ice.\n如何使用 — drink slowly; wait before taking more.\n警告: psychoactive. Don’t drive after use. Adults 18+ only. Follow local law.","pdesc_vape-thc":"是什么 — THC vape (where legal) with selectable flavor and puff count (100/1000).\n如何使用 — start with 1–2 puffs, wait a few minutes, then decide if you need more.\n警告: inhalation can irritate airways. Do not drive after use. Keep out of reach of minors. Adults 18+ only. Follow local law.","pdesc_acc-cap":"是什么 — trucker-style cap (apparel).\n如何使用 — adjustable fit; clean gently.","pdesc_acc-grinder":"是什么 — grinder for a more even grind.\n如何使用 — load, twist, and clean regularly.\n警告: keep sharp parts away from children.","pdesc_acc-tips":"是什么 — tips/mouthpieces for comfort and airflow.\n如何使用 — insert and replace when needed.","pdesc_acc-papers":"是什么 — rolling papers.\n如何使用 — roll as desired; store dry.","pdesc_acc-roller":"是什么 — rolling tool to help with consistent rolls.\n如何使用 — follow the tool’s guide; keep clean.","pdesc_acc-bong":"是什么 — bong/water pipe accessory.\n如何使用 — fill to the correct water level and clean frequently.\n警告: glass can break—handle with care. Use only where legal; do not drive after use.","age18":"18+","footer_company":"","footer_group":"JP. DIETERICH 集团","privacy_title":"隐私政策","legal_model_note":"信息文档（模板）。实际使用请与律师调整。","privacy_li1":"我们可能收集基本数据用于购物车、登录（演示）与语言偏好。","privacy_li2":"为提升体验，数据可能存储在浏览器本地（localStorage）。","privacy_li3":"您可依据适用法律（LGPD）申请删除/调整。","privacy_li4":"我们不出售您的数据，仅用于运营与改进服务。","terms_title":"使用条款","terms_li1":"访问本网站即表示您同意这些条款及适用法律法规。","terms_li2":"此处信息仅供参考，可能随时变更且不另行通知。","terms_li3":"禁止不当使用品牌、完整复制内容以及滥用式抓取。","terms_li4":"购买与支付遵循结账页面所示条件。","terms_li5":"如有疑问，请使用联系页面。","cookies_title":"Cookie 政策","cookies_li1":"本网站可能使用本地存储/Cookie 来保存语言与购物车。","cookies_li2":"您可随时清除浏览器数据以移除偏好设置。","cookies_li3":"分析/营销工具仅应在获得同意后启用（如适用）。","lgpd_title":"LGPD（主体权利）","lgpd_li1":"您可申请：访问、更正、可携带、撤回同意与删除。","lgpd_li2":"渠道：privacidade@hempstore.com.br（请替换为真实邮箱）。","lgpd_li3":"法律依据与保留期限取决于数据类型及监管/税务义务。","institutional":"institutional","back_simple":"返回","notice":"notice","notice_sub":"机构内容。运营与产品组合受现行法律法规及标准约束。","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"Hemp Oil Company 专注于品质、可持续与身心健康，以高端标准在每个环节精心交付大麻衍生产品。","hoc_btn_solutions":"查看解决方案","hoc_btn_store":"前往商店（Hemp Store）","hoc_areas_title":"主要领域","hoc_badge_rd":"研发","hoc_card_rd_title":"研发","hoc_card_rd_sub":"用于规格、稳定性、文档与创新的框架。","hoc_badge_quality":"质量","hoc_card_quality_title":"质量与可追溯","hoc_card_quality_sub":"监管链、批次控制与一致性指南。","hoc_badge_compliance":"合规","hoc_card_compliance_title":"治理与合规","hoc_card_compliance_sub":"内部政策与适用规范的合规（如需）。","hoc_contact_title":"B2B 联系方式","hoc_contact_sub":"如需合作、分销与产品组合开发，请联系商务/技术团队。","label_email":"邮箱：","label_partnerships":"合作：","hoc_quick_msg":"快速留言","label_name":"姓名","label_message":"留言","send":"send","hoc_form_demo":"演示表单。请申请真实发送/集成。","sol_title":"解决方案（B2B）","sol_sub":"用于质量、文档与供应链的模块，同时保持 Hemp Store 的视觉风格。","sol_btn_compliance":"研发 + 合规","sol_deliver_title":"交付内容","sol_badge_docs":"文档","sol_docs_title":"规格与文档","sol_docs_sub":"技术资料、标签要求、内部标准与一致性。","sol_badge_scm":"SCM","sol_scm_title":"供应链与合作伙伴","sol_scm_sub":"供应商甄选、标准化与可追溯。","sol_badge_brand":"品牌","sol_brand_title":"产品组合策略","sol_brand_sub":"产品线架构与分销指南。","sol_integration_title":"与 Hemp Store 集成","sol_integration_sub":"B2C 运营在 （电商）进行。Hemp Oil Company 负责供应链与研发架构。","sol_btn_store_products":"在商店查看产品","comp_title":"研发 + 合规","comp_sub":"面向内部标准、质量与可追溯性的机构信息中心，表达清晰客观。","comp_btn_talk":"联系团队","comp_pillars":"支柱","comp_badge_sop":"SOP","comp_sop_title":"流程与标准","comp_sop_sub":"面向一致性与持续改进的文档体系。","comp_badge_qa":"QA","comp_qa_title":"质量控制","comp_qa_sub":"批次控制与记录的指南。","comp_badge_legal":"法务","comp_legal_title":"合规","comp_legal_sub":"根据范围/监管要求，符合适用规范。","Acessórios":"配件","Bebida":"饮料","Charutaria":"雪茄","Comestíveis":"可食用","Extração":"提取物","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"油","Óleo CBD Isolado":"油 CBD 分离型","Óleo Full Spectrum":"油 全谱","Óleo CBG":"油 CBG","Charutos San Juan":"雪茄 San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash（ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds":"Diamonds","Gummies":"Gummies","Mel infusionado de THC":"蜂蜜 infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"巧克力","Chicletes CBD e THC":"口香糖 CBD e THC","Refrigerante infusionado (THC/CBD)":"汽水 infusionado（THC/CBD)","Chá infusionado THC":"茶 infusionado THC","Limonada infusionada THC":"柠檬水 infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"油 CBD Pet","Petiscos mastigáveis CBD":"零食 mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"香膏 tópico com 汉麻/CBD","Shampoo calmante com cânhamo":"洗发水 calmante com 汉麻","Canetas Hemp":"笔 Hemp","Camisetas":"T恤","Bonés (estilo trucker)":"帽子（estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"卷制器","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • 分离型 • 30ml （演示）","CBD • Full Spectrum • 30ml (demo)":"CBD • 全谱 • 30ml （演示）","CBG • Isolado • 30ml (demo)":"CBG • 分离型 • 30ml （演示）","Configuração por peso e strain (demo)":"按重量与品种配置（演示）","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"预卷香烟 • 01g • 品种可选 （演示）","Extração (demo) • strain selecionável":"提取物 （演示） • 品种可选","Comestível (demo) • sabores • 50g / 100g":"可食用 （演示） • 口味 • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"可食用 （演示） • THC（仅在允许地区）• 100ml","Comestível (demo) • THC (onde permitido) • 100g":"可食用 （演示） • THC（仅在允许地区）• 100g","Comestível (demo) • CBD/THC • 100g":"可食用 （演示） • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"可食用 （演示） • CBD/THC • 单位","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"饮料 • THC/CBD • 330ml / 500ml （演示：仅在允许地区）","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"饮料 • THC • 300ml / 500ml （演示：仅在允许地区）","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"饮料 • THC • 400ml / 700ml （演示：仅在允许地区）","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 吸口 （演示：仅在允许地区）","Pet (demo) • cânhamo/CBD • 30ml":"Pet （演示） • 汉麻/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet （演示） • snacks • 单位","Pet (demo) • uso tópico":"Pet （演示） • 外用","Pet (demo) • higiene":"Pet （演示） • 清洁","Acessório • escrita/coleção":"配件 • escrita/coleção","Acessório • apparel":"配件 • apparel","Acessório • boné":"配件 • boné","Acessório • diversos modelos":"配件 • diversos modelos","Acessório • enrolar":"配件 • enrolar","Acessório • papéis":"配件 • papéis","Acessório • tamanhos P / M / G":"配件 • tamanhos P / M / G","Acessório • vidro/acrílico":"配件 • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"可选品种 • 5g / 10g （演示：仅在允许地区）","Bolador (demo). Ajuda a manter consistência na montagem.":"卷制器（演示）。有助于在卷制时保持一致性。","Bongs (demo). Utilize com segurança e cuide da limpeza.":"水烟壶（演示）。请安全使用并注意清洁。","Bonés trucker (demo). Leve e ventilado.":"帽子 trucker （演示）. Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"外用香膏（演示）。常见于含大麻籽/汉麻成分的宠物产品线。请核对配方，并先在小范围测试。","Camisetas (demo). Modelagem básica e minimalista.":"T恤（演示）。基础简约版型。","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hemp 笔（演示）。为日常增添一点风格。","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San Juan 雪茄（演示）。请选择重量与品种。在允许地区，体验通常包含香气与仪式感。请负责任地使用。","Chicletes (demo). Discretos e fáceis de dosar.":"口香糖（演示）。低调且易于控制用量。","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"巧克力（演示）。经典食用形式；请注意吸收可能更慢。","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC 浸泡茶饮（演示）。可选口味与容量。请务必确认当地合法性，并负责任地食用。","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"研磨器（演示）。均匀研磨有助于一致性并减少浪费。","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"提取物（演示）。通常更为浓缩：从少量开始，并在遵守当地法规的前提下负责任地使用。","Gummies (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"软糖（演示）。方便低调。可食用产品起效可能更慢——请循序渐进。","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos（演示）。01g 预卷，可选品种。建议在安全环境并从更小剂量开始。","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC 浸泡柠檬水（演示）。请选择容量与冰块。请务必确认当地合法性，并负责任地食用。","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"松露黄油（演示）。适合做菜谱——剂量控制至关重要。","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"浸泡蜂蜜（演示）。适合搭配茶饮与食谱——注意剂量。","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBD 零食（演示）。日常/训练用可咀嚼小食。请根据所在司法辖区核对配料与标签是否合规。","Piteiras (demo). Conforto e melhor fluxo.":"烟嘴（演示）。更舒适、气流更顺畅。","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"浸泡汽水（演示）。请选择大麻素、容量与口味。请务必确认当地合法性，并负责任地食用。","Sedas (demo). Papéis clássicos e práticos.":"卷纸（演示）。经典实用。","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"汉麻洗发水（演示）。主打舒适健康的清洁产品——选择温和且适合宠物的配方。","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THC 电子雾化（演示）。请选择吸口次数与口味。请务必确认当地合法性，并负责任地使用。","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBD 分离型油（演示）。聚焦单一主要大麻素，风味/特性更中性。请务必确认当地合法性，并负责任地使用。","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"宠物 CBD 油（演示）。在允许的市场较常见；避免医疗宣称，并遵循兽医建议。","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBG 油（演示）。通常含有大麻萜酚（CBG/ cannabigerol）。请查看标签并确认合规/当地合法性。","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"全谱油（演示）。通常含有更多汉麻成分（含萜烯），可能改变香气与体验。请查看标签并确认合规性。","Isolado":"分离型","THC (onde permitido)":"THC（仅在允许地区)","100 puxadas":"100 吸口","1000 puxadas":"1000 吸口","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"白色","Branca":"白色","Preto":"黑色","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"玻璃","Acrílico":"亚克力","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"苦味","Ao leite":"牛奶","Camomila":"洋甘菊","Gengibre":"姜","Hortelã":"薄荷","Menta":"Menta","Mint":"Mint","Morango":"草莓","Melancia":"西瓜","Uva":"葡萄","Laranja":"橙子","Limão":"柠檬","Tangerina":"橘子","Manga":"芒果","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"}};

  /* ---------- Text cleanup: remove demo/chat-command references, keep medical/legal warnings ---------- */
  function sanitizeUIText(value){
    if(typeof value !== "string") return value;
    let s = value;

    // Remove references that expose internal/chat/demo workflow instead of user-facing commerce copy.
    const phrases = [
      /\s*\((?:demo|démo|demonstration|demonstração|demostración|dimostrazione|デモ|演示)[^)]*\)/gi,
      /\bconteúdo\s+(?:informativo\s+e\s+)?demonstrativo\b/gi,
      /\bmodelo\s*\/\s*demonstração\b/gi,
      /\bmodelo\s+de\s+demonstração\b/gi,
      /\bsite\s+é\s+um\s+modelo\s*\/\s*demonstração\.?/gi,
      /\bdemonstration\s+content\b/gi,
      /\binformational\s+and\s+demonstrative\s+content\b/gi,
      /\bcontenido\s+demostrativo\b/gi,
      /\bcontenu\s+de\s+démonstration\b/gi,
      /\bcontenuto\s+dimostrativo\b/gi,
      /\bdemonstrationsinhalt\b/gi,
      /\bstatic\s+demo\b/gi,
      /\bdemo\s+estática\b/gi,
      /\bdemo\s+statica\b/gi,
      /\bdemo\s+estática\b/gi,
      /\bprévia\s+visual\b/gi,
      /\bvisual\s+preview\b/gi,

      /\bsem\s+compra\s+habilitada[^.。]*[.。]?/gi,
      /\bsem\s+liberação\s+de\s+compra[^.。]*[.。]?/gi,
      /\bpurchasing\s+disabled[^.]*[.]?/gi,
      /\bwithout\s+purchase\s+enabled[^.]*[.]?/gi,
      /\bsans\s+achat\s+activé[^.]*[.]?/gi,
      /\bsenza\s+acquisto\s+abilitato[^.]*[.]?/gi,
      /\bsin\s+compra\s+habilitada[^.]*[.]?/gi,
      /\bder\s+Kauf\s+ist[^.]*deaktiviert[^.]*[.]?/gi,
      /購入できません。?/g,
      /不开放购买。?/g,
      /\bnesta\s+demo\b/gi,
      /\bin\s+this\s+demo\b/gi,
      /\bdans\s+cette\s+démo\b/gi,
      /\bin\s+questa\s+demo\b/gi,
      /\ben\s+esta\s+demo\b/gi,
      /\bin\s+dieser\s+Demo\b/gi,
      /本デモでは/g,
      /本演示中/g,
      /\baperçu\s+visuel\b/gi,
      /\banteprima\s+visiva\b/gi,
      /\bvista\s+previa\s+visual\b/gi,
      /\bvisuelle\s+Vorschau\b/gi,
      /\bビジュアルプレビュー\b/g,
      /\b视觉预览\b/g,
      /\bcarrinho\s+fica\s+desativado\s+nesta\s+etapa[^.。]*[.。]?/gi,
      /\bthe\s+cart\s+is\s+disabled\s+at\s+this\s+stage[^.]*[.]?/gi,
      /\ble\s+panier\s+est\s+désactivé\s+à\s+cette\s+étape[^.]*[.]?/gi,
      /\bil\s+carrello\s+è\s+disattivato\s+in\s+questa\s+fase[^.]*[.]?/gi,
      /\bel\s+carrito\s+está\s+desactivado\s+en\s+esta\s+etapa[^.]*[.]?/gi,
      /\bder\s+Warenkorb\s+ist\s+in\s+dieser\s+Phase\s+deaktiviert[^.]*[.]?/gi,
      /この段階ではカートは無効です。?/g,
      /本演示阶段购物车已禁用。?/g,
      /\bprompt\b/gi,
      /\bcomando(?:s)?\s+dados\s+ao\s+chat\b/gi
    ];
    phrases.forEach(rx=>{ s = s.replace(rx, ""); });

    // Clean isolated demo terms that may remain in UI copy.
    s = s
      .replace(/\b(?:demo|démo|démonstration|demonstration|demonstração|demostración|dimostrazione)\b/gi, "")
      .replace(/デモ/g, "")
      .replace(/演示/g, "")
      .replace(/\s+—\s+$/g, "")
      .replace(/—\s+—/g, "—")
      .replace(/\(\s*\)/g, "")
      .replace(/\s+([,.!?:;])/g, "$1")
      .replace(/([([{])\s+/g, "$1")
      .replace(/\s+([)\]}])/g, "$1")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return s;
  }

  function stripProductWarningBlocks(desc){
    let raw = sanitizeUIText(desc || "");

    // Remove meta/observation paragraphs about catalog copy or market/demo context.
    const noteLabels = [
      "Observações", "Observación", "Observaciones", "Notes", "Note",
      "Notas", "Hinweise", "注記", "备注", "備考"
    ];
    const noteRx = new RegExp("(^|\\n)\\s*(" + noteLabels.join("|") + ")\\s*[—:-][^\\n]*(?:\\n(?!\\s*\\n).*)*(?=\\n\\s*\\n|$)", "gi");
    raw = raw.replace(noteRx, "\\n");

    const labels = [
      "Atenção", "Aviso", "Warning", "Advertencia", "Advertencia médica/legal",
      "Avertissement", "Avvertenza", "Warnhinweis", "注意", "警告"
    ];
    const rx = new RegExp("\\n\\s*(" + labels.join("|") + ")\\s*[:：][\\s\\S]*$", "i");
    return raw.replace(rx, "").replace(/\\n{3,}/g, "\\n\\n").trim();
  }

  function medicalLegalWarning(){
    const lang = getLang();
    const map = {
      pt:"Atenção: produto destinado a adultos, apenas onde permitido por lei. O uso excessivo de substâncias psicoativas pode causar ansiedade, sonolência, taquicardia, prejuízo de coordenação, alterações de percepção e risco de dependência. Não dirija, não opere máquinas, evite misturar com álcool ou medicamentos e procure orientação médica em caso de gravidez, amamentação, condição de saúde ou uso contínuo de remédios.",
      en:"Warning: intended for adults only and only where allowed by law. Excessive use of psychoactive substances may cause anxiety, drowsiness, rapid heartbeat, impaired coordination, altered perception and risk of dependence. Do not drive or operate machinery, avoid mixing with alcohol or medication, and seek medical advice if pregnant, breastfeeding, managing a health condition or taking regular medication.",
      fr:"Avertissement: produit destiné aux adultes uniquement et seulement là où la loi l’autorise. L’usage excessif de substances psychoactives peut provoquer anxiété, somnolence, tachycardie, troubles de la coordination, altération de la perception et risque de dépendance. Ne conduisez pas, n’utilisez pas de machines, évitez l’association avec alcool ou médicaments et demandez un avis médical en cas de grossesse, d’allaitement, de condition de santé ou de traitement régulier.",
      it:"Avvertenza: prodotto destinato solo ad adulti e solo dove consentito dalla legge. L’uso eccessivo di sostanze psicoattive può causare ansia, sonnolenza, tachicardia, riduzione della coordinazione, alterazioni della percezione e rischio di dipendenza. Non guidare, non usare macchinari, evitare l’associazione con alcol o farmaci e chiedere consiglio medico in caso di gravidanza, allattamento, condizioni di salute o uso regolare di medicinali.",
      es:"Advertencia: producto destinado solo a adultos y únicamente donde la ley lo permita. El uso excesivo de sustancias psicoactivas puede causar ansiedad, somnolencia, taquicardia, deterioro de la coordinación, alteración de la percepción y riesgo de dependencia. No conduzcas ni operes maquinaria, evita mezclar con alcohol o medicamentos y consulta a un profesional de salud en caso de embarazo, lactancia, condición médica o uso continuo de medicación.",
      de:"Warnhinweis: nur für Erwachsene und nur dort, wo gesetzlich erlaubt. Übermäßiger Konsum psychoaktiver Substanzen kann Angst, Schläfrigkeit, Herzrasen, eingeschränkte Koordination, veränderte Wahrnehmung und Abhängigkeitsrisiko verursachen. Nicht fahren oder Maschinen bedienen, nicht mit Alkohol oder Medikamenten kombinieren und bei Schwangerschaft, Stillzeit, Erkrankungen oder regelmäßiger Medikamenteneinnahme ärztlichen Rat einholen.",
      ja:"注意: 法律で認められた地域における成人向け製品です。精神作用のある物質の過度な使用は、不安、眠気、動悸、協調運動の低下、知覚の変化、依存リスクを引き起こす可能性があります。使用後の運転や機械操作は避け、アルコールや薬との併用を避けてください。妊娠中、授乳中、持病がある場合、または継続的に薬を使用している場合は医療専門家に相談してください。",
      zh:"警告: 仅限法律允许地区的成年人使用。过量使用精神活性物质可能导致焦虑、嗜睡、心跳加快、协调能力下降、感知改变以及依赖风险。使用后请勿驾驶或操作机械，避免与酒精或药物混用；如处于怀孕、哺乳、患有健康问题或长期用药状态，请咨询医疗专业人士。"
    };
    return map[lang] || map.pt;
  }

  function sanitizeProductDesc(desc){
    const core = stripProductWarningBlocks(desc);
    const warning = medicalLegalWarning();
    return (core ? core + "\n\n" : "") + warning;
  }

function t(key){
    const lang = getLang();
    const value = (
      (I18N_EXTRA[lang] && I18N_EXTRA[lang][key]) ||
      (I18N[lang] && I18N[lang][key]) ||
      (I18N_EXTRA.pt && I18N_EXTRA.pt[key]) ||
      (I18N.pt && I18N.pt[key]) ||
      key
    );
    return sanitizeUIText(value);
  }
  
  /* ---------- Currency & money formatting ---------- */
  const CUR = {
    key: "hemp_currency",
    ratesKey: "hemp_currency_rates",
    // All product/totals numbers in this demo are treated as BRL base.
    base: "BRL",
    list: [
      { code:"BRL", label:"Real brasileiro" },
      { code:"USD", label:"Dólar americano" },
      { code:"EUR", label:"Euro" },
      { code:"JPY", label:"Iene japonês" },
      { code:"CNY", label:"Yuan chinês" },
      { code:"BTC", label:"Bitcoin" },
      { code:"SATS", label:"Satoshis" },
    ]
  };

  const LANG_CURRENCY = {
    pt:"BRL",
    en:"USD",
    fr:"EUR",
    it:"EUR",
    es:"EUR",
    de:"EUR",
    ja:"JPY",
    zh:"CNY"
  };

  const CURRENCY_LOCALE = {
    BRL:"pt-BR",
    USD:"en-US",
    EUR:"de-DE",
    JPY:"ja-JP",
    CNY:"zh-CN",
    BTC:"en-US",
    SATS:"en-US"
  };

  function currencyForLang(lang){
    return LANG_CURRENCY[String(lang || getLang()).toLowerCase()] || "BRL";
  }

  function syncCurrencyWithLanguage(){
    setCurrency(currencyForLang(getLang()));
  }

  function getCurrency(){
    const fallback = currencyForLang(getLang());
    const v = (localStorage.getItem(CUR.key) || fallback).toUpperCase();
    return CUR.list.some(c=>c.code===v) ? v : fallback;
  }
  function setCurrency(code){
    const clean = String(code || currencyForLang(getLang())).toUpperCase();
    localStorage.setItem(CUR.key, CUR.list.some(c=>c.code===clean) ? clean : currencyForLang(getLang()));
  }

  function getRates(){
    const fallback = { USD:1, BRL_PER_USD:5.0, EUR_PER_USD:0.92, JPY_PER_USD:155, CNY_PER_USD:7.2, BTC_USD:45000 };
    try{
      const obj = JSON.parse(localStorage.getItem(CUR.ratesKey) || "null");
      if(!obj || typeof obj !== "object") return fallback;
      return {
        USD:1,
        BRL_PER_USD: Number(obj.BRL_PER_USD) || fallback.BRL_PER_USD,
        EUR_PER_USD: Number(obj.EUR_PER_USD) || fallback.EUR_PER_USD,
        JPY_PER_USD: Number(obj.JPY_PER_USD) || fallback.JPY_PER_USD,
        CNY_PER_USD: Number(obj.CNY_PER_USD) || fallback.CNY_PER_USD,
        BTC_USD: Number(obj.BTC_USD) || fallback.BTC_USD,
        source: obj.source || "manual",
        updatedAt: obj.updatedAt || null
      };
    } catch { return fallback; }
  }
  function setRates(r){
    const cur = getRates();
    const next = {
      BRL_PER_USD: Number(r?.BRL_PER_USD ?? cur.BRL_PER_USD) || cur.BRL_PER_USD,
      EUR_PER_USD: Number(r?.EUR_PER_USD ?? cur.EUR_PER_USD) || cur.EUR_PER_USD,
      JPY_PER_USD: Number(r?.JPY_PER_USD ?? cur.JPY_PER_USD) || cur.JPY_PER_USD,
      CNY_PER_USD: Number(r?.CNY_PER_USD ?? cur.CNY_PER_USD) || cur.CNY_PER_USD,
      BTC_USD: Number(r?.BTC_USD ?? cur.BTC_USD) || cur.BTC_USD,
      source: r?.source || cur.source || "manual",
      updatedAt: r?.updatedAt || new Date().toISOString()
    };
    localStorage.setItem(CUR.ratesKey, JSON.stringify(next));
  }

  function ratesFreshForToday(r=getRates()){
    if(!r?.updatedAt) return false;
    const updated = new Date(r.updatedAt);
    if(Number.isNaN(updated.getTime())) return false;
    const now = new Date();
    return updated.getFullYear() === now.getFullYear() &&
           updated.getMonth() === now.getMonth() &&
           updated.getDate() === now.getDate();
  }

  async function fetchLiveCurrencyRates(){
    const [fxRes, btcRes] = await Promise.allSettled([
      fetch("https://open.er-api.com/v6/latest/USD", { cache:"no-store" }),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", { cache:"no-store" })
    ]);

    let fx = null;
    if(fxRes.status === "fulfilled" && fxRes.value.ok){
      fx = await fxRes.value.json();
    }

    let btc = null;
    if(btcRes.status === "fulfilled" && btcRes.value.ok){
      btc = await btcRes.value.json();
    }

    const rates = fx?.rates || fx?.conversion_rates || {};
    const brl = Number(rates.BRL);
    const eur = Number(rates.EUR);
    const jpy = Number(rates.JPY);
    const cny = Number(rates.CNY);
    const btcUsd = Number(btc?.bitcoin?.usd);

    if(!isFinite(brl) || !isFinite(eur) || !isFinite(jpy) || !isFinite(cny)){
      throw new Error(t("currency_rates_unavailable"));
    }

    return {
      BRL_PER_USD: brl,
      EUR_PER_USD: eur,
      JPY_PER_USD: jpy,
      CNY_PER_USD: cny,
      BTC_USD: isFinite(btcUsd) ? btcUsd : getRates().BTC_USD,
      source: "open.er-api.com + coingecko",
      updatedAt: new Date().toISOString()
    };
  }

  async function refreshDailyRates({force=false, statusEl=null}={}){
    if(!force && ratesFreshForToday()) return false;
    try{
      if(statusEl) statusEl.textContent = "Atualizando cotação diária…";
      const live = await fetchLiveCurrencyRates();
      setRates(live);
      syncCurrencyButton();
      pageRenderAll();
      initHeroCarousel();
      mountProductBackNav();
      mountSmartFooter();
      mountNewsletter();
      if(statusEl) statusEl.textContent = `${t("currency_updated")} ${new Date(live.updatedAt).toLocaleString("pt-BR")}`;
      return true;
    }catch(err){
      if(statusEl) statusEl.textContent = "Não foi possível atualizar agora. Mantive a última cotação salva.";
      return false;
    }
  }

  function formatNumber(v, {max=2, min=2}={}){
    const n = Number(v);
    if(!isFinite(n)) return "0";
    return n.toLocaleString(undefined, { minimumFractionDigits:min, maximumFractionDigits:max });
  }

  function escHtml(s){
    return String(s ?? "").replace(/[&<>"']/g, (ch)=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[ch]));
  }

  function money(vBrl){
    const code = getCurrency();
    const v = Number(vBrl);
    const r = getRates();
    if(!isFinite(v)) return "–";

    const usd = r.BRL_PER_USD > 0 ? v / r.BRL_PER_USD : 0;
    const fiatValue = {
      BRL: v,
      USD: usd,
      EUR: usd * r.EUR_PER_USD,
      JPY: usd * r.JPY_PER_USD,
      CNY: usd * r.CNY_PER_USD,
    };

    if(["BRL","USD","EUR","JPY","CNY"].includes(code)){
      const decimals = code === "JPY" ? 0 : 2;
      try{
        return new Intl.NumberFormat(CURRENCY_LOCALE[code] || undefined, {
          style:"currency",
          currency:code,
          minimumFractionDigits:decimals,
          maximumFractionDigits:decimals
        }).format(fiatValue[code]);
      }catch{
        const prefix = code === "BRL" ? "R$" : code === "EUR" ? "€" : code === "JPY" ? "¥" : code === "CNY" ? "¥" : "$";
        return `${prefix} ${formatNumber(fiatValue[code],{max:decimals,min:decimals})}`;
      }
    }
    if(code === "BTC"){
      const btc = r.BTC_USD > 0 ? (usd / r.BTC_USD) : 0;
      return `₿ ${formatNumber(btc,{max:8,min:8})}`;
    }
    if(code === "SATS"){
      const btc = r.BTC_USD > 0 ? (usd / r.BTC_USD) : 0;
      const sats = Math.round(btc * 1e8);
      return `${sats.toLocaleString(undefined)} sats`;
    }
    return `R$ ${formatNumber(v,{max:2,min:2})}`;
  }

  // Add i18n strings without editing the giant dictionary blocks
  Object.assign(I18N.pt, {
    currency:"Moeda",
    currency_title:"Moeda e conversão",
    currency_sub:"A moeda acompanha automaticamente o idioma selecionado. Você também pode ajustar manualmente aqui.",
    currency_rates:"Taxas (editáveis)",
    currency_brl_per_usd:"BRL por USD",
    currency_eur_per_usd:"EUR por USD",
    currency_jpy_per_usd:"JPY por USD",
    currency_cny_per_usd:"CNY por USD",
    currency_btc_usd:"Preço do BTC (USD)",
    currency_save:"Salvar",
    currency_close:"Fechar",
    currency_est:"*Conversão estimada. Ajuste as taxas se necessário.",
    currency_update:"Atualizar online (opcional)",
    currency_updated:"Taxas atualizadas.",
    opt_unit:"Unidade",
    soon_badge:"Em breve",
  });
  Object.assign(I18N.en, {
    currency:"Currency",
    currency_title:"Currency & conversion",
    currency_sub:"Currency follows the selected language automatically. You can also adjust it here.",
    currency_rates:"Rates (editable)",
    currency_brl_per_usd:"BRL per USD",
    currency_eur_per_usd:"EUR per USD",
    currency_jpy_per_usd:"JPY per USD",
    currency_cny_per_usd:"CNY per USD",
    currency_btc_usd:"BTC price (USD)",
    currency_save:"Save",
    currency_close:"Close",
    currency_est:"*Estimated conversion. Adjust rates if needed.",
    currency_update:"Update online (optional)",
    currency_updated:"Rates updated.",
    opt_unit:"Unit",
    soon_badge:"Coming soon",
  });

  Object.assign(I18N.fr, {
    currency:"Devise",
    currency_title:"Devise et conversion",
    currency_sub:"La devise suit automatiquement la langue sélectionnée. Vous pouvez aussi l’ajuster ici.",
    currency_rates:"Taux (modifiables)",
    currency_brl_per_usd:"BRL par USD",
    currency_eur_per_usd:"EUR par USD",
    currency_jpy_per_usd:"JPY par USD",
    currency_cny_per_usd:"CNY par USD",
    currency_btc_usd:"Prix du BTC (USD)",
    currency_save:"Enregistrer",
    currency_close:"Fermer",
    currency_est:"*Conversion estimée. Ajustez les taux si nécessaire.",
    currency_update:"Mettre à jour en ligne (optionnel)",
    currency_updated:"Taux mis à jour.",
  });
  Object.assign(I18N.it, {
    currency:"Valuta",
    currency_title:"Valuta e conversione",
    currency_sub:"La valuta segue automaticamente la lingua selezionata. Puoi anche modificarla qui.",
    currency_rates:"Tassi (modificabili)",
    currency_brl_per_usd:"BRL per USD",
    currency_eur_per_usd:"EUR per USD",
    currency_jpy_per_usd:"JPY per USD",
    currency_cny_per_usd:"CNY per USD",
    currency_btc_usd:"Prezzo BTC (USD)",
    currency_save:"Salva",
    currency_close:"Chiudi",
    currency_est:"*Conversione stimata. Modifica i tassi se necessario.",
    currency_update:"Aggiorna online (opzionale)",
    currency_updated:"Tassi aggiornati.",
  });
  Object.assign(I18N.es, {
    currency:"Moneda",
    currency_title:"Moneda y conversión",
    currency_sub:"La moneda sigue automáticamente el idioma seleccionado. También puedes ajustarla aquí.",
    currency_rates:"Tasas (editables)",
    currency_brl_per_usd:"BRL por USD",
    currency_eur_per_usd:"EUR por USD",
    currency_jpy_per_usd:"JPY por USD",
    currency_cny_per_usd:"CNY por USD",
    currency_btc_usd:"Precio BTC (USD)",
    currency_save:"Guardar",
    currency_close:"Cerrar",
    currency_est:"*Conversión estimada. Ajusta las tasas si es necesario.",
    currency_update:"Actualizar online (opcional)",
    currency_updated:"Tasas actualizadas.",
  });
  Object.assign(I18N.de, {
    currency:"Währung",
    currency_title:"Währung und Umrechnung",
    currency_sub:"Die Währung folgt automatisch der gewählten Sprache. Sie können sie hier auch manuell anpassen.",
    currency_rates:"Kurse (bearbeitbar)",
    currency_brl_per_usd:"BRL pro USD",
    currency_eur_per_usd:"EUR pro USD",
    currency_jpy_per_usd:"JPY pro USD",
    currency_cny_per_usd:"CNY pro USD",
    currency_btc_usd:"BTC-Preis (USD)",
    currency_save:"Speichern",
    currency_close:"Schließen",
    currency_est:"*Geschätzte Umrechnung. Passen Sie die Kurse bei Bedarf an.",
    currency_update:"Online aktualisieren (optional)",
    currency_updated:"Kurse aktualisiert.",
  });
  Object.assign(I18N.ja, {
    currency:"通貨",
    currency_title:"通貨と換算",
    currency_sub:"通貨は選択した言語に合わせて自動的に切り替わります。ここで手動調整もできます。",
    currency_rates:"レート（編集可）",
    currency_brl_per_usd:"USDあたりのBRL",
    currency_eur_per_usd:"USDあたりのEUR",
    currency_jpy_per_usd:"USDあたりのJPY",
    currency_cny_per_usd:"USDあたりのCNY",
    currency_btc_usd:"BTC価格（USD）",
    currency_save:"保存",
    currency_close:"閉じる",
    currency_est:"*推定換算です。必要に応じてレートを調整してください。",
    currency_update:"オンライン更新（任意）",
    currency_updated:"レートを更新しました。",
  });
  Object.assign(I18N.zh, {
    currency:"货币",
    currency_title:"货币与换算",
    currency_sub:"货币会根据所选语言自动切换，也可以在这里手动调整。",
    currency_rates:"汇率（可编辑）",
    currency_brl_per_usd:"每 USD 的 BRL",
    currency_eur_per_usd:"每 USD 的 EUR",
    currency_jpy_per_usd:"每 USD 的 JPY",
    currency_cny_per_usd:"每 USD 的 CNY",
    currency_btc_usd:"BTC 价格（USD）",
    currency_save:"保存",
    currency_close:"关闭",
    currency_est:"*估算换算。可按需调整汇率。",
    currency_update:"在线更新（可选）",
    currency_updated:"汇率已更新。",
  });

  
  /* ---------- Refined text translations for all selector languages ---------- */
  Object.assign(I18N.pt, {
    hero_title:"Catálogo premium",
    hero_sub:"Catálogo digital premium com navegação clara, produtos destacados e experiência pensada para mobile.",
    featured:"Produtos em destaque",
    choose_volume_strain:"Selecione a configuração do produto",
    product_about_title:"Ficha do produto",
    product_disclaimer:"Aviso: conteúdo informativo e demonstrativo. A disponibilidade, composição e rotulagem devem seguir a legislação local, restrições de idade e laudos do lote.",
    footer_desc_store:"Catálogo premium com curadoria visual, informações claras e experiência digital responsiva.",
    footer_newsletter_sub:"Receba novidades, prévias de catálogo e lançamentos selecionados.",
    footer_search_hint:"Digite um termo e pressione Enter para navegar pelo catálogo.",
    cannabinoids_title:"Principais canabinoides",
    cannabinoids_sub:"Informações gerais sobre compostos presentes em produtos de cannabis e cânhamo, com linguagem simples e foco educativo.",
    soon_box_text:"Produto em prévia visual. O carrinho fica desativado nesta etapa da demo.",
    image_of_product:"Imagem {n} de {name}",
    cat_cigars:"Charutaria",
    cat_extracts:"Extrações",
    all_categories:"Todas categorias"
  });
  Object.assign(I18N.en, {
    hero_title:"Premium catalog",
    hero_sub:"A premium digital catalog with clear navigation, highlighted products and a mobile-first experience.",
    featured:"Featured products",
    choose_volume_strain:"Select the product configuration",
    product_about_title:"Product profile",
    product_disclaimer:"Notice: informational and demonstrative content. Availability, composition and labeling must follow local law, age restrictions and batch lab reports.",
    footer_desc_store:"Premium catalog with visual curation, clear information and a responsive digital experience.",
    footer_newsletter_sub:"Receive updates, catalog previews and selected launches.",
    footer_search_hint:"Type a term and press Enter to browse the catalog.",
    cannabinoids_title:"Main cannabinoids",
    cannabinoids_sub:"General information about compounds found in cannabis and hemp products, in simple educational language.",
    soon_box_text:"Product shown as a visual preview. The cart is disabled at this stage of the demo.",
    image_of_product:"Image {n} of {name}",
    cat_cigars:"Pre-rolls",
    cat_extracts:"Extracts",
    all_categories:"All categories",
    soon_badge:"Coming soon",
    opt_unit:"Unit"
  });
  Object.assign(I18N.fr, {
    hero_title:"Catalogue premium",
    hero_sub:"Un catalogue digital premium avec une navigation claire, des produits mis en avant et une expérience pensée pour le mobile.",
    featured:"Produits en vedette",
    choose_volume_strain:"Sélectionnez la configuration du produit",
    product_about_title:"Fiche produit",
    product_disclaimer:"Avis : contenu informatif et démonstratif. La disponibilité, la composition et l’étiquetage doivent respecter la loi locale, les restrictions d’âge et les analyses de lot.",
    footer_desc_store:"Catalogue premium avec curation visuelle, informations claires et expérience digitale responsive.",
    footer_newsletter_sub:"Recevez les nouveautés, aperçus de catalogue et lancements sélectionnés.",
    footer_search_hint:"Saisissez un terme et appuyez sur Entrée pour parcourir le catalogue.",
    cannabinoids_title:"Principaux cannabinoïdes",
    cannabinoids_sub:"Informations générales sur les composés présents dans les produits de cannabis et de chanvre, avec un langage simple et éducatif.",
    soon_box_text:"Produit affiché en aperçu visuel. Le panier est désactivé à cette étape de la démo.",
    image_of_product:"Image {n} de {name}",
    cat_cigars:"Pré-rolls",
    cat_extracts:"Extractions",
    all_categories:"Toutes les catégories",
    soon_badge:"Bientôt",
    opt_unit:"Unité"
  });
  Object.assign(I18N.it, {
    hero_title:"Catalogo premium",
    hero_sub:"Un catalogo digitale premium con navigazione chiara, prodotti in evidenza ed esperienza pensata per mobile.",
    featured:"Prodotti in evidenza",
    choose_volume_strain:"Seleziona la configurazione del prodotto",
    product_about_title:"Scheda prodotto",
    product_disclaimer:"Avviso: contenuto informativo e dimostrativo. Disponibilità, composizione ed etichettatura devono rispettare legge locale, limiti di età e analisi del lotto.",
    footer_desc_store:"Catalogo premium con curatela visiva, informazioni chiare ed esperienza digitale responsive.",
    footer_newsletter_sub:"Ricevi novità, anteprime di catalogo e lanci selezionati.",
    footer_search_hint:"Digita un termine e premi Invio per navigare nel catalogo.",
    cannabinoids_title:"Principali cannabinoidi",
    cannabinoids_sub:"Informazioni generali sui composti presenti nei prodotti di cannabis e canapa, con linguaggio semplice ed educativo.",
    soon_box_text:"Prodotto mostrato come anteprima visiva. Il carrello è disattivato in questa fase della demo.",
    image_of_product:"Immagine {n} di {name}",
    cat_cigars:"Pre-roll",
    cat_extracts:"Estrazioni",
    all_categories:"Tutte le categorie",
    soon_badge:"Prossimamente",
    opt_unit:"Unità"
  });
  Object.assign(I18N.es, {
    hero_title:"Catálogo premium",
    hero_sub:"Un catálogo digital premium con navegación clara, productos destacados y experiencia pensada para mobile.",
    featured:"Productos destacados",
    choose_volume_strain:"Selecciona la configuración del producto",
    product_about_title:"Ficha del producto",
    product_disclaimer:"Aviso: contenido informativo y demostrativo. Disponibilidad, composición y etiquetado deben cumplir la ley local, restricciones de edad y análisis del lote.",
    footer_desc_store:"Catálogo premium con curaduría visual, información clara y experiencia digital responsiva.",
    footer_newsletter_sub:"Recibe novedades, avances del catálogo y lanzamientos seleccionados.",
    footer_search_hint:"Escribe un término y presiona Enter para navegar por el catálogo.",
    cannabinoids_title:"Principales cannabinoides",
    cannabinoids_sub:"Información general sobre compuestos presentes en productos de cannabis y cáñamo, con lenguaje simple y educativo.",
    soon_box_text:"Producto mostrado como vista previa visual. El carrito está desactivado en esta etapa de la demo.",
    image_of_product:"Imagen {n} de {name}",
    cat_cigars:"Pre-rolls",
    cat_extracts:"Extracciones",
    all_categories:"Todas las categorías",
    soon_badge:"Próximamente",
    opt_unit:"Unidad"
  });
  Object.assign(I18N.de, {
    hero_title:"Premium-Katalog",
    hero_sub:"Ein digitaler Premium-Katalog mit klarer Navigation, hervorgehobenen Produkten und Mobile-First-Erlebnis.",
    featured:"Ausgewählte Produkte",
    choose_volume_strain:"Produktkonfiguration auswählen",
    product_about_title:"Produktprofil",
    product_disclaimer:"Hinweis: informativer und demonstrativer Inhalt. Verfügbarkeit, Zusammensetzung und Kennzeichnung müssen lokales Recht, Altersbeschränkungen und Chargenanalysen beachten.",
    footer_desc_store:"Premium-Katalog mit visueller Kuration, klaren Informationen und responsiver digitaler Erfahrung.",
    footer_newsletter_sub:"Erhalten Sie Neuigkeiten, Katalogvorschauen und ausgewählte Launches.",
    footer_search_hint:"Geben Sie einen Begriff ein und drücken Sie Enter, um den Katalog zu durchsuchen.",
    cannabinoids_title:"Wichtige Cannabinoide",
    cannabinoids_sub:"Allgemeine Informationen zu Verbindungen in Cannabis- und Hanfprodukten, einfach und edukativ erklärt.",
    soon_box_text:"Produkt als visuelle Vorschau. Der Warenkorb ist in dieser Demo-Phase deaktiviert.",
    image_of_product:"Bild {n} von {name}",
    cat_cigars:"Pre-rolls",
    cat_extracts:"Extrakte",
    all_categories:"Alle Kategorien",
    soon_badge:"Demnächst",
    opt_unit:"Einheit"
  });
  Object.assign(I18N.ja, {
    hero_title:"プレミアムカタログ",
    hero_sub:"わかりやすいナビゲーション、注目商品、モバイル向け体験を備えたプレミアムデジタルカタログ。",
    featured:"おすすめ商品",
    choose_volume_strain:"商品の設定を選択",
    product_about_title:"商品プロフィール",
    product_disclaimer:"注意：情報提供およびデモ用コンテンツです。入手可能性、成分、表示は現地法、年齢制限、ロット検査に従う必要があります。",
    footer_desc_store:"視覚的に整理された、情報がわかりやすいレスポンシブなプレミアムカタログ。",
    footer_newsletter_sub:"ニュース、カタログのプレビュー、選定された新商品情報を受け取れます。",
    footer_search_hint:"キーワードを入力し、Enterでカタログを検索します。",
    cannabinoids_title:"主なカンナビノイド",
    cannabinoids_sub:"大麻およびヘンプ製品に含まれる成分について、シンプルで教育的な表現でまとめた一般情報です。",
    soon_box_text:"この商品はビジュアルプレビューです。デモのこの段階ではカートは無効です。",
    image_of_product:"{name} の画像 {n}",
    cat_cigars:"プレロール",
    cat_extracts:"抽出製品",
    all_categories:"すべてのカテゴリ",
    soon_badge:"近日公開",
    opt_unit:"単位"
  });
  Object.assign(I18N.zh, {
    hero_title:"高端目录",
    hero_sub:"具备清晰导航、重点商品展示和移动端体验的高端数字目录。",
    featured:"精选产品",
    choose_volume_strain:"选择产品配置",
    product_about_title:"产品档案",
    product_disclaimer:"提示：此为信息与演示内容。可售性、成分和标签必须遵守当地法律、年龄限制和批次检测报告。",
    footer_desc_store:"具备视觉策展、清晰信息和响应式体验的高端目录。",
    footer_newsletter_sub:"接收新品、目录预览和精选发布信息。",
    footer_search_hint:"输入关键词并按 Enter 浏览目录。",
    cannabinoids_title:"主要大麻素",
    cannabinoids_sub:"关于大麻与工业大麻产品中常见成分的一般信息，以简单的教育性语言呈现。",
    soon_box_text:"该产品为视觉预览。本演示阶段购物车已禁用。",
    image_of_product:"{name} 的第 {n} 张图片",
    cat_cigars:"预卷",
    cat_extracts:"提取物",
    all_categories:"全部分类",
    soon_badge:"即将推出",
    opt_unit:"单位"
  });


  /* ---------- Cart/checkout dynamic text translations ---------- */
  Object.assign(I18N.pt, {
    cart_review_subtitle:"Revise os itens selecionados antes de avançar para o checkout.",
    cart_summary_title:"Resumo do carrinho",
    cart_summary_subtitle:"Acompanha a rolagem para manter o total sempre visível.",
    no_chargeback:"Sem chargeback",
    country_default:"Brasil",
    card_demo_note:"Demonstração: em produção, processe cartão via adquirente/gateway e libere somente após confirmação.",
    boleto_demo_note:"Demonstração: em produção, gere boleto via banco ou gateway integrado.",
    bank_transfer_demo_note:"Demonstração: use os dados abaixo para TED/DOC."
  });
  Object.assign(I18N.en, {
    cart_review_subtitle:"Review the selected items before moving to checkout.",
    cart_summary_title:"Cart summary",
    cart_summary_subtitle:"Follows the scroll so the total stays visible.",
    no_chargeback:"No chargeback",
    country_default:"Brazil",
    card_demo_note:"Demo: in production, process cards through an acquirer/gateway and release only after confirmation.",
    boleto_demo_note:"Demo: in production, generate boleto through a bank or integrated gateway.",
    bank_transfer_demo_note:"Demo: use the details below for TED/DOC."
  });
  Object.assign(I18N.fr, {
    cart_review_subtitle:"Vérifiez les articles sélectionnés avant de passer au checkout.",
    cart_summary_title:"Résumé du panier",
    cart_summary_subtitle:"Suit le défilement afin de garder le total visible.",
    no_chargeback:"Sans chargeback",
    country_default:"Brésil",
    card_demo_note:"Démo : en production, traitez les cartes via un acquéreur/gateway et libérez seulement après confirmation.",
    boleto_demo_note:"Démo : en production, générez le boleto via une banque ou une passerelle intégrée.",
    bank_transfer_demo_note:"Démo : utilisez les informations ci-dessous pour TED/DOC."
  });
  Object.assign(I18N.it, {
    cart_review_subtitle:"Rivedi gli articoli selezionati prima di procedere al checkout.",
    cart_summary_title:"Riepilogo carrello",
    cart_summary_subtitle:"Segue lo scroll per mantenere il totale sempre visibile.",
    no_chargeback:"Nessun chargeback",
    country_default:"Brasile",
    card_demo_note:"Demo: in produzione, processa le carte tramite acquirer/gateway e libera solo dopo conferma.",
    boleto_demo_note:"Demo: in produzione, genera il boleto tramite banca o gateway integrato.",
    bank_transfer_demo_note:"Demo: usa i dati qui sotto per TED/DOC."
  });
  Object.assign(I18N.es, {
    cart_review_subtitle:"Revisa los artículos seleccionados antes de avanzar al checkout.",
    cart_summary_title:"Resumen del carrito",
    cart_summary_subtitle:"Acompaña el desplazamiento para mantener el total siempre visible.",
    no_chargeback:"Sin chargeback",
    country_default:"Brasil",
    card_demo_note:"Demo: en producción, procesa tarjetas mediante adquirente/gateway y libera solo tras confirmación.",
    boleto_demo_note:"Demo: en producción, genera boleto mediante banco o gateway integrado.",
    bank_transfer_demo_note:"Demo: usa los datos abajo para TED/DOC."
  });
  Object.assign(I18N.de, {
    cart_review_subtitle:"Überprüfen Sie die ausgewählten Artikel, bevor Sie zum Checkout gehen.",
    cart_summary_title:"Warenkorbübersicht",
    cart_summary_subtitle:"Folgt beim Scrollen, damit die Summe sichtbar bleibt.",
    no_chargeback:"Kein Chargeback",
    country_default:"Brasilien",
    card_demo_note:"Demo: In Produktion Karten über Acquirer/Gateway verarbeiten und erst nach Bestätigung freigeben.",
    boleto_demo_note:"Demo: In Produktion Boleto über Bank oder integriertes Gateway erzeugen.",
    bank_transfer_demo_note:"Demo: Verwenden Sie die untenstehenden Daten für TED/DOC."
  });
  Object.assign(I18N.ja, {
    cart_review_subtitle:"チェックアウトへ進む前に、選択した商品を確認してください。",
    cart_summary_title:"カート概要",
    cart_summary_subtitle:"スクロールに合わせて表示され、合計金額を確認しやすくします。",
    no_chargeback:"チャージバックなし",
    country_default:"ブラジル",
    card_demo_note:"デモ：本番ではアクワイアラ/ゲートウェイでカードを処理し、確認後にのみ確定します。",
    boleto_demo_note:"デモ：本番では銀行または統合ゲートウェイで boleto を生成します。",
    bank_transfer_demo_note:"デモ：TED/DOCには以下の情報を使用します。"
  });
  Object.assign(I18N.zh, {
    cart_review_subtitle:"进入结账前，请确认已选择的商品。",
    cart_summary_title:"购物车摘要",
    cart_summary_subtitle:"随页面滚动显示，方便随时查看总计。",
    no_chargeback:"无拒付",
    country_default:"巴西",
    card_demo_note:"演示：生产环境中应通过收单方/支付网关处理银行卡，并在确认后释放订单。",
    boleto_demo_note:"演示：生产环境中应通过银行或集成网关生成 boleto。",
    bank_transfer_demo_note:"演示：TED/DOC 请使用以下信息。"
  });


  /* ---------- Final public-facing copy: no demo/chat-command references ---------- */
  Object.assign(I18N.pt, {
    create_demo:"Use seu e-mail e senha para entrar",
    order_ok:"Pedido gerado com sucesso.",
    checkout_terms:"Ao finalizar, você concorda com os termos, a política de privacidade e as regras legais aplicáveis.",
    pay_hint_card:"Pagamento por cartão sujeito à confirmação da operadora.",
    pay_hint_fiat:"Pagamentos em reais ficam pendentes até a compensação.",
    product_disclaimer:"Aviso: produto destinado a adultos e sujeito à legislação local. O uso excessivo de substâncias psicoativas pode causar efeitos adversos; consuma com responsabilidade.",
    soon_box_text:"Produto listado como lançamento futuro. A disponibilidade depende de conformidade legal e liberação de estoque.",
    card_demo_note:"Em produção, processe cartão via adquirente/gateway e libere somente após confirmação.",
    boleto_demo_note:"Gere o boleto via banco ou gateway integrado.",
    bank_transfer_demo_note:"Use os dados abaixo para TED/DOC.",
    hoc_form_demo:"Formulário sujeito à integração de envio.",
    notice_sub:"Conteúdo institucional. Operações e portfólio estão sujeitos à legislação e normas vigentes."
  });
  Object.assign(I18N.en, {
    create_demo:"Use your email and password to sign in",
    order_ok:"Order created successfully.",
    checkout_terms:"By placing the order, you agree to the terms, privacy policy and applicable legal rules.",
    pay_hint_card:"Card payment is subject to operator confirmation.",
    pay_hint_fiat:"BRL payments remain pending until cleared.",
    product_disclaimer:"Notice: product intended for adults and subject to local law. Excessive use of psychoactive substances may cause adverse effects; consume responsibly.",
    soon_box_text:"Product listed as a future launch. Availability depends on legal compliance and stock release.",
    card_demo_note:"Process cards through an acquirer/gateway and release only after confirmation.",
    boleto_demo_note:"Generate boleto through a bank or integrated gateway.",
    bank_transfer_demo_note:"Use the details below for TED/DOC.",
    hoc_form_demo:"Form subject to send integration.",
    notice_sub:"Institutional content. Operations and portfolio are subject to current laws and regulations."
  });
  Object.assign(I18N.fr, {
    create_demo:"Utilisez votre e-mail et votre mot de passe pour vous connecter",
    order_ok:"Commande créée avec succès.",
    checkout_terms:"En validant la commande, vous acceptez les conditions, la politique de confidentialité et les règles légales applicables.",
    pay_hint_card:"Le paiement par carte est soumis à confirmation de l’opérateur.",
    pay_hint_fiat:"Les paiements en BRL restent en attente jusqu’à compensation.",
    product_disclaimer:"Avis : produit destiné aux adultes et soumis à la loi locale. L’usage excessif de substances psychoactives peut provoquer des effets indésirables ; consommez avec responsabilité.",
    soon_box_text:"Produit listé comme lancement futur. La disponibilité dépend de la conformité légale et de la libération du stock.",
    card_demo_note:"Traitez les cartes via un acquéreur/gateway et libérez seulement après confirmation.",
    boleto_demo_note:"Générez le boleto via une banque ou une passerelle intégrée.",
    bank_transfer_demo_note:"Utilisez les informations ci-dessous pour TED/DOC.",
    hoc_form_demo:"Formulaire soumis à une intégration d’envoi.",
    notice_sub:"Contenu institutionnel. Les opérations et le portefeuille sont soumis aux lois et réglementations en vigueur."
  });
  Object.assign(I18N.it, {
    create_demo:"Usa e-mail e password per accedere",
    order_ok:"Ordine creato con successo.",
    checkout_terms:"Finalizzando l’ordine accetti termini, privacy policy e norme legali applicabili.",
    pay_hint_card:"Il pagamento con carta è soggetto a conferma dell’operatore.",
    pay_hint_fiat:"I pagamenti in BRL restano in attesa fino alla compensazione.",
    product_disclaimer:"Avviso: prodotto destinato ad adulti e soggetto alla legge locale. L’uso eccessivo di sostanze psicoattive può causare effetti avversi; consumare responsabilmente.",
    soon_box_text:"Prodotto indicato come lancio futuro. La disponibilità dipende dalla conformità legale e dal rilascio dello stock.",
    card_demo_note:"Processa le carte tramite acquirer/gateway e libera solo dopo conferma.",
    boleto_demo_note:"Genera il boleto tramite banca o gateway integrato.",
    bank_transfer_demo_note:"Usa i dati qui sotto per TED/DOC.",
    hoc_form_demo:"Modulo soggetto a integrazione di invio.",
    notice_sub:"Contenuto istituzionale. Operazioni e portafoglio sono soggetti a leggi e regolamenti vigenti."
  });
  Object.assign(I18N.es, {
    create_demo:"Usa tu e-mail y contraseña para entrar",
    order_ok:"Pedido creado correctamente.",
    checkout_terms:"Al finalizar, aceptas los términos, la política de privacidad y las normas legales aplicables.",
    pay_hint_card:"El pago con tarjeta está sujeto a confirmación de la operadora.",
    pay_hint_fiat:"Los pagos en BRL quedan pendientes hasta la compensación.",
    product_disclaimer:"Aviso: producto destinado a adultos y sujeto a la legislación local. El uso excesivo de sustancias psicoactivas puede causar efectos adversos; consume con responsabilidad.",
    soon_box_text:"Producto listado como lanzamiento futuro. La disponibilidad depende del cumplimiento legal y la liberación de stock.",
    card_demo_note:"Procesa tarjetas mediante adquirente/gateway y libera solo tras confirmación.",
    boleto_demo_note:"Genera boleto mediante banco o gateway integrado.",
    bank_transfer_demo_note:"Usa los datos abajo para TED/DOC.",
    hoc_form_demo:"Formulario sujeto a integración de envío.",
    notice_sub:"Contenido institucional. Operaciones y portafolio están sujetos a leyes y normas vigentes."
  });
  Object.assign(I18N.de, {
    create_demo:"Mit E-Mail und Passwort anmelden",
    order_ok:"Bestellung erfolgreich erstellt.",
    checkout_terms:"Mit Abschluss der Bestellung akzeptieren Sie Bedingungen, Datenschutzrichtlinie und geltende gesetzliche Regeln.",
    pay_hint_card:"Kartenzahlung unterliegt der Bestätigung des Betreibers.",
    pay_hint_fiat:"BRL-Zahlungen bleiben bis zur Verrechnung ausstehend.",
    product_disclaimer:"Hinweis: Produkt für Erwachsene und vorbehaltlich lokaler Gesetze. Übermäßiger Konsum psychoaktiver Substanzen kann Nebenwirkungen verursachen; verantwortungsvoll konsumieren.",
    soon_box_text:"Produkt als zukünftiger Launch gelistet. Verfügbarkeit hängt von rechtlicher Konformität und Bestandsfreigabe ab.",
    card_demo_note:"Karten über Acquirer/Gateway verarbeiten und erst nach Bestätigung freigeben.",
    boleto_demo_note:"Boleto über Bank oder integriertes Gateway erstellen.",
    bank_transfer_demo_note:"Verwenden Sie die untenstehenden Daten für TED/DOC.",
    hoc_form_demo:"Formular erfordert Sendeintegration.",
    notice_sub:"Institutioneller Inhalt. Betrieb und Portfolio unterliegen geltenden Gesetzen und Vorschriften."
  });
  Object.assign(I18N.ja, {
    create_demo:"メールアドレスとパスワードでログイン",
    order_ok:"注文が正常に作成されました。",
    checkout_terms:"注文を完了すると、利用規約、プライバシーポリシー、適用される法規則に同意したものとみなされます。",
    pay_hint_card:"カード決済は決済事業者の確認が必要です。",
    pay_hint_fiat:"BRLでの支払いは清算完了まで保留されます。",
    product_disclaimer:"注意：成人向けであり、現地法の対象となる製品です。精神作用のある物質の過度な使用は有害な影響を引き起こす可能性があります。責任を持って使用してください。",
    soon_box_text:"今後の発売予定商品です。提供可否は法令遵守と在庫の解放により決まります。",
    card_demo_note:"カードはアクワイアラ/ゲートウェイで処理し、確認後にのみ確定してください。",
    boleto_demo_note:"銀行または統合ゲートウェイで boleto を生成します。",
    bank_transfer_demo_note:"TED/DOCには以下の情報を使用します。",
    hoc_form_demo:"送信連携が必要なフォームです。",
    notice_sub:"機関向けコンテンツです。運用とポートフォリオは現行の法律および規制の対象です。"
  });
  Object.assign(I18N.zh, {
    create_demo:"使用邮箱和密码登录",
    order_ok:"订单已成功创建。",
    checkout_terms:"完成订单即表示你同意条款、隐私政策和适用法律规则。",
    pay_hint_card:"银行卡支付需经运营方确认。",
    pay_hint_fiat:"BRL 支付在清算完成前保持待处理状态。",
    product_disclaimer:"提示：产品面向成年人，并受当地法律约束。过量使用精神活性物质可能导致不良影响；请负责任使用。",
    soon_box_text:"该产品列为未来发布。可用性取决于法律合规和库存释放。",
    card_demo_note:"请通过收单方/支付网关处理银行卡，并在确认后释放订单。",
    boleto_demo_note:"通过银行或集成网关生成 boleto。",
    bank_transfer_demo_note:"TED/DOC 请使用以下信息。",
    hoc_form_demo:"表单需接入发送集成。",
    notice_sub:"机构内容。运营和产品组合受现行法律法规约束。"
  });


  /* ---------- Hemp Oil Company: minimalist institutional copy ---------- */
  Object.assign(I18N.pt, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"Operação institucional focada em qualidade, rastreabilidade e desenvolvimento responsável para mercados regulados.",
    hoc_btn_solutions:"Ver soluções",
    hoc_btn_store:"Conhecer catálogo",
    hoc_areas_title:"Estrutura de atuação",
    hoc_card_rd_title:"Pesquisa e desenvolvimento",
    hoc_card_rd_sub:"Especificações, estabilidade e documentação técnica com linguagem clara.",
    hoc_card_quality_title:"Qualidade e rastreabilidade",
    hoc_card_quality_sub:"Controle por lote, cadeia de custódia e consistência operacional.",
    hoc_card_compliance_title:"Governança e conformidade",
    hoc_card_compliance_sub:"Processos internos alinhados às normas aplicáveis e ao escopo de cada mercado.",
    hoc_about_title:"Quem somos",
    hoc_about_p1:"A Hemp Oil Company S.A. atua na organização de processos, portfólio e documentação para produtos em mercados regulados.",
    hoc_about_p2:"A proposta é simples: clareza, qualidade e responsabilidade em cada etapa — da seleção de parceiros à apresentação final.",
    hoc_about_points:"Qualidade por lote • Documentação técnica • Seleção de parceiros • Portfólio com foco em conformidade",
    hoc_commitment_title:"Compromisso",
    hoc_commitment_p:"Trabalhar com transparência, critérios claros e comunicação objetiva, respeitando a legislação aplicável.",
    hoc_contact_title:"Contato B2B",
    hoc_contact_sub:"Entre em contato para parcerias, distribuição, desenvolvimento de portfólio e projetos institucionais.",
    hoc_quick_msg:"Mensagem rápida",
    notice_sub:"Operações e portfólio estão sujeitos à legislação e às normas vigentes."
  });
  Object.assign(I18N.en, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"An institutional operation focused on quality, traceability and responsible development for regulated markets.",
    hoc_btn_solutions:"View solutions",
    hoc_btn_store:"View catalog",
    hoc_areas_title:"Operating structure",
    hoc_card_rd_title:"Research and development",
    hoc_card_rd_sub:"Specifications, stability and technical documentation in clear language.",
    hoc_card_quality_title:"Quality and traceability",
    hoc_card_quality_sub:"Batch control, chain of custody and operational consistency.",
    hoc_card_compliance_title:"Governance and compliance",
    hoc_card_compliance_sub:"Internal processes aligned with applicable standards and each market scope.",
    hoc_about_title:"About us",
    hoc_about_p1:"Hemp Oil Company S.A. organizes processes, portfolio and documentation for products in regulated markets.",
    hoc_about_p2:"The proposal is simple: clarity, quality and responsibility at every stage — from partner selection to final presentation.",
    hoc_about_points:"Batch quality • Technical documentation • Partner selection • Compliance-focused portfolio",
    hoc_commitment_title:"Commitment",
    hoc_commitment_p:"Work with transparency, clear criteria and objective communication while respecting applicable law.",
    hoc_contact_title:"B2B contact",
    hoc_contact_sub:"Contact us for partnerships, distribution, portfolio development and institutional projects.",
    hoc_quick_msg:"Quick message",
    notice_sub:"Operations and portfolio are subject to current laws and regulations."
  });
  Object.assign(I18N.es, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"Operación institucional enfocada en calidad, trazabilidad y desarrollo responsable para mercados regulados.",
    hoc_btn_solutions:"Ver soluciones",
    hoc_btn_store:"Ver catálogo",
    hoc_areas_title:"Estructura de actuación",
    hoc_card_rd_title:"Investigación y desarrollo",
    hoc_card_rd_sub:"Especificaciones, estabilidad y documentación técnica con lenguaje claro.",
    hoc_card_quality_title:"Calidad y trazabilidad",
    hoc_card_quality_sub:"Control por lote, cadena de custodia y consistencia operativa.",
    hoc_card_compliance_title:"Gobernanza y cumplimiento",
    hoc_card_compliance_sub:"Procesos internos alineados con normas aplicables y el alcance de cada mercado.",
    hoc_about_title:"Quiénes somos",
    hoc_about_p1:"Hemp Oil Company S.A. organiza procesos, portafolio y documentación para productos en mercados regulados.",
    hoc_about_p2:"La propuesta es simple: claridad, calidad y responsabilidad en cada etapa, desde la selección de socios hasta la presentación final.",
    hoc_about_points:"Calidad por lote • Documentación técnica • Selección de socios • Portafolio enfocado en cumplimiento",
    hoc_commitment_title:"Compromiso",
    hoc_commitment_p:"Trabajar con transparencia, criterios claros y comunicación objetiva, respetando la legislación aplicable.",
    hoc_contact_title:"Contacto B2B",
    hoc_contact_sub:"Contáctanos para alianzas, distribución, desarrollo de portafolio y proyectos institucionales.",
    hoc_quick_msg:"Mensaje rápido",
    notice_sub:"Operaciones y portafolio están sujetos a leyes y normas vigentes."
  });
  Object.assign(I18N.fr, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"Opération institutionnelle axée sur la qualité, la traçabilité et le développement responsable pour les marchés réglementés.",
    hoc_btn_solutions:"Voir les solutions",
    hoc_btn_store:"Voir le catalogue",
    hoc_areas_title:"Structure d’activité",
    hoc_card_rd_title:"Recherche et développement",
    hoc_card_rd_sub:"Spécifications, stabilité et documentation technique avec un langage clair.",
    hoc_card_quality_title:"Qualité et traçabilité",
    hoc_card_quality_sub:"Contrôle par lot, chaîne de traçabilité et cohérence opérationnelle.",
    hoc_card_compliance_title:"Gouvernance et conformité",
    hoc_card_compliance_sub:"Processus internes alignés sur les normes applicables et le périmètre de chaque marché.",
    hoc_about_title:"Qui sommes-nous",
    hoc_about_p1:"Hemp Oil Company S.A. structure les processus, le portefeuille et la documentation de produits pour marchés réglementés.",
    hoc_about_p2:"La proposition est simple : clarté, qualité et responsabilité à chaque étape.",
    hoc_about_points:"Qualité par lot • Documentation technique • Sélection de partenaires • Portefeuille orienté conformité",
    hoc_commitment_title:"Engagement",
    hoc_commitment_p:"Travailler avec transparence, critères clairs et communication objective, dans le respect de la loi applicable.",
    hoc_contact_title:"Contact B2B",
    hoc_contact_sub:"Contactez-nous pour partenariats, distribution, développement de portefeuille et projets institutionnels.",
    hoc_quick_msg:"Message rapide",
    notice_sub:"Les opérations et le portefeuille sont soumis aux lois et réglementations en vigueur."
  });
  Object.assign(I18N.it, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"Operazione istituzionale focalizzata su qualità, tracciabilità e sviluppo responsabile per mercati regolamentati.",
    hoc_btn_solutions:"Vedi soluzioni",
    hoc_btn_store:"Vedi catalogo",
    hoc_areas_title:"Struttura operativa",
    hoc_card_rd_title:"Ricerca e sviluppo",
    hoc_card_rd_sub:"Specifiche, stabilità e documentazione tecnica con linguaggio chiaro.",
    hoc_card_quality_title:"Qualità e tracciabilità",
    hoc_card_quality_sub:"Controllo per lotto, catena di custodia e coerenza operativa.",
    hoc_card_compliance_title:"Governance e conformità",
    hoc_card_compliance_sub:"Processi interni allineati alle norme applicabili e allo scopo di ogni mercato.",
    hoc_about_title:"Chi siamo",
    hoc_about_p1:"Hemp Oil Company S.A. organizza processi, portafoglio e documentazione per prodotti in mercati regolamentati.",
    hoc_about_p2:"La proposta è semplice: chiarezza, qualità e responsabilità in ogni fase.",
    hoc_about_points:"Qualità per lotto • Documentazione tecnica • Selezione partner • Portafoglio orientato alla conformità",
    hoc_commitment_title:"Impegno",
    hoc_commitment_p:"Lavorare con trasparenza, criteri chiari e comunicazione oggettiva, nel rispetto della legge applicabile.",
    hoc_contact_title:"Contatto B2B",
    hoc_contact_sub:"Contattaci per partnership, distribuzione, sviluppo portfolio e progetti istituzionali.",
    hoc_quick_msg:"Messaggio rapido",
    notice_sub:"Operazioni e portafoglio sono soggetti a leggi e regolamenti vigenti."
  });
  Object.assign(I18N.de, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"Institutioneller Betrieb mit Fokus auf Qualität, Rückverfolgbarkeit und verantwortungsvolle Entwicklung für regulierte Märkte.",
    hoc_btn_solutions:"Lösungen ansehen",
    hoc_btn_store:"Katalog ansehen",
    hoc_areas_title:"Tätigkeitsstruktur",
    hoc_card_rd_title:"Forschung und Entwicklung",
    hoc_card_rd_sub:"Spezifikationen, Stabilität und technische Dokumentation in klarer Sprache.",
    hoc_card_quality_title:"Qualität und Rückverfolgbarkeit",
    hoc_card_quality_sub:"Chargenkontrolle, Chain of Custody und operative Konsistenz.",
    hoc_card_compliance_title:"Governance und Compliance",
    hoc_card_compliance_sub:"Interne Prozesse im Einklang mit geltenden Standards und Marktanforderungen.",
    hoc_about_title:"Über uns",
    hoc_about_p1:"Hemp Oil Company S.A. strukturiert Prozesse, Portfolio und Dokumentation für Produkte in regulierten Märkten.",
    hoc_about_p2:"Der Ansatz ist einfach: Klarheit, Qualität und Verantwortung in jeder Phase.",
    hoc_about_points:"Chargenqualität • Technische Dokumentation • Partnerauswahl • Compliance-fokussiertes Portfolio",
    hoc_commitment_title:"Verpflichtung",
    hoc_commitment_p:"Transparent arbeiten, klare Kriterien anwenden und objektiv kommunizieren, unter Beachtung geltender Gesetze.",
    hoc_contact_title:"B2B-Kontakt",
    hoc_contact_sub:"Kontaktieren Sie uns für Partnerschaften, Distribution, Portfolioentwicklung und institutionelle Projekte.",
    hoc_quick_msg:"Kurznachricht",
    notice_sub:"Betrieb und Portfolio unterliegen geltenden Gesetzen und Vorschriften."
  });
  Object.assign(I18N.ja, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"規制市場に向けて、品質、トレーサビリティ、責任ある開発に重点を置く組織です。",
    hoc_btn_solutions:"ソリューションを見る",
    hoc_btn_store:"カタログを見る",
    hoc_areas_title:"事業領域",
    hoc_card_rd_title:"研究開発",
    hoc_card_rd_sub:"仕様、安定性、技術文書をわかりやすく整理します。",
    hoc_card_quality_title:"品質とトレーサビリティ",
    hoc_card_quality_sub:"ロット管理、流通履歴、運用品質の一貫性を重視します。",
    hoc_card_compliance_title:"ガバナンスとコンプライアンス",
    hoc_card_compliance_sub:"各市場の規制と範囲に沿った内部プロセス。",
    hoc_about_title:"私たちについて",
    hoc_about_p1:"Hemp Oil Company S.A. は、規制市場向け製品のプロセス、ポートフォリオ、文書化を整備します。",
    hoc_about_p2:"明確さ、品質、責任をすべての段階で大切にします。",
    hoc_about_points:"ロット品質 • 技術文書 • パートナー選定 • コンプライアンス重視のポートフォリオ",
    hoc_commitment_title:"コミットメント",
    hoc_commitment_p:"透明性、明確な基準、客観的なコミュニケーションを重視し、適用法を尊重します。",
    hoc_contact_title:"B2Bお問い合わせ",
    hoc_contact_sub:"提携、流通、ポートフォリオ開発、組織向けプロジェクトについてお問い合わせください。",
    hoc_quick_msg:"クイックメッセージ",
    notice_sub:"事業とポートフォリオは現行の法律および規制の対象です。"
  });
  Object.assign(I18N.zh, {
    hoc_title:"Hemp Oil Company S.A.",
    hoc_hero_sub:"面向合规市场，专注于质量、可追溯性和负责任开发的机构业务。",
    hoc_btn_solutions:"查看解决方案",
    hoc_btn_store:"查看目录",
    hoc_areas_title:"业务结构",
    hoc_card_rd_title:"研发",
    hoc_card_rd_sub:"以清晰语言整理规格、稳定性和技术文档。",
    hoc_card_quality_title:"质量与追溯",
    hoc_card_quality_sub:"按批次控制、监管链记录和运营一致性。",
    hoc_card_compliance_title:"治理与合规",
    hoc_card_compliance_sub:"内部流程与适用标准及各市场范围保持一致。",
    hoc_about_title:"关于我们",
    hoc_about_p1:"Hemp Oil Company S.A. 为合规市场中的产品组织流程、产品组合和文档。",
    hoc_about_p2:"核心很简单：在每个阶段保持清晰、质量和责任。",
    hoc_about_points:"批次质量 • 技术文档 • 合作伙伴选择 • 以合规为核心的产品组合",
    hoc_commitment_title:"承诺",
    hoc_commitment_p:"以透明、明确标准和客观沟通开展工作，并尊重适用法律。",
    hoc_contact_title:"B2B 联系",
    hoc_contact_sub:"欢迎就合作、分销、产品组合开发和机构项目联系我们。",
    hoc_quick_msg:"快速留言",
    notice_sub:"运营和产品组合受现行法律法规约束。"
  });

/* ---------- Catalog (demo / example) ---------- */
  const CATEGORIES = [
    { id:"strains", labelKey:"cat_strains" },
    { id:"cigars", labelKey:"cat_cigars" },
    { id:"extracts", labelKey:"cat_extracts" },
  ];

  // Catálogo enxuto solicitado: Strains, Charutaria (somente pre-roll) e Extrações (em breve).
  const STRAIN_LIST = [
    "OG Kush",
    "Purple Haze",
  ];


  /* ---------- Checkout/payment translation cleanup ---------- */
  const CHECKOUT_COPY = {
    pt: {
      selected_item:"Item selecionado",
      items_singular:"item",
      items_plural:"itens",
      checkout_transparent_badge:"Checkout transparente",
      checkout_finalize_eyebrow:"Finalizar pedido",
      checkout_hero_title:"Pagamento limpo, rápido e seguro.",
      checkout_hero_sub:"Revise os itens, escolha Mercado Pago ou PayPal e conclua a compra em uma experiência simples e organizada.",
      checkout_summary_toggle:"Ver resumo do pedido",
      checkout_summary_label:"Resumo do pedido",
      checkout_updated:"Atualizado",
      shipping_standard_label:"Padrão",
      shipping_express_label:"Expresso",
      fees:"Taxas",
      payment_details_aria:"Detalhes de pagamento",
      payment_providers:"Provedores de pagamento",
      payment_details_title:"Inserir detalhes de pagamento",
      payment_details_sub:"Checkout transparente com PIX, cartão, boleto, PayPal e opção alternativa em criptomoedas.",
      customer_data:"Dados do cliente",
      full_name:"Nome completo",
      full_name_ph:"Nome e sobrenome",
      delivery_title:"Entrega",
      address1_ph:"Rua, número",
      address2_ph:"Apartamento, bloco, referência",
      payment_method_title:"Forma de pagamento",
      pay_pix_desc:"Mercado Pago — QR Code e copia e cola",
      pay_card_name:"Cartão",
      pay_card_desc:"Checkout transparente via Mercado Pago",
      pay_boleto_desc:"Geração pelo Mercado Pago",
      pay_paypal_desc:"Conta PayPal ou cartão salvo",
      pay_crypto_name:"Criptomoedas",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"Revelar código QR",
      checkout_fine_print:"Ao finalizar, você autoriza a criação da cobrança no provedor selecionado. Valores em BRL podem variar conforme taxas do gateway e confirmação de pagamento.",
      copied:"Copiado",
      payhint_pix:"Um código QR será exibido para escanear e concluir a compra.",
      qr_pix_preview:"Prévia do QR Code Pix",
      pix_detail_title:"PIX via Mercado Pago",
      pix_detail_body:"Na integração real, o backend cria a cobrança no Mercado Pago e retorna o QR Code.",
      estimated_fees:"Taxas estimadas",
      amount_due:"Total devido",
      copy_pix:"Copiar Pix",
      payhint_card:"Os dados do cartão ficam nesta tela; em produção use tokenização segura do Mercado Pago.",
      pay_button_card:"Pagar com cartão",
      payhint_boleto:"O boleto é gerado pelo Mercado Pago e fica pendente até a compensação.",
      pay_button_boleto:"Gerar boleto",
      boleto_detail_title:"Boleto Mercado Pago",
      boleto_detail_body:"Use o código abaixo apenas para demonstração visual. Em produção, gere pelo backend.",
      copy_code:"Copiar código",
      payhint_paypal:"O comprador segue para autorização PayPal ou confirma com cartão salvo.",
      pay_button_paypal:"Continuar com PayPal",
      paypal_detail_title:"Pagamento via PayPal",
      paypal_detail_body:"Na produção, o backend cria uma ordem PayPal e retorna o link de aprovação.",
      authorized_total:"Total autorizado",
      initial_status:"Status inicial",
      pending:"Pendente",
      payhint_btc:"Pagamento alternativo em Bitcoin Lightning.",
      pay_button_btc:"Gerar invoice Lightning",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"Invoice de demonstração. Substitua por BTCPay Server/LNURL em produção.",
      checkout_fail:"Falha ao finalizar o pedido.",
      login_fail:"Falha ao entrar.",
      no_orders:"Nenhum pedido encontrado.",
      orders_load_fail:"Falha ao carregar pedidos:",
      currency_rates_unavailable:"Taxas de câmbio indisponíveis"
    },
    en: {
      selected_item:"Selected item",
      items_singular:"item",
      items_plural:"items",
      checkout_transparent_badge:"Transparent checkout",
      checkout_finalize_eyebrow:"Complete order",
      checkout_hero_title:"Clean, fast, secure payment.",
      checkout_hero_sub:"Review your items, choose Mercado Pago or PayPal, and complete the purchase in a simple, organized experience.",
      checkout_summary_toggle:"View order summary",
      checkout_summary_label:"Order summary",
      checkout_updated:"Updated",
      shipping_standard_label:"Standard",
      shipping_express_label:"Express",
      fees:"Fees",
      payment_details_aria:"Payment details",
      payment_providers:"Payment providers",
      payment_details_title:"Enter payment details",
      payment_details_sub:"Transparent checkout with PIX, card, boleto, PayPal and an alternative cryptocurrency option.",
      customer_data:"Customer details",
      full_name:"Full name",
      full_name_ph:"First and last name",
      delivery_title:"Delivery",
      address1_ph:"Street and number",
      address2_ph:"Apartment, block, reference",
      payment_method_title:"Payment method",
      pay_pix_desc:"Mercado Pago — QR Code and copy-paste code",
      pay_card_name:"Card",
      pay_card_desc:"Transparent checkout via Mercado Pago",
      pay_boleto_desc:"Generated through Mercado Pago",
      pay_paypal_desc:"PayPal account or saved card",
      pay_crypto_name:"Cryptocurrency",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"Reveal QR code",
      checkout_fine_print:"By placing the order, you authorize charge creation with the selected provider. BRL amounts may vary according to gateway fees and payment confirmation.",
      copied:"Copied",
      payhint_pix:"A QR code will be shown so you can scan it and complete the purchase.",
      qr_pix_preview:"Pix QR Code preview",
      pix_detail_title:"PIX via Mercado Pago",
      pix_detail_body:"In the real integration, the backend creates the Mercado Pago charge and returns the QR Code.",
      estimated_fees:"Estimated fees",
      amount_due:"Amount due",
      copy_pix:"Copy Pix",
      payhint_card:"Card details stay on this screen; in production, use secure Mercado Pago tokenization.",
      pay_button_card:"Pay by card",
      payhint_boleto:"The boleto is generated by Mercado Pago and remains pending until settlement.",
      pay_button_boleto:"Generate boleto",
      boleto_detail_title:"Mercado Pago boleto",
      boleto_detail_body:"Use the code below only as a visual demonstration. In production, generate it through the backend.",
      copy_code:"Copy code",
      payhint_paypal:"The buyer continues to PayPal authorization or confirms with a saved card.",
      pay_button_paypal:"Continue with PayPal",
      paypal_detail_title:"Payment via PayPal",
      paypal_detail_body:"In production, the backend creates a PayPal order and returns the approval link.",
      authorized_total:"Authorized total",
      initial_status:"Initial status",
      pending:"Pending",
      payhint_btc:"Alternative payment through Bitcoin Lightning.",
      pay_button_btc:"Generate Lightning invoice",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"Demonstration invoice. Replace it with BTCPay Server/LNURL in production.",
      checkout_fail:"Could not complete the order.",
      login_fail:"Could not sign in.",
      no_orders:"No orders found.",
      orders_load_fail:"Could not load orders:",
      currency_rates_unavailable:"Exchange rates unavailable"
    },
    fr: {
      selected_item:"Article sélectionné",
      items_singular:"article",
      items_plural:"articles",
      checkout_transparent_badge:"Paiement transparent",
      checkout_finalize_eyebrow:"Finaliser la commande",
      checkout_hero_title:"Paiement clair, rapide et sécurisé.",
      checkout_hero_sub:"Vérifiez les articles, choisissez Mercado Pago ou PayPal et finalisez l’achat dans une expérience simple et organisée.",
      checkout_summary_toggle:"Voir le récapitulatif",
      checkout_summary_label:"Récapitulatif de commande",
      checkout_updated:"Mis à jour",
      shipping_standard_label:"Standard",
      shipping_express_label:"Express",
      fees:"Frais",
      payment_details_aria:"Détails du paiement",
      payment_providers:"Prestataires de paiement",
      payment_details_title:"Saisir les informations de paiement",
      payment_details_sub:"Paiement transparent avec PIX, carte, boleto, PayPal et une option alternative en cryptomonnaie.",
      customer_data:"Données client",
      full_name:"Nom complet",
      full_name_ph:"Prénom et nom",
      delivery_title:"Livraison",
      address1_ph:"Rue et numéro",
      address2_ph:"Appartement, bâtiment, référence",
      payment_method_title:"Mode de paiement",
      pay_pix_desc:"Mercado Pago — QR Code et code à copier-coller",
      pay_card_name:"Carte",
      pay_card_desc:"Paiement transparent via Mercado Pago",
      pay_boleto_desc:"Généré par Mercado Pago",
      pay_paypal_desc:"Compte PayPal ou carte enregistrée",
      pay_crypto_name:"Cryptomonnaies",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"Afficher le QR Code",
      checkout_fine_print:"En finalisant, vous autorisez la création du paiement auprès du prestataire sélectionné. Les montants en BRL peuvent varier selon les frais de passerelle et la confirmation du paiement.",
      copied:"Copié",
      payhint_pix:"Un QR Code sera affiché pour scanner et finaliser l’achat.",
      qr_pix_preview:"Aperçu du QR Code Pix",
      pix_detail_title:"PIX via Mercado Pago",
      pix_detail_body:"Dans l’intégration réelle, le backend crée le paiement Mercado Pago et renvoie le QR Code.",
      estimated_fees:"Frais estimés",
      amount_due:"Total à payer",
      copy_pix:"Copier le Pix",
      payhint_card:"Les données de carte restent sur cet écran ; en production, utilisez la tokenisation sécurisée de Mercado Pago.",
      pay_button_card:"Payer par carte",
      payhint_boleto:"Le boleto est généré par Mercado Pago et reste en attente jusqu’à compensation.",
      pay_button_boleto:"Générer le boleto",
      boleto_detail_title:"Boleto Mercado Pago",
      boleto_detail_body:"Utilisez le code ci-dessous uniquement pour une démonstration visuelle. En production, générez-le via le backend.",
      copy_code:"Copier le code",
      payhint_paypal:"L’acheteur poursuit l’autorisation PayPal ou confirme avec une carte enregistrée.",
      pay_button_paypal:"Continuer avec PayPal",
      paypal_detail_title:"Paiement via PayPal",
      paypal_detail_body:"En production, le backend crée une commande PayPal et renvoie le lien d’approbation.",
      authorized_total:"Total autorisé",
      initial_status:"Statut initial",
      pending:"En attente",
      payhint_btc:"Paiement alternatif en Bitcoin Lightning.",
      pay_button_btc:"Générer une invoice Lightning",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"Invoice de démonstration. Remplacez-la par BTCPay Server/LNURL en production.",
      checkout_fail:"Impossible de finaliser la commande.",
      login_fail:"Impossible de se connecter.",
      no_orders:"Aucune commande trouvée.",
      orders_load_fail:"Impossible de charger les commandes :",
      currency_rates_unavailable:"Taux de change indisponibles"
    },
    it: {
      selected_item:"Articolo selezionato",
      items_singular:"articolo",
      items_plural:"articoli",
      checkout_transparent_badge:"Checkout trasparente",
      checkout_finalize_eyebrow:"Completa ordine",
      checkout_hero_title:"Pagamento pulito, rapido e sicuro.",
      checkout_hero_sub:"Rivedi gli articoli, scegli Mercado Pago o PayPal e completa l’acquisto in un’esperienza semplice e ordinata.",
      checkout_summary_toggle:"Vedi riepilogo ordine",
      checkout_summary_label:"Riepilogo ordine",
      checkout_updated:"Aggiornato",
      shipping_standard_label:"Standard",
      shipping_express_label:"Espresso",
      fees:"Commissioni",
      payment_details_aria:"Dettagli pagamento",
      payment_providers:"Provider di pagamento",
      payment_details_title:"Inserisci i dettagli di pagamento",
      payment_details_sub:"Checkout trasparente con PIX, carta, boleto, PayPal e opzione alternativa in criptovaluta.",
      customer_data:"Dati cliente",
      full_name:"Nome completo",
      full_name_ph:"Nome e cognome",
      delivery_title:"Consegna",
      address1_ph:"Via e numero",
      address2_ph:"Appartamento, blocco, riferimento",
      payment_method_title:"Metodo di pagamento",
      pay_pix_desc:"Mercado Pago — QR Code e codice copia-incolla",
      pay_card_name:"Carta",
      pay_card_desc:"Checkout trasparente via Mercado Pago",
      pay_boleto_desc:"Generazione tramite Mercado Pago",
      pay_paypal_desc:"Account PayPal o carta salvata",
      pay_crypto_name:"Criptovalute",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"Mostra codice QR",
      checkout_fine_print:"Finalizzando, autorizzi la creazione dell’addebito presso il provider selezionato. Gli importi in BRL possono variare in base alle commissioni del gateway e alla conferma del pagamento.",
      copied:"Copiato",
      payhint_pix:"Verrà mostrato un QR Code da scansionare per completare l’acquisto.",
      qr_pix_preview:"Anteprima QR Code Pix",
      pix_detail_title:"PIX via Mercado Pago",
      pix_detail_body:"Nell’integrazione reale, il backend crea l’addebito Mercado Pago e restituisce il QR Code.",
      estimated_fees:"Commissioni stimate",
      amount_due:"Totale dovuto",
      copy_pix:"Copia Pix",
      payhint_card:"I dati della carta restano in questa schermata; in produzione usa la tokenizzazione sicura di Mercado Pago.",
      pay_button_card:"Paga con carta",
      payhint_boleto:"Il boleto viene generato da Mercado Pago e resta in sospeso fino alla compensazione.",
      pay_button_boleto:"Genera boleto",
      boleto_detail_title:"Boleto Mercado Pago",
      boleto_detail_body:"Usa il codice qui sotto solo come dimostrazione visiva. In produzione, generalo tramite backend.",
      copy_code:"Copia codice",
      payhint_paypal:"L’acquirente procede con l’autorizzazione PayPal o conferma con una carta salvata.",
      pay_button_paypal:"Continua con PayPal",
      paypal_detail_title:"Pagamento via PayPal",
      paypal_detail_body:"In produzione, il backend crea un ordine PayPal e restituisce il link di approvazione.",
      authorized_total:"Totale autorizzato",
      initial_status:"Stato iniziale",
      pending:"In sospeso",
      payhint_btc:"Pagamento alternativo in Bitcoin Lightning.",
      pay_button_btc:"Genera invoice Lightning",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"Invoice dimostrativa. Sostituiscila con BTCPay Server/LNURL in produzione.",
      checkout_fail:"Impossibile finalizzare l’ordine.",
      login_fail:"Accesso non riuscito.",
      no_orders:"Nessun ordine trovato.",
      orders_load_fail:"Impossibile caricare gli ordini:",
      currency_rates_unavailable:"Tassi di cambio non disponibili"
    },
    es: {
      selected_item:"Artículo seleccionado",
      items_singular:"artículo",
      items_plural:"artículos",
      checkout_transparent_badge:"Checkout transparente",
      checkout_finalize_eyebrow:"Finalizar pedido",
      checkout_hero_title:"Pago limpio, rápido y seguro.",
      checkout_hero_sub:"Revisa los artículos, elige Mercado Pago o PayPal y completa la compra en una experiencia simple y organizada.",
      checkout_summary_toggle:"Ver resumen del pedido",
      checkout_summary_label:"Resumen del pedido",
      checkout_updated:"Actualizado",
      shipping_standard_label:"Estándar",
      shipping_express_label:"Exprés",
      fees:"Comisiones",
      payment_details_aria:"Detalles de pago",
      payment_providers:"Proveedores de pago",
      payment_details_title:"Ingresa los datos de pago",
      payment_details_sub:"Checkout transparente con PIX, tarjeta, boleto, PayPal y opción alternativa en criptomonedas.",
      customer_data:"Datos del cliente",
      full_name:"Nombre completo",
      full_name_ph:"Nombre y apellido",
      delivery_title:"Entrega",
      address1_ph:"Calle y número",
      address2_ph:"Apartamento, bloque, referencia",
      payment_method_title:"Forma de pago",
      pay_pix_desc:"Mercado Pago — QR Code y código copia y pega",
      pay_card_name:"Tarjeta",
      pay_card_desc:"Checkout transparente vía Mercado Pago",
      pay_boleto_desc:"Generación por Mercado Pago",
      pay_paypal_desc:"Cuenta PayPal o tarjeta guardada",
      pay_crypto_name:"Criptomonedas",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"Mostrar código QR",
      checkout_fine_print:"Al finalizar, autorizas la creación del cobro con el proveedor seleccionado. Los valores en BRL pueden variar según comisiones del gateway y confirmación del pago.",
      copied:"Copiado",
      payhint_pix:"Se mostrará un código QR para escanear y completar la compra.",
      qr_pix_preview:"Vista previa del QR Code Pix",
      pix_detail_title:"PIX vía Mercado Pago",
      pix_detail_body:"En la integración real, el backend crea el cobro en Mercado Pago y devuelve el QR Code.",
      estimated_fees:"Comisiones estimadas",
      amount_due:"Total a pagar",
      copy_pix:"Copiar Pix",
      payhint_card:"Los datos de la tarjeta quedan en esta pantalla; en producción usa tokenización segura de Mercado Pago.",
      pay_button_card:"Pagar con tarjeta",
      payhint_boleto:"El boleto lo genera Mercado Pago y queda pendiente hasta la compensación.",
      pay_button_boleto:"Generar boleto",
      boleto_detail_title:"Boleto Mercado Pago",
      boleto_detail_body:"Usa el código de abajo solo como demostración visual. En producción, genéralo desde el backend.",
      copy_code:"Copiar código",
      payhint_paypal:"El comprador continúa a la autorización de PayPal o confirma con una tarjeta guardada.",
      pay_button_paypal:"Continuar con PayPal",
      paypal_detail_title:"Pago vía PayPal",
      paypal_detail_body:"En producción, el backend crea una orden PayPal y devuelve el enlace de aprobación.",
      authorized_total:"Total autorizado",
      initial_status:"Estado inicial",
      pending:"Pendiente",
      payhint_btc:"Pago alternativo en Bitcoin Lightning.",
      pay_button_btc:"Generar invoice Lightning",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"Invoice de demostración. Sustitúyela por BTCPay Server/LNURL en producción.",
      checkout_fail:"No se pudo finalizar el pedido.",
      login_fail:"No se pudo iniciar sesión.",
      no_orders:"No se encontraron pedidos.",
      orders_load_fail:"No se pudieron cargar los pedidos:",
      currency_rates_unavailable:"Tasas de cambio no disponibles"
    },
    de: {
      selected_item:"Ausgewählter Artikel",
      items_singular:"Artikel",
      items_plural:"Artikel",
      checkout_transparent_badge:"Transparenter Checkout",
      checkout_finalize_eyebrow:"Bestellung abschließen",
      checkout_hero_title:"Klare, schnelle und sichere Zahlung.",
      checkout_hero_sub:"Prüfen Sie die Artikel, wählen Sie Mercado Pago oder PayPal und schließen Sie den Kauf in einer einfachen, übersichtlichen Oberfläche ab.",
      checkout_summary_toggle:"Bestellübersicht anzeigen",
      checkout_summary_label:"Bestellübersicht",
      checkout_updated:"Aktualisiert",
      shipping_standard_label:"Standard",
      shipping_express_label:"Express",
      fees:"Gebühren",
      payment_details_aria:"Zahlungsdetails",
      payment_providers:"Zahlungsanbieter",
      payment_details_title:"Zahlungsdetails eingeben",
      payment_details_sub:"Transparenter Checkout mit PIX, Karte, Boleto, PayPal und alternativer Kryptowährungsoption.",
      customer_data:"Kundendaten",
      full_name:"Vollständiger Name",
      full_name_ph:"Vor- und Nachname",
      delivery_title:"Lieferung",
      address1_ph:"Straße und Hausnummer",
      address2_ph:"Wohnung, Block, Referenz",
      payment_method_title:"Zahlungsart",
      pay_pix_desc:"Mercado Pago — QR-Code und Copy-and-paste-Code",
      pay_card_name:"Karte",
      pay_card_desc:"Transparenter Checkout über Mercado Pago",
      pay_boleto_desc:"Erzeugung über Mercado Pago",
      pay_paypal_desc:"PayPal-Konto oder gespeicherte Karte",
      pay_crypto_name:"Kryptowährungen",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"QR-Code anzeigen",
      checkout_fine_print:"Mit dem Abschluss autorisieren Sie die Erstellung der Zahlung beim ausgewählten Anbieter. BRL-Beträge können je nach Gateway-Gebühren und Zahlungsbestätigung variieren.",
      copied:"Kopiert",
      payhint_pix:"Ein QR-Code wird angezeigt, damit Sie scannen und den Kauf abschließen können.",
      qr_pix_preview:"Pix-QR-Code-Vorschau",
      pix_detail_title:"PIX über Mercado Pago",
      pix_detail_body:"In der echten Integration erstellt das Backend die Mercado-Pago-Zahlung und gibt den QR-Code zurück.",
      estimated_fees:"Geschätzte Gebühren",
      amount_due:"Fälliger Betrag",
      copy_pix:"Pix kopieren",
      payhint_card:"Kartendaten bleiben auf diesem Bildschirm; in Produktion sichere Mercado-Pago-Tokenisierung verwenden.",
      pay_button_card:"Mit Karte zahlen",
      payhint_boleto:"Das Boleto wird von Mercado Pago erzeugt und bleibt bis zur Verrechnung ausstehend.",
      pay_button_boleto:"Boleto erzeugen",
      boleto_detail_title:"Mercado-Pago-Boleto",
      boleto_detail_body:"Verwenden Sie den untenstehenden Code nur als visuelle Demonstration. In Produktion über das Backend erzeugen.",
      copy_code:"Code kopieren",
      payhint_paypal:"Der Käufer fährt mit der PayPal-Autorisierung fort oder bestätigt mit einer gespeicherten Karte.",
      pay_button_paypal:"Weiter mit PayPal",
      paypal_detail_title:"Zahlung per PayPal",
      paypal_detail_body:"In Produktion erstellt das Backend eine PayPal-Bestellung und gibt den Genehmigungslink zurück.",
      authorized_total:"Autorisierter Gesamtbetrag",
      initial_status:"Anfangsstatus",
      pending:"Ausstehend",
      payhint_btc:"Alternative Zahlung mit Bitcoin Lightning.",
      pay_button_btc:"Lightning-Invoice erzeugen",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"Demonstrations-Invoice. In Produktion durch BTCPay Server/LNURL ersetzen.",
      checkout_fail:"Bestellung konnte nicht abgeschlossen werden.",
      login_fail:"Anmeldung fehlgeschlagen.",
      no_orders:"Keine Bestellungen gefunden.",
      orders_load_fail:"Bestellungen konnten nicht geladen werden:",
      currency_rates_unavailable:"Wechselkurse nicht verfügbar"
    },
    ja: {
      selected_item:"選択済みの商品",
      items_singular:"点",
      items_plural:"点",
      checkout_transparent_badge:"透明性のあるチェックアウト",
      checkout_finalize_eyebrow:"注文を完了",
      checkout_hero_title:"わかりやすく、速く、安全な決済。",
      checkout_hero_sub:"商品を確認し、Mercado Pago または PayPal を選んで、シンプルで整理された画面のまま購入を完了します。",
      checkout_summary_toggle:"注文内容を表示",
      checkout_summary_label:"注文内容",
      checkout_updated:"更新済み",
      shipping_standard_label:"通常",
      shipping_express_label:"速達",
      fees:"手数料",
      payment_details_aria:"支払い詳細",
      payment_providers:"決済プロバイダー",
      payment_details_title:"支払い情報を入力",
      payment_details_sub:"PIX、カード、boleto、PayPal、暗号資産の代替オプションに対応した透明性のあるチェックアウトです。",
      customer_data:"お客様情報",
      full_name:"氏名",
      full_name_ph:"姓と名",
      delivery_title:"配送",
      address1_ph:"通り名・番地",
      address2_ph:"部屋番号、建物、目印",
      payment_method_title:"支払い方法",
      pay_pix_desc:"Mercado Pago — QRコードとコピー用コード",
      pay_card_name:"カード",
      pay_card_desc:"Mercado Pago の透明性のあるチェックアウト",
      pay_boleto_desc:"Mercado Pago で生成",
      pay_paypal_desc:"PayPal アカウントまたは保存済みカード",
      pay_crypto_name:"暗号資産",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"QRコードを表示",
      checkout_fine_print:"注文を完了すると、選択したプロバイダーで請求を作成することを承認したものとみなされます。BRL 金額はゲートウェイ手数料や支払い確認により変動する場合があります。",
      copied:"コピーしました",
      payhint_pix:"購入を完了するための QR コードが表示されます。",
      qr_pix_preview:"Pix QRコードのプレビュー",
      pix_detail_title:"Mercado Pago 経由の PIX",
      pix_detail_body:"実際の連携では、バックエンドが Mercado Pago の請求を作成し、QR コードを返します。",
      estimated_fees:"見積手数料",
      amount_due:"支払総額",
      copy_pix:"Pix をコピー",
      payhint_card:"カード情報はこの画面内で扱われます。本番環境では Mercado Pago の安全なトークン化を使用してください。",
      pay_button_card:"カードで支払う",
      payhint_boleto:"boleto は Mercado Pago で生成され、決済完了まで保留になります。",
      pay_button_boleto:"boleto を生成",
      boleto_detail_title:"Mercado Pago boleto",
      boleto_detail_body:"下記コードは表示確認用です。本番ではバックエンドで生成してください。",
      copy_code:"コードをコピー",
      payhint_paypal:"購入者は PayPal の承認へ進むか、保存済みカードで確認します。",
      pay_button_paypal:"PayPal で続行",
      paypal_detail_title:"PayPal で支払い",
      paypal_detail_body:"本番環境では、バックエンドが PayPal 注文を作成し、承認リンクを返します。",
      authorized_total:"承認済み合計",
      initial_status:"初期ステータス",
      pending:"保留中",
      payhint_btc:"Bitcoin Lightning による代替支払いです。",
      pay_button_btc:"Lightning invoice を生成",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"表示確認用の invoice です。本番では BTCPay Server/LNURL に置き換えてください。",
      checkout_fail:"注文を完了できませんでした。",
      login_fail:"ログインできませんでした。",
      no_orders:"注文が見つかりませんでした。",
      orders_load_fail:"注文を読み込めませんでした:",
      currency_rates_unavailable:"為替レートを利用できません"
    },
    zh: {
      selected_item:"已选商品",
      items_singular:"件商品",
      items_plural:"件商品",
      checkout_transparent_badge:"透明结账",
      checkout_finalize_eyebrow:"完成订单",
      checkout_hero_title:"清晰、快速、安全的支付。",
      checkout_hero_sub:"检查商品，选择 Mercado Pago 或 PayPal，并在简洁有序的体验中完成购买。",
      checkout_summary_toggle:"查看订单摘要",
      checkout_summary_label:"订单摘要",
      checkout_updated:"已更新",
      shipping_standard_label:"标准",
      shipping_express_label:"快速",
      fees:"费用",
      payment_details_aria:"支付详情",
      payment_providers:"支付服务商",
      payment_details_title:"填写支付信息",
      payment_details_sub:"支持 PIX、银行卡、boleto、PayPal 以及加密货币替代选项的透明结账。",
      customer_data:"客户信息",
      full_name:"姓名",
      full_name_ph:"姓名",
      delivery_title:"配送",
      address1_ph:"街道和门牌号",
      address2_ph:"公寓、楼栋、参考信息",
      payment_method_title:"支付方式",
      pay_pix_desc:"Mercado Pago — QR Code 和复制粘贴码",
      pay_card_name:"银行卡",
      pay_card_desc:"通过 Mercado Pago 透明结账",
      pay_boleto_desc:"由 Mercado Pago 生成",
      pay_paypal_desc:"PayPal 账户或已保存银行卡",
      pay_crypto_name:"加密货币",
      pay_crypto_desc:"Bitcoin Lightning",
      reveal_qr:"显示二维码",
      checkout_fine_print:"完成订单即表示你授权所选服务商创建收款。BRL 金额可能因网关费用和支付确认而变化。",
      copied:"已复制",
      payhint_pix:"将显示二维码，供你扫描并完成购买。",
      qr_pix_preview:"Pix 二维码预览",
      pix_detail_title:"通过 Mercado Pago 使用 PIX",
      pix_detail_body:"在真实集成中，后端会创建 Mercado Pago 收款并返回二维码。",
      estimated_fees:"预计费用",
      amount_due:"应付总额",
      copy_pix:"复制 Pix",
      payhint_card:"银行卡信息保留在此页面；生产环境请使用 Mercado Pago 安全令牌化。",
      pay_button_card:"银行卡支付",
      payhint_boleto:"boleto 由 Mercado Pago 生成，并在清算前保持待处理状态。",
      pay_button_boleto:"生成 boleto",
      boleto_detail_title:"Mercado Pago boleto",
      boleto_detail_body:"下方代码仅用于视觉展示。生产环境请通过后端生成。",
      copy_code:"复制代码",
      payhint_paypal:"买家将继续前往 PayPal 授权，或使用已保存银行卡确认。",
      pay_button_paypal:"继续使用 PayPal",
      paypal_detail_title:"通过 PayPal 支付",
      paypal_detail_body:"生产环境中，后端会创建 PayPal 订单并返回批准链接。",
      authorized_total:"授权总额",
      initial_status:"初始状态",
      pending:"待处理",
      payhint_btc:"通过 Bitcoin Lightning 的替代支付方式。",
      pay_button_btc:"生成 Lightning invoice",
      btc_detail_title:"Bitcoin Lightning",
      btc_detail_body:"展示用 invoice。生产环境请替换为 BTCPay Server/LNURL。",
      checkout_fail:"无法完成订单。",
      login_fail:"无法登录。",
      no_orders:"未找到订单。",
      orders_load_fail:"无法加载订单:",
      currency_rates_unavailable:"汇率不可用"
    }
  };
  Object.keys(CHECKOUT_COPY).forEach(lang=>Object.assign(I18N[lang], CHECKOUT_COPY[lang]));

  const PRODUCTS = [
    {
      id:"strain-og-kush",
      category:"strains",
      name:"OG Kush",
      price:60,
      priceByWeight:{"1g":60,"10g":600},
      short:"Flor selecionada • terroso, cítrico e pinho • 1g ou 10g",
      imageLabel:"Strain",
      image:"assets/images/strains/og-kush-real-1.jpg",
      gallery:["assets/images/strains/og-kush-real-1.jpg", "assets/images/strains/og-kush-real-2.jpg"],
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["1g", "10g"] }],
      desc:`Características Gerais

Tipo: Híbrida com dominância Indica (geralmente 55-75% Indica / 25-45% Sativa)
Genética: Associada a linhas Chemdawg × Lemon Thai × Hindu Kush; pode variar conforme breeder e lote.
Aparência: Buds compactos, tons verde-oliva a verde-limão, pistilos alaranjados e camada evidente de tricomas.
Aroma e Sabor: Perfil terroso, cítrico e herbal, com notas de pinho, especiarias e fundo diesel característico.
Experiência esperada:
Relaxamento corporal progressivo
Sensação de bem-estar e presença mental
Perfil comum para momentos de desaceleração
Pode iniciar com leve euforia e finalizar com efeito mais encorpado

Quantidade de Canabinoides (valores médios)
THC: 18% a 24% — mais comum entre 19-22%. Alguns lotes premium podem ultrapassar isso.
CBD: 0% a 1% — geralmente muito baixo.
CBG: ~1% — presente em pequenas quantidades.
THCA: Até 22-28% (em flores cruas) — converte para THC quando aquecido.

Observações — descrição comercial/informativa inspirada em mercados legais. Lotes reais devem apresentar origem, data de envase, teor de canabinoides, perfil de terpenos e laudo laboratorial.
Atenção: uso adulto somente onde permitido por lei. Não dirigir ou operar máquinas após o consumo.`
    },
    {
      id:"strain-purple-haze",
      category:"strains",
      name:"Purple Haze",
      price:60,
      priceByWeight:{"1g":60,"10g":600},
      short:"Flor selecionada • berry, uva e toque herbal • 1g ou 10g",
      imageLabel:"Strain",
      image:"assets/images/strains/purple-haze-real-1.jpg",
      gallery:["assets/images/strains/purple-haze-real-1.jpg", "assets/images/strains/purple-haze-real-2.jpg"],
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Purple Haze"] }, { key:"weight", labelKey:"opt_weight", options:["1g", "10g"] }],
      desc:`Características Gerais

Tipo: Sativa dominante (geralmente 60-85% Sativa / 15-40% Indica)
Genética: Cruzamento entre Purple Thai × Haze; variações podem ocorrer conforme seleção genética.
Aparência: Buds com tons roxos característicos, pistilos laranja vibrantes e cobertura densa de tricomas.
Aroma e Sabor: Doce e aromático, com notas de berry, uva, terra, especiarias e leve toque herbal/azedo.
Experiência esperada:
Perfil cerebral e energizante
Euforia, criatividade, felicidade e foco
Boa opção para uso diurno, socialização e atividades criativas
Pode apresentar relaxamento corporal leve no final

Quantidade de Canabinoides (valores médios)
THC: 14% a 20% — mais comum entre 16-19%. Alguns lotes chegam a 23-26%.
CBD: 0% a 1% — geralmente muito baixo (< 0,5-1%).
CBG: ~1% — presente em pequenas quantidades.
THCA: Até 22-28% (em flores cruas) — converte para THC quando aquecido.

Observações — descrição comercial/informativa inspirada em mercados legais. Lotes reais devem apresentar origem, data de envase, teor de canabinoides, perfil de terpenos e laudo laboratorial.
Atenção: uso adulto somente onde permitido por lei. Não dirigir ou operar máquinas após o consumo.`
    },
    {
      id:"preroll-cigarettes",
      category:"cigars",
      name:"Cigarettis Pré-roll",
      price:30,
      short:"Pré-roll unitário • strain selecionável • 1un",
      imageLabel:"Pré-roll",
      image:"assets/images/cigars/juanitos-1g.png",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["OG Kush", "Purple Haze"] }, { key:"unit", labelKey:"opt_unit", options:["1un"] }],
      desc:`Perfil do produto — pré-roll unitário preparado para uma experiência prática, com strain selecionável e apresentação direta no catálogo.
Apresentação — 1 unidade pronta, ideal para destacar conveniência, padronização e leitura simples de preço.
Diferenciais de mercado — em operações reguladas, produtos similares costumam informar peso líquido, tipo de papel, strain, lote, data de envase e laudo do material utilizado.
Recomendação de catálogo — manter fotos limpas, ficha curta e preço visível para facilitar decisão rápida.

Atenção: uso adulto somente onde permitido por lei. Fumar pode irritar as vias respiratórias.`
    },
    {
      id:"extract-dry",
      category:"extracts",
      name:"Dry",
      price:0,
      comingSoon:true,
      short:"Dry sift • tricomas separados a seco • em breve",
      imageLabel:"Dry",
      image:"assets/images/extracts/extract-dry.png",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["OG Kush", "Purple Haze"] }, { key:"weight", labelKey:"opt_weight", options:["1g"] }],
      desc:`Perfil do produto — dry sift é um concentrado obtido por separação mecânica dos tricomas, valorizado pela simplicidade do processo e pelo perfil aromático da matéria-prima.
Status — em breve. Categoria em preparação. Disponibilidade sujeita à legislação local e à liberação de estoque.
Diferenciais de mercado — fichas reais costumam informar micragem, strain de origem, textura, lote, potência e laudo laboratorial.
Posicionamento — produto ideal para uma linha premium de concentrados, com comunicação mais técnica e visual limpo.

Atenção: produto previsto para uso adulto somente onde permitido por lei.`
    },
    {
      id:"extract-bubble-hash",
      category:"extracts",
      name:"Bubble Hash",
      price:0,
      comingSoon:true,
      short:"Ice water hash • extração com água e gelo • em breve",
      imageLabel:"Bubble Hash",
      image:"assets/images/extracts/extract-bubble-hash.png",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["OG Kush", "Purple Haze"] }, { key:"weight", labelKey:"opt_weight", options:["1g"] }],
      desc:`Perfil do produto — bubble hash é uma extração feita com água e gelo, focada na separação dos tricomas e na preservação de parte do perfil aromático da flor.
Status — em breve. Produto previsto para uma próxima fase do catálogo, sujeito à legislação local e à disponibilidade.
Diferenciais de mercado — fichas reais geralmente indicam método ice water, peneiras utilizadas, strain de origem, textura, armazenamento recomendado e laudo.
Posicionamento — opção de extração com apelo artesanal, técnico e premium.

Atenção: produto previsto para uso adulto somente onde permitido por lei.`
    },
  ];

  
  /* ---------- Full multilingual catalog copy ---------- */
  const PRODUCT_L10N = {
    pt: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"Flor selecionada • terroso, cítrico e pinho • 1g ou 10g",
        desc:`Características Gerais

Tipo: Híbrida com dominância Indica (geralmente 55-75% Indica / 25-45% Sativa)
Genética: Associada a linhas Chemdawg × Lemon Thai × Hindu Kush; pode variar conforme breeder e lote.
Aparência: Buds compactos, tons verde-oliva a verde-limão, pistilos alaranjados e camada evidente de tricomas.
Aroma e Sabor: Perfil terroso, cítrico e herbal, com notas de pinho, especiarias e fundo diesel característico.
Experiência esperada:
Relaxamento corporal progressivo
Sensação de bem-estar e presença mental
Perfil comum para momentos de desaceleração
Pode iniciar com leve euforia e finalizar com efeito mais encorpado

Quantidade de Canabinoides (valores médios)
THC: 18% a 24% — mais comum entre 19-22%. Alguns lotes premium podem ultrapassar isso.
CBD: 0% a 1% — geralmente muito baixo.
CBG: ~1% — presente em pequenas quantidades.
THCA: Até 22-28% (em flores cruas) — converte para THC quando aquecido.

Observações — descrição comercial/informativa inspirada em mercados legais. Lotes reais devem apresentar origem, data de envase, teor de canabinoides, perfil de terpenos e laudo laboratorial.
Atenção: uso adulto somente onde permitido por lei. Não dirigir ou operar máquinas após o consumo.`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"Flor selecionada • berry, uva e toque herbal • 1g ou 10g",
        desc:`Características Gerais

Tipo: Sativa dominante (geralmente 60-85% Sativa / 15-40% Indica)
Genética: Cruzamento entre Purple Thai × Haze; variações podem ocorrer conforme seleção genética.
Aparência: Buds com tons roxos característicos, pistilos laranja vibrantes e cobertura densa de tricomas.
Aroma e Sabor: Doce e aromático, com notas de berry, uva, terra, especiarias e leve toque herbal/azedo.
Experiência esperada:
Perfil cerebral e energizante
Euforia, criatividade, felicidade e foco
Boa opção para uso diurno, socialização e atividades criativas
Pode apresentar relaxamento corporal leve no final

Quantidade de Canabinoides (valores médios)
THC: 14% a 20% — mais comum entre 16-19%. Alguns lotes chegam a 23-26%.
CBD: 0% a 1% — geralmente muito baixo (< 0,5-1%).
CBG: ~1% — presente em pequenas quantidades.
THCA: Até 22-28% (em flores cruas) — converte para THC quando aquecido.

Observações — descrição comercial/informativa inspirada em mercados legais. Lotes reais devem apresentar origem, data de envase, teor de canabinoides, perfil de terpenos e laudo laboratorial.
Atenção: uso adulto somente onde permitido por lei. Não dirigir ou operar máquinas após o consumo.`
      },
      "preroll-cigarettes": {
        name:"Cigarettis Pré-roll",
        short:"Pré-roll unitário • strain selecionável • 1un",
        desc:`Perfil do produto — pré-roll unitário preparado para uma experiência prática, com strain selecionável e apresentação direta no catálogo.
Apresentação — 1 unidade pronta, ideal para destacar conveniência, padronização e leitura simples de preço.
Diferenciais de mercado — em operações reguladas, produtos similares costumam informar peso líquido, tipo de papel, strain, lote, data de envase e laudo do material utilizado.
Recomendação de catálogo — manter fotos limpas, ficha curta e preço visível para facilitar decisão rápida.

Atenção: uso adulto somente onde permitido por lei. Fumar pode irritar as vias respiratórias.`
      },
      "extract-dry": {
        name:"Dry",
        short:"Dry sift • tricomas separados a seco • em breve",
        desc:`Perfil do produto — dry sift é um concentrado obtido por separação mecânica dos tricomas, valorizado pela simplicidade do processo e pelo perfil aromático da matéria-prima.
Status — em breve. Categoria em preparação. Disponibilidade sujeita à legislação local e à liberação de estoque.
Diferenciais de mercado — fichas reais costumam informar micragem, strain de origem, textura, lote, potência e laudo laboratorial.
Posicionamento — produto ideal para uma linha premium de concentrados, com comunicação mais técnica e visual limpo.

Atenção: produto previsto para uso adulto somente onde permitido por lei.`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"Ice water hash • extração com água e gelo • em breve",
        desc:`Perfil do produto — bubble hash é uma extração feita com água e gelo, focada na separação dos tricomas e na preservação de parte do perfil aromático da flor.
Status — em breve. Produto previsto para uma próxima fase do catálogo, sujeito à legislação local e à disponibilidade.
Diferenciais de mercado — fichas reais geralmente indicam método ice water, peneiras utilizadas, strain de origem, textura, armazenamento recomendado e laudo.
Posicionamento — opção de extração com apelo artesanal, técnico e premium.

Atenção: produto previsto para uso adulto somente onde permitido por lei.`
      }
    },
    en: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"Selected flower • earthy, citrus and pine • 1g or 10g",
        desc:`General characteristics

Type: Indica-dominant hybrid (usually 55-75% Indica / 25-45% Sativa)
Genetics: Associated with Chemdawg × Lemon Thai × Hindu Kush lines; may vary by breeder and batch.
Appearance: Compact buds, olive-to-lime green tones, orange pistils and a visible layer of trichomes.
Aroma and flavor: Earthy, citrus and herbal profile with pine, spice and a characteristic diesel finish.
Expected experience:
Progressive body relaxation
Sense of well-being and mental presence
Common profile for slowing down
May begin with mild euphoria and finish with a fuller body effect

Cannabinoid content (average values)
THC: 18% to 24% — most commonly 19-22%. Some premium batches may exceed this range.
CBD: 0% to 1% — usually very low.
CBG: ~1% — present in small quantities.
THCA: Up to 22-28% (in raw flower) — converts to THC when heated.

Notes — commercial/informational description inspired by legal markets. Real batches should show origin, packaging date, cannabinoid content, terpene profile and laboratory COA.
Warning: adult use only where allowed by law. Do not drive or operate machinery after consumption.`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"Selected flower • berry, grape and herbal touch • 1g or 10g",
        desc:`General characteristics

Type: Sativa-dominant (usually 60-85% Sativa / 15-40% Indica)
Genetics: Cross between Purple Thai × Haze; variations may occur depending on genetic selection.
Appearance: Buds with characteristic purple tones, vibrant orange pistils and dense trichome coverage.
Aroma and flavor: Sweet and aromatic, with berry, grape, earth, spice and a light herbal/sour touch.
Expected experience:
Cerebral and energizing profile
Euphoria, creativity, happiness and focus
A good option for daytime use, socializing and creative activities
May provide light body relaxation toward the end

Cannabinoid content (average values)
THC: 14% to 20% — most commonly 16-19%. Some batches reach 23-26%.
CBD: 0% to 1% — usually very low (< 0.5-1%).
CBG: ~1% — present in small quantities.
THCA: Up to 22-28% (in raw flower) — converts to THC when heated.

Notes — commercial/informational description inspired by legal markets. Real batches should show origin, packaging date, cannabinoid content, terpene profile and laboratory COA.
Warning: adult use only where allowed by law. Do not drive or operate machinery after consumption.`
      },
      "preroll-cigarettes": {
        name:"Cigarettis Pre-roll",
        short:"Single pre-roll • selectable strain • 1 unit",
        desc:`Product profile — a single pre-roll prepared for practical use, with selectable strain and direct catalog presentation.
Presentation — 1 ready-to-use unit, ideal for highlighting convenience, consistency and easy price reading.
Market details — in regulated operations, similar products usually show net weight, paper type, strain, batch, packaging date and COA for the material used.
Catalog recommendation — keep images clean, product copy short and price visible to support quick decisions.

Warning: adult use only where allowed by law. Smoking may irritate the respiratory tract.`
      },
      "extract-dry": {
        name:"Dry",
        short:"Dry sift • mechanically separated trichomes • coming soon",
        desc:`Product profile — dry sift is a concentrate obtained through mechanical trichome separation, valued for process simplicity and the aromatic profile of the source material.
Status — coming soon. Category in preparation. Availability depends on local law and stock release.
Market details — real product sheets often list micron size, source strain, texture, batch, potency and lab COA.
Positioning — ideal for a premium concentrate line with more technical messaging and a clean visual style.

Warning: intended for adult use only where allowed by law.`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"Ice water hash • water-and-ice extraction • coming soon",
        desc:`Product profile — bubble hash is an ice-water extraction focused on separating trichomes while preserving part of the flower’s aromatic profile.
Status — coming soon. Product planned for a future catalog phase, subject to local law and availability.
Market details — real sheets usually indicate ice-water method, screen sizes used, source strain, texture, recommended storage and COA.
Positioning — an extract option with artisanal, technical and premium appeal.

Warning: intended for adult use only where allowed by law.`
      }
    },
    fr: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"Fleur sélectionnée • terreux, agrumes et pin • 1g ou 10g",
        desc:`Caractéristiques générales

Type : hybride à dominance Indica (généralement 55-75 % Indica / 25-45 % Sativa)
Génétique : associée aux lignées Chemdawg × Lemon Thai × Hindu Kush ; peut varier selon le breeder et le lot.
Aspect : têtes compactes, nuances vert olive à vert citron, pistils orangés et couche visible de trichomes.
Arôme et saveur : profil terreux, citronné et herbacé, avec des notes de pin, d’épices et une finale diesel caractéristique.
Expérience attendue :
Relaxation corporelle progressive
Sensation de bien-être et présence mentale
Profil courant pour les moments de ralentissement
Peut commencer par une légère euphorie et finir par un effet corporel plus marqué

Teneur en cannabinoïdes (valeurs moyennes)
THC : 18 % à 24 % — le plus souvent 19-22 %. Certains lots premium peuvent dépasser cette plage.
CBD : 0 % à 1 % — généralement très faible.
CBG : ~1 % — présent en petites quantités.
THCA : jusqu’à 22-28 % (dans la fleur crue) — se convertit en THC lorsqu’il est chauffé.

Notes — description commerciale/informative inspirée des marchés légaux. Les lots réels doivent indiquer l’origine, la date de conditionnement, les cannabinoïdes, les terpènes et le certificat d’analyse.
Avertissement : usage adulte uniquement là où la loi l’autorise. Ne conduisez pas et n’utilisez pas de machines après consommation.`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"Fleur sélectionnée • fruits rouges, raisin et touche herbacée • 1g ou 10g",
        desc:`Caractéristiques générales

Type : Sativa dominante (généralement 60-85 % Sativa / 15-40 % Indica)
Génétique : croisement Purple Thai × Haze ; des variations peuvent exister selon la sélection génétique.
Aspect : têtes aux tons violets caractéristiques, pistils orange vif et couverture dense de trichomes.
Arôme et saveur : doux et aromatique, avec notes de fruits rouges, raisin, terre, épices et une légère touche herbacée/acidulée.
Expérience attendue :
Profil cérébral et énergisant
Euphorie, créativité, bonheur et concentration
Bonne option pour la journée, la socialisation et les activités créatives
Peut apporter une légère relaxation corporelle en fin d’expérience

Teneur en cannabinoïdes (valeurs moyennes)
THC : 14 % à 20 % — le plus souvent 16-19 %. Certains lots atteignent 23-26 %.
CBD : 0 % à 1 % — généralement très faible (< 0,5-1 %).
CBG : ~1 % — présent en petites quantités.
THCA : jusqu’à 22-28 % (dans la fleur crue) — se convertit en THC lorsqu’il est chauffé.

Notes — description commerciale/informative inspirée des marchés légaux. Les lots réels doivent indiquer l’origine, la date de conditionnement, les cannabinoïdes, les terpènes et le certificat d’analyse.
Avertissement : usage adulte uniquement là où la loi l’autorise. Ne conduisez pas et n’utilisez pas de machines après consommation.`
      },
      "preroll-cigarettes": {
        name:"Cigarettis Pré-roll",
        short:"Pré-roll unitaire • variété sélectionnable • 1 unité",
        desc:`Profil du produit — pré-roll unitaire conçu pour une expérience pratique, avec variété sélectionnable et présentation directe dans le catalogue.
Présentation — 1 unité prête à l’emploi, idéale pour mettre en avant la commodité, la régularité et une lecture simple du prix.
Détails de marché — dans les opérations réglementées, ces produits indiquent souvent le poids net, le type de papier, la variété, le lot, la date de conditionnement et le certificat d’analyse.
Recommandation catalogue — garder des images propres, une fiche courte et un prix visible pour faciliter la décision.

Avertissement : contenu de démonstration. Usage adulte uniquement là où la loi l’autorise. Fumer peut irriter les voies respiratoires.`
      },
      "extract-dry": {
        name:"Dry",
        short:"Dry sift • trichomes séparés à sec • bientôt disponible",
        desc:`Profil du produit — le dry sift est un concentré obtenu par séparation mécanique des trichomes, apprécié pour la simplicité du procédé et le profil aromatique de la matière première.
Statut — bientôt disponible. Cette carte sert d’aperçu visuel de la catégorie des extractions, sans achat activé à cette étape.
Détails de marché — les fiches réelles indiquent souvent la micronisation, la variété d’origine, la texture, le lot, la puissance et le certificat d’analyse.
Positionnement — idéal pour une ligne premium de concentrés avec un discours plus technique et un visuel épuré.

Avertissement : destiné à un usage adulte uniquement là où la loi l’autorise.`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"Ice water hash • extraction eau et glace • bientôt disponible",
        desc:`Profil du produit — le bubble hash est une extraction à l’eau glacée visant à séparer les trichomes tout en préservant une partie du profil aromatique de la fleur.
Statut — bientôt disponible. Cet article annonce la prochaine phase du catalogue, sans achat activé dans cette démo.
Détails de marché — les fiches réelles indiquent généralement la méthode ice water, les tailles de tamis, la variété d’origine, la texture, le stockage conseillé et le certificat d’analyse.
Positionnement — une option d’extraction à l’attrait artisanal, technique et premium.

Avertissement : destiné à un usage adulte uniquement là où la loi l’autorise.`
      }
    },
    it: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"Fiore selezionato • terra, agrumi e pino • 1g o 10g",
        desc:`Caratteristiche generali

Tipo: ibrida a dominanza Indica (di solito 55-75% Indica / 25-45% Sativa)
Genetica: associata a linee Chemdawg × Lemon Thai × Hindu Kush; può variare in base al breeder e al lotto.
Aspetto: cime compatte, tonalità dal verde oliva al verde lime, pistilli arancioni e strato evidente di tricomi.
Aroma e sapore: profilo terroso, agrumato ed erbaceo, con note di pino, spezie e finale diesel caratteristico.
Esperienza attesa:
Rilassamento corporeo progressivo
Sensazione di benessere e presenza mentale
Profilo comune per momenti di decompressione
Può iniziare con una lieve euforia e chiudere con un effetto fisico più pieno

Quantità di cannabinoidi (valori medi)
THC: 18% a 24% — più comune tra 19-22%. Alcuni lotti premium possono superare questo intervallo.
CBD: 0% a 1% — generalmente molto basso.
CBG: ~1% — presente in piccole quantità.
THCA: fino a 22-28% (nel fiore crudo) — si converte in THC quando riscaldato.

Note — descrizione commerciale/informativa ispirata ai mercati legali. I lotti reali dovrebbero indicare origine, data di confezionamento, contenuto di cannabinoidi, profilo terpenico e certificato di analisi.
Avvertenza: uso adulto solo dove consentito dalla legge. Non guidare o usare macchinari dopo il consumo.`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"Fiore selezionato • berry, uva e tocco erbaceo • 1g o 10g",
        desc:`Caratteristiche generali

Tipo: Sativa dominante (di solito 60-85% Sativa / 15-40% Indica)
Genetica: incrocio tra Purple Thai × Haze; possono esserci variazioni secondo la selezione genetica.
Aspetto: cime con tipiche tonalità viola, pistilli arancio vivace e copertura densa di tricomi.
Aroma e sapore: dolce e aromatico, con note di frutti rossi, uva, terra, spezie e leggero tocco erbaceo/aspro.
Esperienza attesa:
Profilo cerebrale ed energizzante
Euforia, creatività, felicità e focus
Buona opzione per uso diurno, socialità e attività creative
Può offrire un lieve rilassamento corporeo nel finale

Quantità di cannabinoidi (valori medi)
THC: 14% a 20% — più comune tra 16-19%. Alcuni lotti arrivano a 23-26%.
CBD: 0% a 1% — generalmente molto basso (< 0,5-1%).
CBG: ~1% — presente in piccole quantità.
THCA: fino a 22-28% (nel fiore crudo) — si converte in THC quando riscaldato.

Note — descrizione commerciale/informativa ispirata ai mercati legali. I lotti reali dovrebbero indicare origine, data di confezionamento, contenuto di cannabinoidi, profilo terpenico e certificato di analisi.
Avvertenza: uso adulto solo dove consentito dalla legge. Non guidare o usare macchinari dopo il consumo.`
      },
      "preroll-cigarettes": {
        name:"Cigarettis Pre-roll",
        short:"Pre-roll singolo • strain selezionabile • 1 unità",
        desc:`Profilo prodotto — pre-roll singolo preparato per un’esperienza pratica, con strain selezionabile e presentazione diretta nel catalogo.
Presentazione — 1 unità pronta all’uso, ideale per comunicare comodità, standardizzazione e prezzo leggibile.
Dettagli di mercato — nelle operazioni regolamentate prodotti simili indicano spesso peso netto, tipo di carta, strain, lotto, data di confezionamento e certificato del materiale utilizzato.
Raccomandazione catalogo — immagini pulite, scheda breve e prezzo visibile aiutano una decisione rapida.

Avvertenza: contenuto dimostrativo. Uso adulto solo dove consentito dalla legge. Fumare può irritare le vie respiratorie.`
      },
      "extract-dry": {
        name:"Dry",
        short:"Dry sift • tricomi separati a secco • prossimamente",
        desc:`Profilo prodotto — il dry sift è un concentrato ottenuto tramite separazione meccanica dei tricomi, apprezzato per la semplicità del processo e il profilo aromatico della materia prima.
Stato — prossimamente. La card funge da anteprima visiva della categoria estrazioni, senza acquisto abilitato in questa fase.
Dettagli di mercato — le schede reali spesso indicano micron, strain di origine, texture, lotto, potenza e certificato di analisi.
Posizionamento — ideale per una linea premium di concentrati con comunicazione più tecnica e visual pulito.

Avvertenza: prodotto destinato all’uso adulto solo dove consentito dalla legge.`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"Ice water hash • estrazione acqua e ghiaccio • prossimamente",
        desc:`Profilo prodotto — il bubble hash è un’estrazione con acqua e ghiaccio focalizzata sulla separazione dei tricomi e sulla conservazione di parte del profilo aromatico del fiore.
Stato — prossimamente. Prodotto previsto per una fase successiva del catalogo, soggetto a conformità legale e disponibilità.
Dettagli di mercato — le schede reali indicano di solito metodo ice water, setacci usati, strain di origine, texture, conservazione consigliata e certificato.
Posizionamento — opzione di estrazione dal richiamo artigianale, tecnico e premium.

Avvertenza: prodotto destinato all’uso adulto solo dove consentito dalla legge.`
      }
    },
    es: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"Flor seleccionada • terroso, cítrico y pino • 1g o 10g",
        desc:`Características generales

Tipo: híbrida con dominancia Índica (generalmente 55-75% Índica / 25-45% Sativa)
Genética: asociada a líneas Chemdawg × Lemon Thai × Hindu Kush; puede variar según breeder y lote.
Apariencia: cogollos compactos, tonos verde oliva a verde lima, pistilos anaranjados y capa visible de tricomas.
Aroma y sabor: perfil terroso, cítrico y herbal, con notas de pino, especias y fondo diésel característico.
Experiencia esperada:
Relajación corporal progresiva
Sensación de bienestar y presencia mental
Perfil común para momentos de desaceleración
Puede iniciar con ligera euforia y terminar con un efecto corporal más completo

Cantidad de cannabinoides (valores medios)
THC: 18% a 24% — más común entre 19-22%. Algunos lotes premium pueden superar ese rango.
CBD: 0% a 1% — generalmente muy bajo.
CBG: ~1% — presente en pequeñas cantidades.
THCA: hasta 22-28% (en flores crudas) — se convierte en THC al calentarse.

Notas — descripción comercial/informativa inspirada en mercados legales. Los lotes reales deben mostrar origen, fecha de envasado, contenido de cannabinoides, perfil de terpenos y certificado de análisis.
Advertencia: uso adulto solo donde la ley lo permita. No conducir ni operar maquinaria después del consumo.`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"Flor seleccionada • berry, uva y toque herbal • 1g o 10g",
        desc:`Características generales

Tipo: Sativa dominante (generalmente 60-85% Sativa / 15-40% Índica)
Genética: cruce entre Purple Thai × Haze; pueden existir variaciones según la selección genética.
Apariencia: cogollos con tonos morados característicos, pistilos naranja vibrante y cobertura densa de tricomas.
Aroma y sabor: dulce y aromático, con notas de frutos rojos, uva, tierra, especias y un ligero toque herbal/ácido.
Experiencia esperada:
Perfil cerebral y energizante
Euforia, creatividad, felicidad y enfoque
Buena opción para uso diurno, socialización y actividades creativas
Puede presentar relajación corporal ligera al final

Cantidad de cannabinoides (valores medios)
THC: 14% a 20% — más común entre 16-19%. Algunos lotes llegan a 23-26%.
CBD: 0% a 1% — generalmente muy bajo (< 0,5-1%).
CBG: ~1% — presente en pequeñas cantidades.
THCA: hasta 22-28% (en flores crudas) — se convierte en THC al calentarse.

Notas — descripción comercial/informativa inspirada en mercados legales. Los lotes reales deben mostrar origen, fecha de envasado, contenido de cannabinoides, perfil de terpenos y certificado de análisis.
Advertencia: uso adulto solo donde la ley lo permita. No conducir ni operar maquinaria después del consumo.`
      },
      "preroll-cigarettes": {
        name:"Cigarettis Pre-roll",
        short:"Pre-roll unitario • strain seleccionable • 1 unidad",
        desc:`Perfil del producto — pre-roll unitario preparado para una experiencia práctica, con strain seleccionable y presentación directa en el catálogo.
Presentación — 1 unidad lista, ideal para destacar conveniencia, estandarización y lectura simple del precio.
Detalles de mercado — en operaciones reguladas, productos similares suelen informar peso neto, tipo de papel, strain, lote, fecha de envasado y certificado del material utilizado.
Recomendación de catálogo — mantener fotos limpias, ficha breve y precio visible para facilitar una decisión rápida.

Advertencia: uso adulto solo donde la ley lo permita. Fumar puede irritar las vías respiratorias.`
      },
      "extract-dry": {
        name:"Dry",
        short:"Dry sift • tricomas separados en seco • próximamente",
        desc:`Perfil del producto — dry sift es un concentrado obtenido por separación mecánica de tricomas, valorado por la simplicidad del proceso y el perfil aromático de la materia prima.
Estado — próximamente. La tarjeta funciona como vista previa visual de la categoría de extracciones, sin compra habilitada en esta etapa.
Detalles de mercado — las fichas reales suelen indicar micraje, strain de origen, textura, lote, potencia y certificado de laboratorio.
Posicionamiento — ideal para una línea premium de concentrados, con comunicación más técnica y visual limpio.

Advertencia: producto previsto para uso adulto solo donde la ley lo permita.`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"Ice water hash • extracción con agua y hielo • próximamente",
        desc:`Perfil del producto — bubble hash es una extracción con agua y hielo enfocada en separar tricomas y preservar parte del perfil aromático de la flor.
Estado — próximamente. Producto previsto para una próxima fase del catálogo, sujeto a cumplimiento legal y disponibilidad.
Detalles de mercado — las fichas reales suelen indicar método ice water, mallas utilizadas, strain de origen, textura, almacenamiento recomendado y certificado.
Posicionamiento — una opción de extracción con atractivo artesanal, técnico y premium.

Advertencia: producto previsto para uso adulto solo donde la ley lo permita.`
      }
    },
    de: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"Ausgewählte Blüte • erdig, zitrisch und Kiefer • 1g oder 10g",
        desc:`Allgemeine Merkmale

Typ: Indica-dominanter Hybrid (meist 55-75 % Indica / 25-45 % Sativa)
Genetik: mit Chemdawg × Lemon Thai × Hindu Kush Linien verbunden; kann je nach Breeder und Charge variieren.
Aussehen: kompakte Buds, oliv- bis limettengrüne Töne, orange Pistillen und sichtbare Trichomschicht.
Aroma und Geschmack: erdiges, zitrisches und kräuteriges Profil mit Kiefer, Gewürzen und charakteristischem Diesel-Finish.
Erwartete Erfahrung:
Progressive körperliche Entspannung
Gefühl von Wohlbefinden und mentaler Präsenz
Typisches Profil für ruhigere Momente
Kann mit leichter Euphorie beginnen und in einen volleren Körpereffekt übergehen

Cannabinoidgehalt (Durchschnittswerte)
THC: 18 % bis 24 % — meist 19-22 %. Einige Premium-Chargen können darüber liegen.
CBD: 0 % bis 1 % — in der Regel sehr niedrig.
CBG: ~1 % — in kleinen Mengen vorhanden.
THCA: bis zu 22-28 % (in roher Blüte) — wandelt sich beim Erhitzen in THC um.

Hinweise — kommerzielle/informative Beschreibung, inspiriert von legalen Märkten. Reale Chargen sollten Herkunft, Verpackungsdatum, Cannabinoidgehalt, Terpenprofil und Laborzertifikat angeben.
Warnhinweis: nur für Erwachsene und nur dort, wo gesetzlich erlaubt. Nach dem Konsum nicht fahren oder Maschinen bedienen.`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"Ausgewählte Blüte • Beere, Traube und Kräuternote • 1g oder 10g",
        desc:`Allgemeine Merkmale

Typ: Sativa-dominant (meist 60-85 % Sativa / 15-40 % Indica)
Genetik: Kreuzung aus Purple Thai × Haze; Varianten können je nach genetischer Selektion auftreten.
Aussehen: Buds mit charakteristischen violetten Tönen, leuchtend orange Pistillen und dichter Trichombedeckung.
Aroma und Geschmack: süß und aromatisch, mit Noten von Beeren, Traube, Erde, Gewürzen und leichter kräuterig-säuerlicher Nuance.
Erwartete Erfahrung:
Zerebrales und energetisierendes Profil
Euphorie, Kreativität, Glücksgefühl und Fokus
Gute Option für tagsüber, soziale Momente und kreative Aktivitäten
Kann am Ende leichte körperliche Entspannung bringen

Cannabinoidgehalt (Durchschnittswerte)
THC: 14 % bis 20 % — meist 16-19 %. Einige Chargen erreichen 23-26 %.
CBD: 0 % bis 1 % — in der Regel sehr niedrig (< 0,5-1 %).
CBG: ~1 % — in kleinen Mengen vorhanden.
THCA: bis zu 22-28 % (in roher Blüte) — wandelt sich beim Erhitzen in THC um.

Hinweise — kommerzielle/informative Beschreibung, inspiriert von legalen Märkten. Reale Chargen sollten Herkunft, Verpackungsdatum, Cannabinoidgehalt, Terpenprofil und Laborzertifikat angeben.
Warnhinweis: nur für Erwachsene und nur dort, wo gesetzlich erlaubt. Nach dem Konsum nicht fahren oder Maschinen bedienen.`
      },
      "preroll-cigarettes": {
        name:"Cigarettis Pre-roll",
        short:"Einzelner Pre-roll • auswählbare Strain • 1 Stück",
        desc:`Produktprofil — einzelner Pre-roll für eine praktische Nutzung, mit auswählbarer Strain und direkter Katalogdarstellung.
Präsentation — 1 gebrauchsfertige Einheit, ideal zur Betonung von Komfort, Standardisierung und klarer Preislesbarkeit.
Marktdetails — in regulierten Betrieben geben ähnliche Produkte meist Nettogewicht, Papiertyp, Strain, Charge, Verpackungsdatum und Analysezertifikat des Materials an.
Katalogempfehlung — klare Fotos, kurze Produktkarte und sichtbarer Preis unterstützen schnelle Entscheidungen.

Warnhinweis: Nur für Erwachsene und nur dort, wo gesetzlich erlaubt. Rauchen kann die Atemwege reizen.`
      },
      "extract-dry": {
        name:"Dry",
        short:"Dry sift • trocken getrennte Trichome • demnächst",
        desc:`Produktprofil — Dry Sift ist ein Konzentrat, das durch mechanische Trichomtrennung entsteht und für die Einfachheit des Prozesses sowie das Aroma des Ausgangsmaterials geschätzt wird.
Status — demnächst. Die Karte dient als visuelle Vorschau der Extrakt-Kategorie; der Kauf ist in dieser Phase deaktiviert.
Marktdetails — reale Produktblätter nennen häufig Mikron-Größe, Ausgangsstrain, Textur, Charge, Potenz und Laborzertifikat.
Positionierung — ideal für eine Premium-Linie von Konzentraten mit technischerer Kommunikation und klarem Design.

Warnhinweis: nur für Erwachsene und nur dort, wo gesetzlich erlaubt.`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"Ice water hash • Wasser- und Eisextraktion • demnächst",
        desc:`Produktprofil — Bubble Hash ist eine Eiswasser-Extraktion, die Trichome trennt und einen Teil des aromatischen Profils der Blüte bewahrt.
Status — demnächst. Produkt für eine nächste Katalogphase vorgesehen, vorbehaltlich rechtlicher Konformität und Verfügbarkeit.
Marktdetails — reale Produktblätter nennen meist Ice-Water-Methode, verwendete Siebe, Ausgangsstrain, Textur, empfohlene Lagerung und Zertifikat.
Positionierung — eine Extraktoption mit handwerklicher, technischer und hochwertiger Anmutung.

Warnhinweis: nur für Erwachsene und nur dort, wo gesetzlich erlaubt.`
      }
    },
    ja: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"セレクトフラワー • 土、柑橘、パイン • 1gまたは10g",
        desc:`一般的な特徴

タイプ：インディカ優勢ハイブリッド（通常 55-75% インディカ / 25-45% サティバ）
遺伝：Chemdawg × Lemon Thai × Hindu Kush 系統に関連。ブリーダーやロットにより異なる場合があります。
外観：コンパクトなバッズ、オリーブ〜ライムグリーンの色調、オレンジ色のピスティル、はっきりしたトリコーム層。
香りと味：土っぽさ、柑橘、ハーブを基調に、パイン、スパイス、特徴的なディーゼル感を含むプロファイル。
想定される体験：
段階的なボディリラックス
ウェルビーイング感とメンタルの落ち着き
ゆっくり過ごす時間に合いやすいプロファイル
軽い高揚感から始まり、より深い身体感で終わる場合があります

カンナビノイド量（平均値）
THC：18%〜24% — 一般的には19-22%。一部のプレミアムロットはこの範囲を超えることがあります。
CBD：0%〜1% — 通常は非常に低い値です。
CBG：約1% — 少量含まれる場合があります。
THCA：生花で最大22-28% — 加熱によりTHCへ変換されます。

注記 — 合法市場を参考にした商業・情報目的の説明です。実際のロットでは、原産、包装日、カンナビノイド量、テルペンプロファイル、検査証明書を確認する必要があります。
注意：法律で認められた地域における成人向け情報です。摂取後の運転や機械操作は避けてください。`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"セレクトフラワー • ベリー、ぶどう、ハーブ感 • 1gまたは10g",
        desc:`一般的な特徴

タイプ：サティバ優勢（通常 60-85% サティバ / 15-40% インディカ）
遺伝：Purple Thai × Haze の交配。遺伝選抜によりバリエーションがあります。
外観：特徴的な紫色のトーン、鮮やかなオレンジ色のピスティル、濃密なトリコーム。
香りと味：甘くアロマティックで、ベリー、ぶどう、土、スパイス、軽いハーブ/酸味のニュアンス。
想定される体験：
頭脳的でエネルギッシュなプロファイル
高揚感、創造性、幸福感、集中
日中、社交、クリエイティブな活動に向いた選択肢
最後に軽い身体のリラックスを感じる場合があります

カンナビノイド量（平均値）
THC：14%〜20% — 一般的には16-19%。一部のロットは23-26%に達することがあります。
CBD：0%〜1% — 通常は非常に低い値（< 0.5-1%）。
CBG：約1% — 少量含まれる場合があります。
THCA：生花で最大22-28% — 加熱によりTHCへ変換されます。

注記 — 合法市場を参考にした商業・情報目的の説明です。実際のロットでは、原産、包装日、カンナビノイド量、テルペンプロファイル、検査証明書を確認する必要があります。
注意：法律で認められた地域における成人向け情報です。摂取後の運転や機械操作は避けてください。`
      },
      "preroll-cigarettes": {
        name:"Cigarettis プレロール",
        short:"単品プレロール • ストレイン選択可 • 1本",
        desc:`製品プロファイル — 実用性を重視した単品プレロール。ストレイン選択ができ、カタログ上でわかりやすく表示されます。
内容 — すぐに使える1本入り。利便性、一定品質、価格の見やすさを伝えるのに適した形式です。
市場での表示例 — 規制市場では、正味重量、紙の種類、ストレイン、ロット、包装日、使用素材の検査証明書などが表示されることがあります。
カタログ推奨 — クリーンな写真、短い説明、見やすい価格表示により、素早い判断をサポートします。

注意：デモ用コンテンツです。法律で認められた地域における成人向け情報です。喫煙は呼吸器を刺激する可能性があります。`
      },
      "extract-dry": {
        name:"Dry",
        short:"ドライシフト • 乾式分離トリコーム • 近日公開",
        desc:`製品プロファイル — ドライシフトはトリコームを機械的に分離して得られる濃縮物で、工程のシンプルさと原料の香りのプロファイルが評価されます。
ステータス — 近日公開。このカードは抽出カテゴリのビジュアルプレビューであり、この段階では購入できません。
市場での表示例 — 実際の製品シートでは、ミクロン、原料ストレイン、質感、ロット、効力、検査証明書が記載されることが一般的です。
ポジショニング — より技術的な説明とクリーンなビジュアルを持つプレミアム濃縮ラインに適しています。

注意：法律で認められた地域における成人向け情報です。`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"アイスウォーターハッシュ • 水と氷による抽出 • 近日公開",
        desc:`製品プロファイル — バブルハッシュは水と氷を使ってトリコームを分離し、花の香りの一部を保つことを重視した抽出です。
ステータス — 近日公開。このアイテムはカタログ次段階のプレビューであり、このデモでは購入できません。
市場での表示例 — 実際の製品シートでは、アイスウォーター方式、使用スクリーン、原料ストレイン、質感、推奨保管方法、証明書が記載されます。
ポジショニング — クラフト感、技術性、プレミアム感を備えた抽出オプションです。

注意：法律で認められた地域における成人向け情報です。`
      }
    },
    zh: {
      "strain-og-kush": {
        name:"OG Kush",
        short:"精选花材 • 泥土、柑橘与松木 • 1g 或 10g",
        desc:`一般特征

类型：偏 Indica 的混合品种（通常 55-75% Indica / 25-45% Sativa）
遗传：常与 Chemdawg × Lemon Thai × Hindu Kush 系谱相关；会因培育者与批次而变化。
外观：紧实花苞，橄榄绿至青柠绿，橙色雌蕊，覆盖明显的晶体毛。
香气与风味：泥土、柑橘与草本调性，带有松木、香料和标志性的柴油尾韵。
预期体验：
逐步的身体放松
舒适感与清晰的心理存在感
常见于放慢节奏的场景
可能以轻微愉悦感开始，并以更饱满的身体感收尾

大麻素含量（平均值）
THC：18% 至 24% — 常见为 19-22%。部分高端批次可能超过该范围。
CBD：0% 至 1% — 通常非常低。
CBG：约 1% — 少量存在。
THCA：生花中最高约 22-28% — 加热后转化为 THC。

备注 — 本描述为参考合法市场的商业/信息性文案。真实批次应展示来源、包装日期、大麻素含量、萜烯谱和实验室检测报告。
警告：仅限法律允许地区的成年人。使用后请勿驾驶或操作机械。`
      },
      "strain-purple-haze": {
        name:"Purple Haze",
        short:"精选花材 • 浆果、葡萄与草本感 • 1g 或 10g",
        desc:`一般特征

类型：Sativa 优势（通常 60-85% Sativa / 15-40% Indica）
遗传：Purple Thai × Haze 的交叉；会因遗传选择而产生变化。
外观：具有标志性紫色调的花苞、鲜艳橙色雌蕊和密集晶体毛覆盖。
香气与风味：甜美且芳香，带有浆果、葡萄、泥土、香料和轻微草本/酸感。
预期体验：
偏头脑感与提振感
愉悦、创造力、幸福感与专注
适合白天、社交和创意活动场景
后段可能带来轻微身体放松

大麻素含量（平均值）
THC：14% 至 20% — 常见为 16-19%。部分批次可达 23-26%。
CBD：0% 至 1% — 通常非常低（< 0.5-1%）。
CBG：约 1% — 少量存在。
THCA：生花中最高约 22-28% — 加热后转化为 THC。

备注 — 本描述为参考合法市场的商业/信息性文案。真实批次应展示来源、包装日期、大麻素含量、萜烯谱和实验室检测报告。
警告：仅限法律允许地区的成年人。使用后请勿驾驶或操作机械。`
      },
      "preroll-cigarettes": {
        name:"Cigarettis 预卷",
        short:"单支预卷 • 可选品种 • 1 支",
        desc:`产品档案 — 单支预卷，强调便利性，可选择品种，并在目录中直接呈现。
规格 — 1 支即用型产品，适合突出便利、标准化和清晰价格。
市场信息 — 在受监管市场中，类似产品通常会标注净重、纸张类型、品种、批次、包装日期和材料检测报告。
目录建议 — 保持图片清晰、说明简短、价格醒目，有助于快速决策。

警告：演示内容。仅限法律允许地区的成年人。吸烟可能刺激呼吸道。`
      },
      "extract-dry": {
        name:"Dry",
        short:"Dry sift • 干式分离晶体毛 • 即将推出",
        desc:`产品档案 — dry sift 是通过机械方式分离晶体毛获得的浓缩物，因工艺简洁和原料香气表现而受到重视。
状态 — 即将推出。该卡片作为提取物类别的视觉预览，此阶段不开放购买。
市场信息 — 真实产品页通常会标注筛网目数/微米、原料品种、质地、批次、效力和实验室报告。
定位 — 适合高端浓缩物系列，配合更技术化的沟通与干净视觉。

警告：仅限法律允许地区的成年人。`
      },
      "extract-bubble-hash": {
        name:"Bubble Hash",
        short:"冰水哈希 • 水与冰提取 • 即将推出",
        desc:`产品档案 — bubble hash 是以水和冰分离晶体毛的提取物，重点在于保留花材部分香气特征。
状态 — 即将推出。该产品预告目录的下一阶段，本演示中不开放购买。
市场信息 — 真实产品页通常会标注 ice water 方法、使用筛网、原料品种、质地、建议储存方式和检测报告。
定位 — 具备手工感、技术感与高端定位的提取物选项。

警告：仅限法律允许地区的成年人。`
      }
    }
  };

  const PRODUCT_OPTION_L10N = {
    pt: {"1un":"1un","Pré-roll":"Pré-roll"},
    en: {"1un":"1 unit","1g":"1g","10g":"10g","Pré-roll":"Pre-roll","Strain":"Strain"},
    fr: {"1un":"1 unité","1g":"1g","10g":"10g","Pré-roll":"Pré-roll","Strain":"Variété"},
    it: {"1un":"1 unità","1g":"1g","10g":"10g","Pré-roll":"Pre-roll","Strain":"Strain"},
    es: {"1un":"1 unidad","1g":"1g","10g":"10g","Pré-roll":"Pre-roll","Strain":"Strain"},
    de: {"1un":"1 Stück","1g":"1g","10g":"10g","Pré-roll":"Pre-roll","Strain":"Strain"},
    ja: {"1un":"1本","1g":"1g","10g":"10g","Pré-roll":"プレロール","Strain":"ストレイン"},
    zh: {"1un":"1支","1g":"1g","10g":"10g","Pré-roll":"预卷","Strain":"品种"}
  };

  function productL10n(p){
    if(!p) return {};
    const lang = getLang();
    return (PRODUCT_L10N[lang] && PRODUCT_L10N[lang][p.id]) ||
      (PRODUCT_L10N.pt && PRODUCT_L10N.pt[p.id]) || {};
  }
  function getProductName(p){
    const l = productL10n(p);
    return sanitizeUIText(l.name || t(p?.name || ""));
  }
  function getProductShort(p){
    const l = productL10n(p);
    return sanitizeUIText(l.short || t(p?.short || ""));
  }
  function optionLabel(value){
    const lang = getLang();
    return (PRODUCT_OPTION_L10N[lang] && PRODUCT_OPTION_L10N[lang][value]) ||
      (PRODUCT_OPTION_L10N.pt && PRODUCT_OPTION_L10N.pt[value]) ||
      t(value);
  }

const HOME_PROMO_SLIDES = [
    {
      eyebrow:"CURADORIA PREMIUM",
      title:"Strains com seleção refinada",
      text:"Descubra flores selecionadas com curadoria premium, descrição objetiva e navegação rápida para comparar perfis e escolher melhor.",
      badge:"1g • R$60",
      cta:"Ver strains",
      href:"produtos.html?cat=strains",
      image:"assets/images/strains/purple-haze-real-1.jpg",
      alt:"Purple Haze"
    },
    {
      eyebrow:"PRONTO PARA ESCOLHER",
      title:"Pré-rolls com praticidade",
      text:"Pronto para quem busca conveniência: unidade individual, seleção de strain e apresentação limpa para uma decisão mais rápida.",
      badge:"1un • R$30",
      cta:"Ver pre-roll",
      href:"produtos.html?cat=cigars",
      image:"assets/images/cigars/juanitos-1g.png",
      alt:"Pré-roll"
    },
    {
      eyebrow:"NOVIDADES NO CATÁLOGO",
      title:"Extrações chegando em breve",
      text:"Dry e Bubble Hash em fase de lançamento, preparados para ampliar o catálogo com uma linha de concentrados mais exclusiva.",
      badge:"Em breve",
      cta:"Ver extrações",
      href:"produtos.html?cat=extracts",
      image:"assets/images/extracts/extract-bubble-hash.png",
      alt:"Bubble Hash"
    },
    {
      eyebrow:"EXPERIÊNCIA MODERNA",
      title:"Compra simples, visual premium",
      text:"Uma vitrine digital mais clara, com destaque visual, leitura confortável e fluxo pensado para transformar interesse em escolha.",
      badge:"Catálogo",
      cta:"Explorar produtos",
      href:"produtos.html",
      image:"assets/images/strains/experiencia-moderna-purple-haze.jpg",
      alt:"Purple Haze"
    },
  ];

  const HOME_PROMO_SLIDES_I18N = {
    pt: [
      { eyebrow:"CURADORIA PREMIUM", title:"Strains com seleção refinada", text:"Descubra flores selecionadas com curadoria premium, descrição objetiva e navegação rápida para comparar perfis e escolher melhor.", badge:"1g • R$60", cta:"Ver strains" },
      { eyebrow:"PRONTO PARA ESCOLHER", title:"Pré-rolls com praticidade", text:"Pronto para quem busca conveniência: unidade individual, seleção de strain e apresentação limpa para uma decisão mais rápida.", badge:"1un • R$30", cta:"Ver pre-roll" },
      { eyebrow:"NOVIDADES NO CATÁLOGO", title:"Extrações chegando em breve", text:"Dry e Bubble Hash em fase de lançamento, preparados para ampliar o catálogo com uma linha de concentrados mais exclusiva.", badge:"Em breve", cta:"Ver extrações" },
      { eyebrow:"EXPERIÊNCIA MODERNA", title:"Compra simples, visual premium", text:"Uma vitrine digital mais clara, com destaque visual, leitura confortável e fluxo pensado para transformar interesse em escolha.", badge:"Catálogo", cta:"Explorar produtos" }
    ],
    en: [
      { eyebrow:"PREMIUM CURATION", title:"Refined strain selection", text:"Discover selected flower with premium curation, clear descriptions and fast navigation to compare profiles and choose with confidence.", badge:"1g • R$60", cta:"View strains" },
      { eyebrow:"READY TO CHOOSE", title:"Pre-rolls made convenient", text:"Built for convenience: a single unit, selectable strain and clean presentation for a faster decision.", badge:"1 unit • R$30", cta:"View pre-roll" },
      { eyebrow:"CATALOG NEWS", title:"Extracts coming soon", text:"Dry and Bubble Hash are being prepared to expand the catalog with a more exclusive concentrate line.", badge:"Coming soon", cta:"View extracts" },
      { eyebrow:"MODERN EXPERIENCE", title:"Simple shopping, premium look", text:"A clearer digital storefront with visual emphasis, comfortable reading and a flow designed to turn interest into choice.", badge:"Catalog", cta:"Explore products" }
    ],
    fr: [
      { eyebrow:"CURATION PREMIUM", title:"Sélection raffinée de variétés", text:"Découvrez des fleurs sélectionnées avec une curation premium, des descriptions claires et une navigation rapide pour comparer les profils.", badge:"1g • R$60", cta:"Voir les variétés" },
      { eyebrow:"PRÊT À CHOISIR", title:"Pré-rolls pratiques", text:"Pensé pour la commodité : unité individuelle, variété sélectionnable et présentation claire pour une décision plus rapide.", badge:"1 unité • R$30", cta:"Voir le pré-roll" },
      { eyebrow:"NOUVEAUTÉS CATALOGUE", title:"Extractions bientôt disponibles", text:"Dry et Bubble Hash sont en préparation pour enrichir le catalogue avec une ligne de concentrés plus exclusive.", badge:"Bientôt", cta:"Voir les extractions" },
      { eyebrow:"EXPÉRIENCE MODERNE", title:"Achat simple, visuel premium", text:"Une vitrine digitale plus claire, avec mise en valeur visuelle, lecture confortable et parcours conçu pour faciliter le choix.", badge:"Catalogue", cta:"Explorer les produits" }
    ],
    it: [
      { eyebrow:"CURATELA PREMIUM", title:"Selezione raffinata di strain", text:"Scopri fiori selezionati con curatela premium, descrizioni chiare e navigazione rapida per confrontare i profili.", badge:"1g • R$60", cta:"Vedi strain" },
      { eyebrow:"PRONTO DA SCEGLIERE", title:"Pre-roll pratici", text:"Pensato per la comodità: unità singola, strain selezionabile e presentazione pulita per una decisione più rapida.", badge:"1 unità • R$30", cta:"Vedi pre-roll" },
      { eyebrow:"NOVITÀ CATALOGO", title:"Estrazioni in arrivo", text:"Dry e Bubble Hash sono in preparazione per ampliare il catalogo con una linea di concentrati più esclusiva.", badge:"Prossimamente", cta:"Vedi estrazioni" },
      { eyebrow:"ESPERIENZA MODERNA", title:"Acquisto semplice, look premium", text:"Una vetrina digitale più chiara, con forte impatto visivo, lettura confortevole e flusso pensato per facilitare la scelta.", badge:"Catalogo", cta:"Esplora prodotti" }
    ],
    es: [
      { eyebrow:"CURADURÍA PREMIUM", title:"Selección refinada de strains", text:"Descubre flores seleccionadas con curaduría premium, descripciones claras y navegación rápida para comparar perfiles.", badge:"1g • R$60", cta:"Ver strains" },
      { eyebrow:"LISTO PARA ELEGIR", title:"Pre-rolls prácticos", text:"Pensado para la conveniencia: unidad individual, strain seleccionable y presentación limpia para decidir más rápido.", badge:"1 unidad • R$30", cta:"Ver pre-roll" },
      { eyebrow:"NOVEDADES DEL CATÁLOGO", title:"Extracciones próximamente", text:"Dry y Bubble Hash se preparan para ampliar el catálogo con una línea de concentrados más exclusiva.", badge:"Próximamente", cta:"Ver extracciones" },
      { eyebrow:"EXPERIENCIA MODERNA", title:"Compra simple, visual premium", text:"Una vitrina digital más clara, con destaque visual, lectura cómoda y flujo pensado para convertir interés en elección.", badge:"Catálogo", cta:"Explorar productos" }
    ],
    de: [
      { eyebrow:"PREMIUM-KURATION", title:"Verfeinerte Strain-Auswahl", text:"Entdecken Sie ausgewählte Blüten mit Premium-Kuration, klaren Beschreibungen und schneller Navigation zum Vergleichen.", badge:"1g • R$60", cta:"Strains ansehen" },
      { eyebrow:"BEREIT ZUR AUSWAHL", title:"Praktische Pre-rolls", text:"Für Komfort entwickelt: einzelne Einheit, auswählbare Strain und klare Darstellung für eine schnellere Entscheidung.", badge:"1 Stück • R$30", cta:"Pre-roll ansehen" },
      { eyebrow:"KATALOG-NEUHEITEN", title:"Extrakte demnächst", text:"Dry und Bubble Hash werden vorbereitet, um den Katalog um eine exklusivere Konzentrate-Linie zu erweitern.", badge:"Demnächst", cta:"Extrakte ansehen" },
      { eyebrow:"MODERNE ERFAHRUNG", title:"Einfach kaufen, Premium-Look", text:"Ein klareres digitales Schaufenster mit starker Visualisierung, guter Lesbarkeit und einem Ablauf, der die Auswahl erleichtert.", badge:"Katalog", cta:"Produkte entdecken" }
    ],
    ja: [
      { eyebrow:"プレミアムセレクション", title:"洗練されたストレイン選択", text:"厳選されたフラワーを、わかりやすい説明と快適なナビゲーションで比較し、選びやすくします。", badge:"1g • R$60", cta:"ストレインを見る" },
      { eyebrow:"選びやすい形式", title:"手軽なプレロール", text:"単品、ストレイン選択、すっきりした表示で、より素早い判断をサポートします。", badge:"1本 • R$30", cta:"プレロールを見る" },
      { eyebrow:"カタログ新着", title:"抽出製品は近日公開", text:"Dry と Bubble Hash は、より特別感のある濃縮ラインとしてカタログ拡張に向けて準備中です。", badge:"近日公開", cta:"抽出を見る" },
      { eyebrow:"モダンな体験", title:"シンプルな購入、プレミアムな見た目", text:"見やすさ、読みやすさ、選びやすさを重視したデジタルストアフロントです。", badge:"カタログ", cta:"商品を見る" }
    ],
    zh: [
      { eyebrow:"高端精选", title:"精选品种展示", text:"以高端策展、清晰描述和快速导航呈现精选花材，方便比较不同风味与体验。", badge:"1g • R$60", cta:"查看品种" },
      { eyebrow:"即刻选择", title:"便捷预卷", text:"单支规格、可选品种和简洁展示，让用户更快理解产品并完成选择。", badge:"1支 • R$30", cta:"查看预卷" },
      { eyebrow:"目录新品", title:"提取物即将推出", text:"Dry 与 Bubble Hash 正在筹备中，将以更具高端感的浓缩产品线扩展目录。", badge:"即将推出", cta:"查看提取物" },
      { eyebrow:"现代体验", title:"简单购买，高端视觉", text:"更清晰的数字橱窗，突出视觉、阅读舒适，并帮助用户从兴趣进入选择。", badge:"目录", cta:"探索产品" }
    ]
  };

  function promoPricePrefix(index){
    const lang = getLang();
    const map = {
      pt:["1g", "1un"],
      en:["1g", "1 unit"],
      fr:["1g", "1 unité"],
      it:["1g", "1 unità"],
      es:["1g", "1 unidad"],
      de:["1g", "1 Stück"],
      ja:["1g", "1本"],
      zh:["1g", "1支"],
    };
    return (map[lang] || map.pt)[index] || "";
  }

  function getHomePromoSlides(){
    const lang = getLang();
    const base = HOME_PROMO_SLIDES || [];
    const localized = HOME_PROMO_SLIDES_I18N[lang] || HOME_PROMO_SLIDES_I18N.pt || [];
    return base.map((s, i)=>{
      const merged = Object.assign({}, s, localized[i] || {});
      if(i === 0) merged.badge = `${promoPricePrefix(0)} • ${money(60)}`;
      if(i === 1) merged.badge = `${promoPricePrefix(1)} • ${money(30)}`;
      ["eyebrow","title","text","badge","cta","alt"].forEach(k=>{
        if(typeof merged[k] === "string") merged[k] = sanitizeUIText(merged[k]);
      });
      return merged;
    });
  }



  /* ---------- Hero carousel slides ----------
     Home uses: ./assets/hero-*.jpg
     Institutional (Hemp Oil Company) uses: ./assets/images/company/*
  */
  const HOME_HERO_SLIDES = [
    { src:"assets/images/strains/purple-haze-real-1.jpg", alt:"Purple Haze" },
    { src:"assets/images/cigars/juanitos-1g.png", alt:"Pré-roll" },
    { src:"assets/images/extracts/extract-bubble-hash.png", alt:"Bubble Hash" },
    { src:"assets/images/strains/experiencia-moderna-purple-haze.jpg", alt:"Catálogo premium" },
  ];

  const COMPANY_HERO_SLIDES = [
    {
      type:"video",
      src:"assets/videos/hoc-card-video.mp4",
      poster:"assets/videos/hoc-card-video-poster.jpg",
      alt:"Vídeo institucional Hemp Oil Company S.A.",
      duration:10500
    },
    { src:"assets/images/company/company-1.jpg", alt:"Purple Haze" },
    { src:"assets/images/company/company-2.jpg", alt:"Purple Haze" },
    { src:"assets/images/company/company-3.jpg", alt:"OG Kush" },
    { src:"assets/images/company/company-4.jpg", alt:"OG Kush" },
  ];

  const HERO_SLIDES = (function(){
    const p = (location.pathname || "").toLowerCase();
    const isCompany = p.includes("hemp-oil-company") || p.includes("hoc-");
    return (isCompany ? COMPANY_HERO_SLIDES : HOME_HERO_SLIDES);
  })();
  
  /* ---------- Product helpers ---------- */
  function findProduct(id){ return PRODUCTS.find(p=>p.id===id); }
  function isValidCartItem(item){
    const p = item ? findProduct(item.productId) : null;
    if(!p || p.comingSoon) return false;
    const values = Object.values(item.variant || {});
    return !values.includes("Gorilla Glue");
  }
  function getValidCart(){
    const raw = getCart();
    const clean = raw.filter(isValidCartItem);
    if(clean.length !== raw.length){
      localStorage.setItem(LS.cartKey, JSON.stringify(clean));
    }
    return clean;
  }

  function getProductDesc(p){
    const l = productL10n(p);
    let value = "";
    if(l.desc) value = l.desc;
    else if(p?.desc) value = p.desc;
    else {
      const k = "pdesc_" + p.id;
      const v = t(k);
      value = (v === k) ? (p.desc || "") : v;
    }
    return sanitizeProductDesc(value);
  }

  
  /* ---------- Cart operations ---------- */
  function addToCart(productId, variant={}, qty=1){
    const p = findProduct(productId);
    if(p?.comingSoon) return false;
    const cart = getCart();
    const variantKey = Object.entries(variant).map(([k,v])=>`${k}:${v}`).join("|");
    const key = `${productId}::${variantKey}`;
    const found = cart.find(i=>i.key===key);
    const q = Math.max(1, Math.min(99, Number(qty)||1));
    if(found) found.qty += q;
    else cart.push({ key, productId, variant, qty:q });
    setCart(cart);
    return true;
  }
  function removeFromCart(key){ setCart(getCart().filter(i=>i.key!==key)); }
  function changeQty(key, delta){
    const cart = getCart();
    const it = cart.find(i=>i.key===key);
    if(!it) return;
    it.qty += delta;
    if(it.qty <= 0) return removeFromCart(key);
    setCart(cart);
  }
  function cartTotals(cart){
    const subtotal = cart.reduce((sum, it)=>{
      const p = findProduct(it.productId);
      return sum + (p ? getVariantPrice(p, it.variant||{}) * it.qty : 0);
    }, 0);
    const shipping = subtotal > 0 ? 7.90 : 0;
    const tax = subtotal > 0 ? subtotal * 0.06 : 0;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  }
  
  /* ---------- UI helpers ---------- */
  function currentLangObj(){ return LANGS.find(l=>l.code===getLang()) || LANGS[0]; }
  function updateCartBadge(){
    const badge = document.getElementById("cartBadge");
    if(badge) badge.textContent = String(cartCount());
  }
  function syncLangButton(){
    const btn = document.getElementById("langBtn");
    if(!btn) return;
    const cur = currentLangObj();
    const f = btn.querySelector(".langbtn__flag");
    const c = btn.querySelector(".langbtn__code");
    if(f) f.textContent = cur.flag;
    if(c) c.textContent = cur.code.toUpperCase();
  }
  function applyI18nStatic(){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el=>{
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
  }

  function initFooterSearch(){
    const input = document.getElementById("footerSearchInput");
    if(!input) return;

    const isProducts = /produtos\.html$/i.test(location.pathname) || location.href.includes("produtos.html");
    const mainSearch = document.getElementById("searchInput");

    // If we're on produtos.html, keep footer input synced with the current query.
    try{
      const u = new URL(location.href);
      const q = u.searchParams.get("q") || "";
      if(isProducts && q && !input.value) input.value = q;
    }catch{}

    const applyProductsFilter = ()=>{
      if(!isProducts || !mainSearch) return;
      mainSearch.value = input.value;
      mainSearch.dispatchEvent(new Event("input"));
    };

    input.addEventListener("input", ()=>{
      if(isProducts) applyProductsFilter();
    });

    input.addEventListener("keydown", (e)=>{
      if(e.key !== "Enter") return;
      e.preventDefault();
      const q = (input.value || "").trim();
      if(isProducts){
        applyProductsFilter();
        input.blur();
        return;
      }
      location.href = q ? `produtos.html?q=${encodeURIComponent(q)}` : "produtos.html";
    });
  }
  
  /* ---------- Language modal ---------- */
  function mountLangModal(){
    const modal = document.getElementById("langModal");
    if(!modal) return;
  
    const wheel = modal.querySelector("#langWheel");
    const btn = document.getElementById("langBtn");
    const closeBtn = modal.querySelector("#langClose");
  
    function renderWheel(){
      const cur = getLang();
      wheel.innerHTML = `
        <div class="wheel__focus"></div>
        ${LANGS.map(l=>{
          const active = l.code===cur ? "wheel__item--active" : "";
          return `
            <div class="wheel__item ${active}" data-code="${l.code}">
              <div class="wheel__left">
                <div class="wheel__flag">${l.flag}</div>
                <div>
                  <div class="wheel__name">${l.name}</div>
                  <div class="wheel__meta">${l.meta}</div>
                </div>
              </div>
              <div class="wheel__code">${l.code.toUpperCase()}</div>
            </div>
          `;
        }).join("")}
      `;
      wheel.querySelectorAll(".wheel__item").forEach(item=>{
        item.addEventListener("click", ()=>{
          setLang(item.dataset.code);
          syncLangButton();
          syncCurrencyButton();
          applyI18nStatic();
pageRenderAll();
    mountSmartFooter();
    mountNewsletter();
    mountCurrencyModal();
          renderWheel();
        });
      });
    }
  
    function open(){
      modal.classList.add("modal--open");
      renderWheel();
      const active = wheel.querySelector(".wheel__item--active");
      if(active) active.scrollIntoView({block:"center"});
    }
    function close(){ modal.classList.remove("modal--open"); }
  
    btn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e)=>{ if(e.target === modal) close(); });
  }
  


  /* ---------- Currency UI ---------- */
  function syncCurrencyButton(){
    const btn = document.getElementById("curBtn");
    if(!btn) return;
    const code = getCurrency();
    const c = btn.querySelector(".langbtn__code");
    const f = btn.querySelector(".langbtn__flag");
    if(f){
      f.textContent = code === "BRL" ? "R$" : code === "EUR" ? "€" : code === "JPY" ? "¥" : code === "CNY" ? "¥" : code === "BTC" ? "₿" : code === "SATS" ? "sat" : "$";
    }
    if(c) c.textContent = code;
  }

  function ensureCurrencyButton(){
    const langBtn = document.getElementById("langBtn");
    if(!langBtn) return;
    if(document.getElementById("curBtn")) return;

    const btn = document.createElement("button");
    btn.className = "langbtn curbtn";
    btn.id = "curBtn";
    btn.type = "button";
    btn.innerHTML = `
      <span class="langbtn__flag">FX</span>
      <span class="langbtn__code">USD</span>
      <span class="langbtn__chev">▾</span>
    `;
    langBtn.insertAdjacentElement("afterend", btn);
  }

  function mountCurrencyModal(){
    ensureCurrencyButton();
    syncCurrencyButton();

    const oldModal = document.getElementById("curModal");
    if(oldModal) oldModal.remove();

    {
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.id = "curModal";
      modal.innerHTML = `
        <div class="sheet">
          <div class="sheet__head">
            <div class="sheet__title">${t("currency_title")}</div>
            <button class="sheet__close" id="curClose" type="button">${t("currency_close")}</button>
          </div>
          <div class="sheet__body">
            <div class="small" style="margin:0 0 10px">${t("currency_sub")}</div>
            <div class="wheel" id="curWheel"></div>
            <div class="hr" style="margin:14px 0"></div>
            <div class="small" style="margin-bottom:8px"><strong>${t("currency_rates")}</strong> <span class="muted">${t("currency_est")}</span></div>
            <div class="formgrid">
              <div class="field">
                <div class="label">${t("currency_brl_per_usd")}</div>
                <input class="input" id="rateBRL" inputmode="decimal" />
              </div>
              <div class="field">
                <div class="label">${t("currency_eur_per_usd")}</div>
                <input class="input" id="rateEUR" inputmode="decimal" />
              </div>
              <div class="field">
                <div class="label">${t("currency_jpy_per_usd")}</div>
                <input class="input" id="rateJPY" inputmode="decimal" />
              </div>
              <div class="field">
                <div class="label">${t("currency_cny_per_usd")}</div>
                <input class="input" id="rateCNY" inputmode="decimal" />
              </div>
              <div class="field" style="grid-column:1/-1">
                <div class="label">${t("currency_btc_usd")}</div>
                <input class="input" id="rateBTC" inputmode="decimal" />
              </div>
            </div>
            <div class="paybox__actions" style="margin-top:12px">
              <button class="btn btn--primary" id="curSave" type="button">${t("currency_save")}</button>
              <button class="btn btn--ghost" id="curUpdate" type="button">${t("currency_update")}</button>
            </div>
            <div class="small" id="curStatus" aria-live="polite" style="margin-top:8px"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modal = document.getElementById("curModal");
    const wheel = document.getElementById("curWheel");
    const btn = document.getElementById("curBtn");
    const closeBtn = document.getElementById("curClose");
    const saveBtn = document.getElementById("curSave");
    const updBtn = document.getElementById("curUpdate");
    const status = document.getElementById("curStatus");
    const rateBRL = document.getElementById("rateBRL");
    const rateEUR = document.getElementById("rateEUR");
    const rateJPY = document.getElementById("rateJPY");
    const rateCNY = document.getElementById("rateCNY");
    const rateBTC = document.getElementById("rateBTC");

    function renderWheel(){
      const cur = getCurrency();
      wheel.innerHTML = `
        <div class="wheel__focus"></div>
        ${CUR.list.map(c=>{
          const active = c.code===cur ? "wheel__item--active" : "";
          const flag = (c.code === "BTC") ? "₿" :
                       (c.code === "SATS") ? "sat" :
                       (c.code === "EUR") ? "€" :
                       (c.code === "JPY") ? "¥" :
                       (c.code === "CNY") ? "¥" :
                       (c.code === "BRL") ? "R$" : "$";
          return `
            <div class="wheel__item ${active}" data-code="${c.code}">
              <div class="wheel__left">
                <div class="wheel__flag">${flag}</div>
                <div>
                  <div class="wheel__name">${c.label}</div>
                  <div class="wheel__meta">${c.code === "SATS" ? "Satoshis" : ""}</div>
                </div>
              </div>
              <div class="wheel__code">${c.code}</div>
            </div>
          `;
        }).join("")}
      `;
      wheel.querySelectorAll(".wheel__item").forEach(item=>{
        item.addEventListener("click", ()=>{
          setCurrency(item.dataset.code);
          syncCurrencyButton();
          pageRenderAll();
    initHeroCarousel();
    mountProductBackNav();
          mountSmartFooter();
          mountNewsletter();
          renderWheel();
        });
      });
    }

    function loadRatesToInputs(){
      const r = getRates();
      if(rateBRL) rateBRL.value = String(r.BRL_PER_USD ?? "");
      if(rateEUR) rateEUR.value = String(r.EUR_PER_USD ?? "");
      if(rateJPY) rateJPY.value = String(r.JPY_PER_USD ?? "");
      if(rateCNY) rateCNY.value = String(r.CNY_PER_USD ?? "");
      if(rateBTC) rateBTC.value = String(r.BTC_USD ?? "");
    }

    function open(){
      loadRatesToInputs();
      const r = getRates();
      if(status){
        status.textContent = r.updatedAt ? `Última cotação: ${new Date(r.updatedAt).toLocaleString("pt-BR")}` : "";
      }
      renderWheel();
      modal.classList.add("modal--open");
    }
    function close(){ modal.classList.remove("modal--open"); }

    btn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e)=>{ if(e.target === modal) close(); });

    saveBtn?.addEventListener("click", ()=>{
      setRates({
        BRL_PER_USD: parseFloat(String(rateBRL?.value||"")) || undefined,
        EUR_PER_USD: parseFloat(String(rateEUR?.value||"")) || undefined,
        JPY_PER_USD: parseFloat(String(rateJPY?.value||"")) || undefined,
        CNY_PER_USD: parseFloat(String(rateCNY?.value||"")) || undefined,
        BTC_USD: parseFloat(String(rateBTC?.value||"")) || undefined,
      });
      if(status) status.textContent = t("currency_updated");
      pageRenderAll();
    initHeroCarousel();
    });

    // Atualização online: busca a cotação real do dia e salva localmente.
    updBtn?.addEventListener("click", async ()=>{
      const ok = await refreshDailyRates({ force:true, statusEl:status });
      loadRatesToInputs();
      if(ok) renderWheel();
    });
  }

  /* ---------- Auth UI ---------- */
  function mountAuthUI(){
    const authArea = document.getElementById("authArea");
    if(!authArea) return;
    const user = getUser();
    if(user){
      authArea.innerHTML = `
        <a class="topIcon" href="minhas-compras.html" aria-label="${t("my_orders")}">
          <span class="sr-only">${t("my_orders")}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 6h10M7 10h10M7 14h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M6 3.8h12c1 0 1.8.8 1.8 1.8v12.4c0 1-.8 1.8-1.8 1.8H6c-1 0-1.8-.8-1.8-1.8V5.6C4.2 4.6 5 3.8 6 3.8Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <button class="topIcon" id="logoutBtn" type="button" aria-label="${t("sign_out")}">
          <span class="sr-only">${t("sign_out")}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 7V5.8C10 4.8 10.8 4 11.8 4h6.4C19.2 4 20 4.8 20 5.8v12.4c0 1-.8 1.8-1.8 1.8h-6.4c-1 0-1.8-.8-1.8-1.8V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 12h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m7 9-3 3 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>`;
      authArea.querySelector("#logoutBtn").addEventListener("click", logout);
    } else {
      authArea.innerHTML = `<a class="topIcon" href="login.html" aria-label="${t("login")}">
        <span class="sr-only">${t("login")}</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Zm0 2.2c-4.2 0-7.6 2-7.6 4.4V20h15.2v-1.4c0-2.4-3.4-4.4-7.6-4.4Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`;
    }
  }
  
  /* ---------- Rendering: cards ---------- */

  function getProductImage(p, selected){
    const strength = selected && selected.strength ? selected.strength : null;
    const size = selected && selected.size ? selected.size : null;
    const format = selected && selected.format ? selected.format : null;
    const color = selected && selected.color ? selected.color : null;
    const weight = selected && selected.weight ? selected.weight : null;

    if(p){
      if(p.imagesByStrength && strength){
        return p.imagesByStrength[strength] || p.image || "";
      }
      if(p.imagesBySize && size){
        return p.imagesBySize[size] || p.image || "";
      }
      if(p.imagesByFormat && format){
        return p.imagesByFormat[format] || p.image || "";
      }
      if(p.imagesByColor && color){
        return p.imagesByColor[color] || p.image || "";
      }
      if(p.imagesByWeight && weight){
        return p.imagesByWeight[weight] || p.image || "";
      }
    }
    return (p && p.image) ? p.image : "";
  }

  function getProductGallery(p, selected){
    if(p && Array.isArray(p.gallery) && p.gallery.length){
      return p.gallery.slice();
    }
    const src = getProductImage(p, selected);
    return src ? [src] : [];
  }

  function defaultSelection(p){
    const selected = {};
    (p?.optionGroups||[]).forEach(g=>{ if(g && g.key && Array.isArray(g.options) && g.options.length){ selected[g.key] = g.options[0]; } });
    return selected;
  }

  function getVariantPrice(p, selected={}){
    if(!p) return 0;
    if(p.comingSoon) return 0;
    if(p.priceByWeight && selected.weight){
      const v = p.priceByWeight[selected.weight];
      if(typeof v === "number") return v;
    }
    if(p.priceByUnit && selected.unit){
      const v = p.priceByUnit[selected.unit];
      if(typeof v === "number") return v;
    }
    return Number(p.price)||0;
  }

  function displayPriceHTML(p, selected=defaultSelection(p)){
    if(p?.comingSoon) return `<span class="priceSoon">${t("soon_badge")}</span>`;
    return money(getVariantPrice(p, selected));
  }

  function cardImageHTML(p){
    const selected = defaultSelection(p);
    const src = getProductImage(p, selected);
    if(src){
      return `<img src="${src}" alt="${escapeHTML(getProductName(p))}" loading="lazy" decoding="async" />`;
    }
    return `<div class="card__imageLabel">${t(p.imageLabel||"")}</div>`;
  }

  function cardHTML(p){
    const soon = p.comingSoon ? `<span class="card__badge">${t("soon_badge")}</span>` : "";
    return `
      <a class="card ${p.comingSoon ? "card--soon" : ""} ${p.id === "preroll-cigarettes" ? "card--image-contain card--juanitos" : ""}" href="produto.html?id=${encodeURIComponent(p.id)}">
        <div class="card__image">${cardImageHTML(p)}${soon}</div>
        <h3 class="card__title ${p.id.startsWith("preroll") || p.id.includes("cigarette") ? "card__title--elegant" : ""}">${getProductName(p)}</h3>
        <p class="card__meta">${getProductShort(p)}</p>
        <div class="card__row">
          <div class="card__price">${displayPriceHTML(p)}</div>
        </div>
      </a>
    `;
  }

  /* ---------- Deterministic random helpers (for rotating featured products) ---------- */
  function hashToSeed(str){
    // FNV-1a 32-bit
    let h = 2166136261;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed){
    let a = seed >>> 0;
    return function(){
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pickN(items, n, rand){
    const arr = items.slice();
    // Fisher-Yates shuffle (partial)
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(rand() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.min(n, arr.length));
  }
  
  /* ---------- HOME featured ---------- */
  function renderHome(){
    const featuredGrid = document.getElementById("featuredGrid"); // legacy fallback
    if(!featuredGrid) return;

    // Rotate featured products every time the user returns to the Home page.
    // Uses a deterministic seed based on time bucket + session visit count.
    const now = new Date();
    const dayKey = now.toISOString().slice(0,10); // YYYY-MM-DD
    const bucket = Math.floor((now.getHours() * 60 + now.getMinutes()) / 30); // 30-min buckets
    const visitKey = "hs_home_visit";
    const lastKey = "hs_home_last_featured";
    const visits = (Number(sessionStorage.getItem(visitKey) || "0") + 1);
    sessionStorage.setItem(visitKey, String(visits));

    const seedBase = `${dayKey}:${bucket}:${visits}`;
    const seed = hashToSeed(seedBase);
    const rand = mulberry32(seed);

    // Candidate pool (avoid ultra-long lists by keeping everything eligible)
    const pool = PRODUCTS.filter(Boolean);
    let featured = pickN(pool, 3, rand);

    // Ensure it changes compared to the last home render in this session
    const last = sessionStorage.getItem(lastKey) || "";
    const ids = featured.map(p=>p.id).join("|");
    if(ids && ids === last && pool.length > 3){
      // Shift deterministically by reseeding once
      const rand2 = mulberry32(hashToSeed(seedBase + ":alt"));
      featured = pickN(pool, 3, rand2);
    }
    sessionStorage.setItem(lastKey, featured.map(p=>p.id).join("|"));

    featuredGrid.innerHTML = featured.map(cardHTML).join("");

    // new large home promo carousel
    initHomePromoCarousel();
  }

  /* ---------- Home main promo carousel ---------- */
  function initHomePromoCarousel(){
    const root = document.getElementById("homePromoCarousel");
    if(!root) return;

    const slidesWrap = document.getElementById("homePromoSlides");
    const dotsWrap = document.getElementById("homePromoDots");
    const prev = document.getElementById("homePromoPrev");
    const next = document.getElementById("homePromoNext");
    const slides = getHomePromoSlides();
    let index = 0;
    let timer = null;

    function slideHTML(s, i){
      return `
        <article class="homePromoSlide ${i===0 ? "is-active" : ""}">
          <div class="homePromoSlide__copy">
            <div class="homePromoSlide__eyebrow">${escapeHTML(s.eyebrow||"")}</div>
            <h1 class="homePromoSlide__title">${escapeHTML(s.title||"")}</h1>
            <p class="homePromoSlide__text">${escapeHTML(s.text||"")}</p>
            <div class="homePromoSlide__actions">
              <a class="btn btn--primary" href="${escapeHTML(s.href||"produtos.html")}">${escapeHTML(s.cta||t("see_products"))}</a>
              <span class="homePromoSlide__badge">${escapeHTML(s.badge||"")}</span>
            </div>
          </div>
          <div class="homePromoSlide__media">
            <img src="${escapeHTML(s.image||"")}" alt="${escapeHTML(s.alt||s.title||"")}" loading="${i===0 ? "eager" : "lazy"}" />
          </div>
        </article>
      `;
    }

    function build(){
      if(slidesWrap) slidesWrap.innerHTML = slides.map(slideHTML).join("");
      if(dotsWrap){
        dotsWrap.innerHTML = slides.map((_, i)=>`<button type="button" class="homePromoDot ${i===0 ? "is-active" : ""}" aria-label="Slide ${i+1}" data-i="${i}"></button>`).join("");
        dotsWrap.querySelectorAll(".homePromoDot").forEach(btn=>{
          btn.addEventListener("click", ()=>go(Number(btn.dataset.i||0), true));
        });
      }
    }

    function setActive(){
      const slideNodes = slidesWrap?.querySelectorAll(".homePromoSlide") || [];
      const dots = dotsWrap?.querySelectorAll(".homePromoDot") || [];
      slideNodes.forEach((n, i)=> n.classList.toggle("is-active", i===index));
      dots.forEach((d, i)=> d.classList.toggle("is-active", i===index));
    }

    function go(i, fromUser=false){
      if(!slides.length) return;
      index = (i + slides.length) % slides.length;
      setActive();
      if(fromUser) restart();
    }

    function restart(){
      if(timer) clearInterval(timer);
      timer = setInterval(()=>go(index+1), 4600);
    }

    if(root._hsPromoTimer) clearInterval(root._hsPromoTimer);
    build();

    prev && (prev.onclick = ()=>go(index-1, true));
    next && (next.onclick = ()=>go(index+1, true));
    root.onmouseenter = ()=>{ if(root._hsPromoTimer) clearInterval(root._hsPromoTimer); };
    root.onmouseleave = ()=>restart();

    function storeTimer(fn, ms){
      root._hsPromoTimer = setInterval(fn, ms);
      return root._hsPromoTimer;
    }
    restart = function(){
      if(root._hsPromoTimer) clearInterval(root._hsPromoTimer);
      timer = storeTimer(()=>go(index+1), 4600);
    };
    restart();
  }

  /* ---------- Home hero carousel ---------- */
  function initHeroCarousel(){
    const root = document.getElementById("heroCarousel");
    if(!root) return;
    if(root.dataset.bound === "1"){
      // keep overlay in sync with language
      const ov = document.getElementById("heroOverlay");
      if(ov){
        const k = (ov.dataset && ov.dataset.i18n) ? ov.dataset.i18n : "hero_image_label";
        ov.innerHTML = `<span>${t(k)}</span>`;
      }
      return;
    }
    root.dataset.bound = "1";

    const slidesWrap = document.getElementById("heroSlides");
    const dotsWrap = document.getElementById("heroDots");
    const overlay = document.getElementById("heroOverlay");
    const prev = document.getElementById("heroPrev");
    const next = document.getElementById("heroNext");

    if(overlay){ const k = (overlay.dataset && overlay.dataset.i18n) ? overlay.dataset.i18n : "hero_image_label"; overlay.innerHTML = `<span>${t(k)}</span>`; }

    let index = 0;
    let timer = null;
    const slides = (HERO_SLIDES || []).slice();

    function build(){
      if(slidesWrap) slidesWrap.innerHTML = "";
      if(dotsWrap) dotsWrap.innerHTML = "";

      slides.forEach((s, i)=>{
        const slide = document.createElement("div");
        slide.className = "heroCarousel__slide" + (i===0?" is-active":"");

        const isVideo = s.type === "video" || /\.(mp4|mov|webm)$/i.test(s.src || "");
        let media;

        if(isVideo){
          media = document.createElement("video");
          media.alt = s.alt || "";
          media.muted = true;
          media.loop = true;
          media.autoplay = true;
          media.playsInline = true;
          media.preload = "metadata";
          media.setAttribute("muted", "");
          media.setAttribute("playsinline", "");
          media.setAttribute("aria-label", s.alt || "Vídeo institucional");
          if(s.poster) media.poster = s.poster;
          media.src = s.src;
          media.addEventListener("loadeddata", setActive);
        } else {
          media = document.createElement("img");
          media.alt = s.alt || "";
          media.loading = "lazy";
          media.decoding = "async";
          media.src = s.src;
        }

        media.addEventListener("error", ()=>{
          // hide broken media and keep the centered label visible
          media.style.display = "none";
          setActive();
        });
        slide.appendChild(media);
        slidesWrap?.appendChild(slide);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "heroCarousel__dot" + (i===0?" is-active":"");
        dot.setAttribute("aria-label", `Slide ${i+1}`);
        dot.addEventListener("click", ()=>go(i, true));
        dotsWrap?.appendChild(dot);
      });

      // If no images exist at all (404), the box still looks nice (hero background)
      // and overlay label remains centered.
    }

    function setActive(){
      const nodes = slidesWrap?.querySelectorAll(".heroCarousel__slide") || [];
      const dots = dotsWrap?.querySelectorAll(".heroCarousel__dot") || [];
      nodes.forEach((n, i)=>{
        const active = i===index;
        n.classList.toggle("is-active", active);

        const video = n.querySelector("video");
        if(video){
          if(active){
            try{ video.currentTime = 0; }catch{}
            const play = video.play();
            if(play && typeof play.catch === "function") play.catch(()=>{});
          } else {
            video.pause();
          }
        }
      });
      dots.forEach((d, i)=> d.classList.toggle("is-active", i===index));

      // Show the centered label ONLY when the active slide has no working media.
      if(overlay){
        const active = nodes[index];
        const media = active?.querySelector("img, video");
        const isVideo = media && media.tagName === "VIDEO";
        const hasMedia = media && media.style.display !== "none" && (isVideo ? (media.readyState > 0 || media.currentSrc) : (media.complete && media.naturalWidth > 0));
        overlay.classList.toggle("is-hidden", !!hasMedia);
      }
    }

    function slideDelay(){
      const s = slides[index] || {};
      const value = Number(s.duration || (s.type === "video" ? 10500 : 4200));
      return Number.isFinite(value) && value > 1200 ? value : 4200;
    }

    function go(i, fromUser=false){
      if(!slides.length) return;
      index = (i + slides.length) % slides.length;
      setActive();
      restart();
    }

    let paused = false;
    function restart(){
      if(timer) clearTimeout(timer);
      if(paused) return;
      timer = setTimeout(()=>go(index+1), slideDelay());
    }

    prev?.addEventListener("click", ()=>go(index-1, true));
    next?.addEventListener("click", ()=>go(index+1, true));

    build();
    setActive();
    restart();

    // Pause on hover for desktop
    root.addEventListener("mouseenter", ()=>{ paused = true; if(timer) clearTimeout(timer); });
    root.addEventListener("mouseleave", ()=>{ paused = false; restart(); });
  }
  
  /* ---------- PRODUCTS list ---------- */
  function renderProductsList(){
    const grid = document.getElementById("productsGrid");
    if(!grid) return;
  
    const searchInput = document.getElementById("searchInput");
    const categorySelect = document.getElementById("categorySelect");

    const footerSearchWrap = document.getElementById("footerSearchWrap");
    if(footerSearchWrap) footerSearchWrap.style.display = "block";

    // restore filters from URL (keeps state when returning)
    const u = new URL(location.href);
    const q0 = u.searchParams.get("q") || "";
    const c0 = u.searchParams.get("cat") || "all";
    if(searchInput) searchInput.value = q0;

  
    categorySelect.innerHTML = `
      <option value="all">${t("all_categories")}</option>
      ${CATEGORIES.map(c=>`<option value="${c.id}">${t(c.labelKey)}</option>`).join("")}
    `;
    if(categorySelect) categorySelect.value = c0;

    // Category navigation bar (pills)
    const categoryBar = document.getElementById("categoryBar");
    if(categoryBar){
      const hasProduct = (catId)=> PRODUCTS.some(p=>p.category===catId);
      const barCats = ["all", ...CATEGORIES.filter(c=>hasProduct(c.id)).map(c=>c.id)];
      const labelFor = (id)=>{
        if(id==="all") return t("all_categories");
        const c = CATEGORIES.find(x=>x.id===id);
        return c ? t(c.labelKey) : id;
      };
      categoryBar.innerHTML = barCats.map((id,i)=>`
        <button class="catpill ${i===0?"catpill--active":""}" type="button" data-cat="${id}">
          ${labelFor(id)}
        </button>
      `).join("");

      const setActive = (val)=>{
        categoryBar.querySelectorAll(".catpill").forEach(b=>{
          b.classList.toggle("catpill--active", b.getAttribute("data-cat")===val);
        });
      };

      categoryBar.addEventListener("click", (e)=>{
        const btn = e.target.closest(".catpill");
        if(!btn) return;
        const val = btn.getAttribute("data-cat");
        if(!val) return;
        categorySelect.value = val;
        setActive(val);
        apply();
      });

      categorySelect?.addEventListener("change", ()=>{
        setActive(categorySelect.value || "all");
      });
      setActive(categorySelect?.value || "all");
    }

    function apply(){
      const q = (searchInput?.value||"").trim().toLowerCase();
      const cat = categorySelect?.value || "all";
  
      const filtered = PRODUCTS.filter(p=>{
        const matchQ = !q || getProductName(p).toLowerCase().includes(q) || getProductShort(p).toLowerCase().includes(q);
        const matchCat = (cat==="all") ? true : p.category===cat;
        return matchQ && matchCat;
      });
  
      grid.innerHTML = filtered.map(cardHTML).join("");

      // keep state in URL
      const uu = new URL(location.href);
      if(q) uu.searchParams.set("q", q); else uu.searchParams.delete("q");
      if(cat && cat!=="all") uu.searchParams.set("cat", cat); else uu.searchParams.delete("cat");
      history.replaceState({}, "", uu.toString());

      // remember where user was (so product page "voltar" returns here)
      grid.querySelectorAll("a.card").forEach(a=>{
        a.addEventListener("click", ()=>{
          sessionStorage.setItem("lastProductsUrl", location.href);
        }, { once:true });
      });
    }

  
    searchInput?.addEventListener("input", apply);
    categorySelect?.addEventListener("change", apply);
    apply();
  }
  
  /* ---------- PRODUCT page ---------- */
  function getParam(name){
    const url = new URL(location.href);
    return url.searchParams.get(name);
  }

  function formatProductDesc(desc){
    const raw = String(desc || "");
    const rx = /\n(Atenção|Warning|Advertencia|Avertissement|Avvertenza|Warnhinweis|注意|警告):\s*/;
    const m = raw.match(rx);
    let main = raw.trim();
    let warn = "";
    if(m && typeof m.index === "number"){
      const idx = m.index;
      const label = m[1] || "Atenção";
      main = raw.slice(0, idx).trim();
      warn = label + ": " + raw.slice(idx + m[0].length).trim();
    }
    const mainHtml = escHtml(main).replace(/\n/g, "<br>");
    const warnHtml = warn ? escHtml(warn).replace(/\n/g, "<br>") : "";
    return { mainText: main, warnText: warn, mainHtml, warnHtml };
  }

  const CANNABINOID_PROFILES = {
    "OG Kush": {
      scale: 30,
      metrics: {
        THC: { min:18, max:24 },
        CBD: { min:0, max:1 },
        CBG: { min:0.4, max:1 },
        THCA: { min:22, max:28 }
      }
    },
    "Purple Haze": {
      scale: 30,
      metrics: {
        THC: { min:14, max:20 },
        CBD: { min:0, max:1 },
        CBG: { min:0.4, max:1 },
        THCA: { min:22, max:28 }
      }
    }
  };

  function getChartVariety(p, selected){
    if(!p) return null;
    if(p.id === "strain-og-kush") return "OG Kush";
    if(p.id === "strain-purple-haze") return "Purple Haze";
    const current = selected && selected.strain ? String(selected.strain) : "";
    return CANNABINOID_PROFILES[current] ? current : null;
  }

  function parseProductFacts(text){
    const raw = String(text || "");
    const lines = raw.split(/\n+/).map(v=>v.trim()).filter(Boolean);
    const facts = [];
    let current = null;
    let skipCann = false;
    const skipKeywords = [
      "quantidade de canabinoides", "cannabinoid content", "teneur en cannabinoïdes",
      "quantità di cannabinoidi", "cantidad de cannabinoides", "cannabinoidgehalt",
      "カンナビノイド量", "大麻素含量"
    ];
    const headingKeywords = [
      "características gerais", "general characteristics", "caractéristiques générales",
      "caratteristiche generali", "características generales", "allgemeine merkmale",
      "一般的な特徴", "一般特征"
    ];

    for(const line of lines){
      const lineLc = line.toLowerCase();
      if(skipKeywords.some(k=>lineLc.includes(k))){
        skipCann = true;
        current = null;
        continue;
      }
      if(skipCann) continue;
      if(headingKeywords.some(k=>lineLc === k)) continue;

      const colon = line.match(/^([^:：]{2,48})[:：]\s*(.*)$/);
      const dash = line.match(/^(.{2,48}?)\s+[—-]\s+(.*)$/);

      if(colon){
        const label = colon[1].trim();
        const value = colon[2].trim();
        if(value){
          facts.push({ label, value, items: null });
          current = null;
        }else{
          current = { label, value:"", items:[] };
          facts.push(current);
        }
        continue;
      }

      if(dash){
        facts.push({ label: dash[1].trim(), value: dash[2].trim(), items: null });
        current = null;
        continue;
      }

      if(current){
        current.items.push(line);
      }
    }

    return facts.filter(f=>f && (f.value || (f.items && f.items.length))).slice(0, 8);
  }

  function renderProductFacts(parts){
    const facts = parseProductFacts(parts.mainText);
    if(!facts.length) return parts.mainHtml ? `<p class="productView__descText">${parts.mainHtml}</p>` : "";
    return `
      <div class="productFactsGrid">
        ${facts.map(f=>`
          <div class="productFact">
            <div class="productFact__label">${escapeHTML(f.label)}</div>
            ${f.items && f.items.length ? `<ul class="productFact__list">${f.items.map(item=>`<li>${escapeHTML(item)}</li>`).join("")}</ul>` : `<div class="productFact__value">${escapeHTML(f.value)}</div>`}
          </div>
        `).join("")}
      </div>
    `;
  }


  const CHART_TEXT = {
    pt:{ title:"Perfil de canabinoides", sub:"Leitura simples com faixa típica e média estimada.", avg:"Média", range:"Faixa típica", max:"Escala até" },
    en:{ title:"Cannabinoid profile", sub:"Simple view with typical range and estimated average.", avg:"Average", range:"Typical range", max:"Scale up to" },
    fr:{ title:"Profil de cannabinoïdes", sub:"Lecture simple avec plage typique et moyenne estimée.", avg:"Moyenne", range:"Plage typique", max:"Échelle jusqu’à" },
    it:{ title:"Profilo dei cannabinoidi", sub:"Lettura semplice con intervallo tipico e media stimata.", avg:"Media", range:"Intervallo tipico", max:"Scala fino a" },
    es:{ title:"Perfil de cannabinoides", sub:"Lectura simple con rango típico y promedio estimado.", avg:"Promedio", range:"Rango típico", max:"Escala hasta" },
    de:{ title:"Cannabinoid-Profil", sub:"Einfache Ansicht mit typischem Bereich und geschätztem Mittelwert.", avg:"Durchschnitt", range:"Typischer Bereich", max:"Skala bis" },
    ja:{ title:"カンナビノイドプロファイル", sub:"一般的な範囲と推定平均を見やすく表示します。", avg:"平均", range:"一般的な範囲", max:"基準上限" },
    zh:{ title:"大麻素概览", sub:"以更直观的方式展示典型区间和估算平均值。", avg:"平均值", range:"典型区间", max:"参考上限" }
  };

  function chartText(key){
    const lang = getLang();
    const dict = CHART_TEXT[lang] || CHART_TEXT.pt;
    return dict[key] || CHART_TEXT.pt[key] || key;
  }

  function formatPct(value){
    const num = Number(value || 0);
    return (Math.round(num * 10) % 10 === 0 ? num.toFixed(0) : num.toFixed(1)) + "%";
  }

  function renderCannabinoidChart(p, selected){
    const variety = getChartVariety(p, selected);
    if(!variety) return "";
    const profile = CANNABINOID_PROFILES[variety];
    if(!profile || !profile.metrics) return "";
    const scale = profile.scale || 30;
    return `
      <div class="cannaProfile">
        <div class="cannaProfile__head">
          <div>
            <h4 class="cannaProfile__title">${chartText("title")}</h4>
            <p class="cannaProfile__sub">${chartText("sub")}</p>
          </div>
          <span class="cannaProfile__tag">${escapeHTML(variety)}</span>
        </div>
        <div class="cannaProfile__grid cannaProfile__grid--simple">
          ${Object.entries(profile.metrics).map(([key, val])=>{
            const min = Number(val.min || 0);
            const max = Number(val.max || 0);
            const avg = (min + max) / 2;
            const left = Math.max(0, (min / scale) * 100);
            const width = Math.max(6, ((max - min) / scale) * 100);
            const avgLeft = Math.max(0, (avg / scale) * 100);
            return `
              <div class="cannaMetric cannaMetric--simple">
                <div class="cannaMetric__top">
                  <strong>${key}</strong>
                  <span class="cannaMetric__pill">${formatPct(min)}–${formatPct(max)}</span>
                </div>
                <div class="cannaMetric__trackWrap">
                  <div class="cannaMetric__track">
                    <span class="cannaMetric__range" style="left:${left}%; width:${width}%"></span>
                    <span class="cannaMetric__avg" style="left:${avgLeft}%"></span>
                  </div>
                </div>
                <div class="cannaMetric__meta">
                  <span>${chartText("avg")}: ${formatPct(avg)}</span>
                  <span>${chartText("max")} ${scale}%</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function productInfoHTML(p, selected){
    const parts = formatProductDesc(getProductDesc(p));
    return `
      <p class="productView__lead">${escapeHTML(getProductShort(p))}</p>
      ${renderProductFacts(parts)}
      ${renderCannabinoidChart(p, selected)}
      ${parts.warnHtml ? `<p class="productView__warn">${parts.warnHtml}</p>` : ""}
      <p class="small muted">${t("product_disclaimer")}</p>
    `;
  }

function renderProductPage(){
    const root = document.getElementById("productPage");
    if(!root) return;
  
    const id = getParam("id") || PRODUCTS[0].id;
    const p = findProduct(id) || PRODUCTS[0];
  
    // default variant = first option in each group
    const selected = defaultSelection(p);
    let qty = 1;
  
    function optionsUI(group){
      const many = (group.options || []).length > 12;
      if(many){
        return `
          <div class="optGroup">
            <div class="optGroup__label">${t(group.labelKey)}</div>
            <select class="select" data-group="${group.key}">
              ${(group.options||[]).map((opt, idx)=>`<option value="${opt}" ${idx===0?"selected":""}>${optionLabel(opt)}</option>`).join("")}
            </select>
          </div>
        `;
      }
      return `
        <div class="optGroup">
          <div class="optGroup__label">${t(group.labelKey)}</div>
          <div class="pillset" data-group="${group.key}">
            ${(group.options||[]).map((opt, idx)=>`
              <button type="button" class="pill ${idx===0 ? "pill--active":""}" data-value="${opt}">${optionLabel(opt)}</button>
            `).join("")}
          </div>
        </div>
      `;
    }

    const gallery = getProductGallery(p, selected);
    let manualGallerySrc = null;
    const currentMainSrc = ()=> (manualGallerySrc && gallery.includes(manualGallerySrc)) ? manualGallerySrc : getProductImage(p, selected);
    const actionHTML = p.comingSoon ? `
      <div class="productView__soonBox">
        <strong>${t("soon_badge")}</strong>
        <span>${t("soon_box_text")}</span>
      </div>
      <a class="btn btn--ghost" href="produtos.html?cat=${encodeURIComponent(p.category)}">${t("continue")}</a>
    ` : `
      <div class="qty" style="margin-right:10px">
        <button type="button" id="qtyMinus" aria-label="-">−</button>
        <strong id="qtyVal">1</strong>
        <button type="button" id="qtyPlus" aria-label="+">+</button>
      </div>
      <button class="btn btn--primary" id="addToCartBtn">${t("add_cart")}</button>
      <a class="btn btn--ghost" href="carrinho.html">${t("view_cart")}</a>
    `;

    root.innerHTML = `
      <div class="productView ${p.comingSoon ? "productView--soon" : ""}">
        <div class="productView__media">
          <div class="productView__mediaInner"><img id="productImg" src="${currentMainSrc()}" alt="${escapeHTML(getProductName(p))}" loading="eager" decoding="async" /></div>
          ${gallery.length > 1 ? `<div class="productGallery">${gallery.map((src, idx)=>`<button type="button" class="productGallery__thumb ${idx===0 ? "is-active" : ""}" data-src="${src}" aria-label="${escapeHTML(t("image_of_product").replace("{n}", String(idx+1)).replace("{name}", getProductName(p)))}"><img src="${src}" alt="" loading="lazy" decoding="async" /></button>`).join("")}</div>` : ""}
          ${p.comingSoon ? `<span class="productView__badge">${t("soon_badge")}</span>` : ""}
        </div>

        <div class="productView__panel">
          <h2 class="productView__name">${getProductName(p)} ${p.age18 ? `<span class="badge badge--age badge--ageInline">${t("age18")}</span>` : ""}</h2>
          <div class="productView__price" id="productPrice">${displayPriceHTML(p, selected)}</div>
          <p class="productView__hint">${t("choose")}</p>

          <div class="productView__opts">
            ${(p.optionGroups||[]).map(optionsUI).join("")}
          </div>

          <div class="productView__actions">
            ${actionHTML}
          </div>

          <div class="productView__desc">
            <h3 class="productView__descTitle">${t("product_about_title")}</h3>
            <div id="productInfoBody">${productInfoHTML(p, selected)}</div>
          </div>
</div>
        </div>
      </div>
    `;
  
    // option handlers
    const productImgEl = root.querySelector("#productImg");
    const productPriceEl = root.querySelector("#productPrice");
    const productInfoBodyEl = root.querySelector("#productInfoBody");
    const syncGalleryThumbs = ()=>{
      root.querySelectorAll(".productGallery__thumb").forEach(btn=>{
        btn.classList.toggle("is-active", btn.dataset.src === (manualGallerySrc || getProductImage(p, selected)));
      });
    };
    const refreshDetails = ()=>{
      const src = manualGallerySrc || getProductImage(p, selected);
      if(productImgEl && src){
        productImgEl.setAttribute("src", src);
      }
      if(productPriceEl){
        productPriceEl.innerHTML = displayPriceHTML(p, selected);
      }
      if(productInfoBodyEl){
        productInfoBodyEl.innerHTML = productInfoHTML(p, selected);
      }
      syncGalleryThumbs();
    };

    root.querySelectorAll(".productGallery__thumb").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        manualGallerySrc = btn.dataset.src || null;
        refreshDetails();
      });
    });

    root.querySelectorAll("select.select").forEach(sel=>{
      const gkey = sel.getAttribute("data-group");
      sel.addEventListener("change", ()=>{
        selected[gkey] = sel.value;
        refreshDetails();
      });
    });

    root.querySelectorAll(".pillset").forEach(set=>{
      const gkey = set.dataset.group;
      const pills = Array.from(set.querySelectorAll(".pill"));
      pills.forEach(btn=>{
        btn.addEventListener("click", ()=>{
          pills.forEach(x=>x.classList.remove("pill--active"));
          btn.classList.add("pill--active");
          selected[gkey] = btn.dataset.value;
          refreshDetails();
        });
      });
    });
  
    const qtyVal = root.querySelector("#qtyVal");
    root.querySelector("#qtyMinus")?.addEventListener("click", ()=>{
      qty = Math.max(1, qty-1);
      if(qtyVal) qtyVal.textContent = String(qty);
    });
    root.querySelector("#qtyPlus")?.addEventListener("click", ()=>{
      qty = Math.min(99, qty+1);
      if(qtyVal) qtyVal.textContent = String(qty);
    });

    root.querySelector("#addToCartBtn")?.addEventListener("click", ()=>{
      const ok = addToCart(p.id, selected, qty);
      if(ok) updateCartBadge();
    });
  }

  /* ---------- LOGIN page ---------- */
  function renderLogin(){
    const root = document.getElementById("loginPage");
    if(!root) return;
  
    const user = getUser();
    if(user){
      root.innerHTML = `
        <div class="cardform">
          <h2 style="margin:0 0 8px">${t("login")}</h2>
          <p class="small">${user.email}</p>
          <div class="hr"></div>
          <button class="btn btn--primary" id="logout2">${t("sign_out")}</button>
        </div>
      `;
      root.querySelector("#logout2").addEventListener("click", logout);
      return;
    }
  
    root.innerHTML = `
      <div class="cardform">
        <h2 style="margin:0 0 8px">${t("login")}</h2>
        <p class="small">${t("create_demo")}</p>
        <div class="hr"></div>
  
        <form id="loginForm" class="formgrid formgrid--1">
          <div class="field">
            <div class="label">${t("email")}</div>
            <input class="input" name="email" required />
          </div>
          <div class="field">
            <div class="label">${t("password")}</div>
            <input class="input" type="password" name="password" required />
          </div>
          <button class="btn btn--primary" type="submit">${t("sign_in")}</button>
        </form>
      </div>
    `;
  
    root.querySelector("#loginForm").addEventListener("submit", async (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email")||"").trim();
      const password = String(fd.get("password")||"").trim();
      if(!email || !password) return;
      if(password.length < 8){
        alert(t("password_min"));
        return;
      }
      try{
        const payload = await apiFetch("/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
        setAuthSession(payload);
        const ret = localStorage.getItem("hemp_return_after_login");
        if(ret){ localStorage.removeItem("hemp_return_after_login"); location.href = ret; }
        else location.href = "index.html";
      }catch(err){
        // If user doesn't exist, auto-register then login
        // @ts-ignore
        if(err && err.status === 401){
          try{
            const payload = await apiFetch("/auth/register", { method:"POST", body: JSON.stringify({ email, password }) });
            setAuthSession(payload);
            const ret = localStorage.getItem("hemp_return_after_login");
            if(ret){ localStorage.removeItem("hemp_return_after_login"); location.href = ret; }
            else location.href = "index.html";
            return;
          }catch(e2){
            // fallthrough
          }
        }
        alert((err && err.message) ? err.message : t("login_fail"));
      }
    });
  }
  
  /* ---------- CART page ---------- */
  function renderCart(){
    const root = document.getElementById("cartPage");
    if(!root) return;

    const cart = getValidCart();
    if(cart.length === 0){
      root.innerHTML = `
        <div class="cardform">
          <h2 style="margin:0 0 8px">${t("cart")}</h2>
          <p class="small">${t("empty_cart")}</p>
          <div class="hr"></div>
          <a class="btn btn--primary" href="produtos.html">${t("products")}</a>
        </div>
      `;
      return;
    }

    const totals = cartTotals(cart);

    root.innerHTML = `
      <div class="cartLayout">
        <section class="cardform cartItemsCard">
          <div class="cartHead">
            <div>
              <h2 class="cartTitle">${t("cart")}</h2>
              <p class="small cartSubtitle">${t("cart_review_subtitle")}</p>
            </div>
            <a class="btn btn--ghost" href="produtos.html">${t("continue")}</a>
          </div>
          <div class="hr"></div>

          <div class="cartrow cartrow--head">
            <div>${t("item")}</div>
            <div>${t("price")}</div>
            <div>${t("qty")}</div>
            <div></div>
          </div>

          <div class="cartItemsList">
            ${cart.map(it=>{
              const p = findProduct(it.productId);
              const name = p ? getProductName(p) : it.productId;
              const v = it.variant || {};
              const price = p ? getVariantPrice(p, v) : 0;
              const variantText = Object.values(v).filter(Boolean).map(x=>optionLabel(x)).join(" • ");
              return `
                <div class="cartrow">
                  <div>
                    <div class="cartrow__title">${name}</div>
                    <div class="small">${variantText}</div>
                  </div>
                  <div>${money(price)}</div>
                  <div class="qty">
                    <button data-dec="${it.key}">-</button>
                    <strong>${it.qty}</strong>
                    <button data-inc="${it.key}">+</button>
                  </div>
                  <div>
                    <button class="btn btn--ghost" data-rem="${it.key}" style="padding:10px 14px">${t("remove")}</button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </section>

        <aside class="cartSummaryWrap">
          <div class="cartSummaryCard">
            <div class="asideTitle">${t("cart_summary_title")}</div>
            <div class="small asideSub">${t("cart_summary_subtitle")}</div>
            <div class="hr"></div>
            <div class="totals">
              <div class="totals__row"><span>${t("subtotal")}</span><strong>${money(totals.subtotal)}</strong></div>
              <div class="totals__row"><span>${t("shipping")}</span><strong>${money(totals.shipping)}</strong></div>
              <div class="totals__row"><span>${t("tax")}</span><strong>${money(totals.tax)}</strong></div>
              <div class="hr"></div>
              <div class="totals__row totals__row--big"><span>${t("total")}</span><strong>${money(totals.total)}</strong></div>
            </div>
            <div class="actions cartSummaryActions">
              <a class="btn btn--primary" href="checkout.html">${t("go_checkout")}</a>
              <a class="btn btn--ghost" href="produtos.html">${t("continue")}</a>
            </div>
          </div>
        </aside>
      </div>
    `;

    root.querySelectorAll("[data-inc]").forEach(b=>{
      b.addEventListener("click", ()=>{ changeQty(b.dataset.inc, +1); renderCart(); });
    });
    root.querySelectorAll("[data-dec]").forEach(b=>{
      b.addEventListener("click", ()=>{ changeQty(b.dataset.dec, -1); renderCart(); });
    });
    root.querySelectorAll("[data-rem]").forEach(b=>{
      b.addEventListener("click", ()=>{ removeFromCart(b.dataset.rem); renderCart(); });
    });
  }

  /* ---------- CHECKOUT page ---------- */
  function renderCheckout(){
    const root = document.getElementById("checkoutPage");
    if(!root) return;

    const cart = getValidCart();
    if(cart.length === 0){
      root.innerHTML = `
        <div class="checkoutEmpty">
          <div class="checkoutEmpty__card">
            <div class="checkoutHeroBadge">${t("checkout_transparent_badge")}</div>
            <h2>${t("checkout")}</h2>
            <p class="small">${t("empty_cart")}</p>
            <a class="btn btn--primary" href="produtos.html">${t("products")}</a>
          </div>
        </div>
      `;
      return;
    }

    const totalsBase = cartTotals(cart);
    const user = getUser();
    const userEmail = escapeHTML(user?.email || "");
    const totalQty = cart.reduce((sum, item)=>sum + (Number(item.qty) || 0), 0);
    const totalQtyLabel = `${totalQty} ${totalQty === 1 ? t("items_singular") : t("items_plural")}`;

    const lineItems = cart.map(it=>{
      const p = findProduct(it.productId);
      const name = p ? getProductName(p) : it.productId;
      const v = it.variant || {};
      const variantText = Object.values(v).filter(Boolean).map(x=>optionLabel(x)).join(" • ");
      const line = (p ? getVariantPrice(p, v) : 0) * it.qty;
      return `
        <div class="checkoutLineItem">
          <div class="checkoutLineItem__info">
            <span class="checkoutLineItem__name">${escapeHTML(name)}</span>
            <span class="checkoutLineItem__variant">${variantText ? escapeHTML(variantText) : t("selected_item")}</span>
          </div>
          <div class="checkoutLineItem__qty">× ${it.qty}</div>
          <strong>${money(line)}</strong>
        </div>
      `;
    }).join("");

    root.innerHTML = `
      <div class="checkoutTransparent" data-checkout-transparent>
        <aside class="checkoutBrandPanel" aria-label="${t("checkout_summary_label")}">
          <div class="checkoutBrandPanel__sticky">
            <div class="checkoutBrandPanel__top">
              <a class="checkoutMiniBrand" href="index.html" aria-label="HEMP Store">
                <span>HEMP</span><span>Store</span>
              </a>
              <span class="checkoutHeroBadge">${t("checkout_transparent_badge")}</span>
            </div>

            <div class="checkoutHeroCopy">
              <p class="checkoutEyebrow">${t("checkout_finalize_eyebrow")}</p>
              <h1>${t("checkout_hero_title")}</h1>
              <p>${t("checkout_hero_sub")}</p>
            </div>

            <button class="checkoutSummaryToggle" type="button" id="checkoutSummaryToggle" aria-expanded="false" aria-controls="checkoutSummaryContent">
              <span>${t("checkout_summary_toggle")}</span>
              <strong id="mobileSummaryTotal">${money(totalsBase.total)}</strong>
            </button>

            <div class="checkoutSummaryContent" id="checkoutSummaryContent">
              <div class="checkoutSummaryCard">
                <div class="checkoutSummaryCard__head">
                  <div>
                    <div class="checkoutSummaryCard__eyebrow">${t("checkout_summary_label")}</div>
                    <div class="checkoutSummaryCard__count">${totalQtyLabel}</div>
                  </div>
                  <span class="checkoutSummaryCard__pill">${t("checkout_updated")}</span>
                </div>

                <div class="checkoutLineItems">
                  ${lineItems}
                </div>

                <div class="checkoutTotalBox">
                  <div class="checkoutTotalRow"><span>${t("subtotal")}</span><strong id="sumSubtotal">${money(totalsBase.subtotal)}</strong></div>
                  <div class="checkoutTotalRow"><span id="sumShipLabel">${t("shipping")} · ${t("shipping_standard_label")}</span><strong id="sumShip">${money(totalsBase.shipping)}</strong></div>
                  <div class="checkoutTotalRow"><span>${t("fees")}</span><strong id="sumTax">${money(totalsBase.tax)}</strong></div>
                  <div class="checkoutTotalDivider"></div>
                  <div class="checkoutTotalRow checkoutTotalRow--big"><span>${t("total")}</span><strong id="sumTotal">${money(totalsBase.total)}</strong></div>
                </div>

                <div class="checkoutTrustRow">
                  <span>🔒 SSL</span>
                  <span>Mercado Pago</span>
                  <span>PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section class="checkoutPaymentPanel" aria-label="${t("payment_details_aria")}">
          <form id="checkoutForm" class="transparentForm" autocomplete="on">
            <div class="walletButtons" role="group" aria-label="${t("payment_providers")}">
              <button class="walletButton walletButton--mp walletButton--active" type="button" data-pay="mp_pix" aria-pressed="true">
                <span class="walletButton__mark">MP</span>
                <span>Mercado Pago</span>
              </button>
              <button class="walletButton walletButton--paypal" type="button" data-pay="paypal" aria-pressed="false">
                <span class="walletButton__mark">P</span>
                <span>PayPal</span>
              </button>
            </div>

            <div class="checkoutOr"><span>${t("or")}</span></div>

            <div class="transparentForm__head">
              <h2>${t("payment_details_title")}</h2>
              <p>${t("payment_details_sub")}</p>
            </div>

            <input type="hidden" name="pay" id="paySelect" value="mp_pix" />

            <div class="transparentSection">
              <div class="transparentSection__title">${t("customer_data")}</div>
              <div class="formgrid formgrid--transparent">
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("email")}</div>
                  <input class="input input--transparent" name="email" type="email" required placeholder="voce@email.com" value="${userEmail}" />
                </div>
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("full_name")}</div>
                  <input class="input input--transparent" name="fullName" required placeholder="${t("full_name_ph")}" />
                </div>
                <div class="field">
                  <div class="label">${t("doc")}</div>
                  <input class="input input--transparent" name="doc" required inputmode="numeric" placeholder="000.000.000-00" />
                </div>
                <div class="field">
                  <div class="label">${t("phone")}</div>
                  <input class="input input--transparent" name="phone" required inputmode="tel" placeholder="(00) 00000-0000" />
                </div>
              </div>
            </div>

            <div class="transparentSection">
              <div class="transparentSection__title">${t("delivery_title")}</div>
              <div class="formgrid formgrid--transparent">
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("address1")}</div>
                  <input class="input input--transparent" name="address1" required placeholder="${t("address1_ph")}" />
                </div>
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("address2")}</div>
                  <input class="input input--transparent" name="address2" placeholder="${t("address2_ph")}" />
                </div>
                <div class="field">
                  <div class="label">${t("city")}</div>
                  <input class="input input--transparent" name="city" required />
                </div>
                <div class="field">
                  <div class="label">${t("state")}</div>
                  <input class="input input--transparent" name="state" required maxlength="2" placeholder="SP" />
                </div>
                <div class="field">
                  <div class="label">${t("zip")}</div>
                  <input class="input input--transparent" name="zip" required inputmode="numeric" placeholder="00000-000" />
                </div>
                <div class="field">
                  <div class="label">${t("country")}</div>
                  <input class="input input--transparent" name="country" required value="${t("country_default")}" />
                </div>
              </div>

              <div class="deliverySwitch" role="group" aria-label="${t("shipping_method")}">
                <label class="deliveryOption">
                  <input type="radio" name="ship" value="std" checked />
                  <span><strong>${t("ship_std")}</strong><small>+${money(7.90)}</small></span>
                </label>
                <label class="deliveryOption">
                  <input type="radio" name="ship" value="exp" />
                  <span><strong>${t("ship_exp")}</strong><small>+${money(14.90)}</small></span>
                </label>
              </div>
            </div>

            <div class="transparentSection transparentSection--payment">
              <div class="transparentSection__title">${t("payment_method_title")}</div>
              <div class="paymentList" role="radiogroup" aria-label="${t("pay_method")}">
                <label class="paymentOption paymentOption--active" data-method="mp_pix">
                  <input type="radio" name="payOption" value="mp_pix" checked />
                  <span class="paymentOption__icon">◆</span>
                  <span class="paymentOption__body">
                    <strong>Pix</strong>
                    <small>${t("pay_pix_desc")}</small>
                  </span>
                  <span class="paymentOption__tag">BRL</span>
                </label>

                <label class="paymentOption" data-method="mp_card">
                  <input type="radio" name="payOption" value="mp_card" />
                  <span class="paymentOption__icon">▰</span>
                  <span class="paymentOption__body">
                    <strong>${t("pay_card_name")}</strong>
                    <small>${t("pay_card_desc")}</small>
                  </span>
                  <span class="paymentOption__cards">VISA MC AMEX</span>
                </label>

                <label class="paymentOption" data-method="mp_boleto">
                  <input type="radio" name="payOption" value="mp_boleto" />
                  <span class="paymentOption__icon">☰</span>
                  <span class="paymentOption__body">
                    <strong>Boleto</strong>
                    <small>${t("pay_boleto_desc")}</small>
                  </span>
                </label>

                <label class="paymentOption" data-method="paypal">
                  <input type="radio" name="payOption" value="paypal" />
                  <span class="paymentOption__icon">P</span>
                  <span class="paymentOption__body">
                    <strong>PayPal</strong>
                    <small>${t("pay_paypal_desc")}</small>
                  </span>
                </label>

                <label class="paymentOption" data-method="btc">
                  <input type="radio" name="payOption" value="btc" />
                  <span class="paymentOption__icon">₿</span>
                  <span class="paymentOption__body">
                    <strong>${t("pay_crypto_name")}</strong>
                    <small>${t("pay_crypto_desc")}</small>
                  </span>
                </label>
              </div>

              <div id="payHint" class="checkoutMethodHint" aria-live="polite"></div>
              <div id="payDetails" class="paybox paybox--transparent" aria-live="polite"></div>
            </div>

            <button class="btn btn--primary btn--wide checkoutPayButton" id="placeOrderBtn" type="submit">${t("reveal_qr")}</button>
            <p class="transparentFinePrint">${t("checkout_fine_print")}</p>
          </form>
        </section>
      </div>
    `;

    const form = root.querySelector("#checkoutForm");
    const paySel = root.querySelector("#paySelect");
    const shipInputs = root.querySelectorAll('input[name="ship"]');
    const payHint = root.querySelector("#payHint");
    const payDetails = root.querySelector("#payDetails");
    const payButton = root.querySelector("#placeOrderBtn");

    const sumShip = root.querySelector("#sumShip");
    const sumTotal = root.querySelector("#sumTotal");
    const sumSubtotal = root.querySelector("#sumSubtotal");
    const sumTax = root.querySelector("#sumTax");
    const sumShipLabel = root.querySelector("#sumShipLabel");
    const mobileSummaryTotal = root.querySelector("#mobileSummaryTotal");
    const summaryToggle = root.querySelector("#checkoutSummaryToggle");
    const summaryContent = root.querySelector("#checkoutSummaryContent");

    const walletButtons = root.querySelectorAll(".walletButton[data-pay]");
    const payOptions = root.querySelectorAll(".paymentOption[data-method]");
    const payRadios = root.querySelectorAll('input[name="payOption"]');

    function getShip(){
      const el = form.querySelector('input[name="ship"]:checked');
      return el ? el.value : "std";
    }

    function getCheckoutTotals(){
      const ship = getShip();
      const subtotal = totalsBase.subtotal;
      const shipping = ship === "exp" ? 14.90 : 7.90;
      const tax = subtotal > 0 ? subtotal * 0.06 : 0;
      const total = subtotal + shipping + tax;
      return { subtotal, shipping, tax, total };
    }

    function recalc(){
      const totals = getCheckoutTotals();
      const ship = getShip();
      const shipLabel = ship === "exp" ? `${t("shipping")} · ${t("shipping_express_label")}` : `${t("shipping")} · ${t("shipping_standard_label")}`;
      sumSubtotal.textContent = money(totals.subtotal);
      sumShip.textContent = money(totals.shipping);
      sumTax.textContent = money(totals.tax);
      sumTotal.textContent = money(totals.total);
      if(sumShipLabel) sumShipLabel.textContent = shipLabel;
      if(mobileSummaryTotal) mobileSummaryTotal.textContent = money(totals.total);
    }

    function setSummaryExpanded(expanded){
      if(!summaryToggle || !summaryContent) return;
      summaryToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      summaryContent.classList.toggle("is-open", expanded);
    }

    function randDigits(n){
      let s="";
      for(let i=0;i<n;i++) s += Math.floor(Math.random()*10);
      return s;
    }

    function makeDemoLightningInvoice(totalUsd){
      const amount = Math.max(1, Math.round(totalUsd*100));
      return `lnbc${amount}n1p${randDigits(12)}${randDigits(12)}${randDigits(12)}`;
    }

    function makeDemoPix(){
      const key = `hempstore+${randDigits(6)}@pix.demo`;
      const payload = `00020126580014BR.GOV.BCB.PIX0136${key}5204000053039865802BR5920HEMP STORE6009SAO PAULO62130509HEMP${randDigits(4)}6304${randDigits(4)}`;
      return { key, payload };
    }

    function makeDemoBoleto(){
      const code = `${randDigits(5)}.${randDigits(5)} ${randDigits(5)}.${randDigits(6)} ${randDigits(5)}.${randDigits(6)} ${randDigits(1)} ${randDigits(14)}`;
      return { code };
    }

    function providerForMethod(method){
      if(method === "paypal") return "paypal";
      if(method === "btc") return "mock";
      return "mercadopago";
    }

    function backendMethodFor(method){
      return ({ mp_pix:"pix", mp_card:"credit", mp_boleto:"boleto", paypal:"paypal", btc:"btc" }[method]) || method;
    }

    function setPaymentMethod(method){
      paySel.value = method;

      payRadios.forEach(r=>{ r.checked = (r.value === method); });
      payOptions.forEach(opt=>{
        opt.classList.toggle("paymentOption--active", opt.dataset.method === method);
      });
      walletButtons.forEach(btn=>{
        const active = (btn.dataset.pay === method) || (method.startsWith("mp_") && btn.dataset.pay === "mp_pix");
        btn.classList.toggle("walletButton--active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });

      renderPaymentDetails();
    }

    walletButtons.forEach(btn=>{
      btn.addEventListener("click", ()=>setPaymentMethod(btn.dataset.pay));
    });
    payRadios.forEach(r=>{
      r.addEventListener("change", ()=>setPaymentMethod(r.value));
    });
    payOptions.forEach(opt=>{
      opt.addEventListener("click", ()=>setPaymentMethod(opt.dataset.method));
    });

    function wireCopyButtons(){
      payDetails.querySelectorAll("[data-copy]").forEach(btn=>{
        btn.addEventListener("click", async ()=>{
          const target = payDetails.querySelector(btn.getAttribute("data-copy"));
          const text = target ? (target.value || target.textContent || "") : "";
          try{ await navigator.clipboard.writeText(text); }
          catch(err){ if(target && target.select){ target.focus(); target.select(); } }
          const old = btn.textContent;
          btn.textContent = t("copied");
          setTimeout(()=>{ btn.textContent = old; }, 1400);
        });
      });
    }

    function renderPaymentDetails(){
      const method = paySel.value;
      const totals = getCheckoutTotals();
      const provider = providerForMethod(method);
      const providerName = provider === "paypal" ? "PayPal" : provider === "mercadopago" ? "Mercado Pago" : "Lightning";

      let html = "";
      if(method === "mp_pix"){
        const pix = makeDemoPix();
        payHint.textContent = t("payhint_pix");
        if(payButton) payButton.textContent = t("reveal_qr");
        html = `
          <div class="transparentPayDetail transparentPayDetail--pix">
            <div class="qrPreview" aria-label="${t("qr_pix_preview")}"></div>
            <div class="transparentPayDetail__content">
              <strong>${t("pix_detail_title")}</strong>
              <p>${t("pix_detail_body")}</p>
              <div class="paymentMiniRows">
                <span>${t("subtotal")}</span><strong>${money(totals.subtotal)}</strong>
                <span>${t("estimated_fees")}</span><strong>${money(totals.tax)}</strong>
                <span>${t("amount_due")}</span><strong>${money(totals.total)}</strong>
              </div>
              <textarea class="input input--transparent paybox__invoice" id="pixPayload" readonly>${pix.payload}</textarea>
              <button class="btn btn--ghost" type="button" data-copy="#pixPayload">${t("copy_pix")}</button>
            </div>
          </div>
        `;
      } else if(method === "mp_card"){
        payHint.textContent = t("payhint_card");
        if(payButton) payButton.textContent = t("pay_button_card");
        html = `
          <div class="transparentCardFields">
            <div class="field" style="grid-column:1/-1">
              <div class="label">${t("card_name")}</div>
              <input class="input input--transparent" name="cardName" placeholder="${t("card_name_ph")}" />
            </div>
            <div class="field" style="grid-column:1/-1">
              <div class="label">${t("card_number")}</div>
              <input class="input input--transparent" name="cardNumber" inputmode="numeric" placeholder="0000 0000 0000 0000" />
            </div>
            <div class="field">
              <div class="label">${t("card_exp")}</div>
              <input class="input input--transparent" name="cardExp" inputmode="numeric" placeholder="MM/AA" />
            </div>
            <div class="field">
              <div class="label">${t("card_cvv")}</div>
              <input class="input input--transparent" name="cardCvv" inputmode="numeric" placeholder="CVV" />
            </div>
            <div class="field" style="grid-column:1/-1">
              <div class="label">${t("card_installments")}</div>
              <select class="select select--transparent" name="installments">
                <option>1x ${t("installment_of")} ${money(totals.total)}</option>
                <option>2x</option><option>3x</option><option>6x</option><option>12x</option>
              </select>
            </div>
          </div>
        `;
      } else if(method === "mp_boleto"){
        const boleto = makeDemoBoleto();
        payHint.textContent = t("payhint_boleto");
        if(payButton) payButton.textContent = t("pay_button_boleto");
        html = `
          <div class="transparentPayDetail">
            <div class="transparentPayDetail__content transparentPayDetail__content--full">
              <strong>${t("boleto_detail_title")}</strong>
              <p>${t("boleto_detail_body")}</p>
              <textarea class="input input--transparent paybox__invoice" id="boletoCode" readonly>${boleto.code}</textarea>
              <button class="btn btn--ghost" type="button" data-copy="#boletoCode">${t("copy_code")}</button>
            </div>
          </div>
        `;
      } else if(method === "paypal"){
        payHint.textContent = t("payhint_paypal");
        if(payButton) payButton.textContent = t("pay_button_paypal");
        html = `
          <div class="transparentPayDetail transparentPayDetail--paypal">
            <div class="paypalMark">PayPal</div>
            <div class="transparentPayDetail__content">
              <strong>${t("paypal_detail_title")}</strong>
              <p>${t("paypal_detail_body")}</p>
              <div class="paymentMiniRows">
                <span>${t("authorized_total")}</span><strong>${money(totals.total)}</strong>
                <span>${t("initial_status")}</span><strong>${t("pending")}</strong>
              </div>
            </div>
          </div>
        `;
      } else {
        const invoice = makeDemoLightningInvoice(totals.total);
        payHint.textContent = t("payhint_btc");
        if(payButton) payButton.textContent = t("pay_button_btc");
        html = `
          <div class="transparentPayDetail">
            <div class="transparentPayDetail__content transparentPayDetail__content--full">
              <strong>${t("btc_detail_title")}</strong>
              <p>${t("btc_detail_body")}</p>
              <textarea class="input input--transparent paybox__invoice" id="lnInvoice" readonly>${invoice}</textarea>
              <div class="paybox__actions">
                <button class="btn btn--ghost" type="button" data-copy="#lnInvoice">${t("invoice_copy")}</button>
                <a class="btn btn--primary" href="lightning:${invoice}">${t("open_wallet")}</a>
              </div>
            </div>
          </div>
        `;
      }

      payDetails.innerHTML = html;
      payDetails.setAttribute("data-provider", providerName);
      wireCopyButtons();
    }

    shipInputs.forEach(r=>r.addEventListener("change", ()=>{ recalc(); renderPaymentDetails(); }));
    recalc();
    renderPaymentDetails();
    setPaymentMethod("mp_pix");

    if(summaryToggle && summaryContent){
      let mobileWasCollapsed = false;
      const syncSummaryLayout = ()=>{
        if(window.innerWidth <= 700){
          if(!mobileWasCollapsed){
            setSummaryExpanded(false);
            mobileWasCollapsed = true;
          }
        } else {
          setSummaryExpanded(true);
          mobileWasCollapsed = false;
        }
      };
      syncSummaryLayout();
      summaryToggle.addEventListener("click", ()=>{
        if(window.innerWidth > 700) return;
        const expanded = summaryToggle.getAttribute("aria-expanded") === "true";
        setSummaryExpanded(!expanded);
      });
      window.addEventListener("resize", syncSummaryLayout);
    }

    form.addEventListener("submit", async (e)=>{
      e.preventDefault();

      const user = getUser();
      const tok = getToken();
      if(!user || !tok){
        try{ localStorage.setItem("hemp_return_after_login", location.href); }catch{}
        location.href = "login.html";
        return;
      }

      const cartNow = getCart();
      if(!cartNow.length){
        alert(t("empty_cart"));
        location.href = "produtos.html";
        return;
      }

      const fd = new FormData(form);
      const fullName = String(fd.get("fullName")||"").trim();
      const nameParts = fullName.split(/\s+/).filter(Boolean);
      const first = nameParts.shift() || "Cliente";
      const last  = nameParts.join(" ") || "HEMP Store";
      const phone = String(fd.get("phone")||"").trim();
      const email = String(fd.get("email")||user.email||"").trim();
      const doc = String(fd.get("doc")||"").trim();
      const address1 = String(fd.get("address1")||"").trim();
      const address2 = String(fd.get("address2")||"").trim();
      const city = String(fd.get("city")||"").trim();
      const state = String(fd.get("state")||"").trim().toUpperCase();
      const zipRaw = String(fd.get("zip")||"").trim();
      const method = String(fd.get("pay")||paySel.value||"mp_pix");

      let street = address1, number = "s/n";
      const m = address1.match(/^(.*?)[,\s]+(\d+[\w\-\/]*)\s*$/);
      if(m){ street = m[1].trim() || street; number = m[2].trim() || number; }

      const zip = zipRaw.replace(/\D/g,"").slice(0,8);

      const addressPayload = {
        label: "Entrega",
        recipient: `${first} ${last}`.trim() || (email || user.email || "Cliente"),
        phone: phone || undefined,
        street: street || "Rua",
        number,
        complement: address2 || undefined,
        district: "Centro",
        city: city || "Cidade",
        state: (state && state.length===2) ? state : "SP",
        zip: zip || "00000000",
        document: doc || undefined,
        email: email || undefined
      };

      const provider = providerForMethod(method);
      const clientPaymentMethod = backendMethodFor(method);

      try{
        const addr = await apiFetch("/addresses", { method:"POST", body: JSON.stringify(addressPayload) });

        const items = cartNow.map(i=>({ sku: i.productId, quantity: i.qty }));
        const chk = await apiFetch("/checkout", {
          method:"POST",
          body: JSON.stringify({
            addressId: addr.id,
            items,
            paymentProvider: provider,
            clientPaymentMethod,
            gatewayMode: "transparent"
          })
        });

        const checkoutUrl = chk.checkoutUrl || chk.approvalUrl || chk.redirectUrl || chk.initPoint;
        if((provider === "mercadopago" || provider === "paypal") && checkoutUrl){
          location.href = checkoutUrl;
          return;
        }

        if(provider !== "mock" && chk.orderId){
          setCart([]);
          location.href = `checkout-pending.html?orderId=${encodeURIComponent(chk.orderId)}`;
          return;
        }

        await apiFetch(`/webhooks/mock/approve?orderId=${encodeURIComponent(chk.orderId)}`, { method:"POST" });
        setCart([]);
        location.href = `checkout-success.html?orderId=${encodeURIComponent(chk.orderId)}`;
      }catch(err){
        alert((err && err.message) ? err.message : t("checkout_fail"));
      }
    });
  }

  /* ---------- Render all pages ---------- */
  
  /* ---------- Orders (My purchases) page ---------- */
  function renderOrdersPage(){
    const root = document.getElementById("ordersPage");
    if(!root) return;

    const user = getUser();
    const tok = getToken();
    if(!user || !tok){
      root.innerHTML = `
        <div class="cardform">
          <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
          <p class="small">Você precisa entrar para ver seu histórico.</p>
          <div class="hr"></div>
          <a class="btn btn--primary" href="login.html">${t("login")}</a>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="cardform">
        <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
        <p class="small">Carregando…</p>
      </div>
    `;

    apiFetch("/orders")
      .then((orders)=>{
        if(!Array.isArray(orders) || orders.length===0){
          root.innerHTML = `
            <div class="cardform">
              <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
              <p class="small">${t("no_orders")}</p>
              <div class="hr"></div>
              <a class="btn btn--primary" href="produtos.html">${t("products")}</a>
            </div>
          `;
          return;
        }

        const rows = orders.map(o=>{
          const when = o.createdAt ? new Date(o.createdAt).toLocaleString() : "";
          const total = (o.totalCents||0)/100;
          const items = Array.isArray(o.items) ? o.items.map(i=>`<div class="small" style="opacity:.9">• ${escapeHTML(i.name||i.sku)} × ${i.quantity}</div>`).join("") : "";
          const pay = o.paymentStatus ? `<span class="badge">${escapeHTML(o.paymentStatus)}</span>` : "";
          const ln = o.lightningStatus ? `<span class="badge">${escapeHTML(o.lightningStatus)}</span>` : "";
          return `
            <div class="orderCard">
              <div class="orderCard__top">
                <div>
                  <div class="orderCard__id">#${escapeHTML(o.id)}</div>
                  <div class="small">${when}</div>
                </div>
                <div style="text-align:right">
                  <div class="orderCard__total">${money(total)}</div>
                  <div class="small">${escapeHTML(o.status||"")}</div>
                </div>
              </div>
              <div class="orderCard__meta">${pay} ${ln}</div>
              <div class="hr"></div>
              <div>${items}</div>
            </div>
          `;
        }).join("");

        root.innerHTML = `
          <div class="cardform">
            <h2 style="margin:0 0 12px">${t("my_orders")}</h2>
            ${rows}
          </div>
        `;
      })
      .catch((err)=>{
        root.innerHTML = `
          <div class="cardform">
            <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
            <p class="small">${t("orders_load_fail")} ${escapeHTML(err?.message||"")}</p>
          </div>
        `;
      });
  }

  function escapeHTML(s){
    return String(s||"").replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
  }

function pageRenderAll(){
    renderHome();
    renderProductsList();
    renderProductPage();
    renderLogin();
    renderCart();
    renderCheckout();
    renderOrdersPage();
    mountAuthUI();
    updateCartBadge();
  }
  

  /* ---------- Smart Footer + Newsletter ---------- */
  function mountSmartFooter(){
    const footer = document.getElementById("siteFooter");
    if(!footer) return;

    const yearEl = document.getElementById("footerYear");
    if(yearEl) yearEl.textContent = String(new Date().getFullYear());

    const site = (document.body && document.body.dataset && document.body.dataset.site) || "";
    const path = (location.pathname || "").toLowerCase();
    const isHoc = site === "hoc" || path.includes("hemp-oil-company") || path.includes("hoc-");

    const brandEl = document.getElementById("footerBrand");
    const descEl = document.getElementById("footerDesc");
    const copyEl = document.getElementById("footerCopy");
    const nav = document.getElementById("footerNav");

    if(isHoc){
      if(brandEl) brandEl.textContent = "Hemp Oil Company S.A.";
      if(descEl) descEl.textContent = t("footer_desc_hoc");
      if(copyEl) copyEl.innerHTML = "";
      if(nav){
        nav.innerHTML = `
          <a href="hemp-oil-company.html">${t("home")}</a>
          <a href="hoc-solucoes.html">Soluções</a>
          <a href="hoc-compliance.html">Compliance</a>
          <a href="hemp-oil-company.html#contato">${t("contact")}</a>
        `;
      }
    }else{
      if(brandEl) brandEl.textContent = "HEMP Store";
      if(descEl) descEl.textContent = t("footer_desc_store");
      if(copyEl) copyEl.innerHTML = "";
      if(nav){
        nav.innerHTML = `
          <a href="index.html">${t("home")}</a>
          <a href="produtos.html">${t("products")}</a>
          <a href="carrinho.html">${t("cart")}</a>
          <a href="login.html">${t("login")}</a>
        `;
      }
    }
  }

  function mountNewsletter(){
    const email = document.getElementById("newsletterEmail");
    const btn = document.getElementById("newsletterBtn");
    const status = document.getElementById("newsletterStatus");
    if(!email || !btn || !status) return;

    const key = "hemp_newsletter_emails";
    const valid = (v)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||"").trim());

    btn.addEventListener("click", ()=>{
      const v = String(email.value||"").trim();
      status.textContent = "";
      status.classList.remove("ok","bad");
      if(!valid(v)){
        status.textContent = t("newsletter_invalid");
        status.classList.add("bad");
        return;
      }
      try{
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        if(!list.includes(v)) list.push(v);
        localStorage.setItem(key, JSON.stringify(list));
      }catch{}
      status.textContent = t("newsletter_success");
      status.classList.add("ok");
      email.value = "";
    });
  }




/* ---------- Product back navigation ---------- */
function mountProductBackNav(){
  // Store the current page as the "back" target whenever the user opens a product page
  document.addEventListener("click", (e)=>{
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if(!a) return;
    const href = a.getAttribute("href") || "";
    if(/(^|\/)(produto\.html)(\?|#|$)/i.test(href)){
      try{ sessionStorage.setItem("productBackUrl", location.href); }catch{}
    }
  }, true);

  const backLink = document.getElementById("backLink");
  if(!backLink) return;

  backLink.addEventListener("click", (e)=>{
    e.preventDefault();

    const here = location.href;

    let stored = null;
    try{
      stored = sessionStorage.getItem("productBackUrl") || sessionStorage.getItem("lastProductsUrl");
    }catch{}

    if(stored && stored !== here){
      location.href = stored;
      return;
    }

    if(document.referrer){
      try{
        const r = new URL(document.referrer, location.href);
        const c = new URL(location.href);
        if(r.origin === c.origin && r.href !== here){
          location.href = r.href;
          return;
        }
      }catch{}
    }

    if(history.length > 1){
      history.back();
      return;
    }

    location.href = "produtos.html";
  });
}

  /* ---------- INIT ---------- */
  (function init(){
    syncCurrencyWithLanguage();
    applyI18nStatic();
    syncLangButton();
    mountLangModal();
    mountCurrencyModal();
    mountAuthUI();
    updateCartBadge();
    pageRenderAll();
    initHeroCarousel();
    mountSmartFooter();
    initFooterSearch();
    mountNewsletter();
    refreshDailyRates({ force:false });
  })();
  
