/**
 * Hexagon map prototype level 2:
 * 1. In a hexagon map, a player controls a main shape starting from the center.
 * 2. The player can move the shape with keys (WSAD) or pressing down mouse button (left click).
 *    - Each character has a limited range of movement.
 * 3. After move, the player can select from a few skills to attack enemies within the attack range.
 *    - Selection of skills.
 *      -> UI for selection.
 *    - Attack range: single, line, circle. 
 *      -> How to describe attack range with respect to a character (position, direction).
 *    - Attack availability: always available, available every x rounds, available after defeat an enemy, etc.
 *      -> Keep track of the availability, attack count, etc.
 *    - Attack damage: low, medium, high, etc.
 *      -> How to describe attack damage (0-100).
 *      -> How to calculate damage based on skill, character who attacks, and character being attacked.
 *         - base damage of skills
 *         - positions and directions of characters
 *    - HP bar: 0-100.
 *      -> Keep track of hp of each character.
 *      -> UI for HP bar.
 * 4. The enemies will spawn randomly in the map.
 *    - The enemies will spawn except where the player resides.
 *    - How to control the frequency and number of spawns.
 *    - The enemis know how they can attack, and they move with the closest path with maximum move.
 * 5. End policy
 *    - The game will end after player defeat a certain amount of enemies.
 */