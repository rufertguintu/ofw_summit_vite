
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
                    ofw_type: String(userdata.meta?.ofw_type ?? "")
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
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        
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
            <p><strong>Home Town:</strong> {userdata.meta.hometown}</p>
            <p><strong>Address:</strong> {userdata.meta.address}</p>
            <p><strong>Civil Status:</strong> {userdata.meta.civil_status}</p>
            <p><strong>Gender:</strong> {userdata.meta.gender}</p>
            <p><strong>Mobile Number:</strong> {userdata.meta.mobile}</p>
            <p><strong>Landline Number:</strong> {userdata.meta.landline}</p>
            <p><strong>Passport:</strong> <img src={userdata.passport} alt="" width="250px"/> <br />
                <input
                type="file"
                name="passport"
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
