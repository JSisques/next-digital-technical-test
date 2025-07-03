import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from './bank.service';
import { BankRepository } from './bank.repository';
import { BankEntity } from './entities/bank.entity';

describe('BankService', () => {
  let service: BankService;
  let bankRepository: jest.Mocked<BankRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankService,
        {
          provide: BankRepository,
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
    service = module.get<BankService>(BankService);
    bankRepository = module.get(BankRepository);
  });

  describe('CRUD', () => {
    it('should call create on repository', () => {
      const dto = { name: 'Bank1', commission: 0.05 };
      const created: BankEntity = {
        id: 'id1',
        name: 'Bank1',
        atms: [],
        accounts: [],
        commission: 0.05,
      };
      bankRepository.create.mockResolvedValue(created);
      expect(service.create(dto)).resolves.toBe(created);
      expect(bankRepository.create).toHaveBeenCalledWith(dto);
    });
    it('should call findAll on repository', () => {
      const banks: BankEntity[] = [
        { id: 'id1', name: 'Bank1', atms: [], accounts: [], commission: 0.05 },
      ];
      bankRepository.findAll.mockResolvedValue(banks);
      expect(service.findAll()).resolves.toEqual(banks);
      expect(bankRepository.findAll).toHaveBeenCalled();
    });
    it('should call findOne on repository', () => {
      const bank: BankEntity = {
        id: 'id1',
        name: 'Bank1',
        atms: [],
        accounts: [],
        commission: 0.05,
      };
      bankRepository.findOne.mockResolvedValue(bank);
      expect(service.findOne('id1')).resolves.toBe(bank);
      expect(bankRepository.findOne).toHaveBeenCalledWith('id1');
    });
    it('should call update on repository', () => {
      const dto = { id: 'id1', name: 'Bank1', commission: 0.05 };
      const updated: BankEntity = {
        id: 'id1',
        name: 'Bank1',
        atms: [],
        accounts: [],
        commission: 0.05,
      };
      bankRepository.update.mockResolvedValue(updated);
      expect(service.update(dto)).resolves.toBe(updated);
      expect(bankRepository.update).toHaveBeenCalledWith(dto);
    });
    it('should call remove on repository', () => {
      const removed: BankEntity = {
        id: 'id1',
        name: 'Bank1',
        atms: [],
        accounts: [],
        commission: 0.05,
      };
      bankRepository.remove.mockResolvedValue(removed);
      expect(service.remove('id1')).resolves.toBe(removed);
      expect(bankRepository.remove).toHaveBeenCalledWith('id1');
    });
    it('should throw if create fails', async () => {
      const dto = { name: 'Bank1', commission: 0.05 };
      bankRepository.create.mockRejectedValue(new Error('DB error'));
      await expect(service.create(dto)).rejects.toThrow('DB error');
    });
    it('should throw if findAll fails', async () => {
      bankRepository.findAll.mockRejectedValue(new Error('DB error'));
      await expect(service.findAll()).rejects.toThrow('DB error');
    });
    it('should return undefined if findOne not found', async () => {
      bankRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findOne('id1')).resolves.toBeUndefined();
    });
    it('should throw if findOne fails', async () => {
      bankRepository.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.findOne('id1')).rejects.toThrow('DB error');
    });
    it('should return undefined if update not found', async () => {
      bankRepository.update.mockResolvedValue(undefined);
      await expect(
        service.update({ id: 'id1', name: 'Bank1', commission: 0.05 }),
      ).resolves.toBeUndefined();
    });
    it('should throw if update fails', async () => {
      bankRepository.update.mockRejectedValue(new Error('DB error'));
      await expect(
        service.update({ id: 'id1', name: 'Bank1', commission: 0.05 }),
      ).rejects.toThrow('DB error');
    });
    it('should return undefined if remove not found', async () => {
      bankRepository.remove.mockResolvedValue(undefined);
      await expect(service.remove('id1')).resolves.toBeUndefined();
    });
    it('should throw if remove fails', async () => {
      bankRepository.remove.mockRejectedValue(new Error('DB error'));
      await expect(service.remove('id1')).rejects.toThrow('DB error');
    });
  });

  describe('calculateCommission', () => {
    it('should calculate commission using bank commission rate', async () => {
      const bank: BankEntity = {
        id: 'id1',
        name: 'Bank1',
        atms: [],
        accounts: [],
        commission: 0.1,
      };
      bankRepository.findOne.mockResolvedValue(bank);
      const result = await service.calculateCommission('id1', 100);
      expect(result).toBe(10);
    });
    it('should use default commission if not set', async () => {
      const bank: Partial<BankEntity> = {
        id: 'id1',
        name: 'Bank1',
        atms: [],
        accounts: [],
      };
      bankRepository.findOne.mockResolvedValue(bank as BankEntity);
      const result = await service.calculateCommission('id1', 100);
      expect(result).toBe(5);
    });
    it('should return at least 1 as commission', async () => {
      const bank: BankEntity = {
        id: 'id1',
        name: 'Bank1',
        atms: [],
        accounts: [],
        commission: 0.001,
      };
      bankRepository.findOne.mockResolvedValue(bank);
      const result = await service.calculateCommission('id1', 1);
      expect(result).toBe(1);
    });
    it('should handle bank not found', async () => {
      bankRepository.findOne.mockResolvedValue(undefined);
      const result = await service.calculateCommission('id1', 100);
      expect(result).toBe(5);
    });
  });
});
