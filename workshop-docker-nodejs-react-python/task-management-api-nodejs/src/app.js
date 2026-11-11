import express from "express";
import pkg from "../package.json" with { type: "json" };
import { createStore } from "./store.js";

const MAX_TITLE = 120;

function parseTitle(value) {
  if (typeof value !== "string") return { error: "Le champ title est obligatoire (texte)" };
  const title = value.trim();
  if (!title) return { error: "Le champ title ne peut pas être vide" };
  if (title.length > MAX_TITLE) return { error: `Le champ title est limité à ${MAX_TITLE} caractères` };
  return { title };
}

export function createApp({
  dataFile = process.env.DATA_FILE || "data/tasks.json",
  apiKey = process.env.API_KEY || "",
} = {}) {
  const app = express();
  const store = createStore(dataFile);

  app.use(express.json());

  // Si API_KEY est défini (dans le .env du serveur), les écritures exigent l'en-tête x-api-key.
  const requireKey = (req, res, next) => {
    if (apiKey && req.get("x-api-key") !== apiKey) {
      return res.status(401).json({ error: "Clé API manquante ou invalide" });
    }
    next();
  };

  app.get("/", (req, res) => {
    res.json({
      name: pkg.name,
      version: pkg.version,
      env: process.env.NODE_ENV || "development",
      message: "Bienvenue sur TaskFlow API",
    });
  });

  app.get("/health", (req, res) => res.json({ status: "ok", uptime: Math.round(process.uptime()) }));

  app.get("/api/tasks", (req, res) => {
    let list = store.all();
    if (req.query.done === "true") list = list.filter((t) => t.done);
    if (req.query.done === "false") list = list.filter((t) => !t.done);
    res.json(list);
  });

  app.get("/api/tasks/:id", (req, res) => {
    const task = store.get(Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Tâche introuvable" });
    res.json(task);
  });

  app.post("/api/tasks", requireKey, (req, res) => {
    const { title, error } = parseTitle(req.body?.title);
    if (error) return res.status(400).json({ error });
    res.status(201).json(store.create(title));
  });

  app.patch("/api/tasks/:id", requireKey, (req, res) => {
    const changes = {};
    if ("title" in (req.body ?? {})) {
      const { title, error } = parseTitle(req.body.title);
      if (error) return res.status(400).json({ error });
      changes.title = title;
    }
    if ("done" in (req.body ?? {})) {
      if (typeof req.body.done !== "boolean") {
        return res.status(400).json({ error: "Le champ done doit être true ou false" });
      }
      changes.done = req.body.done;
    }
    if (!Object.keys(changes).length) {
      return res.status(400).json({ error: "Rien à modifier : envoyez title et/ou done" });
    }
    const task = store.update(Number(req.params.id), changes);
    if (!task) return res.status(404).json({ error: "Tâche introuvable" });
    res.json(task);
  });

  app.delete("/api/tasks/:id", requireKey, (req, res) => {
    if (!store.remove(Number(req.params.id))) return res.status(404).json({ error: "Tâche introuvable" });
    res.status(204).end();
  });

  app.use((req, res) => res.status(404).json({ error: "Route inconnue" }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: "JSON invalide" });
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  });

  return app;
}
