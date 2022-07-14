import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from './user/commands/user.command';
import { UserService } from './user/user.service';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CommandModule,
    GroupModule,
  ],
  controllers: [],
  providers: [UserCommand, UserService],
})
export class AppModule {}
