import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QuotationService } from '../../modules/quotation/quotation.service';
import { CreateQuotationRequestDto, UpdateQuotationRequestDto } from '../../modules/quotation/dto/quotation-request.dto';
import { ValidationService } from '../../modules/quotation/validations/validation.service';
import { BadRequestException } from '@nestjs/common';

const quotationService = new QuotationService(new ValidationService());

const handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.pathParameters?.id) {
    const quotation = await quotationService.findById(event.pathParameters.id);
    if (!quotation) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Cotización no encontrada' }),
      };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotation),
    };
  }

  const quotations = await quotationService.findAll();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quotations),
  };
};

const handlePost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const quotationData: CreateQuotationRequestDto = JSON.parse(event.body || '{}');
    const newQuotation = await quotationService.create(quotationData);
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuotation),
    };
  } catch (error) {
    if (error instanceof BadRequestException) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message }),
      };
    }
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Datos de cotización inválidos' }),
    };
  }
};

const handlePut = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'ID de cotización no proporcionado' }),
      };
    }

    const updateData: UpdateQuotationRequestDto = JSON.parse(event.body || '{}');
    const updatedQuotation = await quotationService.update(id, updateData);

    if (!updatedQuotation) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Cotización no encontrada' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedQuotation),
    };
  } catch (error) {
    if (error instanceof BadRequestException) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message }),
      };
    }
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Datos de actualización inválidos' }),
    };
  }
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        return handleGet(event);
      case 'POST':
        return handlePost(event);
      case 'PUT':
        return handlePut(event);
      default:
        return {
          statusCode: 405,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Método no permitido' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};
