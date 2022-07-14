import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { GetUser } from '../auth/guards/get-user.decorator';
import { GroupDocument } from './schemas/groupe.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/authorization/roles.guard';
import { Roles } from '../auth/authorization/roles.decorator';
import { RoleEnum } from '../auth/authorization/role.enum';
import UpdateGroupDto from './dto/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  createGroup(
    @Body() createGroup: CreateGroupDto,
    @GetUser() id: string,
  ): Promise<GroupDocument> {
    createGroup.groupManger = id;
    return this.groupService.createGroup(createGroup);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  getAllGroup(): Promise<GroupDocument[]> {
    return this.groupService.getAllGroup();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  getGroup(@Param('id') id: string): Promise<GroupDocument> {
    return this.groupService.getGroup(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  updateGroup(
    @Param('id') id: string,
    @Body() updateDto: UpdateGroupDto,
  ): Promise<GroupDocument> {
    return this.groupService.UpdateGroup(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  deleteGroup(@Param('id') id: string): Promise<void> {
    return this.groupService.deleteGroup(id);
  }
}
