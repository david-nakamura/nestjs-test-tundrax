import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Cats {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @ManyToMany(() => User, user => user.favoriteCats)
  @JoinTable()
  users: User[];
}