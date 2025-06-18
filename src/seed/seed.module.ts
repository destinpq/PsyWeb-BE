import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { BlogPost } from '../blog/entities/blog-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlogPost])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}