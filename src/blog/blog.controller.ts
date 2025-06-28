import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPost } from './entities/blog-post.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(): Promise<BlogPost[]> {
    return this.blogService.findAll();
  }

  @Get('published')
  async findPublished(): Promise<BlogPost[]> {
    return this.blogService.findPublished();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    return this.blogService.findOne(id);
  }
}
