import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../config/config.service.interface';
import { UserEntity } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const userData = {
    email: 'email@email.com',
    name: 'Test Name',
    password: '123456789',
};

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
    find: jest.fn(),
    create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
    container.bind<IUserService>(TYPES.UserService).to(UserService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
    usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
    it('createUser', async () => {
        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.create = jest.fn().mockImplementationOnce(
            (user: UserEntity): UserModel => ({
                name: user.name,
                email: user.email,
                password: user.password,
                id: 1,
            }),
        );
        createdUser = await usersService.createUser({
            email: userData.email,
            name: userData.name,
            password: userData.password,
        });
        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('123456789');
    });

    it('validateUser - success', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await usersService.validateUser({
            email: userData.email,
            password: userData.password,
        });
        expect(result).toBeTruthy();
    });

    it('validateUser - wrong password', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await usersService.validateUser({
            email: userData.email,
            password: 'wrongPassword',
        });
        expect(result).toBeFalsy();
    });

    it('validateUser - user not exists', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(null);
        const result = await usersService.validateUser({
            email: userData.email,
            password: 'wrongPassword',
        });
        expect(result).toBeFalsy();
    });
});
