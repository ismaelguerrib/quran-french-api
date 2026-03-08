import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ayahs')
@Index(['surahNumber', 'ayahNumber'], { unique: true })
export class AyahEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  surahNumber!: number;

  @Column()
  ayahNumber!: number;
}
