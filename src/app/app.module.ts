import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from 'src/utility/middlewares/logger.middleware';
import { MediaModule } from './media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CategoriesModule } from './categories/categories.module';
import * as path from 'path';
import { CurrentUserMiddleware } from 'src/utility/middlewares/current-user.middleware';
import { BlogsModule } from './blogs/blogs.module';
import { TagsModule } from './tags/tags.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        migrations: ['dist/src/database/migrations/*{.ts,.js}'],
        synchronize: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_JWT'),
        signOptions: { expiresIn: '10d' },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../../', 'static'),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_SERVER_HOST'),
          post: configService.get<number>('EMAIL_SERVER_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: 'welcome  <info@mail.benitech.ir>',
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
    AuthModule,
    UsersModule,
    MediaModule,
    CategoriesModule,
    BlogsModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
