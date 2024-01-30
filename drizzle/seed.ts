import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "drizzle/config";
import { password, user } from "drizzle/schema";

async function seed() {
  const email = "walter@transit.chat";

  // cleanup the existing database
  await db.delete(user).where(eq(user.email, email));

  const hashedPassword = await bcrypt.hash("walteriscoool", 10);

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

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
