import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { FireblocksService } from './fireblock.service';

@Module({
  controllers: [TokenController],
  providers: [TokenService, FireblocksService],
})
export class TokenModule {}