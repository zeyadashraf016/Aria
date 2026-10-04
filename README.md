# Aria Job Order Database

## Run locally

Install dependencies with `npm install`, then run `npm run dev`.
Run `npm run build` for a production build.

## Departments and serial numbers

Department choices in the creation form and record filter are OBM, ISI, and Maintenance.
Job order serial numbers (the `jobNumber` field) are automatically assigned when a job order is created:

`DEP-SEQUENCE-MM-YY`

- Prefix: the first three letters of the department in uppercase (OBM, ISI, MAI).
- Sequence: starts at 01 for each department in each calendar month and year.
- Month and year: two digits each, based on the browser's local creation date.
- Examples: `OBM-01-10-26`, `OBM-02-10-26`, `ISI-01-10-26`, `MAI-01-10-26`.
- Sequences above 99 continue as 100, 101, and so on.

The form shows a serial number preview. Saving assigns the current next number, and
deleting a record does not reuse its sequence during the session. Sample records
use the updated departments and serial format. MO Number remains a manual,
optional text field. Required-field validation, statuses, search, deletion, and
the existing layout remain available.

Like the original project, records are kept in memory and reset on page reload.
The sequence counters share that lifetime; this project has no persistent database
or cross-user numbering service.

## Numbering checks

With Node.js 22.18 or newer, run `node --test tests/serialNumber.test.mjs`.
Checks cover independent departments, previews, month/year resets, existing
sequences, deletion, and sequences above 99.
