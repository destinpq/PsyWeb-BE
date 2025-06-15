import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';
import { BlogService } from '../blog/blog.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
    private readonly blogService: BlogService,
  ) {}

  async seedDatabase(): Promise<void> {
    console.log('Starting database seeding...');

    try {
      // Create admin user
      await this.createAdminUser();
      
      // Seed services
      await this.servicesService.seedDefaultServices();
      
      // Seed blog posts
      await this.blogService.seedDefaultPosts();

      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  private async createAdminUser(): Promise<void> {
    try {
      const adminEmail = 'admin@psychology-website.com';
      const existingAdmin = await this.usersService.findByEmail(adminEmail);
      
      if (!existingAdmin) {
        await this.usersService.create({
          firstName: 'Admin',
          lastName: 'User',
          email: adminEmail,
          password: 'admin123',
          role: UserRole.ADMIN,
        });
        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  }
} 