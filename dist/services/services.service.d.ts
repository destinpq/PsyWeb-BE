import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesService {
    private readonly serviceRepository;
    constructor(serviceRepository: Repository<Service>);
    create(createServiceDto: CreateServiceDto): Promise<Service>;
    findAll(): Promise<Service[]>;
    findOne(id: string): Promise<Service>;
    update(id: string, updateServiceDto: Partial<CreateServiceDto>): Promise<Service>;
    remove(id: string): Promise<void>;
    seedDefaultServices(): Promise<void>;
}
