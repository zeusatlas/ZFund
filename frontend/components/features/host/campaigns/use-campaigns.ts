"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Campaign, type CampaignStatus } from "@/components/features/host/shared/demo";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getProjectCategories,
  getNextProjectCode,
  getProjectStats,
  type BackendProject,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ProjectStatus,
} from "@/lib/api/projects";

export type { ProjectStats } from "@/lib/api/projects";

export function projectToCampaign(project: BackendProject): Campaign {
  const goalInPesewas = project.targetAmount
    ? Math.round(parseFloat(project.targetAmount) * 100)
    : 0;

  const raisedInPesewas = project.totalRaised
    ? Math.round(parseFloat(project.totalRaised) * 100)
    : 0;

  const contributors = project.contributorsCount ?? 0;

  const statusMap: Record<ProjectStatus, CampaignStatus> = {
    DRAFT: "Draft",
    PENDING_REVIEW: "Draft",
    APPROVED: "Active",
    PUBLISHED: "Active",
    SUSPENDED: "Draft",
    COMPLETED: "Completed",
    ARCHIVED: "Completed",
  };

  return {
    id: project.id,
    name: project.name,
    eventCode: project.eventCode,
    location: project.welcomeMessage || "Ghana",
    category: project.category?.name || "General Fundraising",
    description: project.description || "",
    goal: goalInPesewas,
    raised: raisedInPesewas,
    contributors,
    status: statusMap[project.status] || "Active",
    rawStatus: project.status,
    created: project.createdAt ? project.createdAt.slice(0, 10) : "",
    closing: project.endDate ? project.endDate.slice(0, 10) : "",
    currency: project.currency,
    acceptsContributions: project.acceptsContributions,
  };
}

export function useProjectsQuery(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      const result = await getProjects(params);
      return result.projects;
    },
    staleTime: 5_000,
  });
}

export function useProjectCategoriesQuery() {
  return useQuery({
    queryKey: ["project-categories"],
    queryFn: getProjectCategories,
    staleTime: 60_000,
  });
}

export function computeNextCampaignCode(
  campaignsOrProjects: Array<{ eventCode?: string | null }>
): string {
  for (const item of campaignsOrProjects) {
    const code = item.eventCode?.trim();
    if (code && /^\d{4}$/.test(code)) {
      const num = parseInt(code, 10);
      if (!isNaN(num) && num >= 1000 && num <= 9999) {
        return (num + 1).toString();
      }
    }
  }

  const numericCodes = campaignsOrProjects
    .map((c) => parseInt(c.eventCode || "", 10))
    .filter((n) => !isNaN(n) && n >= 1000 && n <= 9999);

  if (numericCodes.length > 0) {
    return (Math.max(...numericCodes) + 1).toString();
  }

  return "1001";
}

export function useNextCampaignCodeQuery(enabled = true) {
  return useQuery({
    queryKey: ["projects", "next-code"],
    queryFn: getNextProjectCode,
    enabled,
    staleTime: 0,
  });
}

export function useProjectStatsQuery() {
  return useQuery({
    queryKey: ["projects", "stats"],
    queryFn: getProjectStats,
    staleTime: 5_000,
  });
}

export function useCampaignsList(params?: { search?: string; status?: string }) {
  const query = useProjectsQuery(params);
  const campaigns = useMemo(() => {
    return (query.data || []).map(projectToCampaign);
  }, [query.data]);

  return {
    ...query,
    campaigns,
    backendCount: campaigns.length,
  };
}

export function useCampaigns(): Campaign[] {
  const { campaigns } = useCampaignsList();
  return campaigns;
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const project = await getProjectById(id);
      return projectToCampaign(project);
    },
    enabled: Boolean(id && id.length > 10), // UUID length
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProjectStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: ProjectStatus; notes?: string }) =>
      updateProjectStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      updateProject(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export async function saveCampaign(input: CreateProjectInput) {
  return createProject(input);
}
