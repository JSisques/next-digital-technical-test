import { Test, TestingModule } from '@nestjs/testing';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

const mockBank = {
  id: 'bank1',
  name: 'Bank of America',
  atms: [],
  accounts: [],
  commission: 0.05,
};

describe('BankController', () => {
  let controller: BankController;
  let service: jest.Mocked<BankService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankController],
      providers: [
        {
          provide: BankService,
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

    controller = module.get<BankController>(BankController);
    service = module.get(BankService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a bank', async () => {
      const dto: CreateBankDto = {
        name: mockBank.name,
        commission: mockBank.commission,
      };
      service.create.mockResolvedValue(mockBank);
      await expect(controller.create(dto)).resolves.toBe(mockBank);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('should throw if service throws', async () => {
      const dto: CreateBankDto = {
        name: mockBank.name,
        commission: mockBank.commission,
      };
      service.create.mockRejectedValue(new Error('error'));
      await expect(controller.create(dto)).rejects.toThrow('error');
    });
  });

  describe('findAll', () => {
    it('should return all banks', async () => {
      service.findAll.mockResolvedValue([mockBank]);
      await expect(controller.findAll()).resolves.toEqual([mockBank]);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should throw if service throws', async () => {
      service.findAll.mockRejectedValue(new Error('error'));
      await expect(controller.findAll()).rejects.toThrow('error');
    });
  });

  describe('findOne', () => {
    it('should return a bank by id', async () => {
      service.findOne.mockResolvedValue(mockBank);
      await expect(controller.findOne('bank1')).resolves.toBe(mockBank);
      expect(service.findOne).toHaveBeenCalledWith('bank1');
    });
    it('should return undefined if not found', async () => {
      service.findOne.mockResolvedValue(undefined);
      await expect(controller.findOne('bank1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.findOne.mockRejectedValue(new Error('error'));
      await expect(controller.findOne('bank1')).rejects.toThrow('error');
    });
  });

  describe('update', () => {
    it('should update a bank', async () => {
      const dto: UpdateBankDto = {
        id: 'bank1',
        name: 'Bank Updated',
        commission: 0.1,
      };
      service.update.mockResolvedValue({ ...mockBank, ...dto });
      await expect(controller.update('bank1', dto)).resolves.toEqual({
        ...mockBank,
        ...dto,
      });
      expect(service.update).toHaveBeenCalledWith(dto);
    });
    it('should return undefined if not found', async () => {
      const dto: UpdateBankDto = {
        id: 'bank1',
        name: 'Bank Updated',
        commission: 0.1,
      };
      service.update.mockResolvedValue(undefined);
      await expect(controller.update('bank1', dto)).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      const dto: UpdateBankDto = {
        id: 'bank1',
        name: 'Bank Updated',
        commission: 0.1,
      };
      service.update.mockRejectedValue(new Error('error'));
      await expect(controller.update('bank1', dto)).rejects.toThrow('error');
    });
  });

  describe('remove', () => {
    it('should remove a bank', async () => {
      service.remove.mockResolvedValue(mockBank);
      await expect(controller.remove('bank1')).resolves.toBe(mockBank);
      expect(service.remove).toHaveBeenCalledWith('bank1');
    });
    it('should return undefined if not found', async () => {
      service.remove.mockResolvedValue(undefined);
      await expect(controller.remove('bank1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.remove.mockRejectedValue(new Error('error'));
      await expect(controller.remove('bank1')).rejects.toThrow('error');
    });
  });
});
