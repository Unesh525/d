// components/Header.js
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { GoScreenFull } from "react-icons/go";
import { BiExitFullscreen } from "react-icons/bi";
import { useState } from "react";
import { useSession } from "next-auth/react";


export default function Header() {
    
    const { data: session, status } = useSession()

const [isfullscreen , setIsfullscreen ] = useState(false);

const togglefullscreen = () => {
    if (!document.fullscreenElement){
        document.documentElement.requestFullscreen().then(()=>{
            setIsfullscreen(true);
        })
    }
    else{
        if(document.exitFullscreen){
            document.exitFullscreen().then(()=>{
                setIsfullscreen(false);
            })
        }
    }
}

  return (
    <>
        <header className="header flex flex-sb">
            <div className="logo flex gap-2">
                <h1>Admin</h1>
                <div className="headerham flex flex-center">
                    <RiBarChartHorizontalLine/>
                </div>
            </div> 

            <div className="rightnav flex gap-2">
                <div onClick={togglefullscreen}>
                    {isfullscreen ? <GoScreenFull/> : <BiExitFullscreen/>}
                    
                </div>
                <div className="notification">
                    <img src="/img/notification.png" alt="notification" />
                </div>
                <div className="profilenav">
                    {session ? <img width={50} height={50} src={session.user.image} alt="user" />:<img src="/img/user.png" alt="user" /> }
                    
                </div>

            </div>
        </header>
    </>

  );
  
}