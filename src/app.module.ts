import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import jwtConfig from './config/jwt.config';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        database: configService.get<string>('database.databaseName'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        port: +configService.get<number>('database.port'),
        synchronize: configService.get<boolean>('database.sync'),
        logging: configService.get<boolean>('database.logging'),
        autoLoadEntities: configService.get<boolean>('database.autoload'),
      }),
    }),
    UserModule,
    AuthModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
