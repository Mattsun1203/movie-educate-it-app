import { Controller, Get } from "@nestjs/common";
import { InjectPinoLogger, type PinoLogger } from "nestjs-pino";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectPinoLogger(AppController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.debug({ handler: "getHello" }, "リクエストを受け付けました");
    return this.appService.getHello();
  }
}
