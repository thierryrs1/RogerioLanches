# 🍔 Rogério Lanches & Porções — Landing Page & Kit de Marketing

Landing Page de alta conversão, responsiva para **Android, iOS e Desktop**, desenvolvida sob medida para a lanchonete **Rogério Lanches & Porções** (localizada na **Av. Tiradentes, 11 - Praça Matriz, Cambuí - MG**).

---

## ✨ Arquitetura 100% Separada (HTML, CSS e JS Isolados)

- **[`index.html`](index.html):** Estrutura semântica pura em HTML5 contendo todos os **72 itens oficiais do cardápio UaiRango**, galeria e `<template>` do carrinho diretamente no HTML (zero CSS inline e zero scripts embutidos).
- **[`style.css`](style.css):** Folha de estilos isolada na raiz, responsiva (*Mobile-First* para Android e iOS, com suporte a `env(safe-area-inset-bottom)`, `100dvh` e inputs em `16px` para evitar zoom automático no iPhone).
- **[`app.js`](app.js):** Lógica JavaScript pura na raiz com **sincronização automática em tempo real via GET na API do UaiRango** (`https://www.uairango.com/api-v2/oauth/cardapio/41441` e `/estabelecimento/slug/rogerio-lanches-porcoes`), busca em tempo real, suporte a tamanhos (*Mini/Lanche*, *Meia/Inteira* e *Lata/600ml/2L*), sacola via `<template>` nativo e checkout no WhatsApp.
- **[`logo.svg`](logo.svg) & [`favicon.svg`](favicon.svg):** Identidade visual e ícone de favoritos vetoriais em SVG na raiz do projeto.

---

## 📋 Cardápio Oficial Integrado (UaiRango)

- **🍔 Lanches Especiais (15 opções):** *Coalho Burguer* (R$ 44), *Big Australiano c/ Fritas* (R$ 55), *CroqBurguer* (R$ 48), *Picanha Duplo Cheddar* (R$ 49), *Costela Burguer* (R$ 42), *Carne Seca Burguer* (R$ 45), *X-Burguer Especial* (R$ 30), *Bacon Especial* (R$ 38), *Salada Especial* (R$ 35), *Frango Especial* (R$ 34), *Tropical Chicken* (R$ 38), *Burguer Linguiça* (R$ 36), *Cheddar Melt* (R$ 40), *Australiano Duplo* (R$ 47) e *Duplo Bacon* (R$ 48).
- **🥪 Lanches Tradicionais (22 opções c/ Mini ou Lanche):** Linha de Hambúrguer, Pernil, Lombo, Filé de Frango, Contra-Filé (*Americano, X-Filé, Filé c/ Vinagrete*), Calabresa, *X-Fritas*, *Hot Dog*, *Misto Quente*, *Queijo Quente* e *Vegetariano*.
- **🥩 Porções (13 opções c/ Meia ou Inteira):** *Contra-Filé c/ Pão de Alho* (R$ 85 / R$ 120), *Contra-Filé c/ Fritas* (R$ 85 / R$ 110), *Filé de Tilápia* (R$ 60 / R$ 70), *Bolinho de Tilápia* (R$ 55 / R$ 65), *Batata Especial da Casa* (R$ 55), *Fritas c/ Cheddar e Bacon* (R$ 40 / R$ 50), *Fritas Queijo e Bacon* (R$ 37 / R$ 48), *Fritas Tradicional* (R$ 30 / R$ 40), *Anéis de Cebola* (R$ 38), *Bolinho de Costela 500g* (R$ 37), *Dadinho de Tapioca 500g* (R$ 37), *Calabresa Acebolada* (R$ 45) e *Polenta c/ Queijo* (R$ 35).
- **🥣 Maionese D'Casa:** *Tradicional* (R$ 4) e *Salsa & Cebolinha* (R$ 4).
- **🥤 Bebidas & Chocolates:** Refrigerantes (Lata, 600ml e 2L), Sucos Naturais e Lata, Cervejas (Heineken, Original, Brahma, Amstel, Skol, Corona) e Chocolates.

---

## 📁 Estrutura do Projeto

```text
RogerioLanches/
├── index.html                  # HTML5 estruturado puro com cardápio completo
├── style.css                   # CSS3 responsivo isolado na raiz
├── app.js                      # JavaScript puro isolado na raiz
├── logo.svg                    # Logo oficial vetorial em SVG
├── favicon.svg                 # Favicon oficial vetorial em SVG
├── README.md                   # Documentação do projeto
├── .gitignore                  # Arquivos ignorados pelo Git
├── Instagram.pdf               # Referência original do Instagram do cliente
└── assets/
    └── img/
        ├── cardapio/           # Fotos oficiais de alta resolução dos produtos
        ├── marketing/          # Fotos comerciais geradas/tratadas e posts 4:5 p/ Instagram
        └── ...                 # Fotos reais do estabelecimento e prêmio UaiRango
```

---

## 🚀 Como Executar

Abra o arquivo [`index.html`](index.html) em qualquer navegador moderno (Chrome, Safari, Edge, Firefox) ou utilize a extensão *Live Server* no VS Code.
