import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] База данных подключена.');
        } catch (error) {
            if (error instanceof Error) {
                this.logger.log(
                    '[PrismaService] Ошибка подключения к базе данных:' + error.message,
                );
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
