// Definições dos itens disponíveis na loja
const ITEM_CATEGORIES = {
    food: {
        name: 'Comida',
        icon: '🍽️',
        items: {
            fishBowl: {
                name: 'Tigela de Peixe',
                icon: '🐟',
                price: 10,
                catification: 3,
                description: 'Atrai gatinhos famintos'
            },
            milkBowl: {
                name: 'Tigela de Leite',
                icon: '🥛',
                price: 8,
                catification: 2,
                description: 'Gatinhos adoram leite fresco'
            },
            tuna: {
                name: 'Lata de Atum',
                icon: '🥫',
                price: 15,
                catification: 4,
                description: 'Irresistível para qualquer gato'
            },
            treats: {
                name: 'Petiscos',
                icon: '🍪',
                price: 12,
                catification: 3,
                description: 'Saborosos petiscos caseiros'
            }
        }
    },
    toys: {
        name: 'Brinquedos',
        icon: '🧸',
        items: {
            ball: {
                name: 'Bolinha',
                icon: '⚽',
                price: 5,
                catification: 2,
                description: 'Diversão garantida para gatinhos ativos'
            },
            mouse: {
                name: 'Ratinho de Brinquedo',
                icon: '🐭',
                price: 8,
                catification: 3,
                description: 'Instinto de caça ativado!'
            },
            feather: {
                name: 'Varinha com Pena',
                icon: '🪶',
                price: 12,
                catification: 4,
                description: 'O brinquedo favorito dos felinos'
            },
            laser: {
                name: 'Ponteiro Laser',
                icon: '🔴',
                price: 18,
                catification: 5,
                description: 'Diversão infinita com ponto vermelho'
            },
            scratcher: {
                name: 'Arranhador',
                icon: '🪵',
                price: 25,
                catification: 6,
                description: 'Essencial para manter as unhas saudáveis'
            }
        }
    },
    furniture: {
        name: 'Móveis',
        icon: '🪑',
        items: {
            catBed: {
                name: 'Caminha de Gato',
                icon: '🛏️',
                price: 20,
                catification: 5,
                description: 'Conforto máximo para sonecas'
            },
            catTree: {
                name: 'Árvore para Gatos',
                icon: '🌳',
                price: 50,
                catification: 10,
                description: 'Paraíso vertical para escalar'
            },
            litterBox: {
                name: 'Caixa de Areia',
                icon: '📦',
                price: 15,
                catification: 3,
                description: 'Necessidade básica felina'
            },
            cushion: {
                name: 'Almofada',
                icon: '💺',
                price: 12,
                catification: 3,
                description: 'Local perfeito para relaxar'
            },
            catHouse: {
                name: 'Casinha de Gato',
                icon: '🏠',
                price: 35,
                catification: 8,
                description: 'Refúgio seguro e aconchegante'
            }
        }
    },
    decoration: {
        name: 'Decoração',
        icon: '🎨',
        items: {
            plant: {
                name: 'Plantinha',
                icon: '🌱',
                price: 8,
                catification: 2,
                description: 'Adiciona vida ao ambiente'
            },
            carpet: {
                name: 'Tapetinho',
                icon: '🟫',
                price: 15,
                catification: 4,
                description: 'Conforto para as patinhas'
            },
            window: {
                name: 'Janela com Vista',
                icon: '🪟',
                price: 30,
                catification: 7,
                description: 'Gatos adoram observar pela janela'
            },
            picture: {
                name: 'Quadrinho de Gato',
                icon: '🖼️',
                price: 10,
                catification: 2,
                description: 'Arte felina para decorar'
            },
            flowers: {
                name: 'Vaso de Flores',
                icon: '🌺',
                price: 12,
                catification: 3,
                description: 'Beleza natural (cuidado com curiosos!)'
            }
        }
    }
};

// Classe para representar um item colocado no jogo
class PlacedItem {
    constructor(itemKey, categoryKey, x, y) {
        this.itemKey = itemKey;
        this.categoryKey = categoryKey;
        this.x = x;
        this.y = y;
        this.itemData = ITEM_CATEGORIES[categoryKey].items[itemKey];
        this.size = 40; // Tamanho padrão dos itens no canvas
    }
    
    draw(ctx) {
        // Desenhar fundo do item
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        
        // Borda
        ctx.strokeStyle = '#74b9ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        
        // Ícone do item
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#2d3436';
        ctx.fillText(this.itemData.icon, this.x, this.y);
    }
    
    // Verificar se um ponto está dentro do item
    contains(x, y) {
        return x >= this.x - this.size/2 && 
               x <= this.x + this.size/2 && 
               y >= this.y - this.size/2 && 
               y <= this.y + this.size/2;
    }
}
