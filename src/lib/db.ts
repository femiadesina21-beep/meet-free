/**
 * Simple file-based database for MeetFree MVP
 * Later this can be replaced with MongoDB / Prisma easily
 */

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ============ Types ============

export type DbUser = {
  id: string;
  name: string;
  email: string;
  password: string; // hashed in real app – plain for MVP demo
  age: number;
  gender: "male" | "female" | "other";
  bio: string;
  location: string;
  interests: string[];
  avatar: string;
  isVerified: boolean;
  createdAt: string;
};

export type DbPhoto = {
  id: string;
  userId: string;
  userName: string;
  url: string;
  views: number;
  likes: number;
  createdAt: string;
};

export type DbMessage = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
};

export type DbChat = {
  id: string;
  participants: string[]; // user ids
  lastMessage: string;
  lastMessageTime: string;
  updatedAt: string;
};

// ============ Users ============

export async function getUsers(): Promise<DbUser[]> {
  return readJson<DbUser[]>("users.json", []);
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(user: Omit<DbUser, "id" | "createdAt">): Promise<DbUser> {
  const users = await getUsers();
  const newUser: DbUser = {
    ...user,
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await writeJson("users.json", users);
  return newUser;
}

// ============ Photos ============

export async function getPhotos(): Promise<DbPhoto[]> {
  return readJson<DbPhoto[]>("photos.json", []);
}

export async function getPhotoById(id: string): Promise<DbPhoto | null> {
  const photos = await getPhotos();
  return photos.find((p) => p.id === id) || null;
}

export async function getPhotosByUser(userId: string): Promise<DbPhoto[]> {
  const photos = await getPhotos();
  return photos.filter((p) => p.userId === userId);
}

export async function addPhoto(photo: Omit<DbPhoto, "id" | "views" | "likes" | "createdAt">): Promise<DbPhoto> {
  const photos = await getPhotos();
  const newPhoto: DbPhoto = {
    ...photo,
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    views: 0,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  photos.push(newPhoto);
  await writeJson("photos.json", photos);
  return newPhoto;
}

export async function incrementPhotoViews(photoId: string): Promise<DbPhoto | null> {
  const photos = await getPhotos();
  const idx = photos.findIndex((p) => p.id === photoId);
  if (idx === -1) return null;
  photos[idx].views += 1;
  await writeJson("photos.json", photos);
  return photos[idx];
}

export async function likePhoto(photoId: string): Promise<DbPhoto | null> {
  const photos = await getPhotos();
  const idx = photos.findIndex((p) => p.id === photoId);
  if (idx === -1) return null;
  photos[idx].likes += 1;
  await writeJson("photos.json", photos);
  return photos[idx];
}

// ============ Leaderboard ============

export async function getLeaderboard(period: "weekly" | "monthly" = "weekly"): Promise<DbPhoto[]> {
  const photos = await getPhotos();
  // For MVP we just sort by views. Later we can filter by date range.
  return [...photos].sort((a, b) => b.views - a.views).slice(0, 20);
}

// ============ Chats & Messages ============

export async function getChats(): Promise<DbChat[]> {
  return readJson<DbChat[]>("chats.json", []);
}

export async function getChatById(id: string): Promise<DbChat | null> {
  const chats = await getChats();
  return chats.find((c) => c.id === id) || null;
}

export async function getMessages(chatId: string): Promise<DbMessage[]> {
  const all = await readJson<DbMessage[]>("messages.json", []);
  return all.filter((m) => m.chatId === chatId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export async function addMessage(msg: Omit<DbMessage, "id" | "timestamp" | "isRead">): Promise<DbMessage> {
  const messages = await readJson<DbMessage[]>("messages.json", []);
  const newMsg: DbMessage = {
    ...msg,
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  messages.push(newMsg);
  await writeJson("messages.json", messages);

  // Update chat last message
  const chats = await getChats();
  const chatIdx = chats.findIndex((c) => c.id === msg.chatId);
  if (chatIdx !== -1) {
    chats[chatIdx].lastMessage = msg.text;
    chats[chatIdx].lastMessageTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    chats[chatIdx].updatedAt = new Date().toISOString();
    await writeJson("chats.json", chats);
  }

  return newMsg;
}

export async function createChat(participantIds: string[]): Promise<DbChat> {
  const chats = await getChats();
  const newChat: DbChat = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    participants: participantIds,
    lastMessage: "",
    lastMessageTime: "",
    updatedAt: new Date().toISOString(),
  };
  chats.push(newChat);
  await writeJson("chats.json", chats);
  return newChat;
}
