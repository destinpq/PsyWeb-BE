import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { BlogPost, PostStatus } from '../blog/entities/blog-post.entity';
import { ContactMessage, MessageStatus } from '../contact/entities/contact-message.entity';
import { Service } from '../services/entities/service.entity';

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  unreadMessages: number;
  thisMonthAppointments: number;
  thisMonthNewPatients: number;
  revenue: number;
}

export interface CreateBlogPostDto {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime?: string;
  featuredImage?: string;
  tags?: string[];
  status?: PostStatus;
}

export interface UpdateBlogPostDto {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  readTime?: string;
  featuredImage?: string;
  tags?: string[];
  status?: PostStatus;
  publishedAt?: Date;
}

export interface AppointmentAnalytics {
  month: string;
  appointments: number;
}

export interface PatientAnalytics {
  month: string;
  newPatients: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(ContactMessage)
    private contactMessageRepository: Repository<ContactMessage>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      totalPatients,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      totalBlogPosts,
      publishedBlogPosts,
      unreadMessages,
      thisMonthAppointments,
      thisMonthNewPatients,
    ] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.PATIENT } }),
      this.appointmentRepository.count(),
      this.appointmentRepository.count({ where: { status: AppointmentStatus.PENDING } }),
      this.appointmentRepository.count({ where: { status: AppointmentStatus.COMPLETED } }),
      this.blogPostRepository.count(),
      this.blogPostRepository.count({ where: { status: PostStatus.PUBLISHED } }),
      this.contactMessageRepository.count({ where: { status: MessageStatus.UNREAD } }),
      this.appointmentRepository.count({
        where: {
          appointmentDate: Between(startOfMonth, endOfMonth),
        },
      }),
      this.userRepository.count({
        where: {
          role: UserRole.PATIENT,
          createdAt: Between(startOfMonth, endOfMonth),
        },
      }),
    ]);

    // Calculate estimated revenue (appointments * average fee)
    const averageFee = 150; // Assume $150 per session
    const revenue = completedAppointments * averageFee;

    return {
      totalPatients,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      totalBlogPosts,
      publishedBlogPosts,
      unreadMessages,
      thisMonthAppointments,
      thisMonthNewPatients,
      revenue,
    };
  }

  // Appointment Management
  async getAllAppointments(page: number = 1, limit: number = 10) {
    const [appointments, total] = await this.appointmentRepository.findAndCount({
      relations: ['patient'],
      order: { appointmentDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      appointments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string) {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }

    return await this.appointmentRepository.save(appointment);
  }

  async addGoogleMeetLink(id: string, meetLink: string) {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Assuming there's a meetLink field in the appointment entity
    // If not, you might need to add it to the entity
    (appointment as any).meetLink = meetLink;

    return await this.appointmentRepository.save(appointment);
  }

  // Blog Management
  async getAllBlogPosts(page: number = 1, limit: number = 10) {
    const [posts, total] = await this.blogPostRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createBlogPost(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const blogPost = this.blogPostRepository.create({
      title: createBlogPostDto.title,
      excerpt: createBlogPostDto.excerpt,
      content: createBlogPostDto.content,
      category: createBlogPostDto.category,
      readTime: createBlogPostDto.readTime,
      featuredImage: createBlogPostDto.featuredImage,
      tags: createBlogPostDto.tags ? JSON.stringify(createBlogPostDto.tags) : undefined,
      status: createBlogPostDto.status || PostStatus.DRAFT,
    });

    return await this.blogPostRepository.save(blogPost);
  }

  async updateBlogPost(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }

    // If publishing, set publishedAt date
    if (updateBlogPostDto.status === PostStatus.PUBLISHED && !blogPost.publishedAt) {
      blogPost.publishedAt = new Date();
    }

    Object.assign(blogPost, {
      ...updateBlogPostDto,
      tags: updateBlogPostDto.tags ? JSON.stringify(updateBlogPostDto.tags) : blogPost.tags,
    });

    return await this.blogPostRepository.save(blogPost);
  }

  async deleteBlogPost(id: string): Promise<void> {
    const result = await this.blogPostRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Blog post not found');
    }
  }

  async publishBlogPost(id: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }

    blogPost.status = PostStatus.PUBLISHED;
    blogPost.publishedAt = new Date();

    return await this.blogPostRepository.save(blogPost);
  }

  // Patient Management
  async getAllPatients(page: number = 1, limit: number = 10) {
    const [patients, total] = await this.userRepository.findAndCount({
      where: { role: UserRole.PATIENT },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      patients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPatientDetails(id: string) {
    const patient = await this.userRepository.findOne({
      where: { id, role: UserRole.PATIENT },
      relations: ['appointments'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  // Message Management
  async getAllMessages(page: number = 1, limit: number = 10) {
    const [messages, total] = await this.contactMessageRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markMessageAsRead(id: string) {
    const message = await this.contactMessageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.status = MessageStatus.READ;
    return await this.contactMessageRepository.save(message);
  }

  async replyToMessage(id: string, reply: string) {
    const message = await this.contactMessageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.status = MessageStatus.REPLIED;
    // You might want to add a reply field to the entity or create a separate replies table
    (message as any).reply = reply;

    return await this.contactMessageRepository.save(message);
  }

  // Analytics
  async getAppointmentAnalytics(months: number = 6): Promise<AppointmentAnalytics[]> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select('DATE_TRUNC(\'month\', appointment.appointmentDate) as month')
      .addSelect('COUNT(*) as count')
      .where('appointment.appointmentDate >= :startDate', { startDate })
      .groupBy('DATE_TRUNC(\'month\', appointment.appointmentDate)')
      .orderBy('month', 'ASC')
      .getRawMany();

    const result: AppointmentAnalytics[] = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthData = appointments.find(a => 
        new Date(a.month).getMonth() === date.getMonth() && 
        new Date(a.month).getFullYear() === date.getFullYear()
      );
      const count = monthData ? parseInt(monthData.count) : 0;
      
      result.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        appointments: count,
      });
    }

    return result.reverse();
  }

  async getPatientAnalytics(months: number = 6): Promise<PatientAnalytics[]> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const patients = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE_TRUNC(\'month\', user.createdAt) as month')
      .addSelect('COUNT(*) as count')
      .where('user.role = :role', { role: UserRole.PATIENT })
      .andWhere('user.createdAt >= :startDate', { startDate })
      .groupBy('DATE_TRUNC(\'month\', user.createdAt)')
      .orderBy('month', 'ASC')
      .getRawMany();

    const result: PatientAnalytics[] = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthData = patients.find(p => 
        new Date(p.month).getMonth() === date.getMonth() && 
        new Date(p.month).getFullYear() === date.getFullYear()
      );
      const count = monthData ? parseInt(monthData.count) : 0;
      
      result.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        newPatients: count,
      });
    }

    return result.reverse();
  }
} 