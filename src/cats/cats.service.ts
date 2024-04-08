import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Cats } from './entities/cats.entity';
import { ICat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cats) 
    private readonly catsRepository: Repository<Cats>,
    
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ) {}

  async create(cat: CreateCatDto): Promise<ICat> {
    try {
      const newCat = await this.catsRepository.save(cat);   
      return newCat;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id:number): Promise<ICat> {
    const cat = await this.catsRepository.findOne({where:{id:id}});
    return cat;
  }

  async findAll(): Promise<ICat[]> {
    const cats = await this.catsRepository.find();
    return cats;
  }

  // This method update a cat by ID. 
  async updateOne(id: number, updateData: CreateCatDto): Promise<ICat> {
    const isExist = await this.catsRepository.exists({ where: { id: id } });
    if(!isExist) {
      throw new HttpException('Not found cat', HttpStatus.NOT_FOUND);
    }
    
    const cat = new Cats();
    cat.name = updateData.name;
    cat.age = updateData.age;
    cat.breed = updateData.breed;
    cat.id = id;

    return this.catsRepository.save(cat);
  }


  // This method removes a cat by ID. 
  async removeOne(id: number): Promise<void> {
    const cat = await this.catsRepository.findOne({ where: { id: id } });
    if(!cat) {
      throw new HttpException('Not found cat', HttpStatus.NOT_FOUND);
    }
    try {
      await this.catsRepository.delete({id:id});
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // This method allows a user to set a cat as a favorite. It first checks if the cat exists in the database. 
  // Then it retrieves the user by ID and manages the favorite cats list by adding or removing the specified cat.
  // Finally, it returns the updated user with the modified favorite cats list.
  async favoriteSet(catId: number, userId: number): Promise<User> {
    const cat = await this.catsRepository.findOne({ where: { id: catId } });
    if(!cat) {
      throw new HttpException('Not found cat', HttpStatus.NOT_FOUND);
    }
    
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId })
        .leftJoinAndSelect('user.favoriteCats', 'cats')
        .getOne();
      
      const favoriteCatsIds = user.favoriteCats.map(item => item.id);
      if(favoriteCatsIds.includes(catId)) {
        user.favoriteCats = user.favoriteCats.filter(item => item.id !== catId);
        const updateUser = await this.userRepository.save(user);
        return updateUser;
      } else {
        user.favoriteCats.push(cat);
        const updateUser =  await this.userRepository.save(user);
        return updateUser;
      }
    } catch (error) {
      console.log(error)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}