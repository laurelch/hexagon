# Hexagon
- [Hexagon](#hexagon)
  - [Goal](#goal)
  - [Implementation](#implementation)
  - [Gameplay](#gameplay)
  - [References](#references)
    - [Theories](#theories)
    - [Implementations](#implementations)
  - [Timeline & To-do List](#timeline--to-do-list)
    - [Versions](#versions)
    - [Elements](#elements)
    - [Gameplay](#gameplay-1)
    - [UI](#ui)
    - [Bugs](#bugs)

## Goal
Implement a game involving one or more players, where they move, collaborate, and fight enemies in a hexagonal grid. 

Players have a variety of possible moves and attack ranges based on their skills.

## Implementation
The prototype is implemented in HTML5 and JavaScript.

## Gameplay
The player controls the character (represented as circle) that is always in the left-center of the view.

Our player will encounter pre-defined or random enemies exist to the right of the player. While the player attack the enemies, the player is moving towards right of the world.

A few kinds of attack is available for player to choose. Different attack may have different range, distance, and damage.

## References
### Theories
* [Hexagonal Grids from Red Blob Games](https://www.redblobgames.com/grids/hexagons/)
* [石鸦的博客：战术级战棋设计思考随笔1-战棋分类](https://zafara-zd.github.io/blog/%E6%88%98%E6%9C%AF%E7%BA%A7%E6%88%98%E6%A3%8B%E8%AE%BE%E8%AE%A1%E6%80%9D%E8%80%83%E9%9A%8F%E7%AC%941-%E6%88%98%E6%A3%8B%E5%88%86%E7%B1%BB/)

### Implementations
* [Stage.js | 2D HTML5 rendering and layout engine](https://github.com/shakiba/stage.js)
* [GitHub | eperezcosano/hexagonal-grid: How to draw a hexagonal grid on HTML Canvas](https://github.com/eperezcosano/hexagonal-grid)

--- 

## Timeline & To-do List
### Versions
* Lv. 1 - A player can move from one hexagon cell to another within a defined range
  * start: 5/9/22
* Lv. 2 - A player can move and attack enemies while moving in the hexagon grid
### Elements
Lv. 1
- [x] create hexagon grid
- [x] create basic shape for players and enemies -> round shape
- [ ] create basic shape for environment and obstacles

Lv. 2
- [ ] create character for players and enemies

### Gameplay
Lv. 1
- [x] move player from one hexagon cell to another with mouse click
- [x] move player with animation
- [ ] show range of possible moves with color
- [ ] show different types of moves
- [ ] constrain player move within the range

Lv. 2
- [ ] add enemies that appear randomly in the view
- [ ] let player attack the enemies and let them disappear if they die

### UI
Lv. 1
- [ ] add styled intructions

Lv. 2
- [ ] add progress bar to attack

### Bugs
Lv. 1
- [ ] manhattan distance does not reflect third coordinate