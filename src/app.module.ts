import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './middleware/session.middleware';
import { BOTNAME } from './shared/constants/global.constants';
import { GreeterModule } from './greeter/greeter.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
config();
console.log(
  '=>(app.module.ts:11) process.env.MONGO_URL',
  process.env.MONGO_URL,
);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      botName: BOTNAME,
      useFactory: async (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
        middlewares: [sessionMiddleware],
      }),
      inject: [ConfigService],
    }),
    GreeterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
