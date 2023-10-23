import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({
    name: 'cell_phone_number',
    type: 'varchar',
    length: 45,
    nullable: false,
    unique: true,
  })
  cellPhoneNumber: string;
  @Column({
    name: 'identity_card',
    type: 'varchar',
    length: 45,
    nullable: false,
    unique: true,
  })
  identityCard: string;
  @Column({ name: 'password', type: 'text', nullable: false })
  password: string;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => Role, (role: Role) => role.users, { nullable: false })
  @JoinTable()
  roles: Role[];
}
