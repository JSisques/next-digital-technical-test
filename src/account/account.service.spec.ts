import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Currency } from '@prisma/client';

describe('AccountService', () => {
  let service: AccountService;
  let repository: jest.Mocked<AccountRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: AccountRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get(AccountRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an account', async () => {
    const dto: CreateAccountDto = {
      iban: 'ES123',
      balance: 100,
      currency: Currency.EUR,
    } as any;
    const created = {
      id: '1',
      iban: 'ES123',
      balance: 100,
      currency: Currency.EUR,
      createdAt: new Date(),
      updatedAt: new Date(),
      bankId: 'bank1',
    };
    repository.create.mockResolvedValue(created);
    await expect(service.create(dto)).resolves.toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('should return all accounts', async () => {
    const accounts = [
      {
        id: '1',
        iban: 'ES123',
        balance: 100,
        currency: Currency.EUR,
        createdAt: new Date(),
        updatedAt: new Date(),
        bankId: 'bank1',
      },
      {
        id: '2',
        iban: 'ES124',
        balance: 200,
        currency: Currency.USD,
        createdAt: new Date(),
        updatedAt: new Date(),
        bankId: 'bank2',
      },
    ];
    repository.findAll.mockResolvedValue(accounts);
    await expect(service.findAll()).resolves.toEqual(accounts);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should return an account by id', async () => {
    const account = {
      id: '1',
      iban: 'ES123',
      balance: 100,
      currency: Currency.EUR,
      createdAt: new Date(),
      updatedAt: new Date(),
      bankId: 'bank1',
    };
    repository.findOne.mockResolvedValue(account);
    await expect(service.findOne('1')).resolves.toEqual(account);
    expect(repository.findOne).toHaveBeenCalledWith('1');
  });

  it('should update an account', async () => {
    const dto: UpdateAccountDto = { id: '1', iban: 'ES123' } as any;
    const updated = {
      id: '1',
      iban: 'ES123',
      balance: 100,
      currency: Currency.EUR,
      createdAt: new Date(),
      updatedAt: new Date(),
      bankId: 'bank1',
    };
    repository.update.mockResolvedValue(updated);
    await expect(service.update(dto)).resolves.toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith(dto);
  });

  it('should remove an account', async () => {
    const removed = {
      id: '1',
      iban: 'ES123',
      balance: 100,
      currency: Currency.EUR,
      createdAt: new Date(),
      updatedAt: new Date(),
      bankId: 'bank1',
    };
    repository.remove.mockResolvedValue(removed);
    await expect(service.remove('1')).resolves.toEqual(removed);
    expect(repository.remove).toHaveBeenCalledWith('1');
  });

  it('should handle not found on findOne', async () => {
    repository.findOne.mockResolvedValue(undefined);
    await expect(service.findOne('not-exist')).resolves.toBeUndefined();
  });
});
