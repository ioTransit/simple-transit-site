import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import z from "zod";

import { db } from "./config";
import { password, user } from "./schema";

const config = () => {
  const _config = z
    .object({
      ADMIN_EMAIL: z.string(),
      ADMIN_PASSWORD: z.string(),
      DATABASE_URL: z.string(),
      AGENCY_NAME: z.string(),
      MAPBOX_ACCESS_TOKEN: z.string(),
      GTFS_URL: z.string(),
    })
    .parse(process.env);
  return _config;
};

const envConfig = config();
async function predeploy() {
  const email = envConfig.ADMIN_EMAIL;

  // cleanup the existing database
  await db.delete(user).where(eq(user.email, email));

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
