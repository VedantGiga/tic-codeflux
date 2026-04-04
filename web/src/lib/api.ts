
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

const getBaseUrl = (): string => {
  // In development, we usually talk to localhost:3001
  // If we have an environment variable, use it.
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  return "http://localhost:3001/api";
};

const BASE_URL = getBaseUrl();

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // For now, no auth token is required for simple testing, 
  // but if we had one (e.g. in localStorage), we'd add it here.
  const token = localStorage.getItem("caredose_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
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

export const patientsApi = {
  getAll: () => api.get<Patient[]>("/patients"),
  getOne: (id: string) => api.get<Patient>(`/patients/${id}`),
  dashboard: (id: string) => api.get<DashboardData>(`/patients/${id}/dashboard`),
  logs: (id: string) => api.get<ActivityLog[]>(`/patients/${id}/logs`),
};

export const medicinesApi = {
  getAll: (patientId: string) => api.get<Medicine[]>(`/patients/${patientId}/medicines`),
  create: (patientId: string, data: Partial<Medicine>) =>
    api.post<Medicine>(`/patients/${patientId}/medicines`, data),
  update: (patientId: string, medicineId: string, data: Partial<Medicine>) =>
    api.put<Medicine>(`/patients/${patientId}/medicines/${medicineId}`, data),
  delete: (patientId: string, medicineId: string) =>
    api.delete<{ success: boolean }>(`/patients/${patientId}/medicines/${medicineId}`),
};
