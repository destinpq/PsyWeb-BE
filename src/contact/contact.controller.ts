import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Get('unread/count')
  async getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @Post()
  async create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactService.create(createContactMessageDto);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Put(':id/reply')
  async reply(@Param('id') id: string, @Body('reply') replyText: string) {
    return this.contactService.reply(id, replyText);
  }

  @Put(':id/archive')
  async archive(@Param('id') id: string) {
    return this.contactService.archive(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
