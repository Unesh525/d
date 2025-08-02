// pages/setting.js
import Loading from "@/components/Loading";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function Setting(){

    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if no session
    useEffect(() => {
        if (!session && status !== "loading") {
            router.push('/Login');
        }
    }, [session, status, router]);

    // Show loader while loading or redirecting
    if (status === "loading" || (!session && status === "unauthenticated")) {
        return (
            <div className='loadingdata flex flex-col flex-center wh_100'>
                <Loading />
            </div>
        );
    }

    async function logout(){
        await router.push('/login');
        await signOut();
    }

    return (
        <>
            <div className="settingpage">
                <div className="titledashboard flex flex-sb">
                    <div>
                        <h2>Blogs <span>Dashboard</span></h2>
                        <h3>ADMIN PANEL</h3>
                    </div>
                    <div className="breadcrumb">
                        <IoSettingsOutline /> <span>/</span> <span>Dashboard</span>
                    </div>
                </div>

                <div className="profilesettings">
                    <div className="leftprofile_details flex">
                        {/* <img /> */}
                        <div className="w-100">
                            <div className="flex flex-sb flex-left mt-2">
                                <h2>My Profile:</h2>
                                <h3>FinBees <br/> gmail@gmail.com </h3>
                            </div>
                            <div className="flex flex-sb mt-2">
                                <input type="text" defaultValue="+91 9660837005" />
                            </div>
                            <div className="mt-2">
                                <input type="email" defaultValue="your@gmail.com" />
                            </div>
                            <div className="flex flex-center w-100 mt-2">
                                <button>Save</button>
                            </div>
                        </div>
                    </div>
                    <div className="rightlogoutsec">
                        <div className="topaccountbox">
                            <h2 className="flex flex-sb">My Account <MdOutlineAccountCircle/></h2>
                            <br/>
                            <div className="flex flex-sb mt-1">
                                <h3>Active Account <br/><span>Email</span></h3>
                                <button>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}