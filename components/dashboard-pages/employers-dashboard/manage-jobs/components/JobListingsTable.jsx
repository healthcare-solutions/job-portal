import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../common/form/firebase";
// import jobs from "../../../../../data/job-featured.js";
import { supabase } from "../../../../../config/supabaseClient";
import { toast, ToastContainer } from "react-toastify";

const JobListingsTable = () => {
  const [jobs, setjobs] = useState([]);
  const user = useSelector(state => state.candidate.user)
  const router = useRouter();

  // const fetchPost = async () => {
  //   const userJoblistQuery  = query(collection(db, "jobs"), where("user", "==", user.id))
  //   await getDocs(userJoblistQuery).then((querySnapshot) => {
  //     const newData = querySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     setjobs(newData);
  //   });
  // };

  const dateFormat = (val) => {
    const date = new Date(val)
    return date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric'}) + ', ' + date.getFullYear()
  }

  const publishJob = async (jobId, status) => {
    if (!status) {
      const { data, error } = await supabase
          .from('jobs')
          .update({ status: true })
          .eq('job_id', jobId)

      // open toast
      toast.success('Job successfully published!', {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // fetching all posts to refresh the data in Job Listing Table
      fetchPost();
    } else {
      // open toast
      toast.error('Job is already published!', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  const unpublishJob = async (jobId, status) => {
    if (status) {
      const { data, error } = await supabase
          .from('jobs')
          .update({ status: false })
          .eq('job_id', jobId)

      // open toast
      toast.success('Job successfully unpublished!', {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // fetching all posts to refresh the data in Job Listing Table
      fetchPost();
    } else {
      // open toast
      toast.error('Job is already unpublished!', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  const fetchPost = async () => {
    let { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at',  { ascending: false });

      jobs.forEach( job => job.created_at = dateFormat(job.created_at))
      setjobs(jobs)
  }
  

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Job Listings</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
{/*
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
 */}
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      {jobs.length == 0 ? <p><center>No jobs posted yet!</center></p>: 
        <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applications</th>
                <th>Created On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.slice(0, 10).map((item) => (
                <tr key={item.job_id}>
                  <td>
                    {/* <!-- Job Block --> */}
                    <div className="job-block">
                      <div className="inner-box">
                        <div>
                          {/* <span className="company-logo">
                            <img src={item.logo} alt="logo" />
                          </span> */}
                          <h4>
                            <Link href={`/employers-dashboard/edit-job/${item.job_id}`}>
                              {item.job_title}
                            </Link>
                          </h4>
                            <ul className="job-info">
                              { item?.job_type ?
                                  <li>
                                    <span className="icon flaticon-clock-3"></span>
                                    {item?.job_type}
                                  </li>
                                  : '' }
                              { item?.job_address ?
                                  <li>
                                    <span className="icon flaticon-map-locator"></span>
                                    {item?.job_address}
                                  </li>
                                  : '' }
                              {/* location info */}
                              { item?.salary ?
                                  <li>
                                    <span className="icon flaticon-money"></span>{" "}
                                   ${item?.salary} {item?.salary_rate}
                                  </li>
                                  : '' }
                              {/* salary info */}
                            </ul>
                            {/* End .job-info */}

                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applied">
                    {/* <Link href="/employers-dashboard/all-applicants/${item.job_id}">3+ Applied</Link> */}
                    <a onClick={()=>{
                      router.push(`/employers-dashboard/all-applicants-view/${item.job_id}`)
                    }}>
                      3+ Applied
                    </a>
                  </td>
                  <td>
                  {item?.created_at}
                  </td>
                  { item?.status ?
                    <td className="status">Active</td>
                    : <td className="status" style={{ color: 'red' }}>Inactive</td> }
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <li onClick={()=>{
                          router.push(`/job/${item.job_id}`)
                        }}>
                          <button data-text="Preview Job">
                            <span className="la la-file-alt"></span>
                          </button>
                        </li>
                        <li onClick={()=>{ publishJob(item.job_id, item.status) }} >
                          <button data-text="Publish Job">
                            <span className="la la-eye"></span>
                          </button>
                        </li>
                        <li onClick={()=>{ unpublishJob(item.job_id, item.status) }}>
                          <button data-text="Unpublish Job" disabled>
                            <span className="la la-trash"></span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      }
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
