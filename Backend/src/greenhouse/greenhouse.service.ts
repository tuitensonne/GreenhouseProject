import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGreenhouseDto } from './dto/create-greenhouse.dto';
import { UpdateGreenhouseDto } from './dto/update-greenhouse.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GreenhouseService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGreenhouseDto: CreateGreenhouseDto) {
    try {
      return this.prisma.greenHouse.create({
        data: {
          name: createGreenhouseDto.name,
          location: createGreenhouseDto.location,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred! Please try again.',
      );
    }
  }

  async getListDetailGreenhouse(pageOffset: number, limit: number) {
    try {
      const totalGreenhouse = await this.prisma.greenHouse.count({});
      const totalPages = Math.ceil(totalGreenhouse / limit);
      const listOfGreenhouse = await this.prisma.greenHouse.findMany({
        take: limit,
        skip: (pageOffset - 1) * limit,
      });
      return {
        data: listOfGreenhouse,
        pagination: {
          currentPage: pageOffset,
          totalPages: totalPages,
          totalItems: totalGreenhouse,
          limit: limit,
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred! Please try again.',
      );
    }
  }

  async getListGreenhouse(pageOffset: number, limit: number) {
    try {
      const listOfGreenhouse = await this.prisma.greenHouse.findMany({
        select: {
          GID: true,
          name: true,
        }
      });
      return listOfGreenhouse
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred! Please try again.',
      );
    }
  }

  update(id: number, updateGreenhouseDto: UpdateGreenhouseDto) {
    try {
      return this.prisma.greenHouse.update({
        where: {
          GID: id,
        },
        data: {
          name: updateGreenhouseDto.name,
          location: updateGreenhouseDto.location,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred! Please try again.',
      );
    }
  }

  delete(id: number) {
    try {
      return this.prisma.greenHouse.delete({
        where: {
          GID: id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred! Please try again.',
      );
    }
  }
}
