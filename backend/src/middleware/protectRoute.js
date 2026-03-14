import { clerkClient, requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // Auto-sync: if the user exists in Clerk but not in our DB yet
      // (e.g., the Inngest webhook wasn't processed in local dev), create them now.
      if (!user) {
        console.log(`User ${clerkId} not found in DB — auto-syncing from Clerk...`);

        const clerkUser = await clerkClient.users.getUser(clerkId);

        const newUser = {
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          profileImage: clerkUser.imageUrl,
        };

        user = await User.create(newUser);

        // Also sync to Stream so video/chat features work
        await upsertStreamUser({
          id: clerkId,
          name: newUser.name,
          image: newUser.profileImage,
        });

        console.log(`✅ Auto-synced user ${clerkId} to DB and Stream.`);
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
