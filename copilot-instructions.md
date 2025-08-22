<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Catification Game Instructions

Este é um projeto de jogo de construção "Catification" desenvolvido em JavaScript com HTML5 Canvas.

## Conceito do Jogo
- Jogo de building/decoração focado em atrair gatinhos
- Quanto mais "gatificada" a casa, mais gatinhos diferentes visitam
- Sistema de moedas para comprar novos itens de decoração
- Diferentes tipos de gatinhos com comportamentos únicos

## Estrutura do Projeto
- `index.html` - Interface principal do jogo
- `style.css` - Estilos e layout
- `game.js` - Lógica principal do jogo
- `items.js` - Definição dos itens de decoração
- `cats.js` - Tipos de gatinhos e comportamentos
- `README.md` - Documentação

## Características do Jogo
- Sistema de grid para posicionamento de itens
- Loja de itens com diferentes categorias (comida, brinquedos, móveis)
- Gatinhos visitantes com animações
- Sistema de pontuação de "gatificação"
- Economia baseada em moedas ganhas por visitações
- Interface drag-and-drop para decoração

## Padrões de Código
- Use classes ES6 para organizar entidades (Item, Cat, Shop)
- Mantenha separação clara entre lógica de jogo e renderização
- Use sprites ou formas geométricas coloridas para representar elementos
- Implemente sistema de eventos para interações
