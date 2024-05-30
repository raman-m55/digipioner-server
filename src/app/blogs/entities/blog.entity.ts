import { Category } from 'src/app/categories/entities/category.entity';
import { Tag } from 'src/app/tags/entities/tag.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  slug: string;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  excerpt: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'int', nullable: true })
  views: number;

  @Column({ type: 'int', nullable: true })
  likes: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ManyToOne(() => Category, (cat) => cat.posts)
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.post_blogs)
  author: User;
}
