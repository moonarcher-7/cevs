"use client"

export default function Dashboard() {

    const user = sessionStorage.getItem("user")
    //@ts-ignore
    const info = JSON.parse(user)

    if(info?.role == 'admin'){
        return(
            <div className="p-24">
                <div className="font-bold text-5xl">Overview</div>
            </div>
        )
    }

    if(info?.role == 'voters'){
        return(
            <div className="p-24">
                <div className="font-bold text-5xl">Active Elections</div>
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