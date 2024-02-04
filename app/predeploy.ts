import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "drizzle/config";
import { password, user } from "drizzle/schema";

import { envConfig } from "./config.server";

async function predeploy() {
  const email = envConfig.ADMIN_EMAIL;

  // cleanup the existing database
  const [_user] = await db.select().from(user).where(eq(user.email, email));
  if (_user) return;

  const hashedPassword = await bcrypt.hash(envConfig.ADMIN_PASSWORD, 10);

  await db.transaction(async (tx) => {
    const [createdUser] = await tx
      .insert(user)
      .values([
        {
          email,
          updatedAt: new Date().toLocaleDateString(),
        },
      ])
      .returning({ id: user.id });
    if (createdUser) {
      await tx.insert(password).values({
        userId: createdUser.id,
        hash: hashedPassword,
      });
    }
  });
  console.log(`Database has been seeded. 🌱`);
}

predeploy().catch((e) => {
  console.error(e);
  process.exit(1);
});
