import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crushd API",
      version: "1.0.0",
      description: "API documentation for Crushd backend",
    },
  },
  // globs for where your route JSDoc lives
  apis: ["./src/routes/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
