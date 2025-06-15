import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost, PostStatus } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const post = this.blogPostRepository.create(createBlogPostDto);
    if (post.status === PostStatus.PUBLISHED && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    return this.blogPostRepository.save(post);
  }

  async findAll(): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPublished(): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      where: { status: PostStatus.PUBLISHED },
      order: { publishedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async update(id: string, updateBlogPostDto: Partial<CreateBlogPostDto>): Promise<BlogPost> {
    const post = await this.findOne(id);
    
    // Set publishedAt when publishing for the first time
    if (updateBlogPostDto.status === PostStatus.PUBLISHED && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    Object.assign(post, updateBlogPostDto);
    return this.blogPostRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.blogPostRepository.remove(post);
  }

  async seedDefaultPosts(): Promise<void> {
    const count = await this.blogPostRepository.count();
    if (count > 0) return;

    const defaultPosts = [
      {
        title: 'Understanding Anxiety: Signs, Symptoms, and Solutions',
        excerpt: 'Learn to recognize anxiety symptoms and discover evidence-based strategies for managing anxiety in daily life.',
        content: 'Anxiety is one of the most common mental health conditions...',
        category: 'Mental Health',
        readTime: '5 min read',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date('2024-12-15'),
      },
      {
        title: 'The Power of Mindfulness in Therapy',
        excerpt: 'Explore how mindfulness techniques can enhance therapeutic outcomes and improve overall mental wellness.',
        content: 'Mindfulness-based interventions have gained significant recognition...',
        category: 'Therapy Techniques',
        readTime: '7 min read',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date('2024-12-10'),
      },
      {
        title: 'Building Resilience: A Guide for Difficult Times',
        excerpt: 'Discover practical strategies for developing emotional resilience and bouncing back from life\'s challenges.',
        content: 'Resilience is not about avoiding difficult experiences...',
        category: 'Personal Growth',
        readTime: '6 min read',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date('2024-12-05'),
      },
    ];

    for (const postData of defaultPosts) {
      const post = this.blogPostRepository.create(postData);
      await this.blogPostRepository.save(post);
    }
  }
}
