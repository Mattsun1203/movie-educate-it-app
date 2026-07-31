import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { InjectPinoLogger, type PinoLogger } from "nestjs-pino";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @InjectPinoLogger(AllExceptionsFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: "Internal server error" };

    // エラーは発生箇所ごとに個別ログを残さず、ここに一本化して1エラー1ログとする。
    // メタ情報はメッセージ文字列に埋め込まず、必ず構造化フィールドとして渡す。
    this.logger.error(
      {
        err: exception instanceof Error ? exception : undefined,
        statusCode: status,
        errorType:
          exception instanceof Error
            ? exception.constructor.name
            : typeof exception,
      },
      "リクエスト処理中にエラーが発生しました",
    );

    httpAdapter.reply(response, body, status);
  }
}
