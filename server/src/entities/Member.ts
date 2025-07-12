import { Entity, Column } from 'typeorm';
import { Length, IsOptional, IsUrl } from 'class-validator';
import { BaseEntity } from './BaseEntity';

@Entity('members')
export class Member extends BaseEntity {
  @Column()
  @Length(1, 150)
  name: string;

  @Column({ name: 'role_in_band' })
  @Length(1, 100)
  roleInBand: string; // E.g., 'Vocalista', 'Guitarrista', 'Manager'

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  bio?: string;

  @Column({ name: 'photo_url', nullable: true })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @Column({ nullable: true })
  @IsOptional()
  @Length(1, 100)
  instrument?: string; // E.g., 'Guitarra Eléctrica', 'Voz Principal'

  @Column({ name: 'is_active_member', default: true })
  isActiveMember: boolean;

  // Add other fields like contact info if needed, but keep PII minimal or managed securely
  // @Column({ nullable: true })
  // @IsOptional()
  // @IsEmail()
  // contactEmail?: string;
}
