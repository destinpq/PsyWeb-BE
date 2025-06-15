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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const services_service_1 = require("../services/services.service");
const blog_service_1 = require("../blog/blog.service");
const user_entity_1 = require("../users/entities/user.entity");
let SeedService = class SeedService {
    usersService;
    servicesService;
    blogService;
    constructor(usersService, servicesService, blogService) {
        this.usersService = usersService;
        this.servicesService = servicesService;
        this.blogService = blogService;
    }
    async seedDatabase() {
        console.log('Starting database seeding...');
        try {
            await this.createAdminUser();
            await this.servicesService.seedDefaultServices();
            await this.blogService.seedDefaultPosts();
            console.log('Database seeding completed successfully!');
        }
        catch (error) {
            console.error('Error seeding database:', error);
        }
    }
    async createAdminUser() {
        try {
            const adminEmail = 'admin@psychology-website.com';
            const existingAdmin = await this.usersService.findByEmail(adminEmail);
            if (!existingAdmin) {
                await this.usersService.create({
                    firstName: 'Admin',
                    lastName: 'User',
                    email: adminEmail,
                    password: 'admin123',
                    role: user_entity_1.UserRole.ADMIN,
                });
                console.log('Admin user created successfully');
            }
            else {
                console.log('Admin user already exists');
            }
        }
        catch (error) {
            console.error('Error creating admin user:', error);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        services_service_1.ServicesService,
        blog_service_1.BlogService])
], SeedService);
//# sourceMappingURL=seed.service.js.map