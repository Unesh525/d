// blogs>edit>[...id].js
import Blog from "@/components/Blog";
import Loading from "@/components/Loading";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";

export default function EditBlog() {

    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if no session
    useEffect(() => {
        if (!session && status !== "loading") {
            router.push('/Login');
        }
    }, [session, status, router]);

    // Show loader while loading or redirecting
    if (status === "loading") {
        return (
            <div className='loadingdata flex flex-col flex-center wh_100'>
                <Loading />
            </div>
        );
    }

    // blog edit function
    const {id} = router.query;
    const [productInfo,setProductInfo] = useState(null);

    useEffect(()=>{
        if (!id) {
            return;
        } else {
            axios.get('/api/blogapi?id='+id).then(response=> {
                setProductInfo(response.data)
            })
        }
    },[id])

    if (session) {

        return (
            <>
                <Head>
                    <title>Update Blog</title>
                </Head>
                <div className="blogpage">
                    <div className="titledashboard flex flex-sb">
                        <div>
                            <h2>Edit <span>Blogs</span></h2>
                            <h3>Admin Panel</h3>
                        </div>
                        <div className="breadcrumb">
                            <BsPostcard /> <span>/</span><span>Edit Blogs</span>
                        </div>
                    </div>

                    <div className="mt-3">
                        {
                            productInfo && (
                                <Blog {...productInfo}/>
                            )
                        }
                    </div>
                    
                </div>
            </>
        )
    }

}