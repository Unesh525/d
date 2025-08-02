// pages/draft.js
import DataLoading from "@/components/DataLoading";
import Loading from "@/components/Loading";
import useFetchData from "@/hooks/useFetchData";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function Draft() {
    const [currentPage, setCurrentPage] = useState(1);
    // here we can change how many blogs we want on one page
    const perPage = 4;

    const { alldata, loading } = useFetchData('/api/blogapi');
    
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if no session
    useEffect(() => {
        if (!session && status !== "loading") {
            router.push('/Login');
        }
    }, [session, status, router]);

    // Show loader while loading or redirecting
    if (status === "loading" || loading || (!session && status === "unauthenticated")) {
        return (
            <div className='loadingdata flex flex-col flex-center wh_100'>
                <Loading />
            </div>
        );
    }

    // Filter draft blogs
    const draftblogs = alldata.filter(blog => blog.status?.toLowerCase() === 'draft');
    const indexofLastBlog = currentPage * perPage;
    const indexofFirstBlog = indexofLastBlog - perPage;
    const currentBlogs = draftblogs.slice(indexofFirstBlog, indexofLastBlog);
    const totalPages = Math.ceil(draftblogs.length / perPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Pagination handler
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="blogpage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>All Draft <span>Blogs</span></h2>
                    <h3>Admin Panel</h3>
                </div>
                <div className="breadcrumb">
                    <BsPostcard /> <span>/</span><span>Draft Blogs</span>
                </div>
            </div>

            <div className="blogstable">
                <table className="table table-styling">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Edit / Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4}><DataLoading /></td>
                            </tr>
                        ) : currentBlogs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center">No Draft Blogs</td>
                            </tr>
                        ) : (
                            currentBlogs.map((blog, index) => (
                                <tr key={blog._id}>
                                    <td>{indexofFirstBlog + index + 1}</td>
                                    <td><h3>{blog.title}</h3></td>
                                    <td><pre>{blog.slug}</pre></td>
                                    <td>
                                        <div className="flex gap-2 flex-center">
                                            <Link href={`/blogs/edit/${blog._id}`}>
                                                <button title="edit"><FaEdit /></button>
                                            </Link>
                                            <Link href={`/blogs/delete/${blog._id}`}>
                                            <button title="delete"><RiDeleteBin6Fill /></button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {draftblogs.length === 0 ? (
                    ''
                ) : (
                    <div className="blogpagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        {pageNumbers
                            .slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, pageNumbers.length))
                            .map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`${currentPage === number ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentBlogs.length < perPage}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
