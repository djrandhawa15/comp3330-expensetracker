# Lab 5 – Notes

- **Vite + React Setup:** Creating a separate `/frontend` folder with Vite (React + TS) was straightforward. Running `bun run dev` confirmed everything scaffolded correctly.  
- **Tailwind Integration:** Adding TailwindCSS required updating both `tailwind.config.js` and `src/index.css`. Once the content paths were correct, utilities applied instantly.  
- **ShadCN UI Initialization:** The CLI needed the `@/*` import alias defined in `tsconfig.json` and `vite.config.ts`. Without it, ShadCN showed “No import alias found.” Fixing this was key.  
- **Design Tokens Issue:** Using classes like `border-border` or `bg-background` didn’t work until I added the CSS variables + color mapping in `tailwind.config.js`. Once tokens were defined, dark mode and ShadCN components styled correctly.  
- **Reusable Components:** Building the `AppCard` with ShadCN’s `Card` parts made it clear how to use UI primitives to create polished, consistent layouts.  
- **Learning:** I now understand how Tailwind’s token system and ShadCN’s generated components fit together. Setting up the alias + theme tokens upfront prevents config errors and makes the UI ready for scalable theming.  
