"use client"

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
export default function Home() {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { data: session,status } = useSession()
  if(!session){
    // signIn()
  }
  if(status !== 'loading'){
    if(!session){
      signIn()
    }
  }
  console.log(session);
  
  return (
    <>
   <div className="h-full flex justify-center items-center">
   
   </div>
    
    </>
  );
}
