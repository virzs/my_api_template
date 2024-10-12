import { registerAs } from '@nestjs/config';

export default registerAs('storage-service', () => ({
  service: process.env.storage_service,
}));
