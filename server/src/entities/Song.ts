import { Entity, Column, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { Length, IsOptional, IsUrl, IsInt, Min } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
// import { Event } from './Event'; // To be created for SetlistEntry

@Entity('songs')
export class Song extends BaseEntity {
  @Column()
  @Length(1, 255)
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @Length(1, 255)
  original_artist?: string;

  @Column({ type: 'integer', nullable: true, comment: 'Duration in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration_seconds?: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  lyrics?: string;

  @Column({ nullable: true })
  @IsOptional()
  @Length(1, 50)
  key?: string; // E.g., 'C#m', 'G', 'Am'

  @Column({ nullable: true })
  @IsOptional()
  @Length(1, 100)
  genre?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  audio_url?: string; // Link to a recording/demo

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  sheet_music_url?: string; // Link to sheet music/tablature

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' }) // Optional: if you want to track who added the song
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy?: User;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  created_by_user_id?: string;

  // Relationship for SetlistEntries will be ManyToMany with Event through SetlistEntry
  // This will be defined in SetlistEntry or indirectly via Event.
}
