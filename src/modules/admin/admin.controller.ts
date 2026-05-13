import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../decorators/roles.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  async findUsers(@Query('role') role?: UserRole, @Query('search') search?: string) {
    const users = await this.adminService.findUsers({ role, search });
    return { users };
  }

  @Get('users/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.adminService.findUserById(id);
    return { user };
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { role?: UserRole; verified?: boolean; province?: string; city?: string; phone?: string },
  ) {
    const user = await this.adminService.updateUser(id, body);
    return { message: 'Usuario actualizado', user };
  }

  @Put('users/:id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    const user = await this.adminService.updateUser(id, { role: body.role });
    return { message: 'Rol actualizado', user };
  }

  @Put('users/:id/verify')
  async verifyUser(@Param('id') id: string, @Body() body: { verified?: boolean }) {
    const user = await this.adminService.updateUser(id, { verified: body.verified ?? true });
    return { message: 'Verificación actualizada', user };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('analytics/summary')
  async summary() {
    const summary = await this.adminService.getSummary();
    return { summary };
  }

  @Get('analytics/timeline')
  async timeline(@Query('days') days?: string) {
    const parsedDays = Math.min(365, Math.max(1, Number(days) || 30));
    const timeline = await this.adminService.getTimeline(parsedDays);
    return { timeline };
  }
}
