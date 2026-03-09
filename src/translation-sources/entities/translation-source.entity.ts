import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AyahTranslationEntity } from '../../ayah-translations/entities/ayah-translation.entity';

@Entity('translation_sources')
@Index(['code'], { unique: true })
export class TranslationSourceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  language?: string;

  @OneToMany(
    () => AyahTranslationEntity,
    (translation) => translation.translationSource,
  )
  translations!: AyahTranslationEntity[];
}
