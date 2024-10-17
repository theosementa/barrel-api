const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/docs/swagger_output.json";
const endpointsFiles = [
  "./src/routes/auth.ts",
  "./src/routes/user.ts",
  "./src/routes/car.ts",
  "./src/routes/entry.ts",
];

const doc = {
  info: {
    title: "Barrel API",
    description: "API for barrel",
  },
  host: ["api.youre-domain.fr"],
  schemes: ["https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "Enter your Bearer token in the format **Bearer &lt;token&gt;**",
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
  definitions: {
    User: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john.doe@gmail.com",
      isCompleted: true,
      imageLink: "https://example.com/image.jpg",
      isGuest: false,
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
