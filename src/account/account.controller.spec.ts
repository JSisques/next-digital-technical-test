import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Currency } from '@prisma/client';

const mockAccount = {
  id: 'id1',
  iban: 'ES91 2100 0418 4502 0005 1332',
  bankId: 'bank1',
  balance: 1000,
  currency: Currency.EUR,
  createdAt: new Date(),
  updatedAt: new Date(),
  cards: [],
  transactions: [],
};

describe('AccountController', () => {
  let controller: AccountController;
  let service: jest.Mocked<AccountService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
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

    controller = module.get<AccountController>(AccountController);
    service = module.get(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an account', async () => {
      const dto: CreateAccountDto = {
        iban: mockAccount.iban,
        bankId: mockAccount.bankId,
        balance: mockAccount.balance,
        currency: mockAccount.currency,
      };
      service.create.mockResolvedValue(mockAccount);
      await expect(controller.create(dto)).resolves.toBe(mockAccount);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('should throw if service throws', async () => {
      const dto: CreateAccountDto = {
        iban: mockAccount.iban,
        bankId: mockAccount.bankId,
        balance: mockAccount.balance,
        currency: mockAccount.currency,
      };
      service.create.mockRejectedValue(new Error('error'));
      await expect(controller.create(dto)).rejects.toThrow('error');
    });
  });

  describe('findAll', () => {
    it('should return all accounts', async () => {
      service.findAll.mockResolvedValue([mockAccount]);
      await expect(controller.findAll()).resolves.toEqual([mockAccount]);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should throw if service throws', async () => {
      service.findAll.mockRejectedValue(new Error('error'));
      await expect(controller.findAll()).rejects.toThrow('error');
    });
  });

  describe('findOne', () => {
    it('should return an account by id', async () => {
      service.findOne.mockResolvedValue(mockAccount);
      await expect(controller.findOne('id1')).resolves.toBe(mockAccount);
      expect(service.findOne).toHaveBeenCalledWith('id1');
    });
    it('should return undefined if not found', async () => {
      service.findOne.mockResolvedValue(undefined);
      await expect(controller.findOne('id1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.findOne.mockRejectedValue(new Error('error'));
      await expect(controller.findOne('id1')).rejects.toThrow('error');
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      const dto: UpdateAccountDto = { id: 'id1', balance: 2000 };
      service.update.mockResolvedValue({ ...mockAccount, ...dto });
      await expect(controller.update('id1', dto)).resolves.toEqual({
        ...mockAccount,
        ...dto,
      });
      expect(service.update).toHaveBeenCalledWith(dto);
    });
    it('should return undefined if not found', async () => {
      const dto: UpdateAccountDto = { id: 'id1', balance: 2000 };
      service.update.mockResolvedValue(undefined);
      await expect(controller.update('id1', dto)).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      const dto: UpdateAccountDto = { id: 'id1', balance: 2000 };
      service.update.mockRejectedValue(new Error('error'));
      await expect(controller.update('id1', dto)).rejects.toThrow('error');
    });
  });

  describe('remove', () => {
    it('should remove an account', async () => {
      service.remove.mockResolvedValue(mockAccount);
      await expect(controller.remove('id1')).resolves.toBe(mockAccount);
      expect(service.remove).toHaveBeenCalledWith('id1');
    });
    it('should return undefined if not found', async () => {
      service.remove.mockResolvedValue(undefined);
      await expect(controller.remove('id1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.remove.mockRejectedValue(new Error('error'));
      await expect(controller.remove('id1')).rejects.toThrow('error');
    });
  });
});
