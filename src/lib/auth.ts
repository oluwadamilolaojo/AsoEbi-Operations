import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const admins = [
          { user: process.env.ADMIN_1_USER, pass: process.env.ADMIN_1_PASS, id: '1', name: process.env.ADMIN_1_USER },
          { user: process.env.ADMIN_2_USER, pass: process.env.ADMIN_2_PASS, id: '2', name: process.env.ADMIN_2_USER },
        ]

        const match = admins.find(
          a => a.user === credentials.username && a.pass === credentials.password
        )

        if (match) {
          return { id: match.id, name: match.name ?? match.user ?? 'Admin' }
        }
        return null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages:   { signIn: '/login' },
  secret:  process.env.NEXTAUTH_SECRET,
}
