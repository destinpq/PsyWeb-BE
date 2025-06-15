export declare enum PostStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime?: string;
    status: PostStatus;
    featuredImage?: string;
    tags?: string;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
