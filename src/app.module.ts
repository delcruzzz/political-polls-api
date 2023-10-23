import { Module } from '@nestjs/common';
import { MunicipalitiesModule } from './municipalities/municipalities.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { NeighborhoodsModule } from './neighborhoods/neighborhoods.module';
import { SurveyedModule } from './surveyed/surveyed.module';
import { VotingMunicipalitiesModule } from './voting-municipalities/voting-municipalities.module';
import { PollingStationsModule } from './polling-stations/polling-stations.module';
import { VotingTablesModule } from './voting-tables/voting-tables.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MunicipalitiesModule,
    AuthModule,
    UsersModule,
    RolesModule,
    NeighborhoodsModule,
    SurveyedModule,
    VotingMunicipalitiesModule,
    PollingStationsModule,
    VotingTablesModule,
  ],
})
export class AppModule {}
