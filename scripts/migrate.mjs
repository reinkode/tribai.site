import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local (or export it) and retry.");
  process.exit(1);
}

const dir = path.join(process.cwd(), "migrations");
const files = (await readdir(dir)).filter((file) => file.endsWith(".sql")).sort();

const sql = postgres(url, { prepare: false, max: 1 });
try {
  for (const file of files) {
    const contents = await readFile(path.join(dir, file), "utf8");
    await sql.unsafe(contents).simple();
    console.log(`applied ${file}`);
  }
} finally {
  await sql.end();
}
