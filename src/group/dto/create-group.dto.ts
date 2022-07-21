import { IsNotEmpty } from 'class-validator';

export interface GroupManger {
  $ref: string;
  $id: string;
}

export class CreateGroupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  groupManger: GroupManger;

  @IsNotEmpty()
  users: string[];
}
