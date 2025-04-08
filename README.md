# CDK Template API con NestJS

Este proyecto es una plantilla para crear APIs serverless usando AWS CDK, NestJS y TypeScript.

## Requisitos

- Node.js >= 18.x
- pnpm
- AWS CLI configurado
- AWS CDK CLI

## Instalación

```bash
# Instalar dependencias
pnpm install

# Compilar el proyecto
pnpm build

# Desplegar la infraestructura
pnpm cdk deploy
```

## Estructura del Proyecto

```
.
├── src/
│   ├── modules/
│   │   └── quotation/
│   │       ├── dto/
│   │       ├── quotation.controller.ts
│   │       ├── quotation.service.ts
│   │       └── quotation.module.ts
│   ├── stacks/
│   │   └── quotation-api.stack.ts
│   ├── app.module.ts
│   ├── app.ts
│   ├── lambda.ts
│   └── main.ts
├── .env
├── package.json
└── tsconfig.json
```

## Endpoints

- POST /quotations - Crear una nueva cotización
- GET /quotations - Obtener todas las cotizaciones
- GET /quotations/:id - Obtener una cotización por ID

## Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```
AWS_REGION=us-east-1
STAGE=dev
PROJECT_NAME=cdk-template-api
```

## Desarrollo

```bash
# Iniciar en modo desarrollo
pnpm start:dev

# Ejecutar tests
pnpm test
```
