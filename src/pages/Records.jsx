import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ModalRecord from "../components/ModalRecord";
import ModalUpdateRecord from "../components/ModalUpdateRecord";

const Records = () => {
    const [open, setOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const [user_data, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true); // ✅ start TRUE
    const [Modalloading, setModalLoading] = useState(true); // ✅ start TRUE
    const [ModalEditloading, setModalEditLoading] = useState(true); // ✅ start TRUE
    const [totalPages, setTotalPages] = useState(1);


    
    const API_URL = "http://localhost:8005/wp-json/custom/v1/users-search";

    
    useEffect(() => {
        setLoading(true); // ✅ loading before fetch
        const delay = setTimeout(() => {
        fetch(`${API_URL}?search=${search}&page=${page}&per_page=20`)
            .then(res => res.json())
            .then(res => {
            setUsers(res.data);
            setTotalPages(res.pagination.pages);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
        }, 1); // ✅ debounce

        return () => clearTimeout(delay);
    }, [search, page]);

    
// Load user list


  // Click user → fetch full data
  const handleUserClick = async (id) => {
    setOpen(true);
    setModalLoading(true);
    setSelectedUser(null);

    try {
      const res = await fetch(
        `http://localhost:8005/wp-json/custom/v1/user/${id}`
      );
      const data = await res.json();

      setSelectedUser(data);
        // console.log(data);

    } catch (err) {
      console.error(err);
    }
    setModalLoading(false);
  };

// Update User Data
const UpdateUserClick = async (id) => {
    setEditOpen(true);
    setModalEditLoading(true);
    setSelectedUser(null);

    try {
      const res = await fetch(
        `http://localhost:8005/wp-json/custom/v1/user/${id}`
      );
      const data = await res.json();

      setSelectedUser(data);
        // console.log(data);

    } catch (err) {
      console.error(err);
    }
    setModalEditLoading(false);
};




    return <>
        <h1>Records</h1>    
        
        <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // ✅ reset page
            }}
        />

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                
            
                { loading ? (
                    // ✅ SHOW LOADING INSIDE TABLE
                    <tr>
                    <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                        Loading users...
                    </td>
                    </tr>
                ) : user_data.length === 0 ? (
                    // ✅ NO DATA STATE
                    <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                        No users found
                    </td>
                    </tr>
                ) : (
                    // ✅ NORMAL DATA
                    user_data.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><button onClick={() => handleUserClick(user.id)}>View</button>
 | <button key={user.id} onClick={() => UpdateUserClick(user.id)}>Edit</button></td>
                    </tr>
                    ))
                )}

            </tbody>
        </table>

        
    {/* PAGINATION */}
        <div style={{ marginTop: "20px" }}>
            <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            >
            Prev
            </button>

            <span style={{ margin: "0 10px" }}>
            Page {page} of {totalPages}
            </span>

            <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            >
            Next
            </button>
        </div>
        
        <ModalRecord isOpen={open} userdata={selectedUser} Modalloading={Modalloading} onClose={() => {setOpen(false); setSelectedUser(null);}}>
        <h2>User Details</h2>
        <p>This is your popup content</p>
        </ModalRecord>

        <ModalUpdateRecord isOpen={openEdit} userdata={selectedUser} ModalEditloading={ModalEditloading} setUsers={setUsers} onClose={() => {setEditOpen(false); setSelectedUser(null);}}>
        <h2>User Details</h2>
        <p>This is your popup content</p>
        </ModalUpdateRecord>

    </>
}

export default Records;