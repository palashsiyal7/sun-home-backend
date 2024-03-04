import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { Role } from '../schema/role.schema';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.roleService.createRole(createRoleDto);
    return {
      success: true,
      status_code: 200,
      message: 'Role added successfully',
    };
  }

  @Get()
  async getAllRoles(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Role[];
  }> {
    const roles = await this.roleService.getAllRoles();
    return {
      success: true,
      status_code: 200,
      message: 'Roles retrieved successfully',
      data: roles,
    };
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Role;
  }> {
    const role = await this.roleService.getRoleById(id);
    if (!role) {
      return {
        success: false,
        status_code: 404,
        message: 'Role not found',
        data: null,
      };
    }
    return {
      success: true,
      status_code: 200,
      message: 'Role retrieved successfully',
      data: role,
    };
  }

  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedRole = await this.roleService.updateRole(id, updateRoleDto);
    if (updatedRole) {
      return {
        success: true,
        status_code: 200,
        message: 'Role updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Role not found or update failed',
      };
    }
  }

  @Delete(':id')
  async deleteRole(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.roleService.deleteRole(id);
    return {
      success: true,
      status_code: 200,
      message: 'Role deleted successfully',
    };
  }
}
