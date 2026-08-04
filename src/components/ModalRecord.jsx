
import React from "react";

function ModalRecord({ isOpen, onClose, userdata, Modalloading }) {
  
  console.log(userdata);
  if (!isOpen) return null;

  return (
    <div style={overlay} className="z-999" onClick={onClose}>
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
            <p><strong>Passport</strong> 
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
            <p>
              <strong>Married Certificate</strong>
              {userdata?.married_cert ? (
                  userdata.married_cert.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.married_cert}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.married_cert}
                      alt="married_cert"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Married Cert uploaded</p>
                )}
            </p>

            <p>
              <strong>OFW Birth Certificate</strong>
              {userdata?.ofw_birthcert ? (
                  userdata.ofw_birthcert.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.ofw_birthcert}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.ofw_birthcert}
                      alt="ofw_birthcert"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No OFW Birth Certificate uploaded</p>
                )}
            </p>

            <p>
              <strong>Valid ID</strong>
              {userdata?.valid_id ? (
                  userdata.valid_id.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.valid_id}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.valid_id}
                      alt="valid_id"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Valid ID uploaded</p>
                )}
            </p>

            <p>
              <strong>Seaman Book</strong>
              {userdata?.seaman_book ? (
                  userdata.seaman_book.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.seaman_book}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.seaman_book}
                      alt="seaman_book"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Seaman Book uploaded</p>
                )}
            </p>

            <p>
              <strong>Employment Contract</strong>
              {userdata?.employment_contract ? (
                  userdata.employment_contract.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.employment_contract}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.employment_contract}
                      alt="employment_contract"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Employment Contract uploaded</p>
                )}
            </p>

            <p>
              <strong>Birth Certificate</strong>
              {userdata?.birth_cert ? (
                  userdata.birth_cert.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.birth_cert}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.birth_cert}
                      alt="birth_cert"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Birth Certificate uploaded</p>
                )}
            </p>

            <p>
              <strong>Working Visa</strong>
              {userdata?.visa ? (
                  userdata.visa.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.visa}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.visa}
                      alt="visa"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Working Visa uploaded</p>
                )}
            </p>

            <p>
              <strong>OWWA POEA</strong>
              {userdata?.owwa_poea ? (
                  userdata.owwa_poea.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.owwa_poea}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.owwa_poea}
                      alt="owwa_poea"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No OWWA POEA uploaded</p>
                )}
            </p>

            <p>
              <strong>Remittance</strong>
              {userdata?.remittance ? (
                  userdata.remittance.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.remittance}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.remittance}
                      alt="remittance"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Remittance uploaded</p>
                )}
            </p>

            <p>
              <strong>Allotment</strong>
              {userdata?.allotment ? (
                  userdata.allotment.toLowerCase().endsWith(".pdf") ? (
                    <embed
                      src={userdata.allotment}
                      width="300px"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : (
                    <img
                      src={userdata.allotment}
                      alt="allotment"
                      width="250px"
                    />
                  )
                ) : (
                  <p>No Allotment uploaded</p>
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
