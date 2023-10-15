import { IsDefined, IsPositive} from 'class-validator';

export class newJobDTO {
  @IsDefined()
  @IsPositive({ message: `Nth must be a positive number (>0)` })
  Nth: number;
}
