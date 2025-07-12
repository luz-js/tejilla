import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { BaseEntity } from './BaseEntity'; // Assuming you have a BaseEntity with id, createdAt, updatedAt
import { Song } from './Song';
import { Event } from './Event';

export enum UserRole {
  ADMIN = 'admin', // Can manage everything
  EDITOR = 'editor', // Can manage songs, events, members
  LECTOR = 'lector', // Read-only access
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Length(3, 50)
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Length(8, 255) // Min length for password (before hashing)
  password_hash: string; // Store hashed passwords only

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.LECTOR,
  })
  @IsEnum(UserRole)
  role: UserRole;

  // Relationships (optional, for audit trails or direct linking)
  @OneToMany(() => Song, song => song.createdBy)
  createdSongs: Song[];

  @OneToMany(() => Event, event => event.createdBy)
  createdEvents: Event[];

  // Add any other user-specific fields here
  // For example:
  // @Column({ nullable: true })
  // firstName?: string;

  // @Column({ nullable: true })
  // lastName?: string;
}
