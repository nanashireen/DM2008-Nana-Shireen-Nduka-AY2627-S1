A) Concept & Intent
We created a virtual garden where users plant flowers by pressing a physical sensor. We wanted each touch to leave a visible trace. As the garden fills up, older plants wilt to make space, reflecting how plants compete for limited resources.

B) Interaction Logic
The main input is a pressure sensor connected to an Arduino. Holding the sensor grows a flower, and a harder press makes it grow faster. It keeps growing until it reaches full size or the reading drops to 0. Letting go completely leaves the flower at the size it reached, and the next press plants a new one. The species is chosen at random, not by how hard you press. A short sound plays when a flower starts to grow. We also included a mouse-operated test button with three pressure settings (light, medium and firm), which change how fast the flower grows.

C) Technical Structure
The Arduino sends sensor readings over serial to a p5.js sketch. We used an array of plant objects to store each plant’s branching pattern, position, size, growth and release time. An L-system generates the branching stems. Each blossom is a 3D mesh built from polar coordinates, following Kazuki Umeda’s p5.js flower tutorial. Every plant gets its own mesh, with the petal count, size, ripple and colour varied at random.

D) Behavior Over Time
Each press adds a plant at a random spot along the bottom of the screen, placed away from the plants already there. Earlier plants stay rooted where they were planted. About nine seconds after release, a plant begins to droop, shrink and fade, and it is removed once it has faded completely. If twelve plants are already on screen, adding another makes the oldest one start fading early.

E) Aesthetic Decisions
We used pink, gold and purple blossoms made of glowing dots against a black background, with green stems, a faint glow along the bottom and drifting dust. The three colour families and petal shapes keep the flowers varied but recognisable. Opening blossoms, swaying stems and slowly turning petals make the garden feel alive, and drooping, shrinking and fading make wilting visible.

F) Iteration & Challenges
An earlier version used a fixed 3 × 3 grid of planting spots and chose the species by pressure. We changed it so plants grow from the bottom of the screen at random positions and the species is random. A flower originally stopped growing as soon as the reading dipped, even with a finger still on the sensor, and it needed too much pressure to appear. We lowered the thresholds, made a flower end only when the reading reaches 0, and made new plants start larger and grow faster so even a short press leaves a visible result. We also tried a particle-based look from our moodboard but went back to the 3D flowers. A function name clash with a newer p5.js version once left the screen blank until we renamed it.