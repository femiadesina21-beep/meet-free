export type User = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  bio: string;
  location: string;
  distance: number; // km
  interests: string[];
  avatar: string;
  photos: Photo[];
  isVerified?: boolean;
  online?: boolean;
};

export type Photo = {
  id: string;
  url: string;
  views: number;
  likes: number;
  userId: string;
  userName: string;
  createdAt: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
};

export type Chat = {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
};

// Placeholder images (using picsum with fixed seeds for consistency)
const getAvatar = (id: number) => `https://picsum.photos/seed/user${id}/400/400`;
const getPhoto = (id: number, idx: number) =>
  `https://picsum.photos/seed/photo${id}${idx}/600/800`;

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Aisha",
    age: 24,
    gender: "female",
    bio: "Love dancing, good food and deep conversations. Looking for something real 💕",
    location: "Lagos",
    distance: 3.2,
    interests: ["Dancing", "Foodie", "Travel", "Music"],
    avatar: getAvatar(1),
    photos: [
      { id: "p1", url: getPhoto(1, 1), views: 1240, likes: 89, userId: "u1", userName: "Aisha", createdAt: "2026-09-20" },
      { id: "p2", url: getPhoto(1, 2), views: 890, likes: 54, userId: "u1", userName: "Aisha", createdAt: "2026-09-18" },
    ],
    isVerified: true,
    online: true,
  },
  {
    id: "u2",
    name: "David",
    age: 27,
    gender: "male",
    bio: "Software engineer by day, football lover by night. Let’s build something special.",
    location: "Abuja",
    distance: 12.5,
    interests: ["Tech", "Football", "Gym", "Movies"],
    avatar: getAvatar(2),
    photos: [
      { id: "p3", url: getPhoto(2, 1), views: 2100, likes: 156, userId: "u2", userName: "David", createdAt: "2026-09-21" },
      { id: "p4", url: getPhoto(2, 2), views: 670, likes: 41, userId: "u2", userName: "David", createdAt: "2026-09-15" },
    ],
    isVerified: true,
    online: false,
  },
  {
    id: "u3",
    name: "Chioma",
    age: 22,
    gender: "female",
    bio: "Creative soul. I paint, write poetry and love long walks under the stars.",
    location: "Port Harcourt",
    distance: 8.1,
    interests: ["Art", "Poetry", "Nature", "Coffee"],
    avatar: getAvatar(3),
    photos: [
      { id: "p5", url: getPhoto(3, 1), views: 3450, likes: 278, userId: "u3", userName: "Chioma", createdAt: "2026-09-22" },
      { id: "p6", url: getPhoto(3, 2), views: 1120, likes: 92, userId: "u3", userName: "Chioma", createdAt: "2026-09-19" },
    ],
    isVerified: false,
    online: true,
  },
  {
    id: "u4",
    name: "Emeka",
    age: 29,
    gender: "male",
    bio: "Entrepreneur. I value honesty, loyalty and good vibes. Looking for my partner in crime.",
    location: "Lagos",
    distance: 5.4,
    interests: ["Business", "Travel", "Fitness", "Wine"],
    avatar: getAvatar(4),
    photos: [
      { id: "p7", url: getPhoto(4, 1), views: 980, likes: 67, userId: "u4", userName: "Emeka", createdAt: "2026-09-17" },
    ],
    isVerified: true,
    online: true,
  },
  {
    id: "u5",
    name: "Zainab",
    age: 25,
    gender: "female",
    bio: "Hijabi fashionista & content creator. Let’s make each other better every day ✨",
    location: "Kano",
    distance: 18.0,
    interests: ["Fashion", "Content", "Faith", "Photography"],
    avatar: getAvatar(5),
    photos: [
      { id: "p8", url: getPhoto(5, 1), views: 2890, likes: 201, userId: "u5", userName: "Zainab", createdAt: "2026-09-21" },
      { id: "p9", url: getPhoto(5, 2), views: 1560, likes: 118, userId: "u5", userName: "Zainab", createdAt: "2026-09-16" },
    ],
    isVerified: true,
    online: false,
  },
  {
    id: "u6",
    name: "Tunde",
    age: 26,
    gender: "male",
    bio: "Musician and dreamer. Looking for someone who feels the music the way I do.",
    location: "Ibadan",
    distance: 9.7,
    interests: ["Music", "Guitar", "Night life", "Food"],
    avatar: getAvatar(6),
    photos: [
      { id: "p10", url: getPhoto(6, 1), views: 1750, likes: 134, userId: "u6", userName: "Tunde", createdAt: "2026-09-20" },
    ],
    isVerified: false,
    online: true,
  },
];

// Flatten all photos for leaderboard
export const allPhotos: Photo[] = mockUsers.flatMap((u) => u.photos);

// Sorted leaderboards
export const weeklyLeaderboard = [...allPhotos]
  .sort((a, b) => b.views - a.views)
  .slice(0, 10);

export const monthlyLeaderboard = [...allPhotos]
  .sort((a, b) => b.views - a.views)
  .slice(0, 10);

// Mock current user (the logged-in person)
export const currentUser: User = {
  id: "me",
  name: "You",
  age: 25,
  gender: "male",
  bio: "Just joined MeetFree. Excited to meet new people!",
  location: "Lagos",
  distance: 0,
  interests: ["Tech", "Music", "Travel"],
  avatar: getAvatar(99),
  photos: [
    { id: "my1", url: getPhoto(99, 1), views: 420, likes: 28, userId: "me", userName: "You", createdAt: "2026-09-22" },
  ],
  isVerified: false,
  online: true,
};

// Simple mock chats
export const mockChats: Chat[] = [
  {
    id: "c1",
    user: mockUsers[0],
    lastMessage: "Hey! I saw your photo on the leaderboard 🔥",
    lastMessageTime: "2 min ago",
    unread: 2,
    messages: [
      { id: "m1", senderId: "u1", text: "Hey! How are you?", timestamp: "10:21", isRead: true },
      { id: "m2", senderId: "me", text: "I’m good, thanks! Nice photos 😊", timestamp: "10:23", isRead: true },
      { id: "m3", senderId: "u1", text: "Hey! I saw your photo on the leaderboard 🔥", timestamp: "10:25", isRead: false },
    ],
  },
  {
    id: "c2",
    user: mockUsers[2],
    lastMessage: "Would love to know more about you",
    lastMessageTime: "1 hour ago",
    unread: 0,
    messages: [
      { id: "m4", senderId: "u3", text: "Hi there!", timestamp: "09:10", isRead: true },
      { id: "m5", senderId: "me", text: "Hello Chioma!", timestamp: "09:15", isRead: true },
      { id: "m6", senderId: "u3", text: "Would love to know more about you", timestamp: "09:18", isRead: true },
    ],
  },
];
