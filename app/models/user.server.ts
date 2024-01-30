import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "../../drizzle/config";
import { password, user } from "../../drizzle/schema";

export async function getUserById(id: string) {
  const [_user] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  return _user;
}

export async function getUserByEmail(email: string) {
  const [_user] = await db.select().from(user).where(eq(user.email, email));
  return _user;
}

export async function createUser(email: string, _password: string) {
  const hashedPassword = await bcrypt.hash(_password, 10);

  return await db.transaction(async (tx) => {
    const [createdUser] = await tx
      .insert(user)
      .values([
        {
          email,
          updatedAt: new Date().toLocaleDateString(),
        },
      ])
      .returning({ id: user.id, email: user.email });
    if (createdUser)
      await tx.insert(password).values({
        userId: createdUser.id,
        hash: hashedPassword,
      });
    return createdUser;
  });
}

export async function deleteUserByEmail(email: string) {
  return await db.delete(user).where(eq(user.email, email));
}

export async function verifyLogin(email: string, _password: string) {
  const [userWithPassword] = await db
    .select()
    .from(user)
    .leftJoin(password, eq(password.userId, user.id))
    .where(eq(user.email, email));

  if (!userWithPassword || !userWithPassword.Password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    _password,
    userWithPassword.Password.hash,
  );

  if (!isValid) {
    return null;
  }

  return userWithPassword.User;
}
