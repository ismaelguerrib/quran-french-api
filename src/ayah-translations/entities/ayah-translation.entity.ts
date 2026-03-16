import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AyahEntity } from '../../ayahs/entities/ayah.entity';
import { TranslationSourceEntity } from '../../translation-sources/entities/translation-source.entity';

@Entity('ayah_translations')
@Index(['ayahId', 'translationSourceId'], { unique: true })
export class AyahTranslationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ayahId!: number;

  @Column()
  translationSourceId!: number;

  @Column({ type: 'varchar', length: 100 })
  reference!: string;

  @Column({ type: 'text', nullable: true })
  text!: string | null;

  @Column({ type: 'integer', nullable: true })
  wordCount!: number | null;

  @ManyToOne(() => AyahEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ayahId' })
  ayah!: AyahEntity;

  @ManyToOne(() => TranslationSourceEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'translationSourceId' })
  translationSource!: TranslationSourceEntity;
}
