# My Project

By Sahara Ahmed, Jocelyn Eddy and Nana-Shireen Nduka

### What we made:
A system where the user interacts with a pressure sensor to control plants in a virtual garden. As the user exerts different level of pressure on the sensor, different species of flowers grow. As the space becomes more crowded, the older flowers die. Mimicking the fight for resources in the natural world.

System:
Pressure Sensor
Arduino
P5.js

### What Evolved:
Our first version was the original sketch. The garden was a fixed 3 × 3 grid; each flower had its own square, and the species depended on how hard you pressed (light = pink, medium = gold, firm = purple). It worked, but it felt too fixed, and it took too much pressure for a flower to appear. Over the project, we changed a lot:

* We made it so the flowers grow from the bottom of the screen. Each press plants a new flower at a random spot along the bottom, and it keeps growing for as long as the sensor is held. Pressure now changes how fast the flower grows.
* Additionally we made the species random. Every flower is generated randomly from the three flower recipes, with the petal count, size, ripple and colour changed slightly, so no two flowers are the same.
* When the sneor is release at 0. After testing with the live sensor readings, we lowered the thresholds. A flower starts at any reading above 0 and only stops when the reading drops to 0, so pressing lightly no longer ends the growth early.
* We added crowding and death. When the sensor is let go, the flower stays on screen, then slowly fades, droops and dies. Only 12 flowers can be on screen at once, so when it gets crowded, the oldest ones fade early.
* Ont top fot hat we added movement to the flowers. The stems sway. A sound effect plays when a flower starts to grow.
* We also added an interface. The page is now a full black screen with a small control panel: a connect button, a live pressure meter, etc.

### Learning Outcomes: 

From this project, we learnt many things. We used L-system rules with chances to grow different branching plants, and polar coordinates to build 3D flowers, then added random variation so every flower is different.
Managing a life cycle in code. Each flower goes through growing, being held, being released, fading and being removed, with a limit on how many exist at once. We also learn how to use feedback like the pressure meter, status text, movement and sound makes it clear to the user that the sensor is working, and a test button lets us keep working without the hardware.

