// pages/blogs/index.js
import Loading from "@/components/Loading";
import DataLoading from "@/components/DataLoading";
import useFetchData from "@/hooks/useFetchData";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function Blogs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 4;

    const { data: session, status } = useSession();
    const router = useRouter();
    const { alldata, loading } = useFetchData('/api/blogapi');


    useEffect(() => {
        if (!session && status !== "loading") {
            router.push('/Login');
        }
    }, [session, status, router]);

    if (status === "loading" || loading || (!session && status === "unauthenticated")) {
        return (
            <div className='loadingdata flex flex-col flex-center wh_100'>
                <Loading />
            </div>
        );
    }

    // Filter published blogs and apply search
    const publishedBlogs = alldata
        .filter(blog => blog.status?.toLowerCase() === 'published')
        .filter(blog => blog.title?.toLowerCase().includes(searchQuery.toLowerCase()));

    const indexOfLastBlog = currentPage * perPage;
    const indexOfFirstBlog = indexOfLastBlog - perPage;
    const currentBlogs = publishedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(publishedBlogs.length / perPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="blogpage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>All Published <span>Blogs</span></h2>
                    <h3>Admin Panel</h3>
                </div>
                <div className="breadcrumb">
                    <BsPostcard /> <span>/</span><span>Blogs</span>
                </div>
            </div>

            <div className="blogstable">
                <div className="flex gap-2 mb-1">
                    <h2>Search Blogs:</h2>
                    <input
                        type="text"
                        placeholder="search by title..."
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />
                </div>

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
                                <td colSpan={4} className="text-center">No Published Blogs</td>
                            </tr>
                        ) : (
                            currentBlogs.map((blog, index) => (
                                <tr key={blog._id}>
                                    <td>{indexOfFirstBlog + index + 1}</td>
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

                {publishedBlogs.length > 0 && (
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
