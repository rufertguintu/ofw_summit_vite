import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ModalRecord from "../components/ModalRecord";
import ModalUpdateRecord from "../components/ModalUpdateRecord";
import { fetchApi } from "../store/api";

const getPageItems = (page, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const items = new Set([1, total, page - 1, page, page + 1]);
    const sorted = [...items].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((n, i) => {
        if (i > 0 && n - sorted[i - 1] > 1) result.push("...");
        result.push(n);
    });
    return result;
};

const Records = () => {
    const [open, setOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const [user_data, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [ofwFilter, setOfwFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true); // ✅ start TRUE
    const [Modalloading, setModalLoading] = useState(true); // ✅ start TRUE
    const [ModalEditloading, setModalEditLoading] = useState(true); // ✅ start TRUE
    const [totalPages, setTotalPages] = useState(1);
    const [menu, setMenu] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!menu) return;
        const close = () => setMenu(null);
        window.addEventListener("click", close);
        window.addEventListener("scroll", close, true);
        return () => {
            window.removeEventListener("click", close);
            window.removeEventListener("scroll", close, true);
        };
    }, [menu]);

    // useEffect(() => {
    //     setLoading(true); // ✅ loading before fetch
    //     const delay = setTimeout(() => {
    //         fetchApi(`/wp-json/custom/v1/users-search?search=${search}&page=${page}&per_page=10`)
    //             .then(res => res.json())
    //             .then(res => {
    //                 setUsers(res.data);
    //                 setTotalPages(res.pagination.pages);
    //             })
    //             .catch(err => console.error(err))
    //             .finally(() => setLoading(false));
    //     }, 0); // ✅ debounce

    //     return () => clearTimeout(delay);
    // }, [search, page]);

    useEffect(() => {
        setLoading(true);

        const params = new URLSearchParams({ search, page, per_page: 10 });
        if (typeFilter !== "") params.set("type_registrant", typeFilter);
        if (ofwFilter !== "") params.set("ofw_type", ofwFilter);
        if (statusFilter !== "") params.set("admin_verified", statusFilter);

        fetchApi(`/wp-json/custom/v1/users-search?${params.toString()}`)
            .then(res => res.json())
            .then(res => {
                setUsers(res.data);
                setTotalPages(res.pagination.pages);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [search, page, typeFilter, ofwFilter, statusFilter]);


    // Load user list


    // Click user → fetch full data
    const handleUserClick = async (id) => {
        setOpen(true);
        setModalLoading(true);
        setSelectedUser(null);

        try {
            const res = await fetchApi(`/wp-json/custom/v1/user/${id}`);
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
            const res = await fetchApi(`/wp-json/custom/v1/user/${id}`);
            const data = await res.json();

            setSelectedUser(data);
            // console.log(data);

        } catch (err) {
            console.error(err);
        }
        setModalEditLoading(false);
    };




    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    return <>

        {menu && (
            <div
                className="fixed z-50 w-44 py-2 bg-white border border-gray-200 rounded-lg shadow-lg text-left"
                style={{ top: menu.top, right: menu.right }}
                onClick={(e) => e.stopPropagation()}
            >
                <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to={`/records/${menu.id}/view-profile`} target="_blank">View</Link>
                <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => { const id = menu.id; setMenu(null); UpdateUserClick(id); }}
                >
                    Edit
                </button>
            </div>
        )}

        {toast && (
            <div
                role="alert"
                className={`fixed bottom-6 right-6 z-[1000] px-5 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
            >
                {toast.message}
            </div>
        )}

        <ModalRecord isOpen={open} userdata={selectedUser} Modalloading={Modalloading} setUsers={setUsers} onClose={() => { setOpen(false); setSelectedUser(null); }}>
            <h2>User Details</h2>
            <p>This is your popup content</p>
        </ModalRecord>

        <ModalUpdateRecord isOpen={openEdit} userdata={selectedUser} ModalEditloading={ModalEditloading} setUsers={setUsers} onSuccess={showToast} onClose={() => { setEditOpen(false); setSelectedUser(null); }}>
            <h2>User Details</h2>
            <p>This is your popup content</p>
        </ModalUpdateRecord>


    <div className="admin-divider border p-3 rounded-[10px]">
        <h3 className="px-10">Records</h3>

        <div className="min-w-full px-10">
            <div className="border-table-line rounded-lg overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb">
                <div className="py-3 border-table-line">
                
                <div className="flex flex-wrap items-center gap-3">
                <div className="relative max-w-xs">
                    <label for="hs-table-search" className="sr-only">Search</label>
                    <input type="text" name="hs-table-search" id="hs-table-search" className="py-1.5 sm:py-2 px-3 ps-9 block w-full bg-layer border-layer-line shadow-2xs rounded-lg sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:z-10 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none" placeholder="Search by ID, name or email" value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // ✅ reset page
                }}/>
                    {/* <div className="absolute inset-y-0 inset-s-0 flex items-center pointer-events-none ps-3">
                    <svg className="size-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div> */}
                </div>

                {[
                    [typeFilter, setTypeFilter, "All Registrant Types", [["0", "Online Registrant"], ["1", "Mall Registrant"], ["2", "Onsite Registrant"], ["3", "Networker"], ["4", "OWWA Member"]]],
                    [ofwFilter, setOfwFilter, "All OFW Types", [["0", "OFW"], ["1", "Relative of OFW"]]],
                    [statusFilter, setStatusFilter, "All Statuses", [["0", "Incomplete"], ["1", "Rejected"], ["2", "Verified"], ["3", "Returned"], ["4", "Validating"]]],
                ].map(([value, setter, label, options]) => (
                    <select
                        key={label}
                        aria-label={label}
                        className="py-1.5 sm:py-2 px-3 block bg-layer border border-layer-line shadow-2xs rounded-lg sm:text-sm text-foreground"
                        style={{ minWidth: "250px" }}
                        value={value}
                        onChange={(e) => { setter(e.target.value); setPage(1); }}
                    >
                        <option value="">{label}</option>
                        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
                    </select>
                ))}
                </div>
                </div>

                <table className="min-w-full divide-y divide-table-line">
                    <thead className="bg-muted" style={{ backgroundColor: "#F8F9FB" }}>
                        <tr>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">ID</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">Full Name</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">Email Address</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">Type of Registrant</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">OFW Type</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">Status</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">Registered Date</th>
                        <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-muted-foreground-1 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="records-style divide-y divide-table-line">

                        {loading ? (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.type_registrant == 0 ? "Online Registrant" : user.type_registrant == 1 ? "Mall Registrant" : user.type_registrant == 2 ? "Onsite Registrant" : user.type_registrant == 3 ? "Networker" : "OWWA Member"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.ofw_type == 0 ? "OFW" : user.ofw_type == 1 ? "Relative of OFW" : "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        <span className={user.admin_verified == 2 ? "verified" : user.admin_verified == 1 ? "rejected" : user.admin_verified == 0 ? "incomplete" : user.admin_verified == 3 ? "returned" : user.admin_verified == 4 ? "validating" : "n/a"}>{user.admin_verified == 0 ? "Incomplete" : user.admin_verified == 1 ? "Rejected" : user.admin_verified == 2 ? "Verified" : user.admin_verified == 3 ? "Returned" : user.admin_verified == 4 ? "Validating" : "N/A"}</span>
                                        </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.user_registered}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                         <button
                                            type="button"
                                            className="inline-flex items-center gap-x-1 px-2 py-1 text-sm font-medium rounded border border-gray-300 bg-gray-200 hover:bg-gray-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (menu?.id === user.id) { setMenu(null); return; }
                                                const r = e.currentTarget.getBoundingClientRect();
                                                setMenu({ id: user.id, top: r.bottom + 4, right: window.innerWidth - r.right });
                                            }}
                                         >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                                            Action
                                         </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                
            </div>
            {/* PAGINATION */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous page"
                        className="size-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        &lsaquo;
                    </button>

                    {getPageItems(page, totalPages).map((item, i) =>
                        item === "..." ? (
                            <span key={`gap-${i}`} className="px-1 text-gray-500">...</span>
                        ) : (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setPage(item)}
                                className={`size-8 rounded-full text-sm ${item === page ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                                {item}
                            </button>
                        )
                    )}

                    <button
                        type="button"
                        aria-label="Next page"
                        className="size-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        &rsaquo;
                    </button>

                    <label className="ms-4 flex items-center gap-2 text-sm text-gray-600">
                        Go to
                        <select
                            aria-label="Go to page"
                            className="mx-1 py-1 px-4 bg-gray-100 border border-layer-line rounded-lg text-sm text-foreground"
                            value={page}
                            onChange={(e) => setPage(Number(e.target.value))}
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                </div>
            
        </div>
    </div>
    </>
}

export default Records;