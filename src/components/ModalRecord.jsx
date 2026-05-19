
import React from "react";

function ModalRecord({ isOpen, onClose, userdata, Modalloading }) {
  
  console.log(userdata);
  if (!isOpen) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div className="modalbody" style={modal} onClick={(e) => e.stopPropagation()}>
        
        <h4>Information</h4>
        {Modalloading ? ( 
          <p>Please wait . . . .</p>
        ) : userdata ? (
          <>
            <p><strong>User ID:</strong> {userdata.meta.custom_id}</p>
            <p><strong>Type of Registrant: </strong> 
            {userdata.meta.ofw_type == 0 ? "OFW" : "Relative of OFW" }</p>
            <p><strong>Full Name:</strong> {userdata.name}</p>
            <p><strong>Email Address:</strong> {userdata.email}</p>
            <p><strong>Date of Birth:</strong> {userdata.meta.date_birth}</p>
            <p><strong>Home Town:</strong> {userdata.meta.hometown}</p>
            <p><strong>Address:</strong> {userdata.meta.address}</p>
            <p><strong>Civil Status:</strong> {userdata.meta.civil_status}</p>
            <p><strong>Gender:</strong> {userdata.meta.gender}</p>
            <p><strong>Mobile Number:</strong> {userdata.meta.mobile}</p>
            <p><strong>Landline Number:</strong> {userdata.meta.landline}</p>
            <p><strong>Passport 123</strong> 
            
                {userdata?.passport ? (
                  userdata.passport.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.passport}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.passport}
                      alt="passport"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No passport uploaded</p>
                )}

            </p>
          </>
        ) : (
          <p>No Data</p>
        )}

        

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// styles
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "900px",
};

export default ModalRecord;
