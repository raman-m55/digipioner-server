import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Codes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'int', nullable: false })
  code: number;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_used: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  expired: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  expiresAt: Date;
}
