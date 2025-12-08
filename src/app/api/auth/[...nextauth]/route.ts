import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';
import { verifyPassword, ensureOAuthUser } from '@/lib/auth';
import { emailSchema } from '@/lib/validation';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        const email = credentials?.email;
        const password = credentials?.password;
        const parsed = emailSchema.safeParse(email);
        if (!parsed.success || !password) return null;

        const user = await db.getUserByEmail(parsed.data.toLowerCase());
        if (!user || user.provider !== 'credentials') return null;
        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, provider: user.provider } as any;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account }): Promise<boolean> {
      if (account?.provider === 'google' && user.email && user.name) {
        await ensureOAuthUser(user.email, user.name, 'google');
      }
      return true;
    },
    async jwt({ token, user, account }): Promise<any> {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.email = user.email;
        token.provider = account?.provider || (user as any).provider;
      }
      return token;
    },
    async session({ session, token }): Promise<any> {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
