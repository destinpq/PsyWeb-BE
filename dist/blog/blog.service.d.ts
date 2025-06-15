import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
export declare class BlogService {
    private readonly blogPostRepository;
    constructor(blogPostRepository: Repository<BlogPost>);
    create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost>;
    findAll(): Promise<BlogPost[]>;
    findPublished(): Promise<BlogPost[]>;
    findOne(id: string): Promise<BlogPost>;
    update(id: string, updateBlogPostDto: Partial<CreateBlogPostDto>): Promise<BlogPost>;
    remove(id: string): Promise<void>;
    seedDefaultPosts(): Promise<void>;
}
