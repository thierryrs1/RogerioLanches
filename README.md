# 🍔 Rogério Lanches & Porções — Landing Page & Kit de Marketing

Landing Page de alta conversão, responsiva para **Android, iOS e Desktop**, desenvolvida sob medida para a lanchonete **Rogério Lanches & Porções** (localizada na **Av. Tiradentes, 11 - Praça Matriz, Cambuí - MG**).

---

## ✨ Arquitetura 100% Separada

- **[`index.html`](index.html):** Estrutura semântica pura em HTML5 (todos os cards do cardápio, galeria e `<template>` do carrinho estão diretamente no HTML, sem nenhum CSS inline ou script embutido).
- **[`style.css`](style.css):** Folha de estilos isolada na raiz, responsiva (*Mobile-First* para Android e iOS, com suporte a `env(safe-area-inset-bottom)` e `100dvh`).
- **[`app.js`](app.js):** Lógica JavaScript pura na raiz (manipulação de estados via classes CSS e clonagem de `<template>` nativo, sem strings de HTML misturadas no JS e sem manipulação inline de estilos).
- **[`logo.svg`](logo.svg) & [`favicon.svg`](favicon.svg):** Identidade visual e ícone de favoritos vetoriais em SVG na raiz do projeto.

---

## 📁 Estrutura do Projeto

```text
RogerioLanches/
├── index.html                  # HTML5 estruturado puro
├── style.css                   # CSS3 responsivo isolado na raiz
├── app.js                      # JavaScript puro isolado na raiz
├── logo.svg                    # Logo oficial vetorial em SVG
├── favicon.svg                 # Favicon oficial vetorial em SVG
├── README.md                   # Documentação do projeto
├── .gitignore                  # Arquivos ignorados pelo Git
├── Instagram.pdf               # Referência original do Instagram do cliente
└── assets/
    └── img/
        ├── marketing/          # Fotos comerciais geradas/tratadas e posts prontos p/ Instagram
        │   ├── burger-coalho-brioche.jpg
        │   ├── chapa-contrafile-pao-alho.jpg
        │   ├── batata-frita-bacon-queijo.jpg
        │   ├── petiscos-cumbuca-studio.jpg
        │   ├── burger-duplo-studio.jpg
        │   ├── lanche-tradicional-studio.jpg
        │   ├── post-instagram-burger.jpg
        │   ├── post-instagram-chapa.jpg
        │   └── post-instagram-fritas.jpg
        └── ...                 # Fotos reais organizadas do estabelecimento e prêmio UaiRango
```

---

## 🚀 Como Executar

Abra o arquivo [`index.html`](index.html) em qualquer navegador moderno (Chrome, Safari, Edge, Firefox) ou utilize a extensão *Live Server* no VS Code.
