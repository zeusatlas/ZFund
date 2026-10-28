import { api } from "./client";

export interface UssdMenuOption {
  id: string;
  displayOrder: number;
  optionKey: string;
  label: string;
  optionType: "NAVIGATION" | "ACTION";
  targetMenuKey?: string;
  actionReference?: string;
  validationConfig?: Record<string, unknown>;
  isActive: boolean;
}

export interface UssdMenu {
  id: string;
  menuKey: string;
  title: string;
  prompt: string;
  menuType: "SELECT" | "INPUT" | "DISPLAY";
  displayOrder: number;
  isActive: boolean;
  options: UssdMenuOption[];
}

export interface UssdFlowVersion {
  id: string;
  versionNumber: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  notes?: string;
  menus: UssdMenu[];
}

export interface UssdFlow {
  id: string;
  name: string;
  description?: string;
  projectId?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  activeVersionId?: string;
  versions?: UssdFlowVersion[];
}

export interface ProjectFlowData {
  flow: UssdFlow;
  version: UssdFlowVersion | null;
}

export type UssdFlowResponse = ProjectFlowData;

export interface PurposeFlowItem {
  label: string;
  purposeId?: string;
  subSteps?: string[];
}

export interface InitializeProjectFlowInput {
  welcomePrompt?: string;
  amountPrompt?: string;
  confirmPrompt?: string;
  otpPrompt?: string;
  allowDirectAmount?: boolean;
  currency?: string;
  purposes?: PurposeFlowItem[];
}

export async function getProjectUssdFlow(projectId: string): Promise<ProjectFlowData> {
  const { data } = await api.get<{ success: boolean; data: ProjectFlowData }>(
    `/ussd-flows/projects/${projectId}`
  );
  return data.data;
}

export async function configureProjectUssdFlow(
  projectId: string,
  input: InitializeProjectFlowInput
): Promise<UssdFlow> {
  const { data } = await api.post<{ success: boolean; data: UssdFlow }>(
    `/ussd-flows/projects/${projectId}/initialize`,
    input
  );
  return data.data;
}

