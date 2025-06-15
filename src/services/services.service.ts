import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: string, updateServiceDto: Partial<CreateServiceDto>): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }

  async seedDefaultServices(): Promise<void> {
    const count = await this.serviceRepository.count();
    if (count > 0) return;

    const defaultServices = [
      {
        name: 'Individual Therapy',
        description: 'One-on-one sessions focused on your personal mental health goals and challenges.',
        duration: 50,
        features: JSON.stringify(['Anxiety & Depression', 'Trauma Recovery', 'Stress Management', 'Personal Growth']),
      },
      {
        name: 'Couples Therapy',
        description: 'Relationship counseling to improve communication and strengthen bonds.',
        duration: 60,
        features: JSON.stringify(['Communication Skills', 'Conflict Resolution', 'Intimacy Issues', 'Pre-marital Counseling']),
      },
      {
        name: 'Family Therapy',
        description: 'Family-centered approach to address dynamics and improve relationships.',
        duration: 60,
        features: JSON.stringify(['Family Dynamics', 'Parenting Support', 'Teen Counseling', 'Blended Families']),
      },
      {
        name: 'Initial Consultation',
        description: 'First meeting to discuss your needs and treatment options.',
        duration: 30,
        features: JSON.stringify(['Assessment', 'Treatment Planning', 'Goal Setting', 'Questions & Answers']),
      },
    ];

    for (const serviceData of defaultServices) {
      const service = this.serviceRepository.create(serviceData);
      await this.serviceRepository.save(service);
    }
  }
}
