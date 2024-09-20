"use client"

import { api } from "@/deps/vars"
import axios from "axios"
import { useRouter } from "next/navigation"

import { useState } from "react"

export default function Login() {
    const user = sessionStorage.getItem('user')
    //@ts-ignore
    const info = JSON.parse(user)


    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    function verify() {
        router.push('/')
        router.refresh()
    }

    
    if(info.role == "admin"){
        router.push("/dashboard")
    }

    return(
        
        <div className="h-full flex flex-col justify-center items-center">
            <div className="font-medium text-xl">
                Two Step Verification 
            </div>
           
            <div className="flex flex-col space-y-4 p-4">
            {error ? <div className="alert alert-warning">
                {error}
            </div> : <></>}
            Questtin 1
                <label className="input input-bordered flex items-center gap-2">
                    
                    <input onChange={e=>setUsername(e.target.value)} type="text" className="grow" placeholder="daisy@site.com" />
                </label>
                <button onClick={verify}  className="btn btn-primary">{!loading ? 'Verify' : 'Loading' }</button>
            </div>
        </div>
    )
}