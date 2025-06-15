import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';
import { BlogService } from '../blog/blog.service';
export declare class SeedService {
    private readonly usersService;
    private readonly servicesService;
    private readonly blogService;
    constructor(usersService: UsersService, servicesService: ServicesService, blogService: BlogService);
    seedDatabase(): Promise<void>;
    private createAdminUser;
}
