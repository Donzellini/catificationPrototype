// Definições dos diferentes tipos de gatinhos
const CAT_TYPES = {
    common: {
        orange: {
            name: 'Gato Laranja',
            icon: '🧡',
            rarity: 'comum',
            minCatification: 0,
            coinsReward: 2,
            visitDuration: 5000, // 5 segundos
            description: 'Um gatinho laranja muito amigável'
        },
        gray: {
            name: 'Gato Cinza',
            icon: '🩶',
            rarity: 'comum',
            minCatification: 0,
            coinsReward: 2,
            visitDuration: 5000,
            description: 'Elegante gato cinza'
        },
        black: {
            name: 'Gato Preto',
            icon: '🖤',
            rarity: 'comum',
            minCatification: 5,
            coinsReward: 3,
            visitDuration: 6000,
            description: 'Misterioso e carinhoso'
        }
    },
    uncommon: {
        white: {
            name: 'Gato Branco',
            icon: '🤍',
            rarity: 'incomum',
            minCatification: 10,
            coinsReward: 4,
            visitDuration: 7000,
            description: 'Puro como a neve'
        },
        tabby: {
            name: 'Gato Rajado',
            icon: '🐅',
            rarity: 'incomum',
            minCatification: 15,
            coinsReward: 5,
            visitDuration: 8000,
            description: 'Com lindas listras naturais'
        },
        calico: {
            name: 'Gato Tricolor',
            icon: '🎨',
            rarity: 'incomum',
            minCatification: 20,
            coinsReward: 6,
            visitDuration: 8000,
            description: 'Três cores em perfeita harmonia'
        }
    },
    rare: {
        siamese: {
            name: 'Gato Siamês',
            icon: '💎',
            rarity: 'raro',
            minCatification: 30,
            coinsReward: 8,
            visitDuration: 10000,
            description: 'Elegante e conversador'
        },
        persian: {
            name: 'Gato Persa',
            icon: '👑',
            rarity: 'raro',
            minCatification: 40,
            coinsReward: 10,
            visitDuration: 12000,
            description: 'Majestoso de pelos longos'
        },
        maine_coon: {
            name: 'Maine Coon',
            icon: '🦁',
            rarity: 'raro',
            minCatification: 50,
            coinsReward: 12,
            visitDuration: 12000,
            description: 'O gigante gentil dos felinos'
        }
    },
    legendary: {
        rainbow: {
            name: 'Gato Arco-íris',
            icon: '🌈',
            rarity: 'lendário',
            minCatification: 70,
            coinsReward: 20,
            visitDuration: 15000,
            description: 'Mágico e colorido!'
        },
        space: {
            name: 'Gato Espacial',
            icon: '🚀',
            rarity: 'lendário',
            minCatification: 90,
            coinsReward: 25,
            visitDuration: 15000,
            description: 'Veio das estrelas para te visitar'
        },
        golden: {
            name: 'Gato Dourado',
            icon: '✨',
            rarity: 'lendário',
            minCatification: 100,
            coinsReward: 30,
            visitDuration: 20000,
            description: 'O gato mais raro de todos!'
        }
    }
};

// Classe para representar um gato visitante
class VisitingCat {
    constructor(catKey, categoryKey) {
        this.catKey = catKey;
        this.categoryKey = categoryKey;
        this.catData = CAT_TYPES[categoryKey][catKey];
        this.visitStartTime = Date.now();
        this.x = Math.random() * 500 + 50; // Posição aleatória no canvas
        this.y = Math.random() * 300 + 50;
        this.vx = (Math.random() - 0.5) * 2; // Velocidade horizontal
        this.vy = (Math.random() - 0.5) * 2; // Velocidade vertical
        this.size = 30;
        this.animationFrame = 0;
    }
    
    update(deltaTime) {
        // Movimento suave do gatinho
        this.x += this.vx;
        this.y += this.vy;
        
        // Manter dentro dos limites do canvas
        if (this.x < this.size || this.x > 600 - this.size) {
            this.vx *= -1;
        }
        if (this.y < this.size || this.y > 400 - this.size) {
            this.vy *= -1;
        }
        
        // Limitar posição
        this.x = Math.max(this.size, Math.min(600 - this.size, this.x));
        this.y = Math.max(this.size, Math.min(400 - this.size, this.y));
        
        this.animationFrame += deltaTime;
    }
    
    draw(ctx) {
        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size/2, this.size/2, this.size/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Corpo do gato (círculo)
        ctx.fillStyle = this.getRarityColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Borda
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Ícone do gato
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#2d3436';
        ctx.fillText(this.catData.icon, this.x, this.y - 2);
        
        // Animação de "felicidade" (pequenos corações flutuando)
        if (Math.sin(this.animationFrame * 0.01) > 0.7) {
            ctx.font = '12px Arial';
            ctx.fillStyle = '#fd79a8';
            ctx.fillText('💕', this.x + 15, this.y - 20);
        }
    }
    
    getRarityColor() {
        const rarityColors = {
            'comum': '#74b9ff',
            'incomum': '#a8e6cf',
            'raro': '#ffeaa7',
            'lendário': '#fd79a8'
        };
        return rarityColors[this.catData.rarity] || '#ddd';
    }
    
    // Verificar se o tempo de visita acabou
    isVisitComplete() {
        return Date.now() - this.visitStartTime >= this.catData.visitDuration;
    }
    
    // Obter informações para exibir na lista
    getDisplayInfo() {
        const timeLeft = Math.max(0, this.catData.visitDuration - (Date.now() - this.visitStartTime));
        return {
            name: this.catData.name,
            icon: this.catData.icon,
            reward: this.catData.coinsReward,
            timeLeft: Math.ceil(timeLeft / 1000),
            rarity: this.catData.rarity
        };
    }
}

// Função para obter um gato aleatório baseado no nível de gatificação
function getRandomCat(catificationLevel) {
    const availableCats = [];
    
    // Coletar todos os gatos disponíveis para o nível atual
    Object.keys(CAT_TYPES).forEach(categoryKey => {
        Object.keys(CAT_TYPES[categoryKey]).forEach(catKey => {
            const cat = CAT_TYPES[categoryKey][catKey];
            if (cat.minCatification <= catificationLevel) {
                // Quanto mais raro, menor a chance
                const weight = cat.rarity === 'comum' ? 10 : 
                              cat.rarity === 'incomum' ? 5 : 
                              cat.rarity === 'raro' ? 2 : 1;
                
                for (let i = 0; i < weight; i++) {
                    availableCats.push({ catKey, categoryKey });
                }
            }
        });
    });
    
    if (availableCats.length === 0) {
        return null; // Nenhum gato disponível
    }
    
    const randomIndex = Math.floor(Math.random() * availableCats.length);
    const selected = availableCats[randomIndex];
    
    return new VisitingCat(selected.catKey, selected.categoryKey);
}
