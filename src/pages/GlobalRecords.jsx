import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardTitle from "../components/DashboardTitle";
import GlobalRecordModal from "../components/GlobalRecordModal";
import { fetchApi } from "../store/api";

const PAGE_SIZE = 20;

const getNestedValue = (source, path) =>
path.split(".").reduce((value, key) => (value == null ? value : value[key]), source);

const pickFirstValue = (record, candidates) => {
const sources = [record, record?.data, record?.meta, record?.summary, record?.record];

for (const source of sources) {
  if (!source) {
    continue;
  }

  for (const candidate of candidates) {
    const value =
      candidate.includes(".") || candidate.includes("[") ? getNestedValue(source, candidate) : source?.[candidate];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
}

return "";
};

const getRecordId = (record) =>
pickFirstValue(record, [
  "record_id",
  "recordId",
  "recordID",
  "custom_id",
  "customId",
  "user_id",
  "userId",
  "userID",
  "wp_user_id",
  "wpUserId",
  "wpUserID",
  "id",
  "ID",
  "summary.record_id",
  "summary.recordId",
  "summary.id",
  "meta.custom_id",
  "meta.record_id",
  "meta.recordId",
  "data.record_id",
  "data.recordId",
]);

const getFullName = (record) =>
pickFirstValue(record, ["display_name", "full_name", "name"]) ||
[pickFirstValue(record, ["first_name", "firstname"]), pickFirstValue(record, ["last_name", "lastname"])]
  .filter(Boolean)
  .join(" ");

const getEmailAddress = (record) =>
pickFirstValue(record, ["user_email", "email_address", "emailaddress", "email", "ofw_emailaddress"]);

const getDateOfBirth = (record) => pickFirstValue(record, ["date_birth", "date_of_birth", "birth_date"]);

const getLocation = (record) => pickFirstValue(record, ["location", "address", "hometown"]);

const getStatus = (record) =>
pickFirstValue(record, ["status", "admin_verified"]) || "N/A";

const getRegistrantType = (record) =>
pickFirstValue(record, ["registrant_type", "type_registrant"]);

const getOfwType = (record) => pickFirstValue(record, ["ofw_type"]);

const getRegisteredDate = (record) =>
pickFirstValue(record, ["user_registered", "registered_date", "created_at"]);

const GlobalRecords = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const [records, setRecords] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    fetchApi(
      `/wp-json/custom/v1/global-records?search=${encodeURIComponent(searchQuery)}&page=${page}&per_page=${PAGE_SIZE}`
    )
      .then(async (response) => {
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "Unable to load global records.");
        }

        if (!isMounted) {
          return;
        }

        setRecords(Array.isArray(payload?.data) ? payload.data : []);
        setTotalPages(payload?.pagination?.pages || 1);
        setTotalRecords(payload?.pagination?.total || 0);
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return;
        }

        setRecords([]);
        setTotalPages(1);
        setTotalRecords(0);
        setError(fetchError.message || "Unable to load global records.");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, searchQuery]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handleViewRecord = async (recordId) => {
    setIsViewOpen(true);
    setViewLoading(true);
    setSelectedRecord(null);

    try {
      const response = await fetchApi(`/wp-json/custom/v1/global-records/${recordId}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to load record details.");
      }

      setSelectedRecord(payload?.data ?? payload);
    } catch (viewError) {
      setSelectedRecord({
        summary: { id: recordId },
        record: { error: viewError.message || "Unable to load record details." },
      });
    }

    setViewLoading(false);
  };


  return (
    <>
      <div className="p-[40px]">
        <DashboardTitle />

        <GlobalRecordModal
          isOpen={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
            setSelectedRecord(null);
          }}
          recordData={selectedRecord}
          loading={viewLoading}
        />

        <div className="mt-10 rounded-lg border border-table-line bg-layer">
          <div className="border-b border-table-line px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <form className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={handleSearchSubmit}>
                <div className="relative flex-1">
                  <label htmlFor="global-records-search" className="sr-only">
                    Search global records
                  </label>
                  <input
                    id="global-records-search"
                    type="text"
                    className="block w-full rounded-lg border-layer-line bg-layer px-3 py-2 text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus"
                    placeholder="Search by ID, name, email, mobile, or location"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-[#ff902b] px-4 py-2 font-medium text-white">
                    Search
                  </button>
                  <button type="button" className="rounded-lg border border-table-line px-4 py-2 font-medium text-foreground" onClick={handleClearSearch}>
                    Clear
                  </button>
                </div>
              </form>

              <div className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground">
                <strong>Total Records:</strong> {totalRecords.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-table-line">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">ID</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">Full Name</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">Email Address</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">Date of Birth</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">Location</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">Status</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">Registrant Type</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">OFW Type</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-muted-foreground-1">Registered Date</th>
                  {/* <th className="px-6 py-3 text-end text-xs font-medium uppercase text-muted-foreground-1">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-table-line">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-sm text-foreground">
                      Loading global records...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-sm text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-sm text-foreground">
                      No global records found.
                    </td>
                  </tr>
                ) : (
                  
                  records.map((record) => (
                    
                    <tr key={`${getRecordId(record)}-${record.user_email}`}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{getRecordId(record) || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{getFullName(record) || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{getEmailAddress(record) || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{getDateOfBirth(record) || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{getLocation(record) || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{getStatus(record)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{getRegistrantType(record) || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{getOfwType(record) || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{getRegisteredDate(record) || "N/A"}</td>
                      {/* <td className="whitespace-nowrap px-6 py-4 text-end text-sm font-medium">
                        <button
                          type="button"
                          className="inline-flex items-center gap-x-2 rounded-lg text-sm font-semibold text-foreground focus:outline-hidden"
                          onClick={() => handleViewRecord(getRecordId(record))}
                        >
                          View
                        </button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-table-line px-4 py-4">
            <div className="text-sm text-muted-foreground-1">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-table-line px-4 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1 || loading}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded-lg border border-table-line px-4 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page >= totalPages || loading}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalRecords;
