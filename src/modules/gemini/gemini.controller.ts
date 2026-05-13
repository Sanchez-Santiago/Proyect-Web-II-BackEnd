import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}

  @Post('generate-description')
  @UseGuards(JwtGuard)
  async generateDescription(
    @Request() req: any,
    @Body()
    body: {
      brand: string;
      model: string;
      year: number;
      mileage?: number | null;
      fuelType?: string;
      transmission?: string;
      color?: string;
    },
  ) {
    const result = await this.geminiService.generateDescription(body);
    return result;
  }
}
