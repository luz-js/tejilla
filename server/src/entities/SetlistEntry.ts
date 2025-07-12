import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsInt, Min, IsOptional } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { Event } from './Event';
import { Song } from './Song';

@Entity('setlist_entries')
@Index(['event', 'song'], { unique: true, comment: 'A song can only appear once per event setlist' }) // Composite unique constraint (optional)
@Index(['event', 'orderInSetlist'], { unique: true, comment: 'Order must be unique within an event' }) // Order must be unique within an event
export class SetlistEntry extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.setlistEntries, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => Song, { onDelete: 'CASCADE', eager: true, nullable: false }) // Eager load song details with setlist entry
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @Column({ name: 'song_id', type: 'uuid' })
  songId: string;

  @Column({ name: 'order_in_setlist', type: 'integer' })
  @IsInt()
  @Min(1)
  orderInSetlist: number; // e.g., 1, 2, 3...

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string; // e.g., "Acoustic version", "Capo on 3rd fret"
}
