import { Controller } from '@nestjs/common';
import { CloudflareR2Service } from './cloudflare-r2.service';

@Controller('cloudflare-r2')
export class CloudflareR2Controller {
  constructor(private readonly cloudflareR2Service: CloudflareR2Service) {}
}
