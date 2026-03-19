import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type QuestionnaireInformantRole = 'VICTIM' | 'WITNESS' | 'PREFER_NOT_TO_SAY' | 'OTHER';
export type QuestionnaireFrequency = 'NEVER' | 'SOMETIMES' | 'OFTEN' | 'ALMOST_ALWAYS';
export type QuestionnaireRiskLevel = 'YELLOW' | 'ORANGE' | 'RED';

export interface QuestionnaireData {
  level0: {
    informantRole: QuestionnaireInformantRole;
  };
  level1: {
    hurtfulJokes: QuestionnaireFrequency;
    jealousyControlHumiliation: QuestionnaireFrequency;
    exclusion: QuestionnaireFrequency;
    physicalAggression: QuestionnaireFrequency;
    digitalHarassment: QuestionnaireFrequency;
  };
  level3?: {
    damageAfterViolence?: 'IMMEDIATE' | 'AFTER_SOME' | 'MOST_EPISODES' | 'PRE_EXISTING';
    wantsAnonymousRecord?: boolean;
    wantsToIdentifyRelatedPerson?: boolean;
    wantsAnonymousContact?: boolean;
    preferredInitialContact?: 'IN_APP' | 'EMAIL' | 'PHONE' | 'NO_CONTACT';
    preferredSupport?: 'PSYCHOLOGICAL' | 'ACADEMIC' | 'LEGAL' | 'SOCIAL';
  };
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  role!: string;

  @Column({ type: 'varchar', length: 100 })
  type!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  date?: string;

  @Column({ type: 'text', nullable: true })
  witnesses?: string;

  @Column({ type: 'text', nullable: true })
  additionalInfo?: string;

  @Column({ type: 'simple-json', nullable: true })
  questionnaireData?: QuestionnaireData;

  @Column({ type: 'varchar', length: 20, nullable: true })
  riskLevel?: QuestionnaireRiskLevel;

  @Column({ type: 'varchar', length: 30, nullable: true })
  informantRole?: QuestionnaireInformantRole;

  @Column({ type: 'boolean', default: false })
  hasQuestionnaire!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
