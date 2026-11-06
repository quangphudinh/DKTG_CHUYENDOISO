const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Hệ thống Quản lý CPN',
      version: '1.0.0',
    },
  },
  // Trỏ Swagger tìm tài liệu trong toàn bộ các file js trong thư mục routes
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes từ thư mục routes (mặc định sẽ đọc file index.js trong đó)
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server: http://localhost:${port}`);
      console.log(`📄 Swagger: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => console.error(err));