// ─── Task / Project ───────────────────────────────────────────────────────────

export type Priority = "Low" | "Medium" | "High";

export type TaskStatus =
  | "To do"
  | "In progress"
  | "Under review"
  | "Completed"
  | "Overdue"
  | "Cancelled";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status?: TaskStatus;
  progress: number;
  progressColor?: string;
  date?: string;
  deadline?: string;
  budget?: string;
  assignees?: string[];
  comments?: number;
  image?: string;
  aiInsights?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: "admin" | "member" | "viewer";
  createdAt?: string;
}

// ─── API Response Envelopes ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
