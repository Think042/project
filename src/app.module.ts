import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostService } from './post/post.service';
import { PrismaService } from './prisma.service';
import { PostController } from './post/post.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ConfigModule, UserModule],
  controllers: [AppController, PostController],
  providers: [AppService, PostService, PrismaService],
})
export class AppModule {}
