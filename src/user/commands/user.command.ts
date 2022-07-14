import { Command, Positional } from 'nestjs-command';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class UserCommand {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Command({
    command: 'update:user <id>',
    describe: 'update a user role',
  })
  async create(
    @Positional({
      name: 'id',
      describe: 'the id user',
      type: 'string',
    })
    id: string,
  ) {
    await this.userService.add({
      id,
    });
  }
}
