// Elementos do DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const coinsElement = document.getElementById('coins');
const catificationElement = document.getElementById('catification');
const visitorsElement = document.getElementById('visitors');
const shopItemsElement = document.getElementById('shopItems');
const selectedItemElement = document.getElementById('selectedItem');
const selectedItemIcon = document.getElementById('selectedItemIcon');
const selectedItemName = document.getElementById('selectedItemName');
const visitingCatsListElement = document.getElementById('visitingCatsList');
const messageModal = document.getElementById('messageModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Estado do jogo
let gameState = {
    coins: 50,
    catification: 0,
    totalVisitors: 0,
    placedItems: [],
    visitingCats: [],
    selectedItem: null,
    selectedCategory: 'food'
};

let lastTime = 0;
let catSpawnTimer = 0;
const CAT_SPAWN_INTERVAL = 10000; // 10 segundos

// Inicialização
function initGame() {
    loadGameState();
    updateUI();
    setupEventListeners();
    generateShopItems();
    gameLoop(0);
    
    // Mostrar mensagem de boas-vindas
    showMessage('Bem-vindo ao Catification! 🐱', 'Decore sua casa para atrair gatinhos adoráveis e ganhar moedas!');
}

// Carregar estado do jogo do localStorage
function loadGameState() {
    const saved = localStorage.getItem('catificationSave');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.coins = data.coins || 50;
        gameState.catification = data.catification || 0;
        gameState.totalVisitors = data.totalVisitors || 0;
        
        // Recriar itens colocados
        if (data.placedItems) {
            gameState.placedItems = data.placedItems.map(item => 
                new PlacedItem(item.itemKey, item.categoryKey, item.x, item.y)
            );
        }
    }
}

// Salvar estado do jogo
function saveGameState() {
    const saveData = {
        coins: gameState.coins,
        catification: gameState.catification,
        totalVisitors: gameState.totalVisitors,
        placedItems: gameState.placedItems.map(item => ({
            itemKey: item.itemKey,
            categoryKey: item.categoryKey,
            x: item.x,
            y: item.y
        }))
    };
    localStorage.setItem('catificationSave', JSON.stringify(saveData));
}

// Configurar event listeners
function setupEventListeners() {
    // Categorias da loja
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            gameState.selectedCategory = e.target.dataset.category;
            updateCategoryButtons();
            generateShopItems();
        });
    });
    
    // Canvas para posicionar itens
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (gameState.selectedItem) {
            placeItem(x, y);
        } else {
            // Verificar se clicou em algum item para removê-lo
            removeItemAt(x, y);
        }
    });
    
    // Botões de controle
    document.getElementById('clearBtn').addEventListener('click', clearAllItems);
    document.getElementById('saveBtn').addEventListener('click', () => {
        saveGameState();
        showMessage('Jogo Salvo! 💾', 'Seu progresso foi salvo com sucesso.');
    });
    document.getElementById('loadBtn').addEventListener('click', () => {
        loadGameState();
        updateUI();
        showMessage('Jogo Carregado! 📂', 'Seu progresso foi carregado.');
    });
    
    // Modal
    modalCloseBtn.addEventListener('click', () => {
        messageModal.style.display = 'none';
    });
}

// Atualizar botões de categoria
function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === gameState.selectedCategory) {
            btn.classList.add('active');
        }
    });
}

// Gerar itens da loja
function generateShopItems() {
    shopItemsElement.innerHTML = '';
    const category = ITEM_CATEGORIES[gameState.selectedCategory];
    
    Object.keys(category.items).forEach(itemKey => {
        const item = category.items[itemKey];
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        
        if (gameState.coins < item.price) {
            itemElement.classList.add('disabled');
        }
        
        itemElement.innerHTML = `
            <span class="shop-item-icon">${item.icon}</span>
            <span class="shop-item-name">${item.name}</span>
            <span class="shop-item-price">💰 ${item.price}</span>
        `;
        
        itemElement.addEventListener('click', () => {
            if (gameState.coins >= item.price) {
                selectItem(itemKey, gameState.selectedCategory);
            }
        });
        
        shopItemsElement.appendChild(itemElement);
    });
}

// Selecionar item para posicionar
function selectItem(itemKey, categoryKey) {
    const item = ITEM_CATEGORIES[categoryKey].items[itemKey];
    gameState.selectedItem = { itemKey, categoryKey };
    
    selectedItemIcon.textContent = item.icon;
    selectedItemName.textContent = item.name;
    selectedItemElement.style.display = 'block';
    
    // Destacar item selecionado na loja
    document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
    event.target.closest('.shop-item').classList.add('selected');
}

// Posicionar item no canvas
function placeItem(x, y) {
    if (!gameState.selectedItem) return;
    
    const { itemKey, categoryKey } = gameState.selectedItem;
    const item = ITEM_CATEGORIES[categoryKey].items[itemKey];
    
    // Verificar se tem dinheiro
    if (gameState.coins < item.price) {
        showMessage('Dinheiro Insuficiente! 💰', `Você precisa de ${item.price} moedas para comprar este item.`);
        return;
    }
    
    // Verificar se não está muito próximo de outro item
    const tooClose = gameState.placedItems.some(placedItem => {
        const distance = Math.sqrt((placedItem.x - x) ** 2 + (placedItem.y - y) ** 2);
        return distance < 50; // Distância mínima entre itens
    });
    
    if (tooClose) {
        showMessage('Muito Próximo! 📏', 'Deixe mais espaço entre os itens.');
        return;
    }
    
    // Colocar o item
    const placedItem = new PlacedItem(itemKey, categoryKey, x, y);
    gameState.placedItems.push(placedItem);
    
    // Deduzir moedas e aumentar gatificação
    gameState.coins -= item.price;
    gameState.catification += item.catification;
    
    // Limpar seleção
    gameState.selectedItem = null;
    selectedItemElement.style.display = 'none';
    document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
    
    updateUI();
    generateShopItems(); // Atualizar disponibilidade dos itens
    saveGameState();
    
    showMessage('Item Colocado! ✨', `${item.name} foi adicionado à sua casa!`);
}

// Remover item clicado
function removeItemAt(x, y) {
    const itemIndex = gameState.placedItems.findIndex(item => item.contains(x, y));
    
    if (itemIndex !== -1) {
        const removedItem = gameState.placedItems[itemIndex];
        
        // Confirmar remoção
        if (confirm(`Remover ${removedItem.itemData.name}? Você receberá ${Math.floor(removedItem.itemData.price / 2)} moedas de volta.`)) {
            gameState.placedItems.splice(itemIndex, 1);
            gameState.coins += Math.floor(removedItem.itemData.price / 2);
            gameState.catification -= removedItem.itemData.catification;
            
            updateUI();
            generateShopItems();
            saveGameState();
            
            showMessage('Item Removido! 🗑️', `${removedItem.itemData.name} foi removido e você recebeu algumas moedas de volta.`);
        }
    }
}

// Limpar todos os itens
function clearAllItems() {
    if (confirm('Remover todos os itens? Você receberá metade do valor de volta.')) {
        let refund = 0;
        gameState.placedItems.forEach(item => {
            refund += Math.floor(item.itemData.price / 2);
        });
        
        gameState.placedItems = [];
        gameState.catification = 0;
        gameState.coins += refund;
        
        updateUI();
        generateShopItems();
        saveGameState();
        
        showMessage('Tudo Limpo! 🧹', `Todos os itens foram removidos. Você recebeu ${refund} moedas de volta.`);
    }
}

// Atualizar interface
function updateUI() {
    coinsElement.textContent = gameState.coins;
    catificationElement.textContent = gameState.catification;
    visitorsElement.textContent = gameState.totalVisitors;
}

// Sistema de spawn de gatos
function updateCatSystem(deltaTime) {
    catSpawnTimer += deltaTime;
    
    // Tentar spawnar novo gato
    if (catSpawnTimer >= CAT_SPAWN_INTERVAL && gameState.catification > 0) {
        const shouldSpawn = Math.random() < (gameState.catification / 100); // Chance baseada na gatificação
        
        if (shouldSpawn) {
            const newCat = getRandomCat(gameState.catification);
            if (newCat && gameState.visitingCats.length < 5) { // Máximo 5 gatos por vez
                gameState.visitingCats.push(newCat);
                gameState.totalVisitors++;
                updateVisitingCatsList();
                catSpawnTimer = 0;
            }
        } else {
            catSpawnTimer = CAT_SPAWN_INTERVAL * 0.8; // Reset parcial se não spawnou
        }
    }
    
    // Atualizar gatos visitantes
    for (let i = gameState.visitingCats.length - 1; i >= 0; i--) {
        const cat = gameState.visitingCats[i];
        cat.update(deltaTime);
        
        if (cat.isVisitComplete()) {
            // Gato saindo, dar recompensa
            gameState.coins += cat.catData.coinsReward;
            gameState.visitingCats.splice(i, 1);
            updateVisitingCatsList();
            updateUI();
            saveGameState();
            
            showMessage(`${cat.catData.name} foi embora! 👋`, `Você ganhou ${cat.catData.coinsReward} moedas pela visita!`);
        }
    }
}

// Atualizar lista de gatos visitantes
function updateVisitingCatsList() {
    if (gameState.visitingCats.length === 0) {
        visitingCatsListElement.innerHTML = '<p class="no-cats">Nenhum gatinho ainda... Decore mais sua casa! 🏠</p>';
        return;
    }
    
    visitingCatsListElement.innerHTML = '';
    gameState.visitingCats.forEach(cat => {
        const info = cat.getDisplayInfo();
        const catElement = document.createElement('div');
        catElement.className = 'cat-visitor';
        catElement.innerHTML = `
            <span>${info.icon} ${info.name}</span>
            <span>💰${info.reward} (${info.timeLeft}s)</span>
        `;
        visitingCatsListElement.appendChild(catElement);
    });
}

// Mostrar mensagem modal
function showMessage(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    messageModal.style.display = 'block';
}

// Desenhar tudo no canvas
function draw() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar fundo
    drawBackground();
    
    // Desenhar itens colocados
    gameState.placedItems.forEach(item => {
        item.draw(ctx);
    });
    
    // Desenhar gatos visitantes
    gameState.visitingCats.forEach(cat => {
        cat.draw(ctx);
    });
    
    // Desenhar preview do item selecionado (seguindo o mouse seria melhor, mas vamos manter simples)
    if (gameState.selectedItem) {
        ctx.fillStyle = 'rgba(253, 121, 168, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2d3436';
        ctx.fillText('Clique para posicionar o item!', canvas.width / 2, 30);
    }
}

// Desenhar fundo
function drawBackground() {
    // Fundo principal
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#a8e6cf');
    gradient.addColorStop(1, '#7fcdcd');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grade sutil para ajudar no posicionamento
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Título do ambiente se não tiver nenhum item
    if (gameState.placedItems.length === 0) {
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(45, 52, 54, 0.5)';
        ctx.fillText('🏠 Sua Casa para Gatinhos 🏠', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '16px Arial';
        ctx.fillText('Compre itens na loja e clique aqui para decorar!', canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Loop principal do jogo
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    updateCatSystem(deltaTime);
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initGame);
