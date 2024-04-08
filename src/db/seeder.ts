import { DataSource } from 'typeorm';
import { seedData } from './data-seed';
import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  await seedData(dataSource);
  await app.close();
}
runSeeder();