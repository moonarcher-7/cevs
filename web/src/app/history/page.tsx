"use client"

export default function Dashboard() {
    const user = sessionStorage.getItem("user")
    //@ts-ignore
    const info = JSON.parse(user)
    if(info.role == 'voter'){
        return(
            <div className="p-24">
                <div className="font-bold text-5xl">My Voting History</div>
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