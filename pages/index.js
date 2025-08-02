// pages/index.js
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineController, plugins} from'chart.js'
import { Bar } from "react-chartjs-2";

export default function Home() {

  
  const { data: session } = useSession()
  
  const router = useRouter();
  
  // checking if there is not active session
  useEffect(() => {
    // if no session
    if (!session) {
      router.push('/Login')
    }
  }, [session, router])
  
  ChartJS.register(CategoryScale, LineController, LinearScale, BarElement, Title, Tooltip, Legend)
  
  // use this to render error
  const [blogdata, setBlogdata] = useState([]);

  // define options within the component scope

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blog Created Monthly by year'
      }
    }
  }

  useEffect(()=>{
    // fetch data from api
    const fetchData = async () => {
      try{
        const response = await fetch('/api/blogapi');
        const data = await response.json();
        setBlogdata(data);
      }
      catch(error) {
          console.error("Error Fetching data",error);
      }
    }

    fetchData();
  },[])


  // Aggregate data by year and month
  const monthlydata = blogdata?.filter(dat => dat.status === 'published').reduce((acc, blog)=>{
    const year = new Date(blog.createdAt).getFullYear(); // geting the year
    const month = new Date(blog.createdAt).getMonth(); // geting the Month
    acc[year] = acc[year] || Array(12).fill(0); // initialize array for the year if not existing

    acc[year][month]++; // increment count for the month
    return acc;
  },{})

  const currentYear = new Date().getFullYear(); // get the current year
  const years = Object.keys(monthlydata || {});
  const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const datasets = years.map(year => ({
    label: `${year}`,
    data: monthlydata[year] || Array(12).fill(0), // if no data for month then default will be 0
    backgroundColor: `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, 0.5)`
  }))

  const data = {
  labels,
  datasets
};

  if (session) {

    return (
      <>
        <Head>
          <title>Admin Dashboard</title>
          <meta name="description" content="Admin Dashboard by next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="dashboard">
          {/* title dashboard */}
          <div className="titledashboard flex flex-sb">
            <div>
              <h2>Blogs <span>Dashboard</span></h2>
              <h3>Admin Panel</h3>
            </div>
            <div className="breadcrumb">
              <IoHome /> <span>/</span><span>Dashboard</span>
            </div>
          </div>

          {/* dashboard for cards */}
          <div className="topfourcards flex flex-sb">
            <div className="four_card">
              <h2>Total Blogs</h2>
              <span>{blogdata?.filter(ab => ab.status === 'published')?.length || 0}</span>

            </div>

            <div className="four_card">
              <h2>Total Topics</h2>
              <span>10</span>
            </div>

            <div className="four_card">
              <h2>Total Tags</h2>
              <span>10</span>
            </div>

            <div className="four_card">
              <h2>Total  Drafts</h2>
              <span>{blogdata?.filter(ab => ab.status === 'draft')?.length || 0}</span>
            </div>
          </div>

          {/* year overview */}
          <div className="year_oveerview flex flex-sb">
            <div className="leftyearoverview">
              <div className="flex flex-sb">
                <h3>Year overview</h3>
                <ul className="creative-dots">
                  <li className="big-dots"></li>
                  <li className="semi-big-dots"></li>
                  <li className="medium-dots"></li>
                  <li className="semi-medium-dots"></li>
                  <li className="semi-small-dots"></li>
                  <li className="small-dots"></li>
                </ul>
                <h3 className="text-center">10 / 365 <br /> <span>Total Published</span> </h3>

              </div>
                
                <Bar data={data} options={options} />
              {/* chart coming soon */}
              <div className="right_salescont">
                <div>
                  <h3>Year overview</h3>
                  <ul className="creative-dots">
                    <li className="big-dots"></li>
                    <li className="semi-big-dots"></li>
                    <li className="medium-dots"></li>
                    <li className="semi-medium-dots"></li>
                    <li className="semi-small-dots"></li>
                    <li className="small-dots"></li>
                  </ul>
                </div>
                <div className="blogscategory flex flex-center">
                  <table>
                    <thead>
                      <tr>
                        <td>Topics</td>
                        <td>Data</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>HTML , CSS ,JS</td>
                         <td>10</td>
                      </tr>

                      <tr>
                        <td>HTML , CSS ,JS</td>
                        <td>10</td>
                      </tr>

                      <tr>
                        <td>HTML , CSS ,JS</td>
                        <td>10</td>
                      </tr>

                      <tr>
                        <td>HTML , CSS ,JS</td>
                        <td>10</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

}
