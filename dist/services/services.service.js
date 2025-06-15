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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_entity_1 = require("./entities/service.entity");
let ServicesService = class ServicesService {
    serviceRepository;
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    async create(createServiceDto) {
        const service = this.serviceRepository.create(createServiceDto);
        return this.serviceRepository.save(service);
    }
    async findAll() {
        return this.serviceRepository.find({
            where: { isActive: true },
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
    async update(id, updateServiceDto) {
        const service = await this.findOne(id);
        Object.assign(service, updateServiceDto);
        return this.serviceRepository.save(service);
    }
    async remove(id) {
        const service = await this.findOne(id);
        await this.serviceRepository.remove(service);
    }
    async seedDefaultServices() {
        const count = await this.serviceRepository.count();
        if (count > 0)
            return;
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
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map