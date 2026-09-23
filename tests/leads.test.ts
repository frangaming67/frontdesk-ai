import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { LocalLeadRepository } from "../lib/leads/LocalLeadRepository";
import { seedLeads } from "../data/seed-leads";

class MemoryStorage {
  private values = new Map<string, string>();
  failWrites = false;
  writtenKeys: string[] = [];

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    if (this.failWrites) throw new Error("Storage unavailable");
    this.writtenKeys.push(key);
    this.values.set(key, value);
  }
}

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let storage: MemoryStorage;
let repository: LocalLeadRepository;

beforeEach(() => {
  storage = new MemoryStorage();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });
  repository = new LocalLeadRepository();
});

afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

test("reset removes test leads, restores example statuses, and preserves unrelated storage", async () => {
  storage.setItem("unrelated-preference", "keep-me");
  const created = await repository.create({
    name: "Sales walkthrough",
    treatment: "Invisalign",
    intent: "HIGH",
    email: "walkthrough@example.com",
    conversation: [],
  });
  await repository.updateStatus("seed_james_wilson", "CONTACTED");
  storage.writtenKeys = [];

  const restored = await repository.resetDemo();

  assert.equal(restored.length, seedLeads.length);
  assert.equal(restored[0].id, "seed_james_wilson");
  assert.equal(restored[0].status, "NEW");
  assert.equal(await repository.getById(created.id), undefined);
  assert.deepEqual(await new LocalLeadRepository().getAll(), restored);
  assert.equal(storage.getItem("unrelated-preference"), "keep-me");
  assert.deepEqual(storage.writtenKeys, ["frontdesk_ai_leads_v1"]);
});

test("reset preserves pristine examples even when the first action updates an example", async () => {
  await repository.updateStatus("seed_james_wilson", "LOST");
  const firstReset = await repository.resetDemo();
  const pristine = await repository.getAll();
  assert.equal(firstReset[0].status, "NEW");

  // Callers must not be able to change the examples used by future resets.
  firstReset[0].status = "WON";
  firstReset[0].conversation[0].text = "Changed by the caller";
  assert.deepEqual(await repository.resetDemo(), pristine);
  assert.deepEqual(await repository.resetDemo(), pristine);
});

test("a failed reset rejects and leaves existing leads untouched", async () => {
  const created = await repository.create({
    name: "Keep on failure",
    treatment: "Veneers",
    intent: "MEDIUM",
    conversation: [],
  });
  const beforeReset = await repository.getAll();
  storage.failWrites = true;

  await assert.rejects(repository.resetDemo(), /Storage unavailable/);

  assert.deepEqual(await repository.getAll(), beforeReset);
  assert.equal((await repository.getById(created.id))?.name, "Keep on failure");
});
