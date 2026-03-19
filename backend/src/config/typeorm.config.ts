import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgres://traffic_admin:secure_db_password_123@localhost:5432/traffic_exchange',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // Use carefully in production! Good for prototyping.
  autoLoadEntities: true,
};
