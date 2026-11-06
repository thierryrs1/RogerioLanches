/**
 * Rogério Lanches & Porções — app.js
 * Centraliza toda a lógica interativa da Landing Page (100% separada do HTML e CSS):
 * - Busca em tempo real e filtro de categorias do cardápio oficial (UaiRango)
 * - Suporte a variações de tamanho (Mini / Lanche, Meia / Inteira, Lata / 600ml / 2L)
 * - Sacola de pedidos com persistência em localStorage usando <template> nativo
 * - Envio de pedido formatado direto para o WhatsApp (5535999096662)
 * - Filtro da Galeria & Kit de Marketing
 * - Menu Mobile responsivo (Android & iOS)
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5535999096662';
  const STORAGE_KEY = 'rogerio_lanches_cart_v2';
  const MIN_DELIVERY_ORDER = 15.0;

  // Estado do carrinho e filtros
  let cart = [];
  let activeCategory = 'todos';
  let searchQuery = '';

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cart = parsed;
      }
    }
  } catch (err) {
    cart = [];
  }

  // Elementos do DOM
  const menuCards = document.querySelectorAll('#menuGrid .menu-item');
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuSearchInput = document.getElementById('menuSearchInput');
  const headerCartCount = document.getElementById('headerCartCount');
  const mobileCartBar = document.getElementById('mobileCartBar');
  const mobileCartCount = document.getElementById('mobileCartCount');
  const mobileCartTotal = document.getElementById('mobileCartTotal');
  const cartModal = document.getElementById('cartModal');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartRowTemplate = document.getElementById('cartRowTemplate');
  const cartTotalValue = document.getElementById('cartTotalValue');
  const openCartBtn = document.getElementById('openCartBtn');
  const mobileOpenCartBtn = document.getElementById('mobileOpenCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const closeCartBackdrop = document.getElementById('closeCartBackdrop');
  const sendWhatsAppOrderBtn = document.getElementById('sendWhatsAppOrderBtn');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const toastEl = document.getElementById('toastNotification');
  const addressGroup = document.getElementById('addressGroup');
  const currentYearEl = document.getElementById('currentYear');

  if (currentYearEl) {
    currentYearEl.textContent = String(new Date().getFullYear());
  }

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function normalizeText(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function buildItemId(name) {
    return normalizeText(name).replace(/[^a-z0-9]+/g, '-');
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      // Ignora erro em navegação privada
    }
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-shown');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toastEl.classList.remove('is-shown');
    }, 2600);
  }

  /**
   * Filtra os cards do cardápio combinando aba de categoria + busca por texto
   */
  function applyMenuFilters() {
    const normalizedQuery = normalizeText(searchQuery.trim());

    menuCards.forEach(function (card) {
      const itemCategory = card.getAttribute('data-item-category') || '';
      const matchesCategory = activeCategory === 'todos' || itemCategory === activeCategory;

      let matchesSearch = true;
      if (normalizedQuery.length > 0) {
        const cardText = normalizeText(card.textContent);
        matchesSearch = cardText.indexOf(normalizedQuery) !== -1;
      }

      if (matchesCategory && matchesSearch) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });
  }

  /**
   * Adiciona um item ou variação (Mini/Lanche, Meia/Inteira, Lata/600ml/2L) à sacola
   */
  function addItemToCart(name, price) {
    if (!name || isNaN(price) || price <= 0) return;

    const itemId = buildItemId(name);
    const existing = cart.find(function (entry) {
      return entry.id === itemId;
    });

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: itemId,
        name: name,
        price: price,
        qty: 1
      });
    }

    saveCart();
    updateCartUI();
    showToast('✅ "' + name + '" adicionado ao pedido!');
  }

  /**
   * Altera quantidade de um item na sacola
   */
  function changeCartQty(itemId, delta) {
    const idx = cart.findIndex(function (entry) {
      return entry.id === itemId;
    });
    if (idx === -1) return;

    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) {
      cart.splice(idx, 1);
    }

    saveCart();
    updateCartUI();
  }

  /**
   * Atualiza os contadores e renderiza as linhas do carrinho clonando o <template> do HTML
   */
  function updateCartUI() {
    const totalCount = cart.reduce(function (acc, item) {
      return acc + item.qty;
    }, 0);

    const totalPrice = cart.reduce(function (acc, item) {
      return acc + item.price * item.qty;
    }, 0);

    if (headerCartCount) headerCartCount.textContent = String(totalCount);
    if (mobileCartCount) mobileCartCount.textContent = String(totalCount);
    if (mobileCartTotal) mobileCartTotal.textContent = formatBRL(totalPrice);
    if (cartTotalValue) cartTotalValue.textContent = formatBRL(totalPrice);

    if (mobileCartBar) {
      mobileCartBar.classList.toggle('is-visible', totalCount > 0);
    }

    if (!cartItemsContainer || !cartRowTemplate) return;

    // Limpa os itens atuais
    while (cartItemsContainer.firstChild) {
      cartItemsContainer.removeChild(cartItemsContainer.firstChild);
    }

    if (cartEmptyState) {
      cartEmptyState.classList.toggle('is-hidden', cart.length > 0);
    }

    cart.forEach(function (entry) {
      const clone = cartRowTemplate.content.cloneNode(true);
      const titleEl = clone.querySelector('.cart-row__title');
      const subtotalEl = clone.querySelector('.cart-row__subtotal');
      const qtyEl = clone.querySelector('.cart-row__qty');
      const qtyButtons = clone.querySelectorAll('.qty-btn');

      if (titleEl) titleEl.textContent = entry.qty + 'x ' + entry.name;
      if (subtotalEl) subtotalEl.textContent = formatBRL(entry.price * entry.qty);
      if (qtyEl) qtyEl.textContent = String(entry.qty);

      qtyButtons.forEach(function (btn) {
        btn.setAttribute('data-qty-id', entry.id);
      });

      cartItemsContainer.appendChild(clone);
    });
  }

  function openCartModal() {
    if (!cartModal) return;
    cartModal.classList.add('is-open');
    cartModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeCartModal() {
    if (!cartModal) return;
    cartModal.classList.remove('is-open');
    cartModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  // Delegação de eventos de clique
  document.addEventListener('click', function (e) {
    // Botões de opções do cardápio (Lanche/Mini, Inteira/Meia, Lata/600ml/2L, Único)
    const optBtn = e.target.closest('[data-opt-name]');
    if (optBtn) {
      const optName = optBtn.getAttribute('data-opt-name');
      const optPrice = parseFloat(optBtn.getAttribute('data-opt-price') || '0');
      addItemToCart(optName, optPrice);
      return;
    }

    // Botões de pedido rápido nos Destaques (Spotlight)
    const quickBtn = e.target.closest('[data-quick-name]');
    if (quickBtn) {
      const quickName = quickBtn.getAttribute('data-quick-name');
      const quickPrice = parseFloat(quickBtn.getAttribute('data-quick-price') || '0');
      addItemToCart(quickName, quickPrice);
      return;
    }

    // Botões +/- dentro do modal da sacola
    const qtyBtn = e.target.closest('[data-qty-id]');
    if (qtyBtn) {
      const id = qtyBtn.getAttribute('data-qty-id');
      const delta = parseInt(qtyBtn.getAttribute('data-qty-delta') || '0', 10);
      changeCartQty(id, delta);
      return;
    }

    // Links do rodapé que filtram diretamente uma categoria do cardápio
    const filterLink = e.target.closest('[data-filter-link]');
    if (filterLink) {
      const cat = filterLink.getAttribute('data-filter-link');
      const targetTab = document.querySelector('.menu-tab[data-category="' + cat + '"]');
      if (targetTab) {
        targetTab.click();
      }
    }
  });

  // Abas de filtro do Cardápio
  menuTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      menuTabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (typeof tab.scrollIntoView === 'function' && window.innerWidth <= 768) {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }

      activeCategory = tab.getAttribute('data-category') || 'todos';
      applyMenuFilters();
    });
  });

  // Busca em tempo real no Cardápio
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', function () {
      searchQuery = menuSearchInput.value || '';
      applyMenuFilters();
    });
  }

  // Filtro da Galeria de Marketing
  const galleryBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryCards = document.querySelectorAll('#marketingGallery .m-card');

  galleryBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      galleryBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      const filterType = btn.getAttribute('data-gallery-filter');

      galleryCards.forEach(function (card) {
        const matches = filterType === 'all' || card.getAttribute('data-type') === filterType;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  // Abrir e fechar sacola
  if (openCartBtn) openCartBtn.addEventListener('click', openCartModal);
  if (mobileOpenCartBtn) mobileOpenCartBtn.addEventListener('click', openCartModal);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartModal);
  if (closeCartBackdrop) closeCartBackdrop.addEventListener('click', closeCartModal);

  // Alternar exibição do campo de endereço conforme modalidade de entrega
  const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');
  orderTypeRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!addressGroup || !radio.checked) return;
      const isDelivery = radio.value.indexOf('Delivery') !== -1;
      addressGroup.classList.toggle('is-hidden', !isDelivery);
    });
  });

  // Envio do pedido para o WhatsApp
  if (sendWhatsAppOrderBtn) {
    sendWhatsAppOrderBtn.addEventListener('click', function () {
      if (cart.length === 0) {
        showToast('⚠️ Adicione pelo menos 1 item ao pedido primeiro!');
        return;
      }

      const nameInput = document.getElementById('customerName');
      const addressInput = document.getElementById('customerAddress');
      const paymentSelect = document.getElementById('paymentMethod');
      const notesInput = document.getElementById('orderNotes');
      const selectedOrderType = document.querySelector('input[name="orderType"]:checked');

      const customerName = nameInput ? nameInput.value.trim() : '';
      const orderType = selectedOrderType ? selectedOrderType.value : 'Delivery (20 a 40 min)';
      const customerAddress = addressInput ? addressInput.value.trim() : '';
      const paymentMethod = paymentSelect ? paymentSelect.value : 'PIX';
      const orderNotes = notesInput ? notesInput.value.trim() : '';

      const totalPrice = cart.reduce(function (acc, item) {
        return acc + item.price * item.qty;
      }, 0);

      if (orderType.indexOf('Delivery') !== -1 && totalPrice < MIN_DELIVERY_ORDER) {
        showToast('⚠️ O pedido mínimo para Delivery é de R$ 15,00.');
        return;
      }

      if (!customerName) {
        showToast('⚠️ Por favor, informe seu nome para o pedido.');
        if (nameInput) nameInput.focus();
        return;
      }

      if (orderType.indexOf('Delivery') !== -1 && !customerAddress) {
        showToast('⚠️ Informe o endereço de entrega em Cambuí.');
        if (addressInput) addressInput.focus();
        return;
      }

      const lines = [
        '🍔 *NOVO PEDIDO PELO SITE - ROGÉRIO LANCHES & PORÇÕES*',
        '----------------------------------------',
        '👤 *Cliente:* ' + customerName,
        '📍 *Modalidade:* ' + orderType
      ];

      if (orderType.indexOf('Delivery') !== -1) {
        lines.push('🏠 *Endereço:* ' + customerAddress);
      }

      lines.push('----------------------------------------');
      lines.push('*ITENS DO PEDIDO:*');

      cart.forEach(function (item) {
        lines.push('▪️ ' + item.qty + 'x ' + item.name + ' (' + formatBRL(item.price * item.qty) + ')');
      });

      lines.push('----------------------------------------');
      lines.push('💰 *Total dos Itens:* ' + formatBRL(totalPrice));
      lines.push('💳 *Pagamento:* ' + paymentMethod);

      if (orderNotes) {
        lines.push('📝 *Observações:* ' + orderNotes);
      }

      const message = encodeURIComponent(lines.join('\n'));
      const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Menu Mobile (Android & iOS)
  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Inicializa UI do carrinho
  updateCartUI();
})();
