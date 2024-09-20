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
    const [users, setUsers] = useState([])
    //@ts-ignore
    const info = JSON.parse(user)

    async function addUser() {
        const res = await axios.post(`${api.url}/users/`, 
            {
                username: username,
                email: email,
                password: password,
                mfa: mfa,
                role: role
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
            const users = await axios.get(`${api.url}/users`,{
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
                <div className="font-bold text-5xl">Manage App Users</div>


                <div className="pt-24 flex">
                    <div className="w-1/2 flex flex-col space-y-4">
                    <span className="font-medium text-lg">Add Account</span>
                    <label htmlFor="Account Type">
                        Choose Account Type
                    </label>
                    <select value={role} onChange={e=>setRole(e.target.value)} required className="select select-bordered w-full max-w-xs">
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="voter">Voter</option>
                        <option value="candidate">Candidate</option>
                        <option value="admin">Admin</option>
                    </select>
                    <input  onChange={e=>setUsername(e.target.value)} type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" />
                    <input onChange={e=>setEmail(e.target.value)} type="text" placeholder="email" className="input input-bordered w-full max-w-xs" />
                    <input onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" className="input input-bordered w-full max-w-xs" />
                    <input onChange={e=>setMfa(e.target.value)} type="password" placeholder="Verification Answer" className="input input-bordered w-full max-w-xs" />
                    <button onClick={addUser} className="btn btn-primary w-full max-w-xs">Add User</button>
                    </div>
                    <div className="flex flex-col w-full">
                    <span className="font-medium text-lg ">List Account</span>
                    <table className="table table-stripped">
                        <thead>
                            <th>USERNAME</th>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                            <th>ACTIONS</th>
                        </thead>
                        <tbody>
                            {users.map((rows:any)=>(
                                <tr>
                                    <td>{rows.username}</td>
                                    <td>{rows.email}</td>
                                    <td>{rows.role}</td>
                                    <td><button onClick={()=>deleteUser(rows.id)} className="btn  btn-sm btn-error">delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    </div>
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