export default {
  host: '0.0.0.0',
  port: Number(process.env.PORT || 8055),
  url: process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8055}`,
  secret: process.env.SECRET || 'dev-secret',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  database: {
    client: 'sqlite',
    connection: {
      filename: './database.db',
    },
  },
  cors: {
    enabled: true,
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
    methods: (process.env.CORS_METHODS || 'GET,POST,PATCH,DELETE,OPTIONS').split(','),
    allowedHeaders: (process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization').split(','),
    exposedHeaders: (process.env.CORS_EXPOSED_HEADERS || 'Content-Range').split(','),
    credentials: process.env.CORS_CREDENTIALS === 'true',
    maxAge: Number(process.env.CORS_MAX_AGE || 18000),
  },
}