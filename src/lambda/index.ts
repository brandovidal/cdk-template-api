import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BadRequestException } from "@nestjs/common";

import { QuotationService } from "@/modules/quotation/quotation.service";

import {
  CreateQuotationRequestDto,
  UpdateQuotationRequestDto,
} from "../modules/quotation/dto/quotation-request.dto";

const quotationService = new QuotationService();

// Interfaz para los manejadores de rutas
interface RouteHandler {
  (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
}

// Mapa de rutas y sus manejadores
const routeHandlers: Record<string, Record<string, RouteHandler>> = {
  "/quotations": {
    GET: async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const quotations = await quotationService.findAll();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotations),
      };
    },
    POST: async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      try {
        const quotationData: CreateQuotationRequestDto = JSON.parse(
          event.body || "{}"
        );
        const newQuotation = await quotationService.create(quotationData);
        return {
          statusCode: 201,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newQuotation),
        };
      } catch (error) {
        if (error instanceof BadRequestException) {
          return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: error.message }),
          };
        }
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Datos de cotización inválidos" }),
        };
      }
    },
  },
  "/quotations/{id}": {
    GET: async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const id = event.pathParameters?.id;
      if (!id) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "ID de cotización no proporcionado" }),
        };
      }

      const quotation = await quotationService.findById(id);
      if (!quotation) {
        return {
          statusCode: 404,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Cotización no encontrada" }),
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotation),
      };
    },
    PUT: async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      try {
        const id = event.pathParameters?.id;
        if (!id) {
          return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "ID de cotización no proporcionado" }),
          };
        }

        const updateData: UpdateQuotationRequestDto = JSON.parse(
          event.body || "{}"
        );
        const updatedQuotation = await quotationService.update(id, updateData);

        if (!updatedQuotation) {
          return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Cotización no encontrada" }),
          };
        }

        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedQuotation),
        };
      } catch (error) {
        if (error instanceof BadRequestException) {
          return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: error.message }),
          };
        }
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Datos de actualización inválidos" }),
        };
      }
    },
  },
};

// Función para encontrar el manejador de ruta adecuado
function findRouteHandler(event: APIGatewayProxyEvent): RouteHandler | null {
  const path = event.resource;
  const method = event.httpMethod;

  // Verificar si existe un manejador para esta ruta y método
  if (routeHandlers[path] && routeHandlers[path][method]) {
    return routeHandlers[path][method];
  }

  return null;
}

// Función para normalizar la ruta
function normalizePath(path: string): string {
  // Reemplazar parámetros de ruta con placeholders
  return path.replace(/\/[^/]+\{[^}]+\}/g, (match) => {
    const paramName = match.match(/\{([^}]+)\}/)?.[1] || "";
    return `/{${paramName}}`;
  });
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Normalizar la ruta para que coincida con nuestro mapa de rutas
    event.resource = normalizePath(event.resource);

    // Encontrar el manejador adecuado
    const routeHandler = findRouteHandler(event);

    if (routeHandler) {
      return await routeHandler(event);
    }

    // Si no se encuentra un manejador, devolver un error 404
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Ruta no encontrada" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error interno del servidor" }),
    };
  }
};
