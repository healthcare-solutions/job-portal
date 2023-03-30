import Map from "../../../Map";
import Select from "react-select";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState } from "react";

const submitJobPost = async (
  jobTitle,
  jobDesc,
  //email,
  //username,
  //specialism,
  jobType,
  salary,
  career,
  exp,
  //gender,
  //industy,
  //qualification,
  //deadline,
  country,
  city,
  address
) => {
    if (jobTitle && jobDesc && jobType && career && exp && country && city) {
        try {
            // const res = await auth.createUserWithEmailAndPassword(email, password);
            // const user = res.user;
/*
            console.log(
              jobTitle,
              jobDesc,
              //email,
              //username,
              //specialism,
              jobType,
              salary,
              career,
              exp,
              //gender,
              //industy,
              //qualification,
              //deadline,
              country,
              city,
              address
            );
 */
        const db = getFirestore();

        await addDoc(collection(db, "jobs"), {
          jobTitle,
          jobDesc,
          //email,
          //username,
          //specialism,
          jobType,
          salary,
          career,
          exp,
          //gender,
          //industy,
          //qualification,
          //deadline,
          country,
          city,
          address,
        });

        alert("Job Posted successfully...");
      } catch (err) {
        alert(err.message);
        // console.warn(err);
      }
    } else {
        const isJobTitle  = jobTitle ? '' : '\nJob Title';
        const isJobDesc   = jobDesc  ? '' : '\nJob Description';
        const isJobType   = jobType  ? '' : '\nJob Type';
        const isEdu       = career   ? '' : '\nEducation';
        const isExp       = exp      ? '' : '\nExperience';
        const isCountry   = country  ? '' : '\nCountry';
        const isCity      = city     ? '' : '\nCity';
        alert("please fill all the mentioned required fields." + isJobTitle + isJobDesc + isJobType + isEdu + isExp + isCountry + isCity);
    }
};

const PostBoxForm = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  //const [email, setEmail] = useState("");
  //const [username, setUsername] = useState("");
  //const [specialism, setSpecialism] = useState([]);
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [career, setCareer] = useState("");
  const [exp, setExp] = useState("");
  //const [gender, setGender] = useState("");
  //const [industy, setIndustry] = useState("");
  //const [qualification, setQualification] = useState("");
  //const [deadline, setDeadline] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

/*
  const specialisms = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Managemnet", label: "Managemnet" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
    { value: "Engineer", label: "Engineer" },
  ];
 */

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title <span className="required">(required)</span></label>
          <input
            type="text"
            name="immense-jobTitle"
            value={jobTitle}
            required
            onChange={(e) => {
              setJobTitle(e.target.value);
              console.log(jobTitle);
            }}
            placeholder="Job Title"
          />
        </div>
        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description <span className="required">(required)</span></label>
          <textarea
            value={jobDesc}
            onChange={(e) => {
              setJobDesc(e.target.value);
            }}
            placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"
          ></textarea>
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
          <select
            className="chosen-single form-select"
            value={jobType}
            required
            onChange={(e) => {
              setJobType(e.target.value);
            }}
          >
            <option></option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Both</option>
            <option>Per Diem</option>
          </select>
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="immense-salary"
            value={salary}
            placeholder="$100,000.00"
            onChange={(e) => {
              setSalary(e.target.value);
            }}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Education<span className="required"> (required)</span></label>
          <select
            className="chosen-single form-select"
            value={career}
            required
            onChange={(e) => {
              setCareer(e.target.value);
            }}
          >
            <option></option>
            <option>Certificate</option>
            <option>High School</option>
            <option>Associate Degree</option>
            <option>Bachelor's Degree</option>
            <option>Master's Degree</option>
          </select>
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience<span className="required"> (required)</span></label>
          <select
            className="chosen-single form-select"
            value={exp}
            required
            onChange={(e) => {
              setExp(e.target.value);
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
        {/* <!-- Input --> */}
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
            <option>Chaina</option>
            <option>Japan</option>
            <option>India</option>
          </select>
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="immense-address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            placeholder="Address"
          />
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
              submitJobPost(
                jobTitle,
                jobDesc,
                //email,
                //username,
                //specialism,
                jobType,
                salary,
                career,
                exp,
                //gender,
                //industy,
                //qualification,
                //deadline,
                country,
                city,
                address
              );
            }}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostBoxForm;
