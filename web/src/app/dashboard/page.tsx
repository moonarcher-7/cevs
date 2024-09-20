"use client"

import { api } from "@/deps/vars"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Dashboard() {


    const [voting ,setVoting] = useState(0)
    const [candidates, setCandidates] = useState([])

    const user = sessionStorage.getItem("user")
    //@ts-ignore
    const info = JSON.parse(user)


    async function vote(candidate:any, voter:any) {
        const votes = await axios.get(`${api.url}/vote/${voter}/${candidate}`,{
                headers:{
                    "Content-Type": "application/json"
                }
            })
    }

    
    useEffect(()=>{
        async function boot() {
            const users = await axios.get(`${api.url}/status`,{
                headers:{
                    "Content-Type": "application/json"
                }
            })

            console.log(users);

            if(users.data.voting == 1){
                const data = await axios.get(`${api.url}/candidates`,{
                    headers:{
                        "Content-Type": "application/json"
                    }
                })

                setCandidates(data.data)

            }

            setVoting(users.data)
            
        }

        boot()
    }, [])

    if(info?.role == 'admin'){
        return(
            <div className="p-24">
                <div className="font-bold text-5xl">Overview</div>
            </div>
        )
    }

    if(info?.role == 'voter'){
        return(
            <div className="p-24">
                <div className="font-bold text-5xl">Active Elections</div>

                {voting?.voting == 0 ? 'NOT ACTIVE' : "ON GOING"}

                <div className="space-y-4">
                {
                    candidates.map(candidate=>(
                        <div className="bg-base-200  flex p-4">
                            <div className="flex-1">{candidate.username}</div><div><button onClick={()=>vote(candidate.id, info.id)} className="btn  btn-xs btn-primary">Vote</button></div>
                        </div>
                    ))
                }
                </div>
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