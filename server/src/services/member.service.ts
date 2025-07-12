import { AppDataSource } from '../config/data-source';
import { Member } from '../entities/Member';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/member';
import { Repository, FindManyOptions, Like, FindOptionsWhere } from 'typeorm';
import { HttpException } from '../middlewares/errorHandler';

export interface FindAllMembersQuery {
  page?: number;
  limit?: number;
  name?: string;
  roleInBand?: string;
  instrument?: string;
  isActiveMember?: boolean; // Filter by active status
}

export interface PaginatedMembersResponse {
  data: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class MemberService {
  private memberRepository: Repository<Member>;

  constructor() {
    this.memberRepository = AppDataSource.getRepository(Member);
  }

  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    // Optional: Check for existing member with the same name if names should be unique
    // const existingMember = await this.memberRepository.findOneBy({ name: createMemberDto.name });
    // if (existingMember) {
    //   throw new HttpException(409, `Un miembro con el nombre '${createMemberDto.name}' ya existe.`);
    // }

    const newMember = this.memberRepository.create(createMemberDto);
    return this.memberRepository.save(newMember);
  }

  async getAllMembers(query: FindAllMembersQuery): Promise<PaginatedMembersResponse> {
    const { page = 1, limit = 10, name, roleInBand, instrument, isActiveMember } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Member> = {};
    if (name) where.name = Like(`%${name}%`);
    if (roleInBand) where.roleInBand = Like(`%${roleInBand}%`);
    if (instrument) where.instrument = Like(`%${instrument}%`);
    if (typeof isActiveMember === 'boolean') where.isActiveMember = isActiveMember;


    const findOptions: FindManyOptions<Member> = {
      where,
      skip,
      take: limit,
      order: { name: 'ASC' }, // Default order
    };

    const [members, total] = await this.memberRepository.findAndCount(findOptions);

    return {
      data: members,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMemberById(id: string): Promise<Member | null> {
    const member = await this.memberRepository.findOneBy({ id });
    if (!member) {
      throw new HttpException(404, 'Miembro no encontrado.');
    }
    return member;
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const memberToUpdate = await this.memberRepository.preload({
      id,
      ...updateMemberDto,
    });

    if (!memberToUpdate) {
      throw new HttpException(404, 'Miembro no encontrado para actualizar.');
    }

    // Optional: Check for name conflict if name is being changed and should be unique
    // if (updateMemberDto.name && updateMemberDto.name !== memberToUpdate.name) {
    //   const existingMember = await this.memberRepository.findOneBy({ name: updateMemberDto.name });
    //   if (existingMember && existingMember.id !== id) {
    //     throw new HttpException(409, `Otro miembro con el nombre '${updateMemberDto.name}' ya existe.`);
    //   }
    // }

    return this.memberRepository.save(memberToUpdate);
  }

  async deleteMember(id: string): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id });
    if (!member) {
      throw new HttpException(404, 'Miembro no encontrado para eliminar.');
    }
    const result = await this.memberRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(404, 'Miembro no encontrado, no se pudo eliminar.');
    }
  }
}
