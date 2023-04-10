import Link from "next/link";
import { useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../common/form/firebase";

const ApplyInstantView = ({ company }) => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [licenseNumberError, setLicenseNumberError] = useState("");
  const [guestSelectedFile, setGuestSelectedFile] = useState(null);

  const router = useRouter();
  const postId = router.query.id;
  function handleFileInputChange(event) {
    setGuestSelectedFile(event.target.files[0]);
  }

  const validateForm = () => {
    let isValid = true;
    if (!firstName) {
      setFirstNameError("Please enter your first name");
      isValid = false;
    }
    if (!lastName) {
      setLastNameError("Please enter your last name");
      isValid = false;
    }
    if (!email) {
      setEmailError("Please enter your email address");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    if (!licenseNumber) {
      setLicenseNumberError("Please enter your License Number");
      isValid = false;
    }
    return isValid;
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
        if (guestSelectedFile) {
          const fileRef = ref(storage, guestSelectedFile.name);
          uploadBytes(fileRef, guestSelectedFile)
            .then(() => {
              alert(`File ${guestSelectedFile.name} uploaded successfully.`);
              // TODO: add code to save file metadata to the database
              getDownloadURL(fileRef)
                .then((downloadURL) => {
                  const metadata = {
                    documentName: guestSelectedFile.name,
                    documentSize: guestSelectedFile.size,
                    documentType: guestSelectedFile.type,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    licenseNumber: licenseNumber,
                    postId: postId,
                    downloadURL: downloadURL,
                    createdAt: new Date(),
                  };
                  addDoc(collection(db, "applications"), metadata)
                    .then(() => {
                      console.log("File metadata saved to the database.");
                    })
                    .catch((error) => {
                      console.error(
                        "Failed to save file metadata to the database:",
                        error
                      );
                    });
                })
                .catch((error) => {
                  console.error(
                    `Failed to get download URL for file ${guestSelectedFile.name}: ${error}`
                  );
                });
            })
            .catch((error) => {
              console.error(`Failed to upload file ${guestSelectedFile.name}: ${error}`);
            });
        } else {
          console.warn("No file selected.");
        }
    }
  }

  return (
    <div className="widget-content">
      <form className="default-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name<span className="required"> (required)</span></label>
          <input
            type="text"
            name="immense-career-first_name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameError("");
            }}
            required
          />
          {firstNameError && <div className="required">{firstNameError}</div>}
        </div>
        <div className="form-group">
          <label>Last Name<span className="required"> (required)</span></label>
          <input
            type="text"
            name="immense-career-last_name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameError("");
            }}
            required
          />
          {lastNameError && <div className="required">{lastNameError}</div>}
        </div>
        <div className="form-group">
          <label>Email Address<span className="required"> (required)</span></label>
          <input
            type="email"
            name="immense-career-email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            placeholder="Enter your email"
            required
          />
          {emailError && <div className="required">{emailError}</div>}
        </div>
        {/* name */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <label>License Number<span className="required"> (required)</span></label>
          <input
            type="text"
            name="immense-career-license_number"
            value={licenseNumber}
            onChange={(e) => {
              setLicenseNumber(e.target.value);
              setLicenseNumberError("");
            }}
            placeholder="enter your license number to verify your eligibilty"
          />
          {licenseNumberError && <div className="required">{licenseNumberError}</div>}
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="uploading-outer apply-cv-outer">
            <div>
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="image/*, application/pdf"
                id="upload"
                required
                onChange={handleFileInputChange}
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                Upload CV (doc, docx, pdf)
                {guestSelectedFile && <p>Selected file: {guestSelectedFile.name}</p>}
                {!guestSelectedFile && <label className="required">Please select a file before Apply</label>}
              </label>
            </div>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="input-group checkboxes square">
            <input type="checkbox" name="remember-me" id="rememberMe" />
            <label htmlFor="rememberMe" className="remember">
              <span className="custom-checkbox"></span> You accept our{" "}
              <span data-bs-dismiss="modal">
                <Link href="/terms">
                  Terms and Conditions and Privacy Policy
                </Link>
              </span>
            </label>
          </div>
        </div>
        {/* End .col */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            onClick={handleSubmit}
          >
            Apply as a Guest
          </button>
        </div>
        {/* login */}
      </form>
    </div>
  );
};

export default ApplyInstantView;
