import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "eCommerce API",
      version: "1.0.0",
      description: "eCommerce backend with authentication and authorization",
    },
    servers: [{ url: "http://localhost:3000" }],
    tags: [
      { name: "Auth" },
      { name: "Users" },
      { name: "Categories" },
      { name: "Products" },
      { name: "Orders" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
          required: ["error"],
        },

        RegisterInput: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2, maxLength: 100 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
          required: ["name", "email", "password"],
        },

        LoginInput: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 1 },
          },
          required: ["email", "password"],
        },

        UserInput: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2, maxLength: 100 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            roles: {
              type: "array",
              items: { type: "string", enum: ["user", "admin", "manager"] },
            },
          },
          required: ["name", "email", "password"],
        },

        CategoryInput: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2, maxLength: 100 },
          },
          required: ["name"],
        },

        ProductInput: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2, maxLength: 120 },
            description: { type: "string", minLength: 2, maxLength: 2000 },
            price: { type: "number", minimum: 0 },
            categoryId: { type: "string", format: "uuid" },
          },
          required: ["name", "description", "price", "categoryId"],
        },

        OrderItemInput: {
          type: "object",
          properties: {
            productId: { type: "string", format: "uuid" },
            quantity: { type: "integer", minimum: 1 },
          },
          required: ["productId", "quantity"],
        },

        OrderInput: {
          type: "object",
          properties: {
            userId: { type: "string", format: "uuid" },
            products: {
              type: "array",
              minItems: 1,
              items: { $ref: "#/components/schemas/OrderItemInput" },
            },
          },
          required: ["userId", "products"],
        },
      },

      responses: {
        BadRequest: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Forbidden: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFound: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },

    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterInput" },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "409": { description: "Conflict" },
          },
        },
      },

      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginInput" },
              },
            },
          },
          responses: {
            "200": { description: "OK" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },

      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },

      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout user",
          responses: {
            "200": { description: "OK" },
          },
        },
      },

      "/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user profile",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },

      "/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users (admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
          },
        },
        post: {
          tags: ["Users"],
          summary: "Create user (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserInput" },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "409": { description: "Conflict" },
          },
        },
      },

      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by id (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update user (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserInput" },
              },
            },
          },
          responses: {
            "200": { description: "OK" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
            "409": { description: "Conflict" },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
      },

      "/categories": {
        get: {
          tags: ["Categories"],
          summary: "Get all categories",
          responses: {
            "200": { description: "OK" },
          },
        },
        post: {
          tags: ["Categories"],
          summary: "Create category (admin/manager)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryInput" },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
          },
        },
      },

      "/categories/{id}": {
        get: {
          tags: ["Categories"],
          summary: "Get category by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        put: {
          tags: ["Categories"],
          summary: "Update category (admin/manager)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryInput" },
              },
            },
          },
          responses: {
            "200": { description: "OK" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Categories"],
          summary: "Delete category (admin/manager)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
      },

      "/products": {
        get: {
          tags: ["Products"],
          summary: "Get all products (optional categoryId query)",
          parameters: [
            {
              name: "categoryId",
              in: "query",
              required: false,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
          },
        },
        post: {
          tags: ["Products"],
          summary: "Create product (admin/manager)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
          },
        },
      },

      "/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Get product by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        put: {
          tags: ["Products"],
          summary: "Update product (admin/manager)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" },
              },
            },
          },
          responses: {
            "200": { description: "OK" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Delete product (admin/manager)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
      },

      "/orders": {
        get: {
          tags: ["Orders"],
          summary: "Get orders (own for user, all for admin/manager)",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
          },
        },
        post: {
          tags: ["Orders"],
          summary: "Create order (server calculates total)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderInput" },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
          },
        },
      },

      "/orders/{id}": {
        get: {
          tags: ["Orders"],
          summary: "Get single order (ownership/role enforced)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        put: {
          tags: ["Orders"],
          summary:
            "Update order (re-validates user/products, recalculates total)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderInput" },
              },
            },
          },
          responses: {
            "200": { description: "OK" },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Orders"],
          summary: "Delete order (ownership/role enforced)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
