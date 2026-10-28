import { Project } from '../database/entities/project.entity';
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
}

export class UssdRoutingService {
  /**
   * Resolves appropriate flow based on incoming request (event code dial vs general dial)
   */
  async resolveFlow(request: InternalUssdRequest): Promise<ResolvedFlowResult> {
    // 1. Direct Project Entry via event code suffix (*920*969*<EVENT_CODE>#)
    if (request.eventCodeExtracted) {
      const project = await projectService.getProjectByEventCode(request.eventCodeExtracted);
      if (project) {
        const projectFlow = await ussdFlowService.getProjectPublishedFlow(project.id);
        if (projectFlow) {
          return {
            flow: projectFlow.flow,
            version: projectFlow.version,
            project,
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
