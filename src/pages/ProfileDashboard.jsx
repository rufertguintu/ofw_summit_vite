import { Navigate, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewInfo from "../components/ReviewInfo";
import { fetchApi } from "../store/api";

const imgsrc = "/src/assets/";

const SOURCE_OPTIONS = [
  "Friend",
  "Relative / Family",
  "Newspaper or Magazine",
  "Radio",
  "Television",
  "Social Website (Facebook, LinkedIn, etc.)",
  "Website",
  "Manning Agency",
  "Others",
];

const CIVIL_STATUS_OPTIONS = ["Single", "Married", "Widowed"];

const OFW_STATUS_OPTIONS = ["Single", "Married", "Separated", "Widowed", "Divorced"];

const RELATIONSHIP_OPTIONS = ["Parent", "Sibling", "Spouse", "Child"];

const OFW_INCOME_OPTIONS = [
  "1.00 - 25,000.00",
  "25,001.00 - 50,000.00",
  "50,000.01 - 100,000.00",
  "100,001.00 - 125,000.00",
  "125,001.00 - 150,000.00",
  "Above 150,000.00",
];

const REVIEW_MODE_STORAGE_PREFIX = "profile-dashboard.review-mode";
const PASSPORT_ID_REGEX = /^[A-Z][A-Z0-9]{1}[0-9]{6}[A-Z0-9]$/;
const PASSPORT_VALIDATION_URL = "/wp-json/custom/v1/passport-validation";

const getUserReviewModeStorageKey = (userId) => {
  if (!userId) {
    return "";
  }

  return `${REVIEW_MODE_STORAGE_PREFIX}:${userId}`;
};

const getStoredUserId = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null")?.id || "";
  } catch {
    return "";
  }
};

const getInitialReviewMode = () => {
  try {
    const storageKey = getUserReviewModeStorageKey(getStoredUserId());
    return storageKey ? localStorage.getItem(storageKey) === "true" : false;
  } catch {
    return false;
  }
};


const ProfileDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (!token) {
      return <Navigate to="/login" replace />;
  }

  
  const [user, setUser] = useState(null);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRegionLabel, setSelectedRegionLabel] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedProvinceLabel, setSelectedProvinceLabel] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedBarangayLabel, setSelectedBarangayLabel] = useState("");
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [step, setStep] = useState(1);
  const [isReviewMode, setIsReviewMode] = useState(getInitialReviewMode);
  const profileImageUrl = user?.profile_picture_url || `${imgsrc}unknown.jpg`;
  const meta = user?.meta || {};

  const [address, setAddress] = useState("");
  const [attend, setAttend] = useState("");
  const [attendType, setAttendType] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [civil_status, setCivilStatus] = useState("");
  const [mobile, setMobile] = useState("");
  const [source_info, setSourceInfo] = useState("");
  const [gender, setGender] = useState("");
  const [landline, setLandline] = useState("");
  const [passportId, setPassportId] = useState("");
  const [relationship, setRelationship] = useState("");
  const [owwaOfwId, setOwwaOfwId] = useState("");
  const [ofwFirstname , setOfwFirstname] = useState("");
  const [ofwMiddlename , setOfwMiddlename] = useState("");
  const [ofwLastname , setOfwLastname] = useState("");
  const [owwaMember, setOwwaMember] = useState("");
  const [ofw_status, setofw_status] = useState("");
  const [ofwYearService, setOfwYearService] = useState("");
  const [profession, setProfession] = useState("");
  const [ofw_profession, setOfwProfession] = useState("");
  const [ofw_emailaddress, setofw_emailaddress] = useState("");
  const [ofwIncome, setOfwIncome] = useState("");
  const [workCountry, setWorkCountry] = useState("");
  const [passportFile, setPassportFile] = useState(null);
  const [passportValidationState, setPassportValidationState] = useState("idle");
  const [passportValidationMessage, setPassportValidationMessage] = useState("");
  const isOfwTypeOne = Number(meta.ofw_type) !== 1;
  const [selectedSupportingDocs, setSelectedSupportingDocs] = useState({
    select_docs1: false,
    select_docs2: false,
    select_docs3: false,
    select_docs4: false,
    select_docs5: false,
    select_docs6: false,
  });

  const supportingDocMetaMap = {
    select_docs1: "employment_contract",
    select_docs2: "visa",
    select_docs3: "owwa_poea",
    select_docs4: "remittance",
    select_docs5: "allotment",
    select_docs6: "seaman_book",
  };

  const handleSupportingDocToggle = (event) => {
    const { name, checked } = event.target;
    setSelectedSupportingDocs((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  const OFWRelationship_type = String(meta.relationship) === "Spouse";
  const normalizedPassportId = String(passportId || "").trim();
  const savedPassportId = String(meta.passport_id || "").trim();
  const isPassportValidationBlocking = normalizedPassportId === ""
    || passportValidationState === "checking"
    || passportValidationState === "invalid"
    || passportValidationState === "duplicate"
    || passportValidationState === "error";
  const passportValidationClassName = passportValidationMessage
    ? passportValidationState === "valid"
      ? "alert alert-success"
      : passportValidationState === "checking"
        ? "alert alert-info"
        : "alert alert-danger"
    : "";



  const getMetaValue = (key, fallback = "Not provided") => {
    const value = meta[key];
    if (value === undefined || value === null || value === "") {
      return fallback;
    }

    return value;
  };

  const hasDocumentData = (metaKey, sourceMeta = meta) => {
    const rawValue = String(sourceMeta?.[metaKey] || "").trim();
    return rawValue !== "" && rawValue !== "[object File]";
  };

  const isSelectedDocFlagEnabled = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes";
  };

  const isSupportingDocChecked = (checkboxKey) => {
    const metaKey = supportingDocMetaMap[checkboxKey];
    return Boolean(selectedSupportingDocs[checkboxKey]) || hasDocumentData(metaKey);
  };

  const resolveDocumentUrl = (metaKey) => {
    const rawValue = String(meta?.[metaKey] || "").trim();
    if (!rawValue || rawValue === "[object File]") {
      return "";
    }

    if (/^https?:\/\//i.test(rawValue)) {
      return rawValue;
    }

    const profileImageBaseUrl = String(user?.profile_image_base_url || "").trim();
    const folderName = String(user?.name || user?.username || "").trim();

    if (!profileImageBaseUrl || !folderName) {
      return "";
    }

    return `${profileImageBaseUrl}${encodeURIComponent(folderName)}/${encodeURIComponent(rawValue)}`;
  };

  const renderDocumentPreview = (metaKey, label) => {
    const fileUrl = resolveDocumentUrl(metaKey);
    if (!fileUrl) {
      return null;
    }

    const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(fileUrl);

    return (
      <div style={{ marginTop: "8px" }}>
        <a href={fileUrl} target="_blank" rel="noreferrer">
          View uploaded {label}
        </a>
        {isImage ? (
          <div style={{ marginTop: "8px" }}>
            <img
              src={fileUrl}
              alt={`${label} preview`}
              style={{ width: "100%", maxWidth: "220px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
            />
          </div>
        ) : null}
      </div>
    );
  };

  const normalizeLocationValue = (value) => String(value || "").trim().toLowerCase();

  const normalizeTextValue = (value) => String(value || "")
    .toLowerCase()
    .replace(/[(),.]/g, " ")
    .replace(/[\/_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const normalizeSourceValue = (value) => normalizeTextValue(value);

  const sourceAliasMap = {
    social: "Social Website (Facebook, LinkedIn, etc.)",
    "social media": "Social Website (Facebook, LinkedIn, etc.)",
    facebook: "Social Website (Facebook, LinkedIn, etc.)",
    linkedin: "Social Website (Facebook, LinkedIn, etc.)",
    tv: "Television",
    newspaper: "Newspaper or Magazine",
    magazine: "Newspaper or Magazine",
    family: "Relative / Family",
    relative: "Relative / Family",
    manning: "Manning Agency",
  };

  const resolveSourceOption = (value) => {
    const normalizedValue = normalizeSourceValue(value);
    if (!normalizedValue) {
      return "";
    }

    const aliasMatched = sourceAliasMap[normalizedValue];
    if (aliasMatched) {
      return aliasMatched;
    }

    const exactMatched = SOURCE_OPTIONS.find(
      (option) => normalizeSourceValue(option) === normalizedValue
    );

    return exactMatched || "";
  };

  const resolveOption = (value, options, aliasMap = {}) => {
    const normalizedValue = normalizeTextValue(value);
    if (!normalizedValue) {
      return "";
    }

    const aliasMatched = aliasMap[normalizedValue];
    if (aliasMatched) {
      return aliasMatched;
    }

    const exactMatched = options.find(
      (option) => normalizeTextValue(option) === normalizedValue
    );

    return exactMatched || "";
  };

  const civilStatusAliasMap = {
    widow: "Widowed",
    widower: "Widowed",
    unmarried: "Single",
  };

  const ofwStatusAliasMap = {
    separated: "Separated",
    single: "Single",
    married: "Married",
    widow: "Widowed",
    widower: "Widowed",
    divorced: "Divorced",
  };

  const relationshipAliasMap = {
    mother: "Parent",
    father: "Parent",
    parent: "Parent",
    brother: "Sibling",
    sister: "Sibling",
    sibling: "Sibling",
    husband: "Spouse",
    wife: "Spouse",
    spouse: "Spouse",
    son: "Child",
    daughter: "Child",
    child: "Child",
  };

  // const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));

  const normalizeSavedValue = (value) => {
    if (value === undefined || value === null) {
      return "";
    }

    return String(value).trim().toLowerCase();
  };

  const isEquivalentSavedValue = (currentValue, existingValue, fieldKey) => {
    const normalizedCurrent = normalizeSavedValue(currentValue);
    const normalizedExisting = normalizeSavedValue(existingValue);

    if (normalizedCurrent === normalizedExisting) {
      return true;
    }

    const resolvedExistingValue = (() => {
      switch (fieldKey) {
        case "source":
        case "source_info":
          return resolveSourceOption(existingValue);
        case "civil_status":
          return resolveOption(existingValue, CIVIL_STATUS_OPTIONS, civilStatusAliasMap);
        case "relationship":
          return resolveOption(existingValue, RELATIONSHIP_OPTIONS, relationshipAliasMap);
        case "ofw_status":
          return resolveOption(existingValue, OFW_STATUS_OPTIONS, ofwStatusAliasMap);
        case "ofw_income":
          return resolveOption(existingValue, OFW_INCOME_OPTIONS);
        default:
          return existingValue;
      }
    })();

    return normalizeSavedValue(resolvedExistingValue) === normalizedCurrent;
  };

  const shouldSaveField = (fieldKey, currentValue, existingMeta) => {
    const existingValue = existingMeta?.[fieldKey];

    if (existingValue === undefined || existingValue === null || existingValue === "") {
      return normalizeSavedValue(currentValue) !== "";
    }

    if (normalizeSavedValue(currentValue) === "") {
      return true;
    }

    return !isEquivalentSavedValue(currentValue, existingValue, fieldKey);
  };

  const nextStep = async () => {
    if (step === 3) {
      if (normalizedPassportId === "") {
        setPassportValidationState("invalid");
        setPassportValidationMessage("Passport ID is required.");
        return;
      }

      if (isPassportValidationBlocking) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const savedPayload = await saveCurrentStep();

      if (savedPayload === null) {
        alert("Failed to save profile.");
        return;
      }

      setUser((prev) => prev ? { ...prev, meta: { ...prev.meta, ...savedPayload } } : prev);
      setFormValues((prev) => ({ ...prev, ...savedPayload }));

      setStep((prev) => Math.min(prev + 1, 4));
    } finally {
      setIsSubmitting(false);
    }
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleReviewEdit = () => {
    const reviewModeKey = getUserReviewModeStorageKey(user?.id || getStoredUserId());
    if (reviewModeKey) {
      localStorage.removeItem(reviewModeKey);
    }
    setIsReviewMode(false);
    setSubmitMessage("");
    setStep(1);
  };

  const getReviewDisplayValue = (value, fallback = "Not provided") => {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue === "" ? fallback : normalizedValue;
  };

  const reviewSupportingDocs = Object.entries({
    select_docs1: "Employment Contract",
    select_docs2: "Working Visa",
    select_docs3: "OWWA / POEA Registration",
    select_docs4: "Remittance Slip",
    select_docs5: "Allotment Certificate",
    select_docs6: "Seaman's Book",
  }).filter(([key]) => isSupportingDocChecked(key)).map(([, label]) => label);

  const saveCurrentStep = async () => {
    let payload = {};

    switch (step) {
      case 1:
        payload = {
          attend,
          attend_type: attendType,
        };
        break;

      case 2:
        payload = {
          address,
          current_location: currentLocation,
          zipcode,
          civil_status,
          mobile,
          landline,
          source: source_info || resolveSourceOption(meta.source),
          source_info: source_info || resolveSourceOption(meta.source),
          gender,
          region: selectedRegionLabel,
          province: selectedProvinceLabel,
          city: selectedCityLabel,
          barangay: selectedBarangayLabel,
        };
        break;

      case 3:
        payload = {
          profession,
          passport_id: passportId,
          owwa_member: owwaMember,
          owwa_ofw_id: owwaOfwId,
          ofw_firstname: ofwFirstname,
          ofw_middlename: ofwMiddlename,
          ofw_lastname: ofwLastname,
          ofw_status,
          ofw_profession,
          ofw_emailaddress,
          ofw_income: ofwIncome,
          work_country: workCountry,
          relationship,
          ofw_year_service: ofwYearService,
        };
        break;

      default:
        return {};
    }

    const existingMeta = user?.meta || {};
    const filteredPayload = Object.entries(payload).reduce((acc, [key, value]) => {
      if (shouldSaveField(key, value, existingMeta)) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(filteredPayload).length === 0) {
      return {};
    }

    const response = await fetchApi(
      "/wp-json/custom/v1/profile-update",
      {
        method: "POST",
        body: JSON.stringify(filteredPayload),
      }
    );

    if (!response.ok) {
      return null;
    }

    return filteredPayload;
  };

  const registrantTypeLabel = {
    0: "Online Registrant",
    1: "Mall Registrant",
    2: "Onsite Registrant",
    3: "Networker Registrant",
    4: "OWWA Registrant",
  }[meta.type_registrant] || "Not provided";

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const domPayload = Object.fromEntries(formData.entries());

      const payload = {
        ...domPayload,
        attend,
        attend_type: attendType,
        address: address,
        current_location: currentLocation,
        civil_status,
        mobile,
        source: source_info,
        source_info,
        gender: gender,
        landline,
        passport_id: passportId,
        relationship,
        owwa_ofw_id: owwaOfwId,
        ofw_firstname: ofwFirstname,
        ofw_middlename: ofwMiddlename,
        ofw_lastname: ofwLastname,
        owwa_member: owwaMember,
        ofw_status,
        ofw_year_service: ofwYearService,
        profession,
        ofw_profession,
        ofw_emailaddress,
        ofw_income: ofwIncome,
        work_country: workCountry,
        zipcode,
        region: selectedRegionLabel || selectedRegion || domPayload.region || meta.region || "",
        province: selectedProvinceLabel || selectedProvince || domPayload.province || meta.province || "",
        city: selectedCityLabel || selectedCity || domPayload.city || meta.city || "",
        barangay: selectedBarangayLabel || selectedBarangay || domPayload.barangay || meta.barangay || "",
      };
      const sanitizedPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => !(value instanceof File))
      );

      const submitFormData = new FormData();

      Object.entries(sanitizedPayload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitFormData.append(key, String(value));
        }
      });

      for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          submitFormData.append(key, value);
        }
      }

      // Passport input is in Step 3. Keep it in state so it survives to Step 4 submit.
      if (passportFile instanceof File && passportFile.size > 0) {
        submitFormData.set("file", passportFile);
      }

      const response = await fetchApi("/wp-json/custom/v1/profile-update", {
        method: "POST",
        body: submitFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      const uploadedFileMeta = Object.entries(result?.uploaded_files || {}).reduce((acc, [key, fileInfo]) => {
        const fileUrl = typeof fileInfo === "string" ? fileInfo : fileInfo?.url;
        if (fileUrl) {
          acc[key] = fileUrl;
        }
        return acc;
      }, {});
      const mergedMeta = { ...sanitizedPayload, ...uploadedFileMeta };
      setSubmitMessage(result.message || "Profile updated successfully.");
      const reviewModeKey = getUserReviewModeStorageKey(user?.id || getStoredUserId());
      if (reviewModeKey) {
        localStorage.setItem(reviewModeKey, "true");
      }
      setIsReviewMode(true);
      setUser((prev) => prev ? { ...prev, meta: { ...prev.meta, ...mergedMeta } } : prev);
      setFormValues((prev) => ({ ...prev, ...mergedMeta }));
    } catch (error) {
      console.error("Profile update failed:", error);
      setSubmitMessage("Unable to update profile right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (normalizedPassportId === "") {
      setPassportValidationState("idle");
      setPassportValidationMessage("");
      return;
    }

    if (!PASSPORT_ID_REGEX.test(normalizedPassportId)) {
      setPassportValidationState("invalid");
      setPassportValidationMessage("Invalid Passport ID");
      return;
    }

    if (normalizedPassportId === savedPassportId) {
      setPassportValidationState("valid");
      setPassportValidationMessage("Valid Passport ID.");
      return;
    }

    const abortController = new AbortController();

    const validatePassportId = async () => {
      setPassportValidationState("checking");
      setPassportValidationMessage("Checking passport ID...");

      try {
        const response = await fetchApi('/wp-json/custom/v1/passport-validation', {
          method: "POST",
          body: JSON.stringify({ passport_id: normalizedPassportId }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed passport validation request: ${response.status}`);
        }

        const data = await response.json();
        const duplicateCount = Number(data?.count ?? 0);

        if (Number.isNaN(duplicateCount)) {
          throw new Error(`Unexpected passport validation response: ${JSON.stringify(data)}`);
        }

        if (duplicateCount === 0) {
          setPassportValidationState("valid");
          setPassportValidationMessage("Valid Passport ID.");
          return;
        }

        setPassportValidationState("duplicate");
        setPassportValidationMessage("Your Passport ID is already Registered.");
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error("Passport validation failed:", error);
        setPassportValidationState("error");
        setPassportValidationMessage("Unable to validate passport ID right now.");
      }
    };

    validatePassportId();

    return () => {
      abortController.abort();
    };
  }, [normalizedPassportId, savedPassportId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchApi("/wp-json/custom/v1/me");

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data);
        const reviewModeKey = getUserReviewModeStorageKey(data?.id);
        setIsReviewMode(reviewModeKey ? localStorage.getItem(reviewModeKey) === "true" : false);
        const attendValue = String(data?.meta?.attend || "").trim().toLowerCase();
        const attendTypeValue = String(data?.meta?.attend_type || "").trim().toLowerCase();

        setAttend(attendValue === "yes" || attendValue === "no" ? attendValue : "");
        setAttendType(attendTypeValue === "onsite" ? "Onsite" : attendTypeValue === "online" ? "Online" : "");
        setAddress(String(data?.meta?.address || "").trim());
        setZipcode(String(data?.meta?.zipcode || "").trim());
        setCurrentLocation(String(data?.meta?.current_location || "").trim());
        setCivilStatus(resolveOption(data?.meta?.civil_status, CIVIL_STATUS_OPTIONS, civilStatusAliasMap));
        setMobile(String(data?.meta?.mobile || "").trim());
        setSourceInfo(resolveSourceOption(data?.meta?.source));
        setGender(String(data?.meta?.gender || "").trim());
        setLandline(String(data?.meta?.landline || "").trim());
        setPassportId(String(data?.meta?.passport_id || "").trim());
        setRelationship(resolveOption(data?.meta?.relationship, RELATIONSHIP_OPTIONS, relationshipAliasMap));
        setOwwaOfwId(String(data?.meta?.owwa_ofw_id || "").trim());
        setOfwFirstname(String(data?.meta?.ofw_firstname || "").trim());
        setOfwMiddlename(String(data?.meta?.ofw_middlename || "").trim());
        setOfwLastname(String(data?.meta?.ofw_lastname || "").trim());
        setOwwaMember(String(data?.meta?.owwa_member || "").trim().toLowerCase());
        setofw_status(resolveOption(data?.meta?.ofw_status, OFW_STATUS_OPTIONS, ofwStatusAliasMap));
        setOfwYearService(String(data?.meta?.ofw_year_service || "").trim());
        setProfession(String(data?.meta?.profession || data?.meta?.ofw_profession || "").trim());
        setOfwProfession(String(data?.meta?.ofw_profession || "").trim());
        setofw_emailaddress(String(data?.meta?.ofw_emailaddress || "").trim());
        setOfwIncome(resolveOption(data?.meta?.ofw_income, OFW_INCOME_OPTIONS));
        setWorkCountry(String(data?.meta?.work_country || "").trim());

        setSelectedSupportingDocs({
          select_docs1: hasDocumentData("employment_contract", data?.meta) || isSelectedDocFlagEnabled(data?.meta?.select_docs1),
          select_docs2: hasDocumentData("visa", data?.meta) || isSelectedDocFlagEnabled(data?.meta?.select_docs2),
          select_docs3: hasDocumentData("owwa_poea", data?.meta) || isSelectedDocFlagEnabled(data?.meta?.select_docs3),
          select_docs4: hasDocumentData("remittance", data?.meta) || isSelectedDocFlagEnabled(data?.meta?.select_docs4),
          select_docs5: hasDocumentData("allotment", data?.meta) || isSelectedDocFlagEnabled(data?.meta?.select_docs5),
          select_docs6: hasDocumentData("seaman_book", data?.meta) || isSelectedDocFlagEnabled(data?.meta?.select_docs6),
        });

        if (data?.meta?.region) {
          setSelectedRegionLabel(data.meta.region);
        }
        if (data?.meta?.province) {
          setSelectedProvinceLabel(data.meta.province);
        }
        if (data?.meta?.city) {
          setSelectedCityLabel(data.meta.city);
        }
        if (data?.meta?.barangay) {
          setSelectedBarangayLabel(data.meta.barangay);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // if (!regions) return;

    const loadRegions = async () => {
      try {
        const response = await fetch("https://psgc.gitlab.io/api/regions/");
        const data = await response.json();
        setRegions(data || []);
      } catch (error) {
        console.error("Failed to load regions:", error);
      }
    };

    loadRegions();
  }, []);

  useEffect(() => {
    if (!meta.region || !regions.length || selectedRegion) {
      return;
    }

    const matchedRegion = regions.find(
      (region) =>
        normalizeLocationValue(region.name) === normalizeLocationValue(meta.region)
        || String(region.code) === String(meta.region)
    );

    if (matchedRegion) {
      setSelectedRegion(String(matchedRegion.code));
      setSelectedRegionLabel(matchedRegion.name);
    }
  }, [meta.region, regions, selectedRegion]);

  useEffect(() => {
    // if (provinces) return;
    if (!selectedRegion) {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      return;
    }

    const loadProvinces = async () => {
      try {
        if (selectedRegion === "130000000") {
          setProvinces([{ code: "130000000", name: "Metro Manila" }]);
          setCities([]);
          setBarangays([]);
          return;
        }

        const response = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`);
        const data = await response.json();
        setProvinces(data || []);
        setCities([]);
        setBarangays([]);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      }
    };

    loadProvinces();
  }, [selectedRegion]);

  useEffect(() => {
    if (!meta.province || !provinces.length || selectedProvince) {
      return;
    }

    const matchedProvince = provinces.find(
      (province) =>
        normalizeLocationValue(province.name) === normalizeLocationValue(meta.province)
        || String(province.code) === String(meta.province)
    );

    if (matchedProvince) {
      setSelectedProvince(String(matchedProvince.code));
      setSelectedProvinceLabel(matchedProvince.name);
    }
  }, [meta.province, provinces, selectedProvince]);

  useEffect(() => {
    // if (cities) return;
    if (!selectedProvince) {
      setCities([]);
      setBarangays([]);
      return;
    }

    const loadCities = async () => {
      try {
        const url = selectedProvince === "130000000"
          ? "https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/"
          : `https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`;

        const response = await fetch(url);
        const data = await response.json();
        setCities(data || []);
        setBarangays([]);
      } catch (error) {
        console.error("Failed to load cities:", error);
      }
    };

    loadCities();
  }, [selectedProvince]);

  useEffect(() => {
    if (!meta.city || !cities.length || selectedCity) {
      return;
    }

    const matchedCity = cities.find(
      (city) =>
        normalizeLocationValue(city.name) === normalizeLocationValue(meta.city)
        || String(city.code) === String(meta.city)
    );

    if (matchedCity) {
      setSelectedCity(String(matchedCity.code));
      setSelectedCityLabel(matchedCity.name);
    }
  }, [meta.city, cities, selectedCity]);

  useEffect(() => {
    // if (barangays) return;
    if (!selectedCity) {
      setBarangays([]);
      return;
    }

    const loadBarangays = async () => {
      try {
        const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`);
        const data = await response.json();
        setBarangays(data || []);
      } catch (error) {
        console.error("Failed to load barangays:", error);
      }
    };

    loadBarangays();
  }, [selectedCity]);

  useEffect(() => {
    if (!meta.barangay || !barangays.length || selectedBarangay) {
      return;
    }

    const matchedBarangay = barangays.find(
      (barangay) =>
        normalizeLocationValue(barangay.name) === normalizeLocationValue(meta.barangay)
        || String(barangay.code) === String(meta.barangay)
    );

    if (matchedBarangay) {
      setSelectedBarangay(String(matchedBarangay.code));
      setSelectedBarangayLabel(matchedBarangay.name);
    }
  }, [meta.barangay, barangays, selectedBarangay]);

  console.log("User Meta:", user);

  return (
    <div className="profile-section">
        <div className="custom-container">
          <h2>Profile Dashboard</h2>

          {submitMessage ? (
            <div className="alert alert-success" style={{ marginBottom: "20px" }}>
              {submitMessage}
            </div>
          ) : null}

          {isReviewMode ? (
            <ReviewInfo values={user?.meta ?? {}} onEdit={handleReviewEdit}></ReviewInfo>
          ) : (
            <form onSubmit={handleSubmit}>
 
          {/* <div className  ="profile-recover">
              <h4>Hi!, We've found your record from previous OFW Summit Event.</h4>
              <h5>Would you like to recover your previous Information? </h5>
              <div className="recover-btn">
                <button type="submit" name="recover" value="yes">Yes</button> <button name="no" >No</button>
              </div>
          </div>

          <div className="profile-recover">
            <div className="alert alert-success">
              <h4>Congratulations! We've recovered your other details.</h4>
              <h5>Please update your profile.</h5>
            </div>
          </div>

          <div className="profile-recover" >
            <div className="alert alert-success cstm_bg-orange">
              <h4>Your Account has been Verified.</h4>
              <h5>Please make sure you will attend on 12th OFW & Family Summit 2023.<br/> November 10, 2023 (Friday), 8:00 AM to 4:00 PM
              The Tent at Vista Global South, C5 Extension Road, Las Piñas City</h5>
              <h6>For you to be qualified on the grand raffle draw.</h6>
            </div>
          </div> */}

          <div className="profile-info-wrapper">
            <div className="basic-info">
              <div className="verified-acct">
                <img src={`${imgsrc}status/incomplete.svg`} alt="Incomplete"/>
              </div>

              <div className="basic-info-inner">
                <div className="basic-prof-pic">
                  <div className="inner-prof-pic">
                    <img src={profileImageUrl} alt="Profile Picture"/>
                  {/* <div className="upload-profile-picture">
									  <input type="file" name="picture" id="picture" accept="image/png, image/jpeg"/>
								  </div> */}
                  </div>
                </div>

                <div className="profile-info">
                  <h5>User ID: {user?.id ?? "N/A"}</h5>
                </div>

                <div className="profile-info">
                  <h5>Name: {user?.name ?? "N/A"}</h5>
                </div>

                <div className="profile-info">
                  <h5>Email: {user?.email ?? "N/A"} || OFW Type: {user?.meta?.ofw_type ?? "N/A"}</h5>
                </div>
              </div>
            </div>

            <div className="required-info">
              <div className="profile-wrapper">
                {/* <div className="custom-alert alert alert-success">
                  Successfully Updated Profile
                </div> */}

                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ marginBottom: "8px" }}>Step {step} of 4</h4>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: item === step ? "#f59e0b" : "#e5e7eb",
                          color: item === step ? "#fff" : "#374151",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {item === 1 ? "Attendance" : item === 2 ? "Personal Info" : item === 3 ? "OFW Info" : "Documents"}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="profile-info">
                  <label>Registrant Type: </label>
                  <div className="field-wrap">
                    <div className="fill-info">	
                        <h5>{registrantTypeLabel}</h5>
                    </div>
                  </div>
                </div>

                {step === 1 ? (
                  <>
                    <div className="profile-info reg_fields">
                      <label>Ikaw ba ay dadalo sa 14th OFW & Family Summit sa November 14, 2025 (Friday), 8:00 AM to 4:00 PM? <span className="required-field">*</span></label>
                      <div className="field-wrap">
                        {/* {getMetaValue("attend", "") ? (
                          <h5>{getMetaValue("attend", "Not provided")}</h5>
                        ) : (
                          <> */}
                            <div className="reg_radio">
                              <div className="reg_radio-list">
                                <input type="radio" name="attend" value="yes" checked={attend === "yes"} onChange={(e) => setAttend(e.target.value)} required /> Yes
                              </div>
                              <div className="reg_radio-list">
                                <input type="radio" name="attend" value="no" checked={attend === "no"} onChange={(e) => setAttend(e.target.value)} required /> No
                              </div>
                            </div>
                        {/* </>
                        )} */}

                        {/* {getMetaValue("attend_type", "") ? (
                          <h5>{getMetaValue("attend_type", "Not provided")}</h5>
                        ) : (
                          <> */}
                            <div className="reg_radio reg_attend">
                              <div className="reg_radio-list">
                                <input type="radio" className="attend_type" name="attend_type" value="Onsite" checked={attendType === "Onsite"} onChange={(e) => setAttendType(e.target.value)} /> Onsite
                              </div>
                              <div className="reg_radio-list">
                                <input type="radio" className="attend_type" name="attend_type" value="Online" checked={attendType === "Online"} onChange={(e) => setAttendType(e.target.value)} /> Online
                              </div>
                            </div>
                          {/* </>
                        )} */}
                      </div>
                    </div>

                    <div className="profile-info">
                      <button type="button" onClick={nextStep} disabled={isSubmitting}>Next</button>
                    </div>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <div className="profile-info">
                      <h3>Personal Information</h3>
                    </div>
                <div className="profile-info">
                  <label>Full Address <span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      {/* {meta.address ? (
                        <h5>{getMetaValue("address", "Not provided")}</h5>
                      ) : ( */}
                        <textarea name="address" id="address" cols="20" rows="2" value={address} onChange={(e) => setAddress(e.target.value)}  required></textarea>
                      {/* )} */}
                    </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Current Location (Country) <span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <div className="fill-info">
                        <select name="current_location" id="current_location" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} required>
                              <option value="Algeria">Algeria</option>

                              <option value="Andorra">Andorra</option>

                              <option value="Angola">Angola</option>

                              <option value="Antigua and Barbuda">Antigua and Barbuda</option>

                              <option value="Argentina">Argentina</option>

                              <option value="Armenia">Armenia</option>

                              <option value="Australia">Australia</option>

                              <option value="Austria">Austria</option>

                              <option value="Azerbaijan">Azerbaijan</option>

                              <option value="Bahamas">Bahamas</option>

                              <option value="Bahrain">Bahrain</option>

                              <option value="Bangladesh">Bangladesh</option>

                              <option value="Barbados">Barbados</option>

                              <option value="Belarus">Belarus</option>

                              <option value="Belgium">Belgium</option>

                              <option value="Belize">Belize</option>

                              <option value="Benin">Benin</option>

                              <option value="Bhutan">Bhutan</option>

                              <option value="Bolivia">Bolivia</option>

                              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>

                              <option value="Botswana">Botswana</option>

                              <option value="Brazil">Brazil</option>

                              <option value="Brunei">Brunei</option>

                              <option value="Bulgaria">Bulgaria</option>

                              <option value="Burkina Faso">Burkina Faso</option>

                              <option value="Burundi">Burundi</option>

                              <option value="Côte d'Ivoire">Côte d'Ivoire</option>

                              <option value="Cabo Verde">Cabo Verde</option>

                              <option value="Cambodia">Cambodia</option>

                              <option value="Cameroon">
                              Cameroon</option>

                              <option value="Canada">
                              Canada</option>

                              <option value="Central African Republic">
                              Central African Republic</option>

                              <option value="Chad">
                              Chad</option>

                              <option value="Chile">
                              Chile</option>

                              <option value="China">
                              China</option>

                              <option value="Colombia">
                              Colombia</option>

                              <option value="Comoros">
                              Comoros</option>

                              <option value="Congo (Congo-Brazzaville)">
                              Congo (Congo-Brazzaville)</option>

                              <option value="Costa Rica">
                              Costa Rica</option>

                              <option value="Croatia">
                              Croatia</option>

                              <option value="Cuba">
                              Cuba</option>

                              <option value="Cyprus">
                              Cyprus</option>

                              <option value="Czechia (Czech Republic)">
                              Czechia (Czech Republic)</option>

                              <option value="Democratic Republic of the Congo">
                              Democratic Republic of the Congo</option>

                              <option value="Denmark">
                              Denmark</option>

                              <option value="Djibouti">
                              Djibouti</option>

                              <option value="Dominica">
                              Dominica</option>

                              <option value="Dominican Republic">
                              Dominican Republic</option>

                              <option value="Ecuador">
                              Ecuador</option>

                              <option value="Egypt">
                              Egypt</option>

                              <option value="El Salvador">
                              El Salvador</option>

                              <option value="Equatorial Guinea">
                              Equatorial Guinea</option>

                              <option value="Eritrea">
                              Eritrea</option>

                              <option value="Estonia">
                              Estonia</option>

                              <option value="Eswatini (fmr. Swaziland)">
                              Eswatini (fmr. "Swaziland")</option>

                              <option value="Ethiopia">
                              Ethiopia</option>

                              <option value="Fiji">
                              Fiji</option>

                              <option value="Finland">
                              Finland</option>

                              <option value="France">
                              France</option>

                              <option value="Gabon">
                              Gabon</option>

                              <option value="Gambia">
                              Gambia</option>

                              <option value="Georgia">
                              Georgia</option>

                              <option value="Germany">
                              Germany</option>

                              <option value="Ghana">
                              Ghana</option>

                              <option value="Greece">
                              Greece</option>

                              <option value="Grenada">
                              Grenada</option>

                              <option value="Guatemala">
                              Guatemala</option>

                              <option value="Guinea">
                              Guinea</option>

                              <option value="Guinea-Bissau">
                              Guinea-Bissau</option>

                              <option value="Guyana">
                              Guyana</option>

                              <option value="Haiti">
                              Haiti</option>

                              <option value="Holy See">
                              Holy See</option>

                              <option value="Honduras">
                              Honduras</option>

                              <option value="Hong Kong">
                              Hong Kong</option>

                              <option value="Hungary">
                              Hungary</option>

                              <option value="Iceland">
                              Iceland</option>

                              <option value="India">
                              India</option>

                              <option value="Indonesia">
                              Indonesia</option>

                              <option value="Iran">
                              Iran</option>

                              <option value="Iraq">
                              Iraq</option>

                              <option value="Ireland">
                              Ireland</option>

                              <option value="Israel">
                              Israel</option>

                              <option value="Italy">
                              Italy</option>

                              <option value="Jamaica">
                              Jamaica</option>

                              <option value="Japan">
                              Japan</option>

                              <option value="Jordan">
                              Jordan</option>

                              <option value="Kazakhstan">
                              Kazakhstan</option>

                              <option value="Kenya">
                              Kenya</option>

                              <option value="Kiribati">
                              Kiribati</option>

                              <option value="Kuwait">
                              Kuwait</option>

                              <option value="Kyrgyzstan">
                              Kyrgyzstan</option>

                              <option value="Laos">
                              Laos</option>

                              <option value="Latvia">
                              Latvia</option>

                              <option value="Lebanon">
                              Lebanon</option>

                              <option value="Lesotho">
                              Lesotho</option>

                              <option value="Liberia">
                              Liberia</option>

                              <option value="Libya">
                              Libya</option>

                              <option value="Liechtenstein">
                              Liechtenstein</option>

                              <option value="Lithuania">
                              Lithuania</option>

                              <option value="Luxembourg">
                              Luxembourg</option>

                              <option value="Macau">
                              Macau</option>

                              <option value="Madagascar">
                              Madagascar</option>

                              <option value="Malawi">
                              Malawi</option>

                              <option value="Malaysia">
                              Malaysia</option>

                              <option value="Maldives">
                              Maldives</option>

                              <option value="Mali">
                              Mali</option>

                              <option value="Malta">
                              Malta</option>

                              <option value="Marshall Islands">
                              Marshall Islands</option>

                              <option value="Mauritania">
                              Mauritania</option>

                              <option value="Mauritius">
                              Mauritius</option>

                              <option value="Mexico">
                              Mexico</option>

                              <option value="Micronesia">
                              Micronesia</option>

                              <option value="Moldova">
                              Moldova</option>

                              <option value="Monaco">
                              Monaco</option>

                              <option value="Mongolia">
                              Mongolia</option>

                              <option value="Montenegro">
                              Montenegro</option>

                              <option value="Morocco">
                              Morocco</option>

                              <option value="Mozambique">
                              Mozambique</option>

                              <option value="Myanmar (formerly Burma)">
                              Myanmar (formerly Burma)</option>

                              <option value="Namibia">
                              Namibia</option>

                              <option value="Nauru">
                              Nauru</option>

                              <option value="Nepal">
                              Nepal</option>

                              <option value="Netherlands">
                              Netherlands</option>

                              <option value="New Zealand">
                              New Zealand</option>

                              <option value="Nicaragua">
                              Nicaragua</option>

                              <option value="Niger">
                              Niger</option>

                              <option value="Nigeria">
                              Nigeria</option>

                              <option value="North Korea">
                              North Korea</option>

                              <option value="North Macedonia">
                              North Macedonia</option>

                              <option value="Norway">
                              Norway</option>

                              <option value="Oman">
                              Oman</option>

                              <option value="Pakistan">
                              Pakistan</option>

                              <option value="Palau">
                              Palau</option>

                              <option value="Palestine State">
                              Palestine State</option>

                              <option value="Panama">
                              Panama</option>

                              <option value="Papua New Guinea">
                              Papua New Guinea</option>

                              <option value="Paraguay">
                              Paraguay</option>

                              <option value="Peru">
                              Peru</option>

                              <option value="Philippines">
                              Philippines</option>

                              <option value="Poland">
                              Poland</option>

                              <option value="Portugal">
                              Portugal</option>

                              <option value="Qatar">
                              Qatar</option>

                              <option value="Romania">
                              Romania</option>

                              <option value="Russia">
                              Russia</option>

                              <option value="Rwanda">
                              Rwanda</option>

                              <option value="Saint Kitts and Nevis">
                              Saint Kitts and Nevis</option>

                              <option value="Saint Lucia">
                              Saint Lucia</option>

                              <option value="Saint Vincent and the Grenadines">
                              Saint Vincent and the Grenadines</option>

                              <option value="Samoa">
                              Samoa</option>

                              <option value="San Marino">
                              San Marino</option>

                              <option value="Sao Tome and Principe">
                              Sao Tome and Principe</option>

                              <option value="Saudi Arabia">
                              Saudi Arabia</option>

                              <option value="Senegal">
                              Senegal</option>

                              <option value="Serbia">
                              Serbia</option>

                              <option value="Seychelles">
                              Seychelles</option>

                              <option value="Sierra Leone">
                              Sierra Leone</option>

                              <option value="Singapore">
                              Singapore</option>

                              <option value="Slovakia">
                              Slovakia</option>

                              <option value="Slovenia">
                              Slovenia</option>

                              <option value="Solomon Islands">
                              Solomon Islands</option>

                              <option value="Somalia">
                              Somalia</option>

                              <option value="South Africa">
                              South Africa</option>

                              <option value="South Korea">
                              South Korea</option>

                              <option value="South Sudan">
                              South Sudan</option>

                              <option value="Spain">
                              Spain</option>

                              <option value="Sri Lanka">
                              Sri Lanka</option>

                              <option value="Sudan">
                              Sudan</option>

                              <option value="Suriname">
                              Suriname</option>

                              <option value="Sweden">
                              Sweden</option>

                              <option value="Switzerland">
                              Switzerland</option>

                              <option value="Syria">
                              Syria</option>

                              

                              <option value="Taiwan">
                              Taiwan</option>

                              <option value="Tajikistan">
                              Tajikistan</option>

                              <option value="Tanzania">
                              Tanzania</option>

                              <option value="Thailand">
                              Thailand</option>

                              <option value="Timor-Leste">
                              Timor-Leste</option>

                              <option value="Togo">
                              Togo</option>

                              <option value="Tonga">
                              Tonga</option>

                              <option value="Trinidad and Tobago">
                              Trinidad and Tobago</option>

                              <option value="Tunisia">
                              Tunisia</option>

                              <option value="Turkey">
                              Turkey</option>

                              <option value="Turkmenistan">
                              Turkmenistan</option>

                              <option value="Tuvalu">
                              Tuvalu</option>

                              <option value="Uganda">
                              Uganda</option>

                              <option value="Ukraine">
                              Ukraine</option>

                              <option value="United Arab Emirates">
                              United Arab Emirates</option>

                              <option value="United Kingdom">
                              United Kingdom</option>

                              <option value="United States of America">
                              United States of America</option>

                              <option value="Uruguay">
                              Uruguay</option>

                              <option value="Uzbekistan">
                              Uzbekistan</option>

                              <option value="Vanuatu">
                              Vanuatu</option>

                              <option value="Venezuela">
                              Venezuela</option>

                              <option value="Vietnam">
                              Vietnam</option>

                              <option value="Yemen">
                              Yemen</option>

                              <option value="Zambia">
                              Zambia</option>

                              <option value="Zimbabwe">
                              Zimbabwe</option>

                      </select>
                    </div>
                  </div>
                </div>

                <div className="profile-info places-function">
                  <label>Region <span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      {/* {meta.region ? (
                        <h5>{selectedRegionName || getMetaValue("region", "Not provided")}</h5>
                      ) : (
                        <> */}
                          <select
                            id="region"
                            name="region"
                            value={selectedRegion}
                            
                            onChange={(e) => {
                              const code = e.target.value;

                              const region = regions.find(
                                (r) => String(r.code) === String(code)
                              );

                              setSelectedRegion(code);
                              setSelectedRegionLabel(region?.name);

                              // console.log("Code:", code);
                              // console.log("Name:", region?.name);
                            }}

                            required
                          >
                            <option value="">- Select Region -</option>
                            {regions.map((region) => (
                              <option key={region.code} value={region.code}>
                                {region.name}
                              </option>
                            ))}
                          </select>
                          {/* <input type="hidden" name="h_region" value="" /> */}
                        {/* </>
                      )} */}
                    </div>
                  </div>
                </div>

                <div className="profile-info places-function">
                  <label>Province <span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      <select
                        id="province"
                        name="province"
                        value={selectedProvince}
                        onChange={(e) => {
                          const code = e.target.value;

                          const province = provinces.find(
                            (r) => String(r.code) === String(code)
                          );

                          setSelectedProvince(code);
                          setSelectedProvinceLabel(province?.name || "");
                        }}
                        disabled={!selectedRegion}
                        required
                      >
                        <option value="">- Select Province -</option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="profile-info places-function">
                  <label>City/Municipalities <span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      <select
                        id="city"
                        name="city"
                        value={selectedCity}
                        onChange={(e) => {
                          const code = e.target.value;

                          const city = cities.find(
                            (r) => String(r.code) === String(code)
                          );

                          setSelectedCity(code);
                          setSelectedCityLabel(city?.name || "");
                        }}
                        disabled={!selectedProvince}
                        required
                      >
                        <option value="">- Select City/Municipalities -</option>
                        {cities.map((city) => (
                          <option key={city.code} value={city.code}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="profile-info places-function">
                  <label>Barangay <span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      <select
                        id="barangay"
                        name="barangay"
                        value={selectedBarangay}
                        onChange={(e) => {
                          const code = e.target.value;

                          const barangay = barangays.find(
                            (r) => String(r.code) === String(code)
                          );

                          setSelectedBarangay(code);
                          setSelectedBarangayLabel(barangay?.name || "");
                        }}
                        disabled={!selectedCity}
                        required
                      >
                        <option value="">- Select Barangay -</option>
                        {barangays.map((barangay) => (
                          <option key={barangay.code} value={barangay.code}>
                            {barangay.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Zip Code</label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      {/* {meta.zipcode ? (
                        <h5>{getMetaValue("zipcode", "Not provided")}</h5>
                      ) : ( */}
                        <input type="text" id="zipcode" name="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                      {/* )} */}
                    </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Civil Status <br/>(Estado sa Buhay)<span className="required-field">*</span></label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.civil_status ? (
                          <h5>{getMetaValue("civil_status", "Not provided")}</h5>
                        ) : ( */}
                          <select name="civil_status" id="civil_status" value={civil_status} onChange={(e) => setCivilStatus(e.target.value)} required>
                            <option value="">- Select Civil Status -</option>
                            <option value="Single" >Single</option>
                            <option value="Married" >Married</option>
                            <option value="Widowed" >Widowed</option>
                          </select>
                        {/* )} */}
                      </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Date of Birth <br/>(Araw ng kapanganakan)<span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <h5>{getMetaValue("date_birth", "Not provided")}</h5>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Gender <br/>(Kasarian)<span className="required-field">*</span></label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      {/* {meta.gender ? (
                        <h5>{getMetaValue("gender", "Not provided")}</h5>
                      ) : ( */}
                        <select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                          <option value="">- Select Gender -</option>
                          <option value="Male" >Male</option>
                          <option value="Female" >Female</option>
                        </select>
                      {/* )} */}
                    </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Mobile Number <br/>(Numero ng Teleponong Mobile)<span className="required-field">*</span></label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.mobile ? (
                          <h5>{getMetaValue("mobile", "Not provided")}</h5>
                        ) : ( */}
                          <input type="text" name="mobile" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                        {/* )} */}
                      </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Landline Number <br/>(Numero ng Telepono)</label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.landline ? (
                          <h5>{getMetaValue("landline", "Not provided")}</h5>
                        ) : ( */}
                          <input type="text" name="landline" placeholder="Landline Number" value={landline} onChange={(e) => setLandline(e.target.value)} />
                        {/* )} */}
                      </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>How did you hear about the Summit? (Paano nalaman ang tungkol sa Summit?) <span className="required-field">*</span></label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.source ? (
                          <h5>{getMetaValue("source", "Not provided")}</h5>
                        ) : ( */}
                          <select name="source" id="source" value={source_info} onChange={(e) => setSourceInfo(e.target.value)}  required >
                            <option value="">- Select Source -</option>
                            <option value="Friend" >Friend</option>
                            <option value="Relative / Family" >Relative / Family</option>
                            <option value="Newspaper or Magazine" >Newspaper or Magazine</option>
                            <option value="Radio" >Radio</option>
                            <option value="Television" >Television</option>
                            <option value="Social Website (Facebook, LinkedIn, etc.)" >Social Website (Facebook, LinkedIn, etc.)</option>
                            <option value="Website" >Website</option>
                            <option value="Manning Agency" >Manning Agency</option>
                            <option value="Others" >Others</option>
                          </select>
                        {/* )} */}  
                      </div>
                  </div>
                </div>

                    <div className="profile-info">
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" onClick={prevStep} disabled={isSubmitting}>Back</button>
                        <button type="button" onClick={nextStep} disabled={isSubmitting}>Next</button>
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <div className="profile-info">
                      <h3>Information of OFW (Impormasyon ng OFW)</h3>
                    </div>

                <div className="profile-info">
                  <label>Profession</label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.profession ? (
                          <h5>{getMetaValue("profession", "Not provided")}</h5>
                        ) : ( */}
                          <input type="text" id="profession" name="profession" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="Profession" />
                        {/* )} */}
                      </div>
                  </div>
                </div>

                <div className="profile-info passport-validation">
                  <label>Passport ID <br/>(Numero ng Pasaporte:)<span className="required-field">*</span></label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.passport_id ? (
                          <h5>{getMetaValue("passport_id", "Not provided")}</h5>
                        ) : (
                          <> */}
                            <input type="text" name="passport_id"  id="passportid" value={passportId} onChange={(e) => setPassportId(e.target.value)}  required />
                            {passportValidationMessage ? (
                              <span
                                id="message"
                                className={passportValidationClassName}
                                style={{ display: "block", marginTop: "8px" }}
                              >
                                {passportValidationMessage}
                              </span>
                            ) : (
                              <span id="message"></span>
                            )}
                        {/* </> */}
                        {/* )} */}
                      </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Passport</label>
                  <div className="field-wrap">
                      <div className="fill-info upload-docs">
                          
                          <input type="file" className="upload-file-input" name="file" id="file" accept="image/png, application/pdf, image/jpeg" onChange={(e) => setPassportFile(e.target.files?.[0] || null)} />
                          {renderDocumentPreview("passport", "Passport")}
                          {/* <div className="upload-msg alert alert-success" id="passport-msg"></div> */}
                      </div>
                  </div>
                </div>

                <div className="profile-info reg_fields">
                  <label>Ikaw ba ay OWWA Member? <span className="required-field">*</span></label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.owwa_member ? (
                          <h5>{getMetaValue("owwa_member", "Not provided")}</h5>
                        ) : ( */}
                          <div className="reg_radio">
                            <div className="reg_radio-list">
                              <input type="radio" name="owwa_member" value="yes" checked={owwaMember === "yes"} onChange={(e) => setOwwaMember(e.target.value)} /> Yes (Oo)
                            </div>
                            <div className="reg_radio-list">
                              <input type="radio" name="owwa_member" value="no" checked={owwaMember === "no"} onChange={(e) => setOwwaMember(e.target.value)} /> No (Hindi)
                            </div>
                          </div>
                        {/* )} */}
                      </div>
                  </div>
                </div>

                <div className="profile-info" id="owwa_ofw_id">
                  <label>OWWA OFW ID No. </label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.owwa_ofw_id ? (
                          <h5>{getMetaValue("owwa_ofw_id", "Not provided")}</h5>
                        ) : ( */}
                          <input type="text" name="owwa_ofw_id" placeholder="OWWA OFW ID No." value={owwaOfwId} onChange={(e) => setOwwaOfwId(e.target.value)} />
                        {/* )} */}
                      </div>
                  </div>
                </div>
                
                {!isOfwTypeOne ? (
                  <>
                    {/* Relative of OFW */}
                    <div className="profile-info">
                      <label>OFW First Name <br/>(Pangalan ng OFW)<span className="required-field">*</span></label>
                      <div className="field-wrap">
                          <div className="fill-info">
                            {/* {meta.ofw_firstname ? (
                              <h5>{getMetaValue("ofw_firstname", "Not provided")}</h5>
                            ) : ( */}
                              <input type="text" name="ofw_firstname" value={ofwFirstname} onChange={(e) => setOfwFirstname(e.target.value)} placeholder="OFW First Name" required />
                            {/* )} */}
                          </div>
                      </div>
                    </div>

                    <div className="profile-info">
                      <label>OFW Middle Name <br/>(Apelyido bago ikinasal/Apelyido ng Ina:)<span className="required-field">*</span></label>
                      <div className="field-wrap">
                          <div className="fill-info">
                            {/* {meta.ofw_middlename ? (
                              <h5>{getMetaValue("ofw_middlename", "Not provided")}</h5>
                            ) : ( */}
                              <input type="text" name="ofw_middlename" value={ofwMiddlename} onChange={(e) => setOfwMiddlename(e.target.value)} placeholder="OFW Middle Name" required />
                            {/* )} */}
                          </div>
                      </div>
                    </div>


                    <div className="profile-info">
                      <label>OFW Last Name <br/>(Apelyido ng OFW)<span className="required-field">*</span></label>
                      <div className="field-wrap">
                          <div className="fill-info">
                            {/* {meta.ofw_lastname ? (
                              <h5>{getMetaValue("ofw_lastname", "Not provided")}</h5>
                            ) : ( */}
                              <input type="text" name="ofw_lastname" value={ofwLastname} onChange={(e) => setOfwLastname(e.target.value)} placeholder="OFW Last Name" required />
                            {/* )} */}
                          </div>
                      </div>
                    </div>

                    <div className="profile-info">
                      <label>OFW Status <br/>(Estado sa Buhay:)<span className="required-field">*</span></label>
                      <div className="field-wrap">
                          <div className="fill-info">
                            {/* {meta.ofw_status ? (
                              <h5>{getMetaValue("ofw_status", "Not provided")}</h5>
                            ) : ( */}
                              <select name="ofw_status" id="" value={ofw_status} onChange={(e) => setofw_status(e.target.value)} required>
                                <option value="">- Select OFW Status</option>
                                <option value="Single">Single (Walang Asawa)</option>
                              <option value="Married">Married (May Asawa)</option>
                              <option value="Separated">Separated (Hiwalay sa Asawa)</option>
                              <option value="Widowed">Widowed (Biyudo/Biyuda)</option>
                              <option value="Divorced">Divorced (Diborsyado)</option>
                              </select>
                            {/* )} */}
                          </div>
                      </div>
                    </div>

                    <div className="profile-info">
                      <label>OFW Profession <br/>(Trabaho)<span className="required-field">*</span></label>
                      <div className="field-wrap">
                          <div className="fill-info">
                            {/* {meta.ofw_profession ? (
                              <h5>{getMetaValue("ofw_profession", "Not provided")}</h5>
                            ) : ( */}
                              <input type="text" name="ofw_profession" value={ofw_profession} onChange={(e) => setOfwProfession(e.target.value)} placeholder="OFW Profession" required />
                            {/* )} */}
                          </div>
                      </div>
                    </div>

                    <div className="profile-info">
                      <label>OFW Email Address <span className="required-field">*</span></label>
                      <div className="field-wrap">
                        <div className="fill-info">
                          {/* {meta.ofw_emailaddress ? (
                            <h5>{getMetaValue("ofw_emailaddress", "Not provided")}</h5>
                          ) : ( */}
                            <input type="text" name="ofw_emailaddress" value={ofw_emailaddress} onChange={(e) => setofw_emailaddress(e.target.value)} placeholder="OFW Email Address" required />
                          {/* )} */}
                        </div>
                      </div>
                    </div>

                    {/* End of Relative of OFW */}
                  </>
                ) : null}

                <div className="profile-info">
                  <label>Work Country (Bansang Pinagtatrabahuhan) <span className="required-field">*</span></label>
                  <div className="field-wrap">
                      <div className="fill-info">
                          <select name="work_country" id="work_country" value={workCountry} onChange={(e) => setWorkCountry(e.target.value)} required>
                            <option value="">- Select Work Country -</option>
                          <option value="Albania">Albania</option>

                          <option value="Algeria">Algeria</option>

                          <option value="Andorra">Andorra</option>

                          <option value="Angola">Angola</option>

                          <option value="Antigua and Barbuda">Antigua and Barbuda</option>

                          <option value="Argentina">Argentina</option>

                          <option value="Armenia">Armenia</option>

                          <option value="Australia">Australia</option>

                          <option value="Austria">Austria</option>

                          <option value="Azerbaijan">Azerbaijan</option>

                          <option value="Bahamas">Bahamas</option>

                          <option value="Bahrain">Bahrain</option>

                          <option value="Bangladesh">Bangladesh</option>

                          <option value="Barbados">Barbados</option>

                          <option value="Belarus">Belarus</option>

                          <option value="Belgium">Belgium</option>

                          <option value="Belize">Belize</option>

                          <option value="Benin">Benin</option>

                          <option value="Bhutan">Bhutan</option>

                          <option value="Bolivia">Bolivia</option>

                          <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>

                          <option value="Botswana">Botswana</option>

                          <option value="Brazil">Brazil</option>

                          <option value="Brunei">Brunei</option>

                          <option value="Bulgaria">Bulgaria</option>

                          <option value="Burkina Faso">Burkina Faso</option>

                          <option value="Burundi">Burundi</option>

                          <option value="Côte d'Ivoire">Côte d'Ivoire</option>

                          <option value="Cabo Verde">Cabo Verde</option>

                          <option value="Cambodia">Cambodia</option>

                          <option value="Cameroon">
                          Cameroon</option>

                          <option value="Canada">
                          Canada</option>

                          <option value="Central African Republic">
                          Central African Republic</option>

                          <option value="Chad">
                          Chad</option>

                          <option value="Chile">
                          Chile</option>

                          <option value="China">
                          China</option>

                          <option value="Colombia">
                          Colombia</option>

                          <option value="Comoros">
                          Comoros</option>

                          <option value="Congo (Congo-Brazzaville)">
                          Congo (Congo-Brazzaville)</option>

                          <option value="Costa Rica">
                          Costa Rica</option>

                          <option value="Croatia">
                          Croatia</option>

                          <option value="Cuba">
                          Cuba</option>

                          <option value="Cyprus">
                          Cyprus</option>

                          <option value="Czechia (Czech Republic)">
                          Czechia (Czech Republic)</option>

                          <option value="Democratic Republic of the Congo">
                          Democratic Republic of the Congo</option>

                          <option value="Denmark">
                          Denmark</option>

                          <option value="Djibouti">
                          Djibouti</option>

                          <option value="Dominica">
                          Dominica</option>

                          <option value="Dominican Republic">
                          Dominican Republic</option>

                          <option value="Ecuador">
                          Ecuador</option>

                          <option value="Egypt">
                          Egypt</option>

                          <option value="El Salvador">
                          El Salvador</option>

                          <option value="Equatorial Guinea">
                          Equatorial Guinea</option>

                          <option value="Eritrea">
                          Eritrea</option>

                          <option value="Estonia">
                          Estonia</option>

                          <option value="Eswatini (fmr. Swaziland)">
                          Eswatini (fmr. "Swaziland")</option>

                          <option value="Ethiopia">
                          Ethiopia</option>

                          <option value="Fiji">
                          Fiji</option>

                          <option value="Finland">
                          Finland</option>

                          <option value="France">
                          France</option>

                          <option value="Gabon">
                          Gabon</option>

                          <option value="Gambia">
                          Gambia</option>

                          <option value="Georgia">
                          Georgia</option>

                          <option value="Germany">
                          Germany</option>

                          <option value="Ghana">
                          Ghana</option>

                          <option value="Greece">
                          Greece</option>

                          <option value="Grenada">
                          Grenada</option>

                          <option value="Guatemala">
                          Guatemala</option>

                          <option value="Guinea">
                          Guinea</option>

                          <option value="Guinea-Bissau">
                          Guinea-Bissau</option>

                          <option value="Guyana">
                          Guyana</option>

                          <option value="Haiti">
                          Haiti</option>

                          <option value="Holy See">
                          Holy See</option>

                          <option value="Honduras">
                          Honduras</option>

                          <option value="Hong Kong">
                          Hong Kong</option>

                          <option value="Hungary">
                          Hungary</option>

                          <option value="Iceland">
                          Iceland</option>

                          <option value="India">
                          India</option>

                          <option value="Indonesia">
                          Indonesia</option>

                          <option value="Iran">
                          Iran</option>

                          <option value="Iraq">
                          Iraq</option>

                          <option value="Ireland">
                          Ireland</option>

                          <option value="Israel">
                          Israel</option>

                          <option value="Italy">
                          Italy</option>

                          <option value="Jamaica">
                          Jamaica</option>

                          <option value="Japan">
                          Japan</option>

                          <option value="Jordan">
                          Jordan</option>

                          <option value="Kazakhstan">
                          Kazakhstan</option>

                          <option value="Kenya">
                          Kenya</option>

                          <option value="Kiribati">
                          Kiribati</option>

                          <option value="Kuwait">
                          Kuwait</option>

                          <option value="Kyrgyzstan">
                          Kyrgyzstan</option>

                          <option value="Laos">
                          Laos</option>

                          <option value="Latvia">
                          Latvia</option>

                          <option value="Lebanon">
                          Lebanon</option>

                          <option value="Lesotho">
                          Lesotho</option>

                          <option value="Liberia">
                          Liberia</option>

                          <option value="Libya">
                          Libya</option>

                          <option value="Liechtenstein">
                          Liechtenstein</option>

                          <option value="Lithuania">
                          Lithuania</option>

                          <option value="Luxembourg">
                          Luxembourg</option>

                          <option value="Macau">
                          Macau</option>

                          <option value="Madagascar">
                          Madagascar</option>

                          <option value="Malawi">
                          Malawi</option>

                          <option value="Malaysia">
                          Malaysia</option>

                          <option value="Maldives">
                          Maldives</option>

                          <option value="Mali">
                          Mali</option>

                          <option value="Malta">
                          Malta</option>

                          <option value="Marshall Islands">
                          Marshall Islands</option>

                          <option value="Mauritania">
                          Mauritania</option>

                          <option value="Mauritius">
                          Mauritius</option>

                          <option value="Mexico">
                          Mexico</option>

                          <option value="Micronesia">
                          Micronesia</option>

                          <option value="Moldova">
                          Moldova</option>

                          <option value="Monaco">
                          Monaco</option>

                          <option value="Mongolia">
                          Mongolia</option>

                          <option value="Montenegro">
                          Montenegro</option>

                          <option value="Morocco">
                          Morocco</option>

                          <option value="Mozambique">
                          Mozambique</option>

                          <option value="Myanmar (formerly Burma)">
                          Myanmar (formerly Burma)</option>

                          <option value="Namibia">
                          Namibia</option>

                          <option value="Nauru">
                          Nauru</option>

                          <option value="Nepal">
                          Nepal</option>

                          <option value="Netherlands">
                          Netherlands</option>

                          <option value="New Zealand">
                          New Zealand</option>

                          <option value="Nicaragua">
                          Nicaragua</option>

                          <option value="Niger">
                          Niger</option>

                          <option value="Nigeria">
                          Nigeria</option>

                          <option value="North Korea">
                          North Korea</option>

                          <option value="North Macedonia">
                          North Macedonia</option>

                          <option value="Norway">
                          Norway</option>

                          <option value="Oman">
                          Oman</option>

                          <option value="Pakistan">
                          Pakistan</option>

                          <option value="Palau">
                          Palau</option>

                          <option value="Palestine State">
                          Palestine State</option>

                          <option value="Panama">
                          Panama</option>

                          <option value="Papua New Guinea">
                          Papua New Guinea</option>

                          <option value="Paraguay">
                          Paraguay</option>

                          <option value="Peru">
                          Peru</option>

                          <option value="Poland">
                          Poland</option>

                          <option value="Portugal">
                          Portugal</option>

                          <option value="Qatar">
                          Qatar</option>

                          <option value="Romania">
                          Romania</option>

                          <option value="Russia">
                          Russia</option>

                          <option value="Rwanda">
                          Rwanda</option>

                          <option value="Saint Kitts and Nevis">
                          Saint Kitts and Nevis</option>

                          <option value="Saint Lucia">
                          Saint Lucia</option>

                          <option value="Saint Vincent and the Grenadines">
                          Saint Vincent and the Grenadines</option>

                          <option value="Samoa">
                          Samoa</option>

                          <option value="San Marino">
                          San Marino</option>

                          <option value="Sao Tome and Principe">
                          Sao Tome and Principe</option>

                          <option value="Saudi Arabia">
                          Saudi Arabia</option>

                          <option value="Senegal">
                          Senegal</option>

                          <option value="Serbia">
                          Serbia</option>

                          <option value="Seychelles">
                          Seychelles</option>

                          <option value="Sierra Leone">
                          Sierra Leone</option>

                          <option value="Singapore">
                          Singapore</option>

                          <option value="Slovakia">
                          Slovakia</option>

                          <option value="Slovenia">
                          Slovenia</option>

                          <option value="Solomon Islands">
                          Solomon Islands</option>

                          <option value="Somalia">
                          Somalia</option>

                          <option value="South Africa">
                          South Africa</option>

                          <option value="South Korea">
                          South Korea</option>

                          <option value="South Sudan">
                          South Sudan</option>

                          <option value="Spain">
                          Spain</option>

                          <option value="Sri Lanka">
                          Sri Lanka</option>

                          <option value="Sudan">
                          Sudan</option>

                          <option value="Suriname">
                          Suriname</option>

                          <option value="Sweden">
                          Sweden</option>

                          <option value="Switzerland">
                          Switzerland</option>

                          <option value="Syria">
                          Syria</option>

                          <option value="Taiwan">
                          Taiwan</option>

                          <option value="Tajikistan">
                          Tajikistan</option>

                          <option value="Tanzania">
                          Tanzania</option>

                          <option value="Thailand">
                          Thailand</option>

                          <option value="Timor-Leste">
                          Timor-Leste</option>

                          <option value="Togo">
                          Togo</option>

                          <option value="Tonga">
                          Tonga</option>

                          <option value="Trinidad and Tobago">
                          Trinidad and Tobago</option>

                          <option value="Tunisia">
                          Tunisia</option>

                          <option value="Turkey">
                          Turkey</option>

                          <option value="Turkmenistan">
                          Turkmenistan</option>

                          <option value="Tuvalu">
                          Tuvalu</option>

                          <option value="Uganda">
                          Uganda</option>

                          <option value="Ukraine">
                          Ukraine</option>

                          <option value="United Arab Emirates">
                          United Arab Emirates</option>

                          <option value="United Kingdom">
                          United Kingdom</option>

                          <option value="United States of America">
                          United States of America</option>

                          <option value="Uruguay">
                          Uruguay</option>

                          <option value="Uzbekistan">
                          Uzbekistan</option>

                          <option value="Vanuatu">
                          Vanuatu</option>

                          <option value="Venezuela">
                          Venezuela</option>

                          <option value="Vietnam">
                          Vietnam</option>

                          <option value="Yemen">
                          Yemen</option>

                          <option value="Zambia">
                          Zambia</option>

                          <option value="Zimbabwe">
                          Zimbabwe</option>

                          </select>
                      </div>
                  </div>
                </div>
                

                <div className="profile-info">
                  <label>Years of Service (Bilang ng Taon ng Serbisyo) <span className="required-field">*</span></label>
                  <div className="field-wrap">
                      <div className="fill-info">
                        {/* {meta.ofw_year_service ? (
                          <h5>{getMetaValue("ofw_year_service", "Not provided")}</h5>
                        ) : ( */}
                          <input type="number" id="ofw_year_service" name="ofw_year_service" value={ofwYearService} onChange={(e) => setOfwYearService(e.target.value)} required />
                        {/* )} */}
                      </div>
                  </div>
                </div>

                <div className="profile-info">
                  <label>Monthly Income Range (Buwanang Sweldo)</label>
                  <div className="field-wrap">
                    <div className="fill-info">
                      {/* {meta.ofw_income ? (
                        <h5>{getMetaValue("ofw_income", "Not provided")}</h5>
                      ) : ( */}
                        <select name="ofw_income" id="" value={ofwIncome} onChange={(e) => setOfwIncome(e.target.value)}  >
                          <option value="">- Select Montly Income Range -</option>
                          <option value="1.00 - 25,000.00">1.00 - 25,000.00</option>
                          <option value="25,001.00 - 50,000.00">25,001.00 - 50,000.00</option>
                          <option value="50,000.01 - 100,000.00">50,000.01 - 100,000.00</option>
                          <option value="100,001.00 - 125,000.00">100,001.00 - 125,000.00</option>
                          <option value="125,001.00 - 150,000.00">125,001.00 - 150,000.00</option>
                          <option value="Above 150,000.00">Above 150,000.00</option>
                        </select>
                      {/* )} */}
                    </div>
                  </div>
                </div>

                {!isOfwTypeOne ? (
                  <div className="profile-info">
                    <label>Relationship with OFW (Relasyon sa OFW) </label>
                    <div className="field-wrap">
                        <div className="fill-info">
                          {/* {meta.relationship ? (
                            <h5>{getMetaValue("relationship", "Not provided")}</h5>
                          ) : ( */}
                            <select name="relationship" id="relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)}  required>
                              <option value="">- Select Relationship -</option>
                              <option value="Parent"  >Parent (Magulang)</option>
                              <option value="Sibling" >Sibling (Kapatid)</option>
                              <option value="Spouse" >Spouse (Asawa)</option>
                              <option value="Child" >Child (Anak)</option>
                            </select>
                          {/* )} */}
                        </div>
                    </div>
                  </div>
                ) : null}

                    <div className="profile-info">
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" onClick={prevStep} disabled={isSubmitting}>Back</button>
                        <button type="button" onClick={nextStep} disabled={isSubmitting || isPassportValidationBlocking}>Next</button>
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <div className="profile-info">
                      <h3>Supporting Documents</h3>
                    </div>

                <div className="profile-info profile-center">
                  <div className="documents-note">
                    <h5><i>Note: Max file upload: <strong>10MB</strong><br/>File Format: JPG, JPEG, PNG and PDF only</i></h5>
                  </div>
                </div>

                {/* Relationship as Parent / Sibling */}
                {!isOfwTypeOne ? (
                <div className="profile-info">
                  <label>Birth Certificate of OFW</label>
                  <div className="field-wrap">
                    <div className="fill-info upload-docs">
                      <input type="file" className="upload-file-input" id="ofw_birthcert" name="ofw_birthcert" accept="image/png, application/pdf, image/jpeg" />
                      {renderDocumentPreview("ofw_birthcert", "Birth Certificate of OFW")}
                      {/* <div className="upload-msg alert alert-success" id="ofw_birthcert-msg" style="display: none;"></div> */}
                    </div>
                  </div>
                </div>
                ) : null}
                {/* End of Relationship as Parent / Sibling */}

                {/* Relationship as Child / Sibling */}
                <div className="profile-info">
                  <label>Birth Certificate (Personal)</label>
                  <div className="field-wrap">
                      <div className="fill-info upload-docs">
                        <input type="file" className="upload-file-input" id="birth_cert" name="birth_cert" accept="image/png, application/pdf, image/jpeg" />
                        {renderDocumentPreview("birth_cert", "Birth Certificate")}
                        {/* <div className="upload-msg alert alert-success" id="birth-msg" style="display: none;"></div> */}    
                      </div>
                  </div>
                </div>
                {/* End of Relationship as Child / Sibling */}
                
                {/* Relationship as Spouse */}
                {OFWRelationship_type ? (
                <div className="profile-info">
                  <label>Marriage Certificate</label>
                  <div className="field-wrap">
                      <div className="fill-info upload-docs">
                        <input type="file" className="upload-file-input" id="married_cert" name="married_cert" accept="image/png, application/pdf, image/jpeg" />
                        {renderDocumentPreview("married_cert", "Marriage Certificate")}
                        {/* <div className="upload-msg alert alert-success" id="married-msg" style="display: none;"></div> */}
                      </div>
                  </div>
                </div>
                ) : null}
                {/* End of Relationship as Spouse */}

                {/* Relative of OFW */}
                {!isOfwTypeOne ? (
                <div className="profile-info">
                  <label>Valid ID</label>
                  <div className="field-wrap">
                      <div className="fill-info upload-docs">
                        <input type="file" className="upload-file-input" id="valid_id" name="valid_id" accept="image/png, application/pdf, image/jpeg" />
                        {renderDocumentPreview("valid_id", "Valid ID")}
                        {/* <div className="upload-msg alert alert-success" id="valid_id-msg" style="display: none;"></div> */}
                      </div>
                  </div>
                </div>
                ) : null}
                {/* End of Relative of OFW */}

                <div className="profile-info">
                  <label>Choose Supporting Documents</label>
                  <div className="field-wrap">
                    
                    <div className="fill-info">
                      <div className="supp-docs-wrapper">
                        <div className="supp-docs-list">
                          <input type="checkbox" className="supp_doc_required" name="select_docs6" value="6" checked={isSupportingDocChecked("select_docs6")} onChange={handleSupportingDocToggle} /> Seaman's Book
                        </div>
                        <div className="supp-docs-list">
                          <input type="checkbox" className="supp_doc_required" name="select_docs1" value="1" checked={isSupportingDocChecked("select_docs1")} onChange={handleSupportingDocToggle} /> Employment Contract
                        </div>
                        <div className="supp-docs-list">
                          <input type="checkbox" className="supp_doc_required" name="select_docs2" value="2" checked={isSupportingDocChecked("select_docs2")} onChange={handleSupportingDocToggle} /> Working Visa
                        </div>
                        <div className="supp-docs-list">
                          <input type="checkbox" className="supp_doc_required" name="select_docs3" value="3" checked={isSupportingDocChecked("select_docs3")} onChange={handleSupportingDocToggle} /> OWWA /POEA Registration
                        </div>
                        <div className="supp-docs-list">
                          <input type="checkbox" className="supp_doc_required" name="select_docs4" value="4" checked={isSupportingDocChecked("select_docs4")} onChange={handleSupportingDocToggle} /> Remittance Slip
                        </div>
                        <div className="supp-docs-list">
                          <input type="checkbox" className="supp_doc_required" name="select_docs5" value="5" checked={isSupportingDocChecked("select_docs5")} onChange={handleSupportingDocToggle} /> Allotment Certificate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedSupportingDocs.select_docs6 || hasDocumentData("seaman_book") ? (
                <div className="profile-info" id="supp_seaman" >
                    <label>Seaman's Book</label>
                    <div className="field-wrap">
                        <div className="fill-info upload-docs">
                          <input type="file" className="upload-file-input" id="seaman_book" name="seaman_book" accept="image/png, application/pdf, image/jpeg" />
                          {renderDocumentPreview("seaman_book", "Seaman's Book")}
                          {/* <div className="upload-msg alert alert-success" id="sb-msg" style="display: none;"></div> */}
                        </div>
                    </div>
                </div>
                ) : null}

                {selectedSupportingDocs.select_docs1 || hasDocumentData("employment_contract") ? (
                <div className="profile-info" id="supp_employment" >
                  <label>Employment Contract</label>
                  <div className="field-wrap">
                    <div className="fill-info upload-docs">
                      <input type="file" className="upload-file-input" id="employment_contract" name="employment_contract" accept="image/png, application/pdf, image/jpeg" />
                      {renderDocumentPreview("employment_contract", "Employment Contract")}
                      <div className="upload-msg alert alert-success" id="employee-msg" style={{ display: 'none' }}></div>
                    </div>
                  </div>
                </div>
                ) : null}

                {selectedSupportingDocs.select_docs2 || hasDocumentData("visa") ? (
                <div className="profile-info" id="supp_visa" >
                  <label>Working VISA</label>
                  <div className="field-wrap">
                    <div className="fill-info upload-docs">
                      <input type="file" className="upload-file-input" id="visa" name="visa" accept="image/png, application/pdf, image/jpeg" />
                      {renderDocumentPreview("visa", "Working VISA")}
                      <div className="upload-msg alert alert-success" id="visa-msg" style={{ display: 'none' }}></div>
                    </div>
                  </div>
                </div>
                ) : null}

                {selectedSupportingDocs.select_docs3 || hasDocumentData("owwa_poea") ? (
                <div className="profile-info" id="supp_owwa" >
                  <label>OWWA / POEA Registration</label>
                  <div className="field-wrap">
                    <div className="fill-info upload-docs">
                      <input type="file" className="upload-file-input" id="owwa_poea" name="owwa_poea" accept="image/png, application/pdf, image/jpeg" />
                      {renderDocumentPreview("owwa_poea", "OWWA / POEA Registration")}
                      <div className="upload-msg alert alert-success" id="owa-msg" style={{ display: 'none' }}></div>
                    </div>
                  </div>
                </div>
                ) : null}

                {selectedSupportingDocs.select_docs4 || hasDocumentData("remittance") ? (
                <div className="profile-info" id="supp_remit" >
                  <label>Remittance Slip</label>
                  <div className="field-wrap">
                    <div className="fill-info upload-docs">
                      <input type="file" className="upload-file-input" id="remittance" name="remittance" accept="image/png, application/pdf, image/jpeg" />
                      {renderDocumentPreview("remittance", "Remittance Slip")}
                      <div className="upload-msg alert alert-success" id="remit-msg" style={{ display: 'none' }}></div>
                    </div>
                  </div>
                </div>
                ) : null}

                {selectedSupportingDocs.select_docs5 || hasDocumentData("allotment") ? (
                <div className="profile-info" id="supp_allotment">
                  <label>Allotment Certificate</label>
                  <div className="field-wrap">
                    <div className="fill-info upload-docs">
                      <input type="file" className="upload-file-input" id="allotment" name="allotment" accept="image/png, application/pdf, image/jpeg" />
                      {renderDocumentPreview("allotment", "Allotment Certificate")}
                      <div className="upload-msg alert alert-success" id="allotment-msg" style={{ display: 'none' }}></div>
                    </div>
                  </div>
                </div>
                ) : null}

                <div className="one-column_field">
                  <div id="message"></div>
                </div>
                <div className="profile-info">
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={prevStep} disabled={isSubmitting}>Back</button>
                    <input type="submit" name="profile_submit" disabled={isSubmitting || isPassportValidationBlocking} />
                  </div>
                </div>
                  </>
                ) : null}

              </div>
            </div>
          </div>
            </form>
          )}
        </div>
    </div>
  );
};

export default ProfileDashboard;
