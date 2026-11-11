import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Stockage des tâches dans un fichier JSON.
 * Le fichier est placé dans un volume Docker : les tâches survivent aux redéploiements.
 */
export function createStore(file) {
  let tasks = load();

  function load() {
    if (!existsSync(file)) return [];
    try {
      return JSON.parse(readFileSync(file, "utf8"));
    } catch {
      console.warn(`Fichier ${file} illisible : démarrage avec une liste vide`);
      return [];
    }
  }

  function save() {
    mkdirSync(dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify(tasks, null, 2));
    renameSync(tmp, file); // écriture atomique : jamais de fichier à moitié écrit
  }

  return {
    all: () => tasks,
    get: (id) => tasks.find((t) => t.id === id),
    create(title) {
      const id = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      const task = { id, title, done: false, createdAt: new Date().toISOString() };
      tasks.push(task);
      save();
      return task;
    },
    update(id, changes) {
      const task = tasks.find((t) => t.id === id);
      if (!task) return undefined;
      Object.assign(task, changes);
      save();
      return task;
    },
    remove(id) {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return false;
      tasks.splice(index, 1);
      save();
      return true;
    },
  };
}
