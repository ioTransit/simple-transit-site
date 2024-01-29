import { eq } from "drizzle-orm";

import { db } from "drizzle/config";
import { note } from "drizzle/schema";
import { dbDate } from "~/utils";

export async function getNote({ id }: { id: string }) {
  const [_note] = await db.select().from(note).where(eq(note.id, id)).limit(1);
  return _note;
}

export function getNoteListItems() {
  return db
    .select({ id: note.id, title: note.title })
    .from(note)
    .orderBy(note.createdAt);
}

export async function createNote({
  body,
  title,
  userId,
}: {
  body: string;
  title: string;
  userId: string;
}) {
  const [_note] = await db
    .insert(note)
    .values([{ body, title, userId, updatedAt: dbDate() }])
    .returning({ id: note.id });
  return _note;
}

export function deleteNote({ id }: { id: string }) {
  return db.delete(note).where(eq(note.id, id));
}
