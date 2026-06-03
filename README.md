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
