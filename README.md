# 3D Meditation and Relaxation Tool

This project is a forward‑thinking prototype for a 3D interactive meditation and sleep‑assistance tool.  It uses **Next.js** and **React Three Fiber** to render immersive environments directly in the browser.  The goal is to provide a peaceful, sensory experience that responds to the player’s actions and can continue to evolve on its own via an *idle* mode.

## Why these technologies?

Building a complex 3D world in the browser is much more manageable when you can lean on an established library rather than writing WebGL by hand.  Three.js abstracts the complexities of WebGL and offers a robust rendering engine with built‑in support for lights, materials, shadow mapping and model loaders【48456416660804†L213-L319】.  On top of that, it includes utilities for interactivity—such as ray casting—to detect mouse or touch events in 3D space【48456416660804†L271-L291】.

Performance is important in large scenes.  The *Rain* component in this project uses **instanced meshes**, an optimisation recommended in advanced Three.js guides.  Instanced meshes allow the GPU to draw many identical objects (like raindrops) with different transforms in a single draw call, which significantly reduces overhead【987843542628762†L67-L76】.

To manage the scene declaratively and integrate it with React state, this project uses **React Three Fiber**—a React renderer for Three.js.  It allows you to build scenes using reusable components that react to state changes and still participate in the wider React ecosystem【936177319559148†screenshot】.  According to the official documentation, everything that works in Three.js works here without exception and there is no extra overhead over vanilla Three.js【936177319559148†screenshot】.

## Features implemented

- **Interactive 3D environment** – A simple Indiana front‑porch scene containing a cherry blossom tree, a wooden swing, a grassy yard and placeholder animals.  You can rotate, pan and zoom the camera using your mouse or touch via orbit controls.
- **Procedural weather** – A seasonal cycle advances automatically.  When it’s raining or snowing, an instanced raindrop system appears.  The intensity of the rain adjusts ambient sound volume accordingly.
- **Audio ambience** – Background audio elements (rain, wind chimes, animal sounds) loop gently in the background.  Replace the placeholder files in `public/sounds` with your own `.mp3` or `.wav` files for a richer experience.
- **Avatar customisation** – A simple humanoid avatar represents the player.  Use the overlay panel to choose body type, hair colour, skin tone and accessories.  Avatar properties are stored in a global store (Zustand) and update reactively in the 3D scene.
- **Idle mode** – Toggle the “Idle mode” switch to let the environment entertain itself.  When enabled, the system will periodically spawn random animals at different positions and play their sounds.  This hint of randomness helps keep the ambience fresh even when you simply want to relax.

## Folder structure

```
meditation-app/
├── components/        # React components for the scene and UI
│   ├── Avatar.js      # 3D avatar representation
│   ├── AvatarCreator.js # UI panel for customisation and settings
│   └── Environment.js # Scene composition, weather, animals, sounds
├── pages/
│   ├── _app.js        # Imports global CSS
│   └── index.js       # Home page with the canvas and overlay UI
├── public/
│   ├── models/        # Place your .glb and .gltf models here
│   ├── sounds/        # Place ambient sound files here
│   ├── textures/      # Textures for models and environments
│   └── ...            # Other static assets
├── store/
│   └── useStore.js    # Global state using Zustand
├── styles/
│   └── globals.css    # Basic styling for the page and UI panels
├── next.config.js     # Next.js configuration
├── package.json       # Project metadata and dependencies
└── README.md          # This documentation
```

## Extending the environment

To recreate different environments or add more detail, you can drop high‑quality models into the `public/models` folder and load them using [`useGLTF`](https://github.com/pmndrs/drei#usegltf) from `@react-three/drei`.  For instance, replace the simple tree in `Environment.js` with a `glb` file of a blossoming cherry tree.  Three.js’s GLTF loader supports PBR materials and animations out of the box【48456416660804†L319-L330】.

Environmental audio lives in `public/sounds`.  Replace the placeholder files with your own `.mp3` or `.wav` clips of rain, wind, crickets, frogs, cats, woodpeckers and other organisms.  The `AmbientAudio` component in `Environment.js` will automatically handle looping and volume.

To simulate other kinds of weather (snow, fog, thunderstorms), create new particle systems similar to the `Rain` component.  Use instanced meshes and simple geometries for high performance.  You can further enhance the atmosphere by adding post‑processing effects such as bloom or depth of field via Three.js’s `EffectComposer`【987843542628762†L88-L97】.

## Running locally

1. Ensure that you have **Node.js** (version 18 or higher) installed.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open a browser and navigate to `http://localhost:3000`.  The page will reload automatically when you edit components.

## Deployment on Vercel

Vercel is an ideal host for a Next.js project.  Follow these steps to deploy:

1. **Create a Git repository.**  If you haven’t already, initialise a Git repository in the `meditation-app` directory and commit your files.  Push the repository to GitHub.
2. **Sign in to Vercel.**  Go to [Vercel](https://vercel.com) and sign in with your GitHub account.
3. **Import the project.**  Click *“New Project”* and select the GitHub repository containing this project.  Vercel will detect that it’s a Next.js application and prefill most settings.  Make sure the *build command* is `npm run build` and the *output directory* is `.next` (the defaults).
4. **Deploy.**  Click *Deploy*.  After the build finishes, you’ll receive a live URL.  You can configure environment variables, custom domains and analytics via Vercel’s dashboard.

## Next steps and ideas

This prototype lays the foundation for a much richer relaxation tool.  Here are some ideas for future improvements:

- **Realistic assets** – Replace the placeholder primitives with detailed models of porches, trees, swings, squirrels, birds and cats.  Use high‑resolution textures and normal maps for added realism.
- **Physics integration** – Connect a physics engine such as [cannon.js](https://github.com/schteppe/cannon.js) or [ammo.js](https://github.com/kripken/ammo.js) to simulate swinging ropes, falling leaves or interacting objects, as suggested by advanced Three.js guides【987843542628762†L98-L103】.
- **Dynamic lighting and celestial cycles** – Animate the position of the sun, moon and stars to reflect the time of day.  Create sunrise and sunset transitions or lunar phases.  Consider using environment maps for realistic reflections【987843542628762†L130-L139】.
- **Guided meditation narration** – Overlay voice‑over tracks that guide the player through breathing exercises or mental imagery.  Combine this with real‑time subtitle rendering for accessibility.
- **Multi‑environment selection** – Allow players to choose from different biomes (mountains, beaches, forests, outer space) each with unique weather patterns and ambient creatures.
- **User‑generated content** – Provide an editor where players can place objects, adjust lighting and upload their own assets to craft personalised relaxation spaces.

We hope this project inspires you to build calming, interactive worlds on the web.  Contributions and feedback are welcome—feel free to fork the repository and share your additions!