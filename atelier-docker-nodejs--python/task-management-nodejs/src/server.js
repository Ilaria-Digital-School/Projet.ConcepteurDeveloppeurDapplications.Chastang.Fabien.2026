import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 3000;
const server = createApp().listen(port, "0.0.0.0", () => {
  console.log(`TaskFlow API démarrée sur le port ${port} (${process.env.NODE_ENV || "development"})`);
});

// docker stop envoie SIGTERM : on ferme proprement les connexions en cours
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    console.log(`${signal} reçu, arrêt du serveur…`);
    server.close(() => process.exit(0));
  });
}
