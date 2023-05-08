import Map from "../../../Map";
import Select from "react-select";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../../../config/supabaseClient";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const apiKey = process.env.NEXT_PUBLIC_JOB_PORTAL_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';

const clonedJobFields = {
    clonedJobTitle: "",
    clonedJobDesc: "",
    clonedJobType: "",
    clonedSalary: "",
    clonedSalaryRate: "",
    clonedCareer: "",
    clonedExp: "",
    clonedAddress: "",
    clonedCompleteAddress: ""
}

// load google map api js
function loadAsyncScript(src) {
    return new Promise(resolve => {
        const script = document.createElement("Script");
        Object.assign(script, {
            type: "text/javascript",
            async: true,
            src
        })
        script.addEventListener("load", () => resolve(script));
        document.head.appendChild(script);
    })
}

const submitJobPost = async (
  { clonedJobTitle, clonedJobDesc, clonedJobType, clonedSalary, clonedSalaryRate, clonedCareer, clonedExp, clonedAddress, clonedCompleteAddress },
  setClonedJobData,
  user,
  fetchedJobData
) => {
    if (clonedJobTitle || clonedJobDesc || clonedJobType || clonedSalary || clonedSalaryRate || clonedCareer || clonedExp || clonedAddress) {
        try {

            const { data, error } = await supabase
            .from('jobs')
            .update(
                { job_title: clonedJobTitle ? clonedJobTitle : fetchedJobData.job_title,
                 job_desc: clonedJobDesc ? clonedJobDesc : fetchedJobData.job_desc,
                 job_type: clonedJobType ? clonedJobType : fetchedJobData.job_type,
                 experience: clonedExp ? clonedExp : fetchedJobData.experience,
                 education: clonedCareer ? clonedCareer : fetchedJobData.education,
                 salary: clonedSalary ? clonedSalary : fetchedJobData.salary,
                 salary_rate: clonedSalaryRate ? clonedSalaryRate : fetchedJobData.salary_rate,
                 job_address: clonedAddress ? clonedAddress : fetchedJobData.job_address,
                 job_comp_add: clonedCompleteAddress ? clonedCompleteAddress : fetchedJobData.job_comp_add,
                 change_dttm: new Date(),
                 update_ver_nbr: fetchedJobData.update_ver_nbr + 1
                }
                )
            .eq('job_id', fetchedJobData.job_id)
            // .select() -- this will return the updated record in object

            // reset all the edit form fields
            setClonedJobData(JSON.parse(JSON.stringify(clonedJobFields)))

            // open toast
            toast.success('Job Cloned and Posted successfully', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // redirect to original page where user came from
            setTimeout(() => {
                Router.push("/employers-dashboard/manage-jobs")
            }, 3000)
      } catch (err) {
        // open toast
        toast.error('Error while saving your changes, Please try again later or contact tech support', {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        // console.warn(err);
      }
    } else {
        // open toast
        toast.error('You do not have any changes to save', {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
};

const CloneJobView = ({ fetchedJobData }) => {
  console.log(fetchedJobData);
  const user = useSelector(state => state.candidate.user)
  const [clonedJobData, setClonedJobData] = useState(JSON.parse(JSON.stringify(clonedJobFields)));
  const { clonedJobTitle, clonedJobDesc, clonedJobType, clonedSalary, clonedSalaryRate, clonedCareer, clonedExp, clonedAddress, clonedCompleteAddress } = useMemo(() => editedJobData, [editedJobData])

  const router = useRouter();
  const JobId = router.query.id;

  const searchInput = useRef(null);

  // init google map script
  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
        return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }

  // do something on address change
  const onChangeAddress = (autocomplete) => {
    const location = autocomplete.getPlace();
    setClonedJobData((previousState) => ({ 
      ...previousState,
      clonedAddress: searchInput.current.value
  }))
  }

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current, {
        types: ['(cities)']
      }
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete))

  }

  // load map script after mounted
  useEffect(() => {
    initMapScript().then(() => initAutocomplete())
  }, []);

  useEffect(() => {
    searchInput.current.value = fetchedJobData.job_address
  }, [fetchedJobData.job_address]);

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title <span className="required">(required)</span></label>
          { !clonedJobTitle ? 
            <input
                type="text"
                name="immense-career-jobTitle"
                value={fetchedJobData.job_title}
                required
                onChange={(e) => {
                setClonedJobData((previousState) => ({ 
                    ...previousState,
                    clonedJobTitle: e.target.value
                }))
                }}
                placeholder="Job Title"
            />
            : <input
                    type="text"
                    name="immense-career-jobTitle"
                    value={clonedJobTitle}
                    required
                    onChange={(e) => {
                    setClonedJobData((previousState) => ({ 
                        ...previousState,
                        clonedJobTitle: e.target.value
                    }))
                    }}
                    placeholder="Job Title"
                />
          }
        </div>
        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description <span className="required">(required)</span></label>
          
          { !clonedJobDesc ?
            <SunEditor 
            setContents={fetchedJobData.job_desc}
            setOptions={{
            buttonList: [
              ["fontSize", "formatBlock"],
              ["bold", "underline", "italic", "strike", "subscript", "superscript"],
              ["align", "horizontalRule", "list", "table"],
              ["fontColor", "hiliteColor"],
              ["outdent", "indent"],
              ["undo", "redo"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["link"],
              ["preview", "print"],
              ["fullScreen", "showBlocks", "codeView"],
            ],
          }}
          setDefaultStyle="color:black;"
          onChange={(e) => {
            setClonedJobData((previousState) => ({ 
              ...previousState,
              clonedJobDesc: e
            }))
          }}
          />
            : 
            <SunEditor 
            setOptions={{
            buttonList: [
              ["fontSize", "formatBlock"],
              ["bold", "underline", "italic", "strike", "subscript", "superscript"],
              ["align", "horizontalRule", "list", "table"],
              ["fontColor", "hiliteColor"],
              ["outdent", "indent"],
              ["undo", "redo"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["link"],
              ["preview", "print"],
              ["fullScreen", "showBlocks", "codeView"],
            ],
          }}
          setDefaultStyle="color:black;"
          onChange={(e) => {
            setClonedJobData((previousState) => ({ 
              ...previousState,
              clonedJobDesc: e
            }))
          }}
          />
          }   
        </div>
        {/* <!-- Input --> */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Email Address <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="name"
            placeholder="example@test.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
 */}
        {/* <!-- Input --> */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Username</label>
          <input
            type="text"
            name="name"
            placeholder=""
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
 */}
        {/* <!-- Search Select --> */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Specialisms </label>
          <Select
            defaultValue={[specialisms[2]]}
            isMulti
            name="colors"
            options={specialisms}
            className="basic-multi-select"
            classNamePrefix="select"
            value={specialism}
            onChange={(e) => {
              // const updatedOptions = [...e.target.options]
              //   .filter((option) => option.selected)
              //   .map((x) => x.value);
              // console.log("updatedOptions", updatedOptions);
              // setSpecialism(updatedOptions);
              setSpecialism(e || []);
            }}
          />
        </div>
 */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type <span className="required"> (required)</span></label>
          { !clonedJobType ? 
            <select
                className="chosen-single form-select"
                value={fetchedJobData.job_type}
                required
                onChange={(e) => {
                setClonedJobData((previousState) => ({ 
                    ...previousState,
                    clonedJobType: e.target.value
                }))
                }}
            >
            <option></option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Both</option>
            <option>Per Diem</option>
          </select>
          : <select
                className="chosen-single form-select"
                value={clonedJobType}
                required
                onChange={(e) => {
                setClonedJobData((previousState) => ({ 
                    ...previousState,
                    clonedJobType: e.target.value
                }))
                }}
            >
            <option></option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Both</option>
            <option>Per Diem</option>
            </select>
          }
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience<span className="required"> (required)</span></label>
          { !clonedExp ? 
            <select
                className="chosen-single form-select"
                value={fetchedJobData.experience}
                required
                onChange={(e) => {
                setClonedJobData((previousState) => ({ 
                    ...previousState,
                    clonedExp: e.target.value
                }))
                }}
            >
                <option></option>
                <option>1 year</option>
                <option>2 years</option>
                <option>3 years</option>
                <option>4 years</option>
                <option>5 years</option>
                <option>6 years</option>
                <option>7 years</option>
                <option>8 years</option>
                <option>9 years</option>
                <option>10+ years</option>
            </select>
            : <select
                    className="chosen-single form-select"
                    value={clonedExp}
                    required
                    onChange={(e) => {
                    setClonedJobData((previousState) => ({ 
                        ...previousState,
                        clonedExp: e.target.value
                    }))
                    }}
                >
                    <option></option>
                    <option>1 year</option>
                    <option>2 years</option>
                    <option>3 years</option>
                    <option>4 years</option>
                    <option>5 years</option>
                    <option>6 years</option>
                    <option>7 years</option>
                    <option>8 years</option>
                    <option>9 years</option>
                    <option>10+ years</option>
                </select>
          }
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="immense-career-salary"
            value={fetchedJobData.salary}
            placeholder="$100,000.00"
            onChange={(e) => {
              setClonedJobData((previousState) => ({ 
                ...previousState,
                clonedSalary: e.target.value
              }))
            }}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Salary Rate <span className="optional">(optional)</span></label>
          { !clonedSalaryRate ?
            <select
                className="chosen-single form-select"
                value={fetchedJobData.salary_rate}
                onChange={(e) => {
                setClonedJobData((previousState) => ({ 
                    ...previousState,
                    clonedSalaryRate: e.target.value
                }))
                }}
            >
                <option></option>
                <option>Per hour</option>
                <option>Per diem</option>
                <option>Per month</option>
                <option>Per year</option>
            </select>
            : <select
                    className="chosen-single form-select"
                    value={clonedSalaryRate}
                    onChange={(e) => {
                    setClonedJobData((previousState) => ({ 
                        ...previousState,
                        clonedSalaryRate: e.target.value
                    }))
                    }}
                >
                    <option></option>
                    <option>Per hour</option>
                    <option>Per diem</option>
                    <option>Per month</option>
                    <option>Per year</option>
                </select>
          }
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Education<span className="required"> (required)</span></label>
          { !clonedCareer ?
            <select
                className="chosen-single form-select"
                value={fetchedJobData.education}
                required
                onChange={(e) => {
                setClonedJobData((previousState) => ({ 
                    ...previousState,
                    clonedCareer: e.target.value
                }))
                }}
            >
                <option></option>
                <option>Certificate</option>
                <option>High School</option>
                <option>Associate Degree</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
            </select>
            : <select
                    className="chosen-single form-select"
                    value={clonedCareer}
                    required
                    onChange={(e) => {
                    setClonedJobData((previousState) => ({ 
                        ...previousState,
                        clonedCareer: e.target.value
                    }))
                    }}
                >
                    <option></option>
                    <option>Certificate</option>
                    <option>High School</option>
                    <option>Associate Degree</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                </select>
          }
        </div>
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select
            className="chosen-single form-select"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
 */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Industry</label>
          <select
            className="chosen-single form-select"
            value={industy}
            onChange={(e) => {
              setIndustry(e.target.value);
            }}
          >
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>
 */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>Qualification</label>
          <select
            className="chosen-single form-select"
            value={qualification}
            onChange={(e) => {
              setQualification(e.target.value);
            }}
          >
            <option>Select</option>
            <option>Banking</option>
            <option>Digital & Creative</option>
            <option>Retail</option>
            <option>Human Resources</option>
            <option>Management</option>
          </select>
        </div>
 */}
        {/* <!-- Input --> */}
{/*
        <div className="form-group col-lg-12 col-md-12">
          <label>Application Deadline Date</label>
          <input
            type="text"
            name="name"
            placeholder="06.04.2020"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
            }}
          />
        </div>
 */}
{/*
        <div className="form-group col-lg-6 col-md-12">
          <label>City <span className="required">(required)</span></label>
          <input
            type="text"
            name="immense-city"
            required
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            placeholder="City"
          />
        </div>
         */}
{/* <!-- Input --> */}{/*

        <div className="form-group col-lg-6 col-md-12">
          <label>Country <span className="required">(required)</span></label>
          <select
            className="chosen-single form-select"
            value={country}
            required
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          >
            <option></option>
            <option>Australia</option>
            <option>Pakistan</option>
            <option>USA</option>
            <option>Japan</option>
            <option>India</option>
          </select>
        </div>
 */}

        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address <span className="optional">(optional)</span></label>
          { !clonedCompleteAddress ?
            <input
                type="text"
                name="immense-career-address"
                value={fetchedJobData.job_comp_add}
                onChange={(e) => {
                setClonedJobData((previousState) => ({ 
                    ...previousState,
                    clonedCompleteAddress: e.target.value
                }))
                }}
                placeholder="Address"
            />
            : <input
                    type="text"
                    name="immense-career-address"
                    value={clonedCompleteAddress}
                    onChange={(e) => {
                    setClonedJobData((previousState) => ({ 
                        ...previousState,
                        clonedCompleteAddress: e.target.value
                    }))
                    }}
                    placeholder="Address"
                />
          }
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>City, State <span className="required">(required)</span></label>
          { !clonedAddress ?
            <input
                type="text"
                name="immense-career-address"
                ref={searchInput}
                placeholder="City, State"
            />
            : <input
                type="text"
                name="immense-career-address"
                ref={searchInput}                    
                placeholder="City, State"
              />
          }
        </div>
        
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Find On Map</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
          />
        </div> */}
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Latitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div> */}
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Longitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div> */}
        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-three">Search Location</button>
        </div>
        <div className="form-group col-lg-12 col-md-12">
          <div className="map-outer">
            <div style={{ height: "420px", width: "100%" }}>
              <Map />
            </div>
          </div>
        </div> */}
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button
            className="theme-btn btn-style-one"
            onClick={(e) => {
              e.preventDefault();
              submitJobPost(clonedJobData, setClonedJobData, user, fetchedJobData);
            }}
          >
            Post
          </button>
          <button
            className="theme-btn btn-style-one"
            onClick={()=>{
                router.push(`/employers-dashboard/manage-jobs`)
              }}
            style={{marginLeft: "10px"}}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default CloneJobView;
