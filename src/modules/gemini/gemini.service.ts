import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('[Gemini] GEMINI_API_KEY no configurada — modo simulado');
    }
  }

  async generateDescription(data: {
    brand: string;
    model: string;
    year: number;
    mileage?: number | null;
    fuelType?: string;
    transmission?: string;
    color?: string;
  }) {
    if (!this.genAI) {
      return this.fallbackDescription(data);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `Genera una descripción de venta para un vehículo en español (argentino). Datos:
- Marca: ${data.brand}
- Modelo: ${data.model}
- Año: ${data.year}
${data.mileage ? `- Kilometraje: ${data.mileage} km` : ''}
${data.fuelType ? `- Combustible: ${data.fuelType}` : ''}
${data.transmission ? `- Transmisión: ${data.transmission}` : ''}
${data.color ? `- Color: ${data.color}` : ''}

La descripción debe ser profesional, atractiva y lista para publicar (2-3 párrafos).
Incluye: estado general, cualidades destacadas, y un llamado a la acción.
Además, sugiere un precio de mercado en pesos argentinos (ARS) basado en los datos.
Devuelve SOLO un JSON válido con este formato exacto (sin markdown, sin \`\`\`):
{"description": "...descripción completa...", "suggestedPrice": 15000000}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const cleanJson = text.replace(/```json?/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        description: parsed.description || this.fallbackDescription(data).description,
        suggestedPrice: parsed.suggestedPrice || null,
      };
    } catch (err) {
      console.warn('[Gemini] Error:', err.message);
      return this.fallbackDescription(data);
    }
  }

  private fallbackDescription(data: {
    brand: string;
    model: string;
    year: number;
    mileage?: number | null;
    fuelType?: string;
    transmission?: string;
    color?: string;
  }) {
    const kmText = data.mileage ? `con ${data.mileage.toLocaleString()} km` : 'con kilometraje moderado';
    const fuelText = data.fuelType ? `motor ${data.fuelType.toLowerCase()}` : '';
    const transText = data.transmission ? `transmisión ${data.transmission.toLowerCase()}` : '';
    const colorText = data.color ? `color ${data.color.toLowerCase()}` : '';
    const details = [fuelText, transText, colorText].filter(Boolean).join(', ');

    const description = `Vendo ${data.brand} ${data.model} ${data.year} ${kmText}${details ? ', ' + details : ''}. 
El vehículo se encuentra en excelente estado, con mantenimiento al día y lista para transferir. 
Cuenta con un desempeño confiable y un diseño que combina confort y estilo. 
Ideal para uso diario o viajes largos. No dejes pasar esta oportunidad. 
Acepto permuta y financiación. Consultanos sin compromiso.`;

    return {
      description,
      suggestedPrice: null,
    };
  }
}
