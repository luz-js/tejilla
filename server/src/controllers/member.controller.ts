import { Request, Response, NextFunction } from 'express';
import { MemberService, FindAllMembersQuery } from '../services/member.service';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/member';
import { validate } from 'class-validator';
import { HttpException } from '../middlewares/errorHandler';
import { plainToClass } from 'class-transformer';

export class MemberController {
  private memberService: MemberService;

  constructor() {
    this.memberService = new MemberService();
  }

  public createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createMemberDto = plainToClass(CreateMemberDto, req.body);
      const errors = await validate(createMemberDto);

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al crear miembro.', errors);
      }

      const member = await this.memberService.createMember(createMemberDto);
      res.status(201).json({ data: member, message: 'Miembro creado exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getAllMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams: FindAllMembersQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        name: req.query.name as string | undefined,
        roleInBand: req.query.roleInBand as string | undefined,
        instrument: req.query.instrument as string | undefined,
        isActiveMember: req.query.isActiveMember !== undefined ? (req.query.isActiveMember === 'true') : undefined,
      };

      if (queryParams.page !== undefined && (isNaN(queryParams.page) || queryParams.page < 1)) {
        throw new HttpException(400, 'Parámetro de página inválido.');
      }
      if (queryParams.limit !== undefined && (isNaN(queryParams.limit) || queryParams.limit < 1)) {
        throw new HttpException(400, 'Parámetro de límite inválido.');
      }

      const paginatedResult = await this.memberService.getAllMembers(queryParams);
      res.status(200).json({ ...paginatedResult, message: 'Miembros obtenidos exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id;
      if (!memberId) {
        throw new HttpException(400, 'ID de miembro no proporcionado.');
      }
      const member = await this.memberService.getMemberById(memberId);
      res.status(200).json({ data: member, message: 'Miembro obtenido exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public updateMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id;
      if (!memberId) {
        throw new HttpException(400, 'ID de miembro no proporcionado.');
      }

      const updateMemberDto = plainToClass(UpdateMemberDto, req.body);
      const errors = await validate(updateMemberDto);

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al actualizar miembro.', errors);
      }

      if (Object.keys(updateMemberDto).length === 0) {
        throw new HttpException(400, 'El cuerpo de la solicitud no puede estar vacío para la actualización.');
      }

      const updatedMember = await this.memberService.updateMember(memberId, updateMemberDto);
      res.status(200).json({ data: updatedMember, message: 'Miembro actualizado exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public deleteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id;
      if (!memberId) {
        throw new HttpException(400, 'ID de miembro no proporcionado.');
      }
      await this.memberService.deleteMember(memberId);
      res.status(200).json({ message: 'Miembro eliminado exitosamente.' });
    } catch (error) {
      next(error);
    }
  };
}
