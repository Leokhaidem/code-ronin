"use client"
// accessing auth session on the server
// in route.ts of nextauth
// export const authOptions = {providers...
// NextAuth(authOptions)
// const session = await getServerSession (authOptions);
// similarly, session.user!.name

import { useSession } from 'next-auth/react'
import React from 'react'

function Dashboard() {
    const {status, data: session} = useSession();

  return (
    <div>
        <div>Dashboard</div>
        {status === "authenticated" && <div>{`The user ${session.user!.name} is logged in`}</div>}
    </div>
  )
}

export default Dashboard