import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('surahs')
@Index(['surahNumber'], { unique: true })
@Index(['canonicalName'], { unique: true })
export class SurahEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  surahNumber!: number;

  @Column({ type: 'varchar', length: 100 })
  canonicalName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  arabicName!: string | null;
}
