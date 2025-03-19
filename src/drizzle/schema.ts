import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar'), // Default avatar from OAuth
  createdAt: timestamp('created_at').defaultNow(),
});

// Chat rooms table
export const rooms = pgTable('rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  roomId: uuid('room_id')
    .references(() => rooms.id)
    .notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
