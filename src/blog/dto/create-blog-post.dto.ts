import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PostStatus } from '../entities/blog-post.entity';

export class CreateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  readTime?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsString()
  tags?: string;
} 