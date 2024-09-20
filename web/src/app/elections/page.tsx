"use client"

import { api } from "@/deps/vars"
import axios from "axios"
import { headers } from "next/headers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Dashboard() {
    const router = useRouter()
    const user = sessionStorage.getItem("user")
    const [role, setRole] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [mfa, setMfa] = useState('')
    const [username, setUsername] = useState('')
    const [users, setUsers] = useState({})
    //@ts-ignore
    const info = JSON.parse(user)

    async function startElection() {
        const state = users?.voting
        const res = await axios.put(`${api.url}/status/`, 
            {
                state: state == 0 ? 1 : 0,
            },
            {headers :{
                "Content-Type":"application/json"
            }}
        );

        if(res.status == 200){
            window.location.reload()
        }

    }

    useEffect(()=>{
        async function boot() {
            const users = await axios.get(`${api.url}/status`,{
                headers:{
                    "Content-Type": "application/json"
                }
            })

            console.log(users);

            setUsers(users.data)
            
        }

        boot()
    }, [])

    async function deleteUser(id:any) {
        const users = await axios.delete(`${api.url}/users/${id}`,{
            headers:{
                "Content-Type": "application/json"
            }
        })

        if(users.status == 200){
            window.location.reload()
        }



    }

    if(info.role == 'admin'){
        return(
            <div className="p-24">
                <div className="font-bold text-5xl">ELECTION STATUS : {users.voting == 0 ? 'NOT ACTIVE' : "ON GOING"}</div>
                <button onClick={startElection} className="btn btn-xl">{users.voting == 0 ? 'START ELECTIONS' : "END ELECTIONS"}</button>


               
</div>
        )
    }
    if(!info){
        return(
            <div className="p-24">
                <div className="font-bold text-5xl">Ops...Somebody Is Lost !!</div>
            </div>
        )
    }
}