import { Project, ProjectStatus } from '../database/entities/project.entity';
import { projectService } from './project.service';
import { UssdFlowVersion } from '../database/entities/ussd-flow-version.entity';
import { UssdFlow } from '../database/entities/ussd-flow.entity';
import { InternalUssdRequest } from './nalo.adapter';
import { ussdFlowService } from './ussd-flow.service';

export interface ResolvedFlowResult {
  flow: UssdFlow | null;
  version: UssdFlowVersion | null;
  project: Project | null;
  directEventCodeUsed?: string;
  rejectionMessage?: string;
}

export class UssdRoutingService {
  /**
   * Resolves appropriate flow based on incoming request (event code dial vs general dial)
   */
  async resolveFlow(request: InternalUssdRequest): Promise<ResolvedFlowResult> {
    // 1. Direct Project Entry via event code suffix (*920*969*<EVENT_CODE>#)
    if (request.eventCodeExtracted) {
      const rawProject = await projectService.getProjectByEventCodeRaw(request.eventCodeExtracted);
      if (rawProject) {
        const now = new Date();
        if (rawProject.startDate && new Date(rawProject.startDate) > now) {
          const startDateStr = new Date(rawProject.startDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          return {
            flow: null,
            version: null,
            project: rawProject,
            directEventCodeUsed: request.eventCodeExtracted,
            rejectionMessage: `${rawProject.name} has not started yet. Contributions open on ${startDateStr}.`.slice(0, 120),
          };
        }

        if (rawProject.status !== ProjectStatus.PUBLISHED || !rawProject.acceptsContributions) {
          return {
            flow: null,
            version: null,
            project: rawProject,
            directEventCodeUsed: request.eventCodeExtracted,
            rejectionMessage: `${rawProject.name} is not currently accepting contributions.`.slice(0, 120),
          };
        }

        const projectFlow = await ussdFlowService.getProjectPublishedFlow(rawProject.id);
        if (projectFlow) {
          return {
            flow: projectFlow.flow,
            version: projectFlow.version,
            project: rawProject,
            directEventCodeUsed: request.eventCodeExtracted,
          };
        }
      }
    }

    // 2. Fallback to General ZFund USSD Menu (*920*969#)
    const generalFlow = await ussdFlowService.getGeneralPublishedFlow();
    return {
      flow: generalFlow?.flow || null,
      version: generalFlow?.version || null,
      project: null,
    };
  }
}

export const ussdRoutingService = new UssdRoutingService();
