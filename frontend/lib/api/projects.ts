import { api } from "./client";

export type ProjectStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "SUSPENDED"
  | "COMPLETED"
  | "ARCHIVED";

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface ProjectContributionPurpose {
  id: string;
  projectId: string;
  purposeId: string;
  customName?: string;
  displayOrder: number;
  isDefault: boolean;
  purpose?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface BackendProject {
  id: string;
  name: string;
  description?: string | null;
  organizationId?: string | null;
  ownerId?: string;
  categoryId?: string | null;
  eventCode: string;
  currency: string;
  targetAmount?: string | null;
  minAmount: string;
  maxAmount: string;
  status: ProjectStatus;
  acceptsContributions: boolean;
  welcomeMessage?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  settings?: Record<string, unknown>;
  organization?: { id: string; name: string } | null;
  category?: ProjectCategory | null;
  purposes?: ProjectContributionPurpose[];
  totalRaised?: string;
  contributorsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  eventCode: string;
  currency?: string;
  targetAmount?: string;
  minAmount?: string;
  maxAmount?: string;
  welcomeMessage?: string;
  startDate?: string;
  endDate?: string;
  acceptsContributions?: boolean;
  categoryId?: string;
  organizationId?: string;
}

export interface UpdateProjectInput extends Partial<Omit<CreateProjectInput, "eventCode">> {
  status?: ProjectStatus;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: BackendProject[];
  meta: PaginationMeta;
}

export interface SingleProjectResponse {
  success: boolean;
  message: string;
  data: BackendProject;
}

export async function getProjects(params?: {
  page?: number;
  limit?: number;
  status?: ProjectStatus | string;
  search?: string;
  organizationId?: string;
}): Promise<{ projects: BackendProject[]; meta: PaginationMeta }> {
  const { data } = await api.get<ProjectsResponse>("/projects", { params });
  return {
    projects: data.data ?? [],
    meta: data.meta ?? { page: 1, limit: 20, total: 0, totalPages: 1 },
  };
}

export async function getProjectById(id: string): Promise<BackendProject> {
  const { data } = await api.get<SingleProjectResponse>(`/projects/${id}`);
  return data.data;
}

export async function createProject(input: CreateProjectInput): Promise<BackendProject> {
  const { data } = await api.post<SingleProjectResponse>("/projects", input);
  return data.data;
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<BackendProject> {
  const { data } = await api.put<SingleProjectResponse>(`/projects/${id}`, input);
  return data.data;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: ProjectCategory[];
}

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const { data } = await api.get<CategoriesResponse>("/projects/categories");
  return data.data ?? [];
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus,
  notes?: string
): Promise<BackendProject> {
  const { data } = await api.patch<SingleProjectResponse>(`/projects/${id}/status`, { status, notes });
  return data.data;
}
