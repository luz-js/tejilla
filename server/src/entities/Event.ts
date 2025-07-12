import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Length, IsOptional, IsDateString } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { SetlistEntry } from './SetlistEntry'; // To be created

@Entity('events')
export class Event extends BaseEntity {
  @Column()
  @Length(1, 255)
  title: string;

  @Column({ type: 'timestamp with time zone' })
  @IsDateString()
  date: Date; // Includes date and time

  @Column({ name: 'venue_name', nullable: true })
  @IsOptional()
  @Length(1, 255)
  venueName?: string;

  @Column({ name: 'venue_address', type: 'text', nullable: true })
  @IsOptional()
  venueAddress?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description?: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean; // To distinguish drafts/private events from public ones

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' }) // Optional: track who created the event
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy?: User;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  created_by_user_id?: string;

  @OneToMany(() => SetlistEntry, (setlistEntry) => setlistEntry.event, { cascade: ['insert', 'update', 'remove'], eager: false })
  setlistEntries: SetlistEntry[];

  // You could add other fields like:
  // @Column({ name: 'ticket_url', nullable: true })
  // @IsOptional()
  // @IsUrl()
  // ticketUrl?: string;

  // @Column({ name: 'event_type', nullable: true }) // e.g., 'Concert', 'Rehearsal', 'Private Party'
  // @IsOptional()
  // eventType?: string;
}
