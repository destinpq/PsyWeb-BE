import { Repository } from 'typeorm';
import { BlogPost } from '../blog/entities/blog-post.entity';
import { User } from '../users/entities/user.entity';
export declare class SeedService {
    private blogPostRepository;
    private userRepository;
    constructor(blogPostRepository: Repository<BlogPost>, userRepository: Repository<User>);
    seedAll(): Promise<void>;
    private seedDoctor;
    private seedBlogPosts;
}
