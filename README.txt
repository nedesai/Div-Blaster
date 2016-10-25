DIV BLASTER v1.0
----------------
Basic Functionalities:
1. Implemented an Accuracy display
2. Implemented a settings panel with various parameters
3. Created a lives system where ship can have 0-10 lives
4. Made the spawning of asteriods automatic as specified in spec
5. Created a splash screen at the start of the game
6. Created a game over screen when all lives are lost
7. Created audio sounds as specified in the spec
8. Created visual effects as specified in the spec
9. Created a shield system where shields spawn every M asteroids
10. Made the layout of the game better with a better settings panel layout, better color choice, and recentering ship after
	splash screen and asteroid collision

Bonus Functionalities:
1. Implemented the pausing feature of the game when the browser tab is not active using both the .focus() and
	.blur() methods of the window. Thus at any point during gameplay, if user were to click out of the browser tab
	or minimize the browser tab, the game will pause and only resume once the browser tab is back in focus.

All pictures and sounds were used from the given start code.

---------------------------------------------------------------------------------------------------------------------------------

This code is the basis for a simple 'asteroid blaster' game. It has the
following functionality:
- 2D ship movement
- "Fire-able rockets" that can destroy asteroids they collide with
- Asteroids that can be "spawned" based on user input, and fall vertically
- Score tracking
 -- Single-session scoring (clears on refresh)
 -- Score per asteroid is inversely proportional to size (smaller==harder==more points)


========  CONTROLS  ========

Arrow-Keys: move ship
Spacebar: fire rocket
