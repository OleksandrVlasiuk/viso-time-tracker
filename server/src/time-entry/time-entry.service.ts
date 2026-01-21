import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';

const prisma = new PrismaClient();

@Injectable()
export class TimeEntryService {
  
  async create(createTimeEntryDto: CreateTimeEntryDto) {
    const { date, hours, project, description } = createTimeEntryDto;
    const entryDate = new Date(date);

    // 1. Шукаємо записи за цю добу
    const startOfDay = new Date(entryDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(entryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // 2. Рахуємо суму годин
    const totalHoursToday = existingEntries.reduce((sum, entry) => sum + entry.hours, 0);

    // 3. Перевірка ліміту
    if (totalHoursToday + hours > 24) {
      throw new BadRequestException(`Limit exceeded. You already logged ${totalHoursToday}h today.`);
    }

    // 4. Зберігаємо
    return prisma.timeEntry.create({
      data: {
        date: entryDate,
        project,
        hours,
        description,
      },
    });
  }

  async findAll() {
    return prisma.timeEntry.findMany({
      orderBy: { date: 'desc' },
    });
  }
}