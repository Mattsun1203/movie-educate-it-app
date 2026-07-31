import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, type PinoLogger } from "nestjs-pino";

@Injectable()
export class AppService {
  constructor(
    @InjectPinoLogger(AppService.name)
    private readonly logger: PinoLogger,
  ) {}

  getHello(): string {
    this.logger.debug("挨拶メッセージを生成しました");
    return "Hello World!";
  }
}
