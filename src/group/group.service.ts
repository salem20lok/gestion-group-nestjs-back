import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/groupe.schema';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import UpdateGroupDto from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async createGroup(groupDto: CreateGroupDto): Promise<GroupDocument> {
    const { name } = groupDto;
    const found = await this.groupModel.findOne({ name: name });
    if (found)
      throw new ConflictException(`this name group: ${name} already exist `);
    try {
      const group = new this.groupModel(groupDto);
      await group.save();
      return group;
    } catch (e) {
      throw new ConflictException(`this name group: ${name} already exist `);
    }
  }

  async getAllGroup(): Promise<GroupDocument[]> {
    try {
      const groups = await this.groupModel.find({}).populate('users');
      return groups;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getGroup(id: string): Promise<GroupDocument> {
    try {
      const found = await this.groupModel.findById(id).populate('users');
      if (!found)
        throw new NotFoundException(`this group id:${id} is not exist `);
      return found;
    } catch (e) {
      throw new NotFoundException(`this group id:${id} is not exist `);
    }
  }

  async UpdateGroup(
    id: string,
    updateGroup: UpdateGroupDto,
  ): Promise<GroupDocument> {
    const { groupManger, name, users } = updateGroup;
    const query = {
      groupManger: groupManger,
      name: name,
      users: users,
    };
    if (!groupManger) delete query.groupManger;
    if (!name) delete query.name;
    if (!users) delete query.users;
    if (name) {
      const found = await this.groupModel.findOne({ name: name });
      if (found)
        throw new ConflictException(`this name group: ${name} already exist `);
    }
    try {
      await this.groupModel.findByIdAndUpdate(id, query);
      const group = await this.groupModel.findById(id).populate('users');
      return group;
    } catch (e) {
      throw new ConflictException(`this name group: ${name} already exist `);
    }
  }

  async deleteGroup(id: string): Promise<void> {
    try {
      await this.groupModel.findByIdAndDelete(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
