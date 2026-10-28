"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectUssdFlow,
  configureProjectUssdFlow,
  type InitializeProjectFlowInput,
} from "@/lib/api/ussd-flows";

export function useProjectUssdFlowQuery(projectId?: string) {
  return useQuery({
    queryKey: ["ussd-flow", projectId],
    queryFn: () => getProjectUssdFlow(projectId!),
    enabled: Boolean(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useConfigureProjectUssdFlowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      input,
    }: {
      projectId: string;
      input: InitializeProjectFlowInput;
    }) => configureProjectUssdFlow(projectId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ussd-flow", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
