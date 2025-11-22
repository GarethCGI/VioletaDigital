import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
