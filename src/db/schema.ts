import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verficationToken) => ({
    compositePk: primaryKey({
      columns: [verficationToken.identifier, verficationToken.token],
    }),
  }),
);

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

const auditSchema = {
  createdOn: integer("createdOn", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedOn: integer("updatedOn", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
};

// const plasticsSchema = {
//   uuid: text("uuid")
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   type: text("type").notNull().unique(),
//   notes: text("notes"),
//   dispose: text("dispose").notNull(),
// };

// const giftsSchema = {
//   uuid: text("uuid")
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   offered: integer("offered", { mode: "timestamp_ms" }).notNull(),
//   description: text("description").notNull(),
//   value: text("value").notNull(),
//   donor: text("donor").notNull(),
//   reason: text("reason").notNull(),
//   prevOffer: text("prevOffer").notNull(),
//   offerType: text("offerType").notNull(),
//   details: text("details").notNull(),
//   accepted: text("accepted").notNull(),
//   published: text("published").notNull(),
// };

const entrySchema = {
  uuid: text("uuid")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(),
  description: text("description").notNull(),
  internalNotes: text("internalNotes"),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
};

const filesSchema = {
  uuid: text("uuid")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  entryUuid: text("entryUuid")
    .notNull()
    .references(() => entryTable.uuid),
  key: text("key").notNull().unique(),
  size: integer("size").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
};

// export const plasticsTable = sqliteTable(
//   "plastics",
//   {
//     ...plasticsSchema,
//     ...auditSchema,
//   },
//   (table) => ({
//     plasticsTypeIndex: index("plastics_type_index").on(table.type),
//   }),
// );

// export const giftsTable = sqliteTable(
//   "gifts",
//   {
//     ...giftsSchema,
//     ...auditSchema,
//   },
//   (table) => ({
//     offeredIndex: index("gifts_offered_index").on(table.offered),
//   }),
// );

export const entryTable = sqliteTable(
  "entry",
  {
    ...entrySchema,
    ...auditSchema,
  },
  (table) => ({
    entryTypeIndex: index("entry_type_index").on(table.type),
  }),
);

export const filesTable = sqliteTable(
  "files",
  {
    ...filesSchema,
    ...auditSchema,
  },
  (table) => ({
    entryUuidIndex: index("entry_uuid_index").on(table.entryUuid),
    filesKeyIndex: index("files_key_index").on(table.key),
  }),
);
