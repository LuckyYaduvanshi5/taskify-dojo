
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // ISO string format
  status: Status;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}

export type SortOption = 'priority' | 'dueDate' | 'status' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilter {
  priority?: Priority;
  status?: Status;
  searchTerm?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
}
