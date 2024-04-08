import { Body, Controller, Delete, Get, Param, Post, UseGuards, Res, Req, Put } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { JWTAuthGuard } from 'src/user/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('cats')
@UseGuards(JWTAuthGuard) // Apply JWTAuthGuard to the entire controller for authentication
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // Create a new cat
  @Post()
  @Roles('admin') // Apply role-based access control
  @UseGuards(RolesGuard) // Apply RolesGuard to handle role-based access control
  async create(@Body() createCatDto: CreateCatDto, @Res() res: Response) {
    try {
      const cat = await this.catsService.create(createCatDto);
      return res.status(201).json({ cat, message: 'Created new cat' });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }

  // Get all cats
  @Get()
  async findAll(@Res() res: Response) {
    const cats = await this.catsService.findAll();
    return res.status(200).json({ cats });
  }

  // Get a specific cat by ID
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number, @Res() res: Response) {
    try {
      const cat = await this.catsService.findOne(id);
      return res.status(200).json({ cat });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }
  
  // Update a cat by ID
  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async updateOne(@Body() updatedCatDto: CreateCatDto, @Param('id', new ParseIntPipe()) id: number, @Res() res: Response) {
    try {
      const updatedCat = await this.catsService.updateOne(id, updatedCatDto);
      return res.status(200).json({ updatedCat, message: 'Updated the cat' });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }

  // Delete a cat by ID
  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async removeOne(@Param('id', new ParseIntPipe()) id: number, @Res() res: Response) {
    try {
      await this.catsService.removeOne(id);
      return res.status(200).json({ message: 'Deleted the cat' });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }

  // Set a cat as favorite for a user
  @Post('favorite/:id')
  async favoriteSet(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number, @Res() res: Response) {
    try {
      const user = await this.catsService.favoriteSet(id, req.user['id']);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }
}
