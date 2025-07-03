import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Currency, TransactionType } from '@prisma/client';

const mockTransaction = {
  id: 'tx1',
  amount: 100,
  currency: Currency.EUR,
  type: TransactionType.DEPOSIT,
  description: 'desc',
  createdAt: new Date(),
  cardId: 'card1',
  accountId: 'acc1',
};

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByAccountId: jest.fn(),
            transfer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      service.create.mockResolvedValue(mockTransaction);
      await expect(controller.create({} as any)).resolves.toBe(mockTransaction);
      expect(service.create).toHaveBeenCalled();
    });
    it('should throw if service throws', async () => {
      service.create.mockRejectedValue(new Error('error'));
      await expect(controller.create({} as any)).rejects.toThrow('error');
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      service.findAll.mockResolvedValue([mockTransaction]);
      await expect(controller.findAll()).resolves.toEqual([mockTransaction]);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should throw if service throws', async () => {
      service.findAll.mockRejectedValue(new Error('error'));
      await expect(controller.findAll()).rejects.toThrow('error');
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      service.findOne.mockResolvedValue(mockTransaction);
      await expect(controller.findOne('tx1')).resolves.toBe(mockTransaction);
      expect(service.findOne).toHaveBeenCalledWith('tx1');
    });
    it('should return undefined if not found', async () => {
      service.findOne.mockResolvedValue(undefined);
      await expect(controller.findOne('tx1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.findOne.mockRejectedValue(new Error('error'));
      await expect(controller.findOne('tx1')).rejects.toThrow('error');
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      service.update.mockResolvedValue({ ...mockTransaction, amount: 200 });
      await expect(
        controller.update('tx1', { amount: 200 } as any),
      ).resolves.toEqual({ ...mockTransaction, amount: 200 });
      expect(service.update).toHaveBeenCalledWith('tx1', { amount: 200 });
    });
    it('should return undefined if not found', async () => {
      service.update.mockResolvedValue(undefined);
      await expect(
        controller.update('tx1', { amount: 200 } as any),
      ).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.update.mockRejectedValue(new Error('error'));
      await expect(
        controller.update('tx1', { amount: 200 } as any),
      ).rejects.toThrow('error');
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      service.remove.mockResolvedValue(mockTransaction);
      await expect(controller.remove('tx1')).resolves.toBe(mockTransaction);
      expect(service.remove).toHaveBeenCalledWith('tx1');
    });
    it('should return undefined if not found', async () => {
      service.remove.mockResolvedValue(undefined);
      await expect(controller.remove('tx1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.remove.mockRejectedValue(new Error('error'));
      await expect(controller.remove('tx1')).rejects.toThrow('error');
    });
  });

  describe('findByAccountId', () => {
    it('should return transactions for an account', async () => {
      service.findByAccountId.mockResolvedValue([mockTransaction]);
      await expect(controller.findByAccountId('acc1')).resolves.toEqual([
        mockTransaction,
      ]);
      expect(service.findByAccountId).toHaveBeenCalledWith('acc1');
    });
    it('should throw if service throws', async () => {
      service.findByAccountId.mockRejectedValue(new Error('error'));
      await expect(controller.findByAccountId('acc1')).rejects.toThrow('error');
    });
  });

  describe('transfer', () => {
    it('should transfer money', async () => {
      const result = {
        message: 'Transfer successful',
        transferred: 100,
        commission: 0,
        fromNewBalance: 900,
        toNewBalance: 1100,
      };
      service.transfer.mockResolvedValue(result);
      await expect(controller.transfer({} as any)).resolves.toBe(result);
      expect(service.transfer).toHaveBeenCalled();
    });
    it('should throw if service throws', async () => {
      service.transfer.mockRejectedValue(new Error('error'));
      await expect(controller.transfer({} as any)).rejects.toThrow('error');
    });
  });
});
