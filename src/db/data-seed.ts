import { DataSource, In } from 'typeorm';
import { hashSync, genSaltSync } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

export async function seedData(dataSource: DataSource): Promise<void> {

    const salt = await genSaltSync(10);
    const userRepository = dataSource.getRepository(User);
    const user = userRepository.create({
        name :'Admin',
        email :'admin@admin.com',
        password :await hashSync('admin', salt),
        favoriteCats :[],
        role :'admin',
    })
    await userRepository.save(user);
}