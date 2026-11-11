import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../src/app.js";

let server;
let base;
let dir;

before(async () => {
  dir = mkdtempSync(join(tmpdir(), "taskflow-"));
  server = createApp({ dataFile: join(dir, "tasks.json") }).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  rmSync(dir, { recursive: true, force: true });
});

const call = (path, options = {}) =>
  fetch(base + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

test("GET /health répond ok", async () => {
  const res = await call("/health");
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, "ok");
});

test("GET / renvoie le nom et la version", async () => {
  const body = await (await call("/")).json();
  assert.equal(body.name, "taskflow-api");
  assert.match(body.version, /^\d+\.\d+\.\d+$/);
});

test("POST crée une tâche, GET la retrouve", async () => {
  const res = await call("/api/tasks", { method: "POST", body: { title: "  Apprendre Docker  " } });
  assert.equal(res.status, 201);
  const task = await res.json();
  assert.equal(task.title, "Apprendre Docker");
  assert.equal(task.done, false);

  const found = await (await call(`/api/tasks/${task.id}`)).json();
  assert.equal(found.id, task.id);
});

test("POST refuse un titre vide ou absent", async () => {
  for (const body of [{}, { title: "   " }, { title: 42 }]) {
    const res = await call("/api/tasks", { method: "POST", body });
    assert.equal(res.status, 400);
  }
});

test("PATCH modifie done et title, puis le filtre ?done fonctionne", async () => {
  const { id } = await (await call("/api/tasks", { method: "POST", body: { title: "Déployer" } })).json();
  const res = await call(`/api/tasks/${id}`, { method: "PATCH", body: { done: true, title: "Déployer sur le VPS" } });
  assert.equal(res.status, 200);
  const task = await res.json();
  assert.equal(task.done, true);
  assert.equal(task.title, "Déployer sur le VPS");

  const done = await (await call("/api/tasks?done=true")).json();
  assert.ok(done.some((t) => t.id === id));
  const todo = await (await call("/api/tasks?done=false")).json();
  assert.ok(!todo.some((t) => t.id === id));
});

test("PATCH refuse un done non booléen et un corps vide", async () => {
  const { id } = await (await call("/api/tasks", { method: "POST", body: { title: "Test" } })).json();
  assert.equal((await call(`/api/tasks/${id}`, { method: "PATCH", body: { done: "oui" } })).status, 400);
  assert.equal((await call(`/api/tasks/${id}`, { method: "PATCH", body: {} })).status, 400);
});

test("DELETE supprime la tâche puis renvoie 404", async () => {
  const { id } = await (await call("/api/tasks", { method: "POST", body: { title: "À supprimer" } })).json();
  assert.equal((await call(`/api/tasks/${id}`, { method: "DELETE" })).status, 204);
  assert.equal((await call(`/api/tasks/${id}`)).status, 404);
  assert.equal((await call(`/api/tasks/${id}`, { method: "DELETE" })).status, 404);
});

test("un JSON invalide renvoie 400 et une route inconnue 404", async () => {
  const bad = await fetch(`${base}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{pas du json",
  });
  assert.equal(bad.status, 400);
  assert.equal((await call("/nimporte-quoi")).status, 404);
});

test("avec une clé API, les écritures sans clé sont refusées", async () => {
  const secured = createApp({ dataFile: join(dir, "secured.json"), apiKey: "secret-de-test" }).listen(0);
  await new Promise((resolve) => secured.once("listening", resolve));
  const url = `http://127.0.0.1:${secured.address().port}/api/tasks`;
  const headers = { "Content-Type": "application/json" };
  const body = JSON.stringify({ title: "Protégée" });

  assert.equal((await fetch(url, { method: "POST", headers, body })).status, 401);
  assert.equal((await fetch(url, { method: "POST", headers: { ...headers, "x-api-key": "secret-de-test" }, body })).status, 201);
  assert.equal((await fetch(url)).status, 200); // la lecture reste publique
  secured.close();
});
