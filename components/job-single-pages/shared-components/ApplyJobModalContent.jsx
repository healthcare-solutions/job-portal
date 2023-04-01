import Link from "next/link";
import { useState } from "react";
import { db, storage } from "../../common/form/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
// import { v4 } from "uuid";
const ApplyJobModalContent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const user = useSelector(state => state.candidate.user)
  const userId = user.id
  const router = useRouter()
  const postId = router.query.id;
  function handleFileInputChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedFile) {
      const fileRef = ref(storage, selectedFile.name);
      uploadBytes(fileRef, selectedFile)
        .then(() => {
          alert(`File ${selectedFile.name} uploaded successfully.`);
          // TODO: add code to save file metadata to the database
          getDownloadURL(fileRef)
            .then((downloadURL) => {
              const metadata = {
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                userId: userId,
                postId: postId,
                downloadURL: downloadURL,
                createdAt: new Date(),
              };
              addDoc(collection(db, "files"), metadata)
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
                `Failed to get download URL for file ${selectedFile.name}: ${error}`
              );
            });
        })
        .catch((error) => {
          console.error(`Failed to upload file ${selectedFile.name}: ${error}`);
        });
    } else {
      console.warn("No file selected.");
    }
  }

  return (
    <form className="default-form job-apply-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="uploading-outer apply-cv-outer">
            <div className="uploadButton">
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
                {selectedFile && <p>Selected file: {selectedFile.name}</p>}
              </label>
            </div>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <textarea
            className="darma"
            name="message"
            placeholder="Message"
            required
          ></textarea>
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

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button
            className="theme-btn btn-style-one w-100"
            type="submit"
            name="submit-form"
          >
            Apply Job
          </button>
        </div>
        {/* End .col */}
      </div>
    </form>
  );
};

export default ApplyJobModalContent;
