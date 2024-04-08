import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Cats } from 'src/cats/entities/cats.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;    

    @Column()
    role: string;    

    @ManyToMany(() => Cats, cat => cat.users)
    favoriteCats: Cats[];
}