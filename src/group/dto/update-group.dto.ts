import { GroupManger } from './create-group.dto';

export default class UpdateGroupDto {
  name: string;

  groupManger: GroupManger;

  users: string[];
}
