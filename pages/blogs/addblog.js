// bolg/addblog.js
import Blog from "@/components/Blog";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

export default function addblog() {

    const { data: session, status } = useSession();
    const router = useRouter();

    // checking if there is not active session
    useEffect(() => {
        // if no session
        if (!session) {
            router.push('/Login')
        }
    }, [session, router])

    if (status === "loading") {
        // here we can create any loader for UI
        return <>
            <div className='loadingdata flex flex-col flex-center wh_100'>
                <Loading />
            </div>
        </>
    }

    if (session) {
        return (
            <>
                <div className="addblogspage">
                    <div>
                        <h2>Add <span>Blog</span></h2>
                        <h3>Admin Panel</h3>
                    </div>
                    <div className="breadcrumb">
                        <MdOutlineAddPhotoAlternate/> <span>Add Blog</span>
                    </div>

                    <div className="blogsadd">
                        <Blog/>
                    </div>
                </div>
            </>
        )
    }


}
