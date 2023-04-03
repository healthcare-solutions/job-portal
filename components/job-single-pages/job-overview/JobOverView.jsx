const JobOverView = ({ company }) => {
  return (
    <div className="widget-content">
      <ul className="job-overview">
        <li>
          <i className="icon icon-calendar"></i>
          <h5>Date Posted:</h5>
          <span>Posted 1 hours ago</span>
        </li>
{/*
        <li>
          <i className="icon icon-expiry"></i>
          <h5>Expiration date:</h5>
          <span>{company.deadline}</span>
        </li>
 */}
        {company?.address ?
            <li>
              <i className="icon icon-location"></i>
              <h5>Location:</h5>
              <span>
                {company?.address}
              </span>
            </li>
            : '' }

        { company?.jobTitle ?
            <li>
              <i className="icon icon-user-2"></i>
              <h5>Job Title:</h5>
              <span>{company?.jobTitle}</span>
            </li>
            : '' }
        { company?.salary ?
            <li>
              <i className="icon icon-rate"></i>
              <h5>Salary:</h5>
              <span>${company?.salary} {company?.salaryRate}</span>
            </li>
            : '' }
        { company?.jobType ?
            <li>
              <i className="icon icon-clock"></i>
              <h5>Job Type:</h5>
              <span>{company?.jobType}</span>
            </li>
            : '' }
        { company?.exp ?
            <li>
              <i className="icon icon-experience"></i>
              <h5>Experience:</h5>
              <span>{company?.exp}</span>
            </li>
            : '' }
        { company?.career ?
            <li>
              <i className="icon icon-education"></i>
              <h5>Education:</h5>
              <span>{company?.career}</span>
            </li>
            : '' }
{/*
        <li>
          <i className="icon icon-clock"></i>
          <h5>Rate:</h5>
          <span>50hr / week</span>
        </li>
 */}
      </ul>
    </div>
  );
};

export default JobOverView;
