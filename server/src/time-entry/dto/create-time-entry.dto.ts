import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateTimeEntryDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsInt()
  @Min(1)
  @Max(24)
  hours: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}