import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
        
          
          name: 'MFA KEY',
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" },
            "2fa-key": { label: "2FA Key" },
          },
          async authorize(credentials, req) {
            
            const res = await fetch("http://localhost:3000/api/test", {
              method: 'GET',
            //   body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" }
            })
            const user = await res.json()
      
            // If no error and we have user data, return it
            if (res.ok && user) {
              return user
            }
            // Return null if user data could not be retrieved
            return null
          }
        }),
        
      ],
      callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
          }
      }
      
})

export { handler as GET, handler as POST }