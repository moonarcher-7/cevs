"use client"

import { api } from "@/deps/vars"
import axios from "axios"
import { useEffect, useState } from "react"


export default function Home() {
  const [voting ,setVoting] = useState(0)
    const [candidates, setCandidates] = useState([])

    const user = sessionStorage.getItem("user")
    //@ts-ignore
    const info = JSON.parse(user)

    
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
  
  return (
    <>
   <div className="h-full flex flex-col justify-center items-center">
    <div className="text-lg font-medium">
      LIVE VOTES
    </div>
    <div className="stats shadow">
      {candidates.map(candidate=>(
          <div className="stat">
          <div className="stat-figure text-secondary">
          </div>
          <div className="stat-title">{candidate.username}</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">votes</div>
        </div>
      ))}

</div>
   </div>
    
    </>
  );
}
