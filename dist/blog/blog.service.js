"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_post_entity_1 = require("./entities/blog-post.entity");
let BlogService = class BlogService {
    blogPostRepository;
    constructor(blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }
    async create(createBlogPostDto) {
        const post = this.blogPostRepository.create(createBlogPostDto);
        if (post.status === blog_post_entity_1.PostStatus.PUBLISHED && !post.publishedAt) {
            post.publishedAt = new Date();
        }
        return this.blogPostRepository.save(post);
    }
    async findAll() {
        return this.blogPostRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findPublished() {
        return this.blogPostRepository.find({
            where: { status: blog_post_entity_1.PostStatus.PUBLISHED },
            order: { publishedAt: 'DESC' },
        });
    }
    async findOne(id) {
        const post = await this.blogPostRepository.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException('Blog post not found');
        }
        return post;
    }
    async update(id, updateBlogPostDto) {
        const post = await this.findOne(id);
        if (updateBlogPostDto.status === blog_post_entity_1.PostStatus.PUBLISHED && !post.publishedAt) {
            post.publishedAt = new Date();
        }
        Object.assign(post, updateBlogPostDto);
        return this.blogPostRepository.save(post);
    }
    async remove(id) {
        const post = await this.findOne(id);
        await this.blogPostRepository.remove(post);
    }
    async seedDefaultPosts() {
        const count = await this.blogPostRepository.count();
        if (count > 0)
            return;
        const defaultPosts = [
            {
                title: 'Understanding Anxiety: Signs, Symptoms, and Solutions',
                excerpt: 'Learn to recognize anxiety symptoms and discover evidence-based strategies for managing anxiety in daily life.',
                content: 'Anxiety is one of the most common mental health conditions...',
                category: 'Mental Health',
                readTime: '5 min read',
                status: blog_post_entity_1.PostStatus.PUBLISHED,
                publishedAt: new Date('2024-12-15'),
            },
            {
                title: 'The Power of Mindfulness in Therapy',
                excerpt: 'Explore how mindfulness techniques can enhance therapeutic outcomes and improve overall mental wellness.',
                content: 'Mindfulness-based interventions have gained significant recognition...',
                category: 'Therapy Techniques',
                readTime: '7 min read',
                status: blog_post_entity_1.PostStatus.PUBLISHED,
                publishedAt: new Date('2024-12-10'),
            },
            {
                title: 'Building Resilience: A Guide for Difficult Times',
                excerpt: 'Discover practical strategies for developing emotional resilience and bouncing back from life\'s challenges.',
                content: 'Resilience is not about avoiding difficult experiences...',
                category: 'Personal Growth',
                readTime: '6 min read',
                status: blog_post_entity_1.PostStatus.PUBLISHED,
                publishedAt: new Date('2024-12-05'),
            },
        ];
        for (const postData of defaultPosts) {
            const post = this.blogPostRepository.create(postData);
            await this.blogPostRepository.save(post);
        }
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_post_entity_1.BlogPost)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlogService);
//# sourceMappingURL=blog.service.js.map