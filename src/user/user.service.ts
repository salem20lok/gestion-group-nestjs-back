import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './interface/user-interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userDto: CreateUserDto): Promise<UserDocument> {
    const { password, email } = userDto;

    const found = await this.userModel.findOne({ email: email });

    if (found)
      throw new ConflictException(`this mail: ${email} is ealready exist `);

    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      userDto.password = hash;
      const user = new this.userModel(userDto);
      const newUser = await user.save();
      return newUser;
    } catch (e) {
      throw new ConflictException(`this mail: ${email} is ealready exist`);
    }
  }

  async getAllUser(): Promise<UserDocument[]> {
    try {
      const users = await this.userModel.find({});
      return users;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getUser(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException(`this id : ${id} not exist`);
      return user;
    } catch (e) {
      throw new NotFoundException(`this id : ${id} not exist`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const found = await this.userModel.findById(id);
      if (!found) throw new NotFoundException(`this id : ${id} not exist`);
      await this.userModel.findByIdAndDelete(id);
    } catch (e) {
      throw new NotFoundException(`this id : ${id} not exist`);
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const { email, firstName, lastName, roles, avatar } = updateUserDto;
    const found = await this.userModel.findById(id);
    if (!found) throw new NotFoundException(`this id : ${id} not exist `);

    const query = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      roles: roles,
      avatar: avatar,
    };

    if (!email) delete query.email;
    if (!firstName) delete query.firstName;
    if (!lastName) delete query.lastName;
    if (!avatar) delete query.avatar;

    try {
      await this.userModel.findByIdAndUpdate(id, query);
      const user = await this.userModel.findById(id);
      return user;
    } catch (e) {
      if (!found) throw new NotFoundException(`this id : ${id} not exist `);
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const found = await this.userModel.findOne({ email: email });
    try {
      return found;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async identification(id: string): Promise<UserInterface> {
    try {
      const user: UserDocument = await this.userModel.findById(id);
      const query: UserInterface = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        roles: user.roles,
      };
      return query;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async add(user: { id: string }): Promise<void> {
    await this.userModel.findByIdAndUpdate(user.id, { roles: ['user'] });
  }
}
