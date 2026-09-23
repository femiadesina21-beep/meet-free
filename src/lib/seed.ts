/**
 * Seed the file-based database with demo users and photos
 * Run once on first start or via API
 */

import { createUser, addPhoto, getUsers } from "./db";

const demoUsers = [
  {
    name: "Aisha",
    email: "aisha@meetfree.com",
    password: "demo123",
    age: 24,
    gender: "female" as const,
    bio: "Love dancing, good food and deep conversations. Looking for something real 💕",
    location: "Lagos",
    interests: ["Dancing", "Foodie", "Travel", "Music"],
    avatar: "https://picsum.photos/seed/user1/400/400",
    isVerified: true,
  },
  {
    name: "David",
    email: "david@meetfree.com",
    password: "demo123",
    age: 27,
    gender: "male" as const,
    bio: "Software engineer by day, football lover by night. Let’s build something special.",
    location: "Abuja",
    interests: ["Tech", "Football", "Gym", "Movies"],
    avatar: "https://picsum.photos/seed/user2/400/400",
    isVerified: true,
  },
  {
    name: "Chioma",
    email: "chioma@meetfree.com",
    password: "demo123",
    age: 22,
    gender: "female" as const,
    bio: "Creative soul. I paint, write poetry and love long walks under the stars.",
    location: "Port Harcourt",
    interests: ["Art", "Poetry", "Nature", "Coffee"],
    avatar: "https://picsum.photos/seed/user3/400/400",
    isVerified: false,
  },
  {
    name: "Emeka",
    email: "emeka@meetfree.com",
    password: "demo123",
    age: 29,
    gender: "male" as const,
    bio: "Entrepreneur. I value honesty, loyalty and good vibes.",
    location: "Lagos",
    interests: ["Business", "Travel", "Fitness", "Wine"],
    avatar: "https://picsum.photos/seed/user4/400/400",
    isVerified: true,
  },
  {
    name: "Zainab",
    email: "zainab@meetfree.com",
    password: "demo123",
    age: 25,
    gender: "female" as const,
    bio: "Hijabi fashionista & content creator. Let’s make each other better every day ✨",
    location: "Kano",
    interests: ["Fashion", "Content", "Faith", "Photography"],
    avatar: "https://picsum.photos/seed/user5/400/400",
    isVerified: true,
  },
  {
    name: "Tunde",
    email: "tunde@meetfree.com",
    password: "demo123",
    age: 26,
    gender: "male" as const,
    bio: "Musician and dreamer. Looking for someone who feels the music the way I do.",
    location: "Ibadan",
    interests: ["Music", "Guitar", "Night life", "Food"],
    avatar: "https://picsum.photos/seed/user6/400/400",
    isVerified: false,
  },
];

export async function seedDatabase() {
  const existing = await getUsers();
  if (existing.length > 0) {
    console.log("Database already seeded");
    return { seeded: false, users: existing.length };
  }

  console.log("Seeding MeetFree database...");

  for (let i = 0; i < demoUsers.length; i++) {
    const u = demoUsers[i];
    const user = await createUser(u);

    // Add 1-2 photos per user with some starting views
    const photoCount = i % 2 === 0 ? 2 : 1;
    for (let j = 0; j < photoCount; j++) {
      await addPhoto({
        userId: user.id,
        userName: user.name,
        url: `https://picsum.photos/seed/photo${i}${j}/600/800`,
      });
    }
  }

  console.log("Seed complete");
  return { seeded: true, users: demoUsers.length };
}
