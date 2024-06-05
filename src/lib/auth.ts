import { db } from "@/db/db-connection";
import { accounts, users } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DBQueryConfig } from "drizzle-orm";
import NextAuth, { DefaultSession, User as AuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ request }: any) {
        console.log("🚀 ~ authorize ~ authorize:", "authorize")
        
        const isUser = await db.select().from(users).all();
        if (isUser.length <= 0) {
          const userInsert = {
            email: "test@test.com",
            id: "1a9b5df3-bc15-4705-bff3-0a3948a8aab9",
            name: "test",
            }
          
          await db.insert(users)
          .values(userInsert)
          .returning()
          .get();
            const fakeAccountData = {
              type: "email",
              provider: "email",
              providerAccountId: "email",
              userId: "1a9b5df3-bc15-4705-bff3-0a3948a8aab9"
            }
          await db
            .insert(accounts)
            .values({
              type: "email",
              provider: "email",
              providerAccountId: "email",
              userId: "1a9b5df3-bc15-4705-bff3-0a3948a8aab9"
            })
            .returning()
            .get();
          }

        return {
          email: "test@test.com",
          id: "1a9b5df3-bc15-4705-bff3-0a3948a8aab9",
          name: "test",
        };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      console.log("🚀 ~ session ~ session, user:", session, user)
      //session.user.role = token.role ? (token.role as string[]) : undefined;
      // Send properties to the client, like an access_token from a provider.
      // if (session.user) {

      return {
        ...session,
        user: {
          ...session.user,
          id: "1a9b5df3-bc15-4705-bff3-0a3948a8aab9",
          role: "test@test.com" ? "admin" : "user",
        },
      };
    },
    authorized({ request, auth }) {
      // console.log("🚀 ~ authorized ~ request, auth:", request, auth);
      // const headersList = headers();
      // const referer = headersList.get("authorization");

      // const serverkey = referer == (process.env.NEXTAUTH_SECRET as string);

      // if (!(serverkey || !!auth?.user)) {
      // if (!auth?.user) {
      //   return NextResponse.redirect(
      //     `${process.env.BASE_URL}login?callbackUrl=${encodeURI(
      //       request.nextUrl.pathname,
      //     )}`,
      //   );
      // }

      return !!auth?.user; // this ensures there is a logged in user for -every- request
    },
  },
});

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}
