import { useAuthStore } from "../store/authStore";
import { auth } from "./firebase";

const getBaseUrl = (): string => {
  const apiUrl = process.env["EXPO_PUBLIC_API_URL"];
  if (apiUrl && apiUrl !== "undefined" && apiUrl !== "null") {
    return apiUrl.trim();
  }

  const isWeb = typeof window !== "undefined";
  if (isWeb) {
    const host = window.location.host;
    if (host.includes(":")) {
       return `http://${host.split(":")[0]}:3001/api`;
    }
  }

  return "http://localhost:3001/api";
};

const BASE_URL = getBaseUrl();

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Get fresh Firebase token (auto-refreshes if expired)
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // Fallback to stored token if Firebase isn't available
    const storedToken = useAuthStore.getState().token;
    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      useAuthStore.getState().logout();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      throw new Error(data.message ?? data.error ?? `Request failed with status ${response.status}`);
    }

    if (response.status === 204) return {} as T;
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API Fetch Error [${options.method || "GET"} ${path}]:`, error);
    console.error(`Target URL: ${BASE_URL}${path}`);
    throw error;
  }
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  phone: string;
  language: string;
  createdAt: string;
}

export interface MedicineTime {
  hour: number;
  minute: number;
  label?: string;
}

export interface Medicine {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: "daily" | "alternate_days" | "weekly" | "custom";
  times: MedicineTime[];
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface MedicineDoseStatus {
  logId: string | null;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  status: "taken" | "missed" | "pending";
  source: "call" | "manual" | "auto" | null;
}

export interface DashboardData {
  patient: Patient;
  todayDoses: MedicineDoseStatus[];
  adherencePercentage: number;
  weeklyAdherence: { date: string; percentage: number }[];
}

export interface ActivityLog {
  id: string;
  patientId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  respondedAt: string | null;
  status: "taken" | "missed" | "pending" | "no_response";
  source: "call" | "manual" | "auto" | null;
  callSid: string | null;
  retryCount: number;
  createdAt: string;
}

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency?: string;
  time?: string;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
  me: () => api.get<{ id: string; name: string; email: string; createdAt: string }>("/auth/me"),
};

export const patientsApi = {
  getAll: () => api.get<Patient[]>("/patients"),
  getOne: (id: string) => api.get<Patient>(`/patients/${id}`),
  getByNumber: (number: string) => api.get<Patient>(`/patients/number/${number}`),
  create: (data: { name: string; age: number; phone: string; language: string }) =>
    api.post<Patient>("/patients", data),
  update: (id: string, data: Partial<{ name: string; age: number; phone: string; language: string }>) =>
    api.put<Patient>(`/patients/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/patients/${id}`),
  dashboard: (id: string) => api.get<DashboardData>(`/patients/${id}/dashboard`),
  logs: (id: string, limit = 50, offset = 0) =>
    api.get<ActivityLog[]>(`/patients/${id}/logs?limit=${limit}&offset=${offset}`),
};

export const medicinesApi = {
  getAll: (patientId: string) => api.get<Medicine[]>(`/patients/${patientId}/medicines`),
  create: (
    patientId: string,
    data: {
      name: string;
      dosage: string;
      frequency: string;
      times: MedicineTime[];
      startDate: string;
      endDate?: string | null;
    },
  ) => api.post<Medicine>(`/patients/${patientId}/medicines`, data),
  createBatch: (
    patientId: string,
    medicines: Array<{
      name: string;
      dosage: string;
      frequency: string;
      times: MedicineTime[];
      startDate: string;
      endDate?: string | null;
    }>,
  ) => api.post<Medicine[]>(`/patients/${patientId}/medicines/batch`, { medicines }),
  update: (patientId: string, medicineId: string, data: Partial<Medicine>) =>
    api.put<Medicine>(`/patients/${patientId}/medicines/${medicineId}`, data),
  delete: (patientId: string, medicineId: string) =>
    api.delete<{ success: boolean }>(`/patients/${patientId}/medicines/${medicineId}`),
};

export const logsApi = {
  updateStatus: (logId: string, status: "taken" | "missed") =>
    api.patch(`/logs/${logId}/status`, { status }),
};

export interface AIExtractedMedicine {
  name: string;
  dosage: string;
  frequency: "daily" | "alternate_days" | "weekly" | "custom";
  times: MedicineTime[];
  startDate: string;
  endDate: string | null;
}

export const aiApi = {
  parsePrescription: (imageBase64: string) =>
    api.post<{ medicines: AIExtractedMedicine[]; rawText: string }>("/ai/parse-prescription", {
      imageBase64,
    }),
};
