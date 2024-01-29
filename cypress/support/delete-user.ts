// Use this to delete a user by their email
// Simply call this with:
// npx ts-node -r tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com,
// and that user will get deleted

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { installGlobals } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { db } from "../../drizzle/config";
import { password, user } from "../../drizzle/schema";

installGlobals();

async function deleteUser(email: string) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  try {
    const [_user] = await db
      .delete(user)
      .where(eq(user.email, email))
      .returning({ id: user.id });
    await db.delete(password).where(eq(password.userId, _user.id));
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("User not found, so no need to delete");
    } else {
      throw error;
    }
  }
}

deleteUser(process.argv[2]);
