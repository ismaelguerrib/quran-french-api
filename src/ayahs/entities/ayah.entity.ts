import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ayahs')
@Index(['surahNumber', 'verseKey'], { unique: true })
export class AyahEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  surahNumber!: number;

  @Column({ type: 'varchar', length: 50 })
  verseKey!: string;

  @Column({ type: 'integer', nullable: true })
  verseNumber!: number | null;
}
