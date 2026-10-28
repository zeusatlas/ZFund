import { AppDataSource } from '../config/database';
import { NotFoundError } from '../common/errors/app-error';
import { Contribution, ContributionStatus } from '../database/entities/contribution.entity';

export class ContributionService {
  private get contributionRepo() { return AppDataSource.getRepository(Contribution); }

  async getContributions(params: {
    projectId?: string;
    contributorId?: string;
    status?: ContributionStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ contributions: Contribution[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.contributionRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.project', 'project')
      .leftJoinAndSelect('c.contributor', 'contributor')
      .leftJoinAndSelect('c.purpose', 'purpose')
      .leftJoinAndSelect('c.paymentAttempts', 'paymentAttempts');

    if (params.projectId) {
      query.andWhere('c.projectId = :projectId', { projectId: params.projectId });
    }
    if (params.contributorId) {
      query.andWhere('c.contributorId = :contributorId', { contributorId: params.contributorId });
    }
    if (params.status) {
      query.andWhere('c.status = :status', { status: params.status });
    }
    if (params.search) {
      query.andWhere(
        '(c.reference LIKE :search OR contributor.msisdn LIKE :search OR contributor.name LIKE :search)',
        { search: `%${params.search}%` }
      );
    }

    query.orderBy('c.createdAt', 'DESC').skip(skip).take(limit);

    const [contributions, total] = await query.getManyAndCount();
    return { contributions, total };
  }

  async getContributionById(id: string): Promise<Contribution> {
    const contribution = await this.contributionRepo.findOne({
      where: [{ id }, { reference: id }],
      relations: ['project', 'contributor', 'purpose', 'paymentAttempts'],
    });

    if (!contribution) {
      throw new NotFoundError('Contribution not found');
    }

    return contribution;
  }
}

export const contributionService = new ContributionService();
