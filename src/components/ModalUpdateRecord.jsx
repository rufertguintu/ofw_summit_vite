
import React, { useEffect, useState } from "react";

function ModalUpdateRecord({ isOpen, onClose, userdata, ModalEditloading, setUsers }) {
  
//   console.log(userdata);
  
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        meta: {
            date_birth: "",
            ofw_type: ""
        },
        passport: "",
    });

    
    // ✅ Fill form when user loads
    useEffect(() => {
        if (userdata) {
        setFormData({
            name: userdata?.name || "",
            email: userdata?.email || "",
            meta: {
                    date_birth: userdata.meta?.date_birth || "",
                    ofw_type: String(userdata.meta?.ofw_type ?? ""),
                    hometown: userdata.meta?.hometown || "",
                    address: userdata.meta?.address || "",
                    civil_status: userdata.meta?.civil_status || "",
                    gender: userdata.meta?.gender || "",
                    mobile: userdata.meta?.mobile || "",
                    landline: userdata.meta?.landline || "",        
            },
            passport: userdata?.passport || "",

        });
        }
    }, [userdata]);

    
    // ✅ Handle input
    const handleChange = (e) => {
        
        const { name, value, dataset } = e.target;

        if (dataset.type === "meta") {
        setFormData({
            ...formData,
            meta: {
            ...formData.meta,
            [name]: value
            }
        });
        } else {
        setFormData({
            ...formData,
            [name]: value
        });
        }

    };

    
    const handleFileChange = (e) => {
        const { name, files } = e.target;

        setFormData({
            ...formData,
            [name]: files[0] // ✅ store file object
        });
    };


    
    // ✅ Submit update
    const handleSubmit = async () => {


        try {
            const res =await fetch(
                `http://localhost:8005/wp-json/custom/v1/user/${userdata.id}`,
                {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    meta: formData.meta
                    })
                }
            );

            
            if (formData.passport) {

                const fileData = new FormData();
                fileData.append("passport", formData.passport);
                fileData.append("user_id", userdata.id);

                await fetch(
                "http://localhost:8005/wp-json/custom/v1/upload-files",
                {
                    method: "POST",
                    body: fileData
                }
                );
            }


            
            if (res.ok) {
                // ✅ Update UI instantly
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                    u.id === userdata.id
                        ? 
                        {
                            ...u,
                            name: formData.name,
                            email: formData.email,
                            meta: {
                            ...u.meta,
                            ...formData.meta
                            }
                        }

                        : u
                    )
                );

                alert("Updated successfully!");
            }

        
        } catch (error) {
            console.error(error);
        }



    };




  if (!isOpen) return null;

  return (
    <div style={overlay} className="z-999" onClick={onClose}>
      <div className="modalbody !max-w-[1500px]" style={modal} onClick={(e) => e.stopPropagation()}>
        
        <h4>Update Information</h4>
        {ModalEditloading ? ( 
          <p>Please wait . . . .</p>
        ) : userdata ? (
          <>
            <p><strong>User ID:</strong> {userdata.meta.custom_id}</p>
            <p><strong>Type of Registrant: </strong> 
            
                <select
                name="ofw_type"
                value={formData.meta.ofw_type}
                onChange={handleChange}
                >
                    <option value="0">OFW</option>
                    <option value="1">Relative of OFW</option>
                </select>
            </p>

            <p><strong>Full Name:</strong> 
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                class="form-control"
            />
            </p>
            <p><strong>Email Address:</strong> 
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                class="form-control"
            />
            </p>
            <p><strong>Date of Birth:</strong> 
            <input
                type="text"
                name="date_birth"
                data-type="meta"
                value={formData.meta.date_birth}
                onChange={handleChange}
                placeholder="Date of Birth"
                class="form-control"
            />
            </p>
            <p><strong>Home Town:</strong><input
                type="text"
                name="hometown"
                data-type="meta"
                value={formData.meta.hometown}
                onChange={handleChange}
                placeholder="Home Town"
                class="form-control"
            /></p>
            <p><strong>Address:</strong> {userdata.meta.address} <input
                type="text"
                name="address"
                data-type="meta"
                value={formData.meta.address}
                onChange={handleChange}
                placeholder="Address"
                class="form-control"
            /></p>
            <p><strong>Civil Status:</strong> {userdata.meta.civil_status} <input
                type="text"
                name="civil_status"
                data-type="meta"
                value={formData.meta.civil_status}
                onChange={handleChange}
                placeholder="Civil Status"
                class="form-control"
            /></p>
            <p><strong>Gender:</strong> {userdata.meta.gender} <input
                type="text"
                name="gender"
                data-type="meta"
                value={formData.meta.gender}
                onChange={handleChange}
                placeholder="Gender"
                class="form-control"
            /></p>
            <p><strong>Mobile Number:</strong> {userdata.meta.mobile} <input
                type="text"
                name="mobile"
                data-type="meta"
                value={formData.meta.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                class="form-control"
            /></p>
            <p><strong>Landline Number:</strong> {userdata.meta.landline} <input
                type="text"
                name="landline"
                data-type="meta"
                value={formData.meta.landline}
                onChange={handleChange}
                placeholder="Landline Number"
                class="form-control"
            /></p>
            <p><strong>Passport:</strong> 
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
                <p>No Passport uploaded</p>
            )}
                <br />
                <input
                type="file"
                name="passport"
                onChange={handleFileChange}
                />
            </p>
            <p><strong>Married Certificate:</strong> 
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
                    <p>No Married Certificate uploaded</p>
                )}
                <br />
                <input
                type="file"
                name="married_cert"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>OFW Birth Certificate:</strong> 
                {userdata?.ofw_birth_cert ? (
                    userdata.ofw_birth_cert.toLowerCase().endsWith(".pdf") ? (
                    <embed
                        src={userdata.ofw_birth_cert}
                        width="300px"
                        height="400px"
                        type="application/pdf"
                    />
                    ) : (
                    <img
                        src={userdata.ofw_birth_cert}
                        alt="ofw_birth_cert"
                        width="250px"
                    />
                    )
                ) : (
                    <p>No OFW Birth Certificate uploaded</p>
                )}
                <br />
                <input
                type="file"
                name="ofw_birth_cert"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>Valid ID:</strong> 
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
                <br />
                <input
                type="file"
                name="valid_id"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>Seaman Book:</strong> 
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
                <br />
                <input
                type="file"
                name="seaman_book"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>Employment Contract:</strong> 
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
                <br />
                <input
                type="file"
                name="employment_contract"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>Working Visa:</strong> 
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
                <br />
                <input
                type="file"
                name="visa"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>OWWA POEA:</strong> 
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
                    <p>No Working owwa_poea uploaded</p>
                )}
                <br />
                <input
                type="file"
                name="owwa_poea"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>Remittance:</strong> 
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
                <br />
                <input
                type="file"
                name="remittance"
                onChange={handleFileChange}
                />
            </p>

            <p><strong>Allotment:</strong> 
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
                    <p>No allotment uploaded</p>
                )}
                <br />
                <input
                type="file"
                name="allotment"
                onChange={handleFileChange}
                />
            </p>
          </>
        ) : (
          <p>No Data</p>
        )}

        

        <button onClick={onClose}>Close</button>
        
        <button onClick={handleSubmit}>
            Update
        </button>

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

export default ModalUpdateRecord;
