"use client"

import { api } from "@/deps/vars"
import axios from "axios"
import { useRouter } from "next/navigation"

import { useState } from "react"

export default function Login() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    async function handleLogin() {

        setLoading(true)

        const body = {
            username: username,
            password: password
        }


        const res = await axios.post(`${api.url}/login`, 
                body,
            {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(res.data.error){
            setError(res.data.error)
        }

        if(!res.data.error){
            setError(null)
        }

        if(res.data.username){
            sessionStorage.setItem('user', JSON.stringify(res.data))
            if(res.data.role == 'admin'){
                window.location.href = "/"
            }
            router.push('/verification')
        }

        if(res.statusText !== 'OK'){
            //@ts-ignore
            setError('Something Went Wrong')
        }

        setLoading(false)
        
        
    }
    return(
        
        <div className="h-full flex flex-col justify-center items-center">
            <div className="font-medium text-xl">
                Login To CES-VOTING SYSTEM
            </div>
           
            <div className="flex flex-col space-y-4 p-4">
            {error ? <div className="alert alert-warning">
                {error}
            </div> : <></>}
                <label className="input input-bordered flex items-center gap-2">
                    Username
                    <input onChange={e=>setUsername(e.target.value)} type="text" className="grow" placeholder="username or id" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Password
                    <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="grow" placeholder="daisy@site.com" />
                </label>
                <button onClick={handleLogin} className="btn btn-primary">{!loading ? 'Log In' : 'Loading' }</button>
            </div>
        </div>
    )
}