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
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    private userService: UserService,
  ) {}

  async createGroup(groupDto: CreateGroupDto): Promise<GroupDocument> {
    const { name, groupManger, users } = groupDto;
    const query = {
      name: name,
      groupManger: groupManger,
    };
    const found = await this.groupModel.findOne({ name: name });
    if (found)
      throw new ConflictException(`this name group: ${name} already exist `);
    try {
      const group = new this.groupModel(query);
      await group.save().then((res) => {
        users.map(async (e) => {
          const query: UpdateUserDto = {
            group: res._id,
          };
          await this.userService.updateUser(e, query);
        });
      });
      return group;
    } catch (e) {
      throw new ConflictException(`this name group: ${name} already exist `);
    }
  }

  async getAllGroup(): Promise<GroupDocument[]> {
    try {
      const groups = await this.groupModel.find({});
      return groups;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getGroup(id: string): Promise<GroupDocument> {
    try {
      const found = await this.groupModel
        .findById(id)
        .populate('groupManger')
        .exec();
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
      groupManger: {
        $ref: 'user',
        $id: groupManger,
      },
      name: name,
    };

    if (!groupManger) delete query.groupManger;
    if (!name) delete query.name;

    try {
      await this.groupModel.findByIdAndUpdate(id, query).then(async (res) => {
        await this.userService.deleteGroup(id);
        if (users) {
          users.map(async (el) => {
            const userQuery: UpdateUserDto = {
              group: res._id,
            };
            await this.userService.updateUser(el, userQuery);
          });
        }
      });
      const group = await this.groupModel.findById(id);
      return group;
    } catch (e) {
      throw new ConflictException(`this name group: ${name} already exist `);
    }
  }

  async deleteGroup(id: string): Promise<void> {
    try {
      await this.groupModel.findByIdAndDelete(id).then(async (res) => {
        await this.userService.deleteGroup(id);
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
