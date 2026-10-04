import { test } from "node:test";
import assert from "node:assert/strict";
import { DEPARTMENTS, nextSerialNumber, reserveSerialNumber, seedSerialCounters } from "../src/serialNumber.ts";

const october = new Date(2026, 9, 4);

test("only the requested departments are available", () => {
  assert.deepEqual(DEPARTMENTS, ["OBM", "ISI", "Maintenance"]);
  assert.throws(() => nextSerialNumber({}, "Engineering", october), /Invalid department/);
});

test("preview does not consume a number; each department advances independently", () => {
  const counters = {};
  assert.equal(nextSerialNumber(counters, "OBM", october), "OBM-01-10-26");
  assert.equal(nextSerialNumber(counters, "OBM", october), "OBM-01-10-26");
  assert.equal(reserveSerialNumber(counters, "OBM", october), "OBM-01-10-26");
  assert.equal(reserveSerialNumber(counters, "OBM", october), "OBM-02-10-26");
  assert.equal(reserveSerialNumber(counters, "ISI", october), "ISI-01-10-26");
  assert.equal(reserveSerialNumber(counters, "Maintenance", october), "MAI-01-10-26");
});

test("sequence resets at month and year boundaries", () => {
  const counters = {};
  reserveSerialNumber(counters, "OBM", october);
  assert.equal(reserveSerialNumber(counters, "OBM", new Date(2026, 10, 1)), "OBM-01-11-26");
  assert.equal(reserveSerialNumber(counters, "OBM", new Date(2027, 9, 1)), "OBM-01-10-27");
  assert.equal(reserveSerialNumber(counters, "ISI", new Date(2026, 11, 31)), "ISI-01-12-26");
  assert.equal(reserveSerialNumber(counters, "ISI", new Date(2027, 0, 1)), "ISI-01-01-27");
});

test("seed uses the highest issued sequence rather than record count or array order", () => {
  const createdAt = october.toISOString();
  const jobs = [
    { department: "OBM", jobNumber: "OBM-08-10-26", createdAt },
    { department: "OBM", jobNumber: "OBM-02-10-26", createdAt },
    { department: "ISI", jobNumber: "ISI-03-10-26", createdAt },
    { department: "OBM", jobNumber: "MO-2026-150", createdAt },
    { department: "OBM", jobNumber: "OBM-99-09-26", createdAt },
  ];
  const counters = seedSerialCounters(jobs);
  assert.equal(reserveSerialNumber(counters, "OBM", october), "OBM-09-10-26");
  jobs.splice(0, jobs.length); // Deleting records does not rewind issued counters.
  assert.equal(reserveSerialNumber(counters, "OBM", october), "OBM-10-10-26");
  assert.equal(reserveSerialNumber(counters, "ISI", october), "ISI-04-10-26");
});

test("monthly sequence grows past two digits without wrapping", () => {
  const counters = {};
  for (let i = 1; i < 100; i++) reserveSerialNumber(counters, "Maintenance", october);
  assert.equal(reserveSerialNumber(counters, "Maintenance", october), "MAI-100-10-26");
});

