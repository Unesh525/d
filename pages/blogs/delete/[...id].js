// blogs>delete>[...id].js
import Blog from "@/components/Blog";
import Loading from "@/components/Loading";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";

export default function DeleteBlog() {

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
    const { id } = router.query;
    const [productInfo, setProductInfo] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        } else {
            axios.get('/api/blogapi?id=' + id).then(response => {
                setProductInfo(response.data)
            })
        }
    }, [id]);

    // function go back
    function goback() {
        router.push('/');
    }

    async function deleteoneblog() {
        await axios.delete('/api/blogapi?id=' + id);
        goback();
    }

    if (session) {

        return (
            <>
                <Head>
                    <title>Delete Blog</title>
                </Head>
                <div className="blogpage">
                    <div className="titledashboard flex flex-sb">
                        <div>
                            <h2>Delete <span>{productInfo?.title}</span></h2>
                            <h3>Admin Panel</h3>
                        </div>
                        <div className="breadcrumb">
                            <BsPostcard /> <span>/</span><span>Delete Blogs</span>
                        </div>
                    </div>

                    <div className="deletesec flex flex-center wh_100">
                        <div className="deletecard">
                            <svg
                                viewBox="0 0 24 24"
                                fill="red"
                                height="6em"
                                width="6em"
                            >
                                <path d="M4 19V7h12v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2ZM6 9v10h8V9H6m7.5-5H17v2H3V4h3.5l1 1h5l1-1Zm5.5 1H19v-2h2v2h-2m0-4V7h2V6h-2Z" />
                            </svg>
                            <p className="cookieHeading">Are You Sure?</p>
                            <p>If you were delete this blog content it will permanent delete</p>

                            <div className="buttonContainer">
                                <button onClick={deleteoneblog} className="acceptButton">Delete</button>
                                <button onClick={goback} className="declineButton">Cancel</button>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }

}