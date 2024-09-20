import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const user = sessionStorage.getItem('user')
  const router = useRouter()
  //@ts-ignore
  const info = JSON.parse(user)

  function loggout() {
    sessionStorage.removeItem('user')
    router.push("/")
    router.refresh()
  }

  if(user){
    console.log(user);
  }
    return (
        <div className=" navbar flex  bg-base-100">
        <div className=" pr-24 flex ">
          <Link href={"/"} className="btn btn-ghost text-xl">CES-VOTING SYSTEM</Link>          
        </div>
        <div className="flex-1">
          {info?.role == 'voter' ? 
                    <ul className="flex space-x-8">
                    <li className="font-medium text-lg"><Link href={"/dashboard"}>Dashboard</Link></li>
                    <li className="font-medium text-lg"><Link href={"/history"}></Link></li>
                  </ul>:
                  <></>  
        }

{info?.role == 'admin' ? 
                    <ul className="flex space-x-8">
                    <li className="font-medium text-lg"><Link href={"/dashboard"}>Dashboard</Link></li>
                    <li className="font-medium text-lg"><Link href={"/users"}>Users</Link></li>
                    <li className="font-medium text-lg"><Link href={"/elections"}>Elections</Link></li>
                    <li className="font-medium text-lg"><Link href={"/history"}>logs</Link></li>
                  </ul>:
                  <></>  
        }
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {user ? <li className="mouse:ponter font-bold text-lg"><button onClick={loggout} className="">{info.username}({info.role})-logout</button></li> : <li><Link href={"/login"}>Login</Link></li>}
          </ul>
        </div>
</div>
    )
}