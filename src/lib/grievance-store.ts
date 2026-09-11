import { CitizenGrievance } from "@/types";

export const INITIAL_MOCK_GRIEVANCES: CitizenGrievance[] = [
  {
    id: "OBJ-2026-DL-48201",
    khasraNo: "DEMO-482",
    village: "Alipur",
    district: "North Delhi",
    state: "Delhi",
    claimantName: "Shri Ramesh Chand",
    claimantPhone: "+91 98110 48201",
    aadhaarLast4: "3829",
    category: "valuation_inadequate",
    statutorySection: "Section 15",
    groundsDescription:
      "Circle rate applied (₹70 Lakh/Ha) is below prevailing commercial registry transactions on GT Karnal Road. Requesting reassessment under Section 26(1)(a).",
    supportingDocName: "Sale_Deed_Registry_Sample_2025.pdf",
    status: "hearing_scheduled",
    hearingDate: "28 March 2026, 11:00 AM",
    hearingOfficer: "Sh. Ashwini Kumar, IAS (DM & CALA North Delhi)",
    hearingVenue: "DM Office Camp Court, Alipur Sub-Division",
    filedAt: "2026-02-12",
    updatedAt: "2026-03-01",
    officialRemarks:
      "Joint field inspection with Tehsildar Alipur ordered. Hearing notice issued under Section 15(2).",
  },
  {
    id: "OBJ-2026-UP-50602",
    khasraNo: "DEMO-506",
    village: "Morta",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    claimantName: "Shri Jagdish Tyagi",
    claimantPhone: "+91 98120 99342",
    aadhaarLast4: "9934",
    category: "measurement_boundary_dispute",
    statutorySection: "Section 15",
    groundsDescription:
      "Survey demarcation includes 0.25 Ha of private tube-well irrigation channel not notified in Section 11 gazette.",
    supportingDocName: "Khatauni_Sajra_Extract_Morta.pdf",
    status: "under_scrutiny",
    hearingOfficer: "Sh. Rakesh Kumar Singh, IAS (DM Ghaziabad)",
    hearingVenue: "Collectorate Court Room 2, Ghaziabad",
    filedAt: "2026-02-20",
    updatedAt: "2026-02-25",
    officialRemarks:
      "BhuNaksha GIS vector layer re-verification referred to DGPS surveyor team.",
  },
];

const STORAGE_KEY = "bhoomi_citizen_grievances";

export function getStoredGrievances(): CitizenGrievance[] {
  if (typeof window === "undefined") return INITIAL_MOCK_GRIEVANCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_GRIEVANCES));
      return INITIAL_MOCK_GRIEVANCES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_GRIEVANCES;
  }
}

export function saveGrievance(grievance: CitizenGrievance): CitizenGrievance[] {
  const current = getStoredGrievances();
  const updated = [grievance, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save grievance to localStorage", e);
    }
  }
  return updated;
}
