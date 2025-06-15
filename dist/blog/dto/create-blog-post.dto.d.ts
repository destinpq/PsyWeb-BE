import { PostStatus } from '../entities/blog-post.entity';
export declare class CreateBlogPostDto {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime?: string;
    status?: PostStatus;
    featuredImage?: string;
    tags?: string;
}
