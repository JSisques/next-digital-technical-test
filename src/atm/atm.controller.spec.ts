import { Test, TestingModule } from '@nestjs/testing';
import { AtmController } from './atm.controller';
import { AtmService } from './atm.service';
import { CreateAtmDto } from './dto/create-atm.dto';
import { UpdateAtmDto } from './dto/update-atm.dto';
import { WithdrawAtmDto } from './dto/withdraw-atm.dto';
import { DepositAtmDto } from './dto/deposit-atm.dto';

const mockAtm = {
  id: 'atm1',
  name: 'ATM Central Park',
  bankId: 'bank1',
};

describe('AtmController', () => {
  let controller: AtmController;
  let service: jest.Mocked<AtmService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtmController],
      providers: [
        {
          provide: AtmService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            withdraw: jest.fn(),
            deposit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AtmController>(AtmController);
    service = module.get(AtmService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an ATM', async () => {
      const dto: CreateAtmDto = { name: mockAtm.name, bankId: mockAtm.bankId };
      service.create.mockResolvedValue(mockAtm);
      await expect(controller.create(dto)).resolves.toBe(mockAtm);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('should throw if service throws', async () => {
      const dto: CreateAtmDto = { name: mockAtm.name, bankId: mockAtm.bankId };
      service.create.mockRejectedValue(new Error('error'));
      await expect(controller.create(dto)).rejects.toThrow('error');
    });
  });

  describe('findAll', () => {
    it('should return all ATMs', async () => {
      service.findAll.mockResolvedValue([mockAtm]);
      await expect(controller.findAll()).resolves.toEqual([mockAtm]);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should throw if service throws', async () => {
      service.findAll.mockRejectedValue(new Error('error'));
      await expect(controller.findAll()).rejects.toThrow('error');
    });
  });

  describe('findOne', () => {
    it('should return an ATM by id', async () => {
      service.findOne.mockResolvedValue(mockAtm);
      await expect(controller.findOne('atm1')).resolves.toBe(mockAtm);
      expect(service.findOne).toHaveBeenCalledWith('atm1');
    });
    it('should return undefined if not found', async () => {
      service.findOne.mockResolvedValue(undefined);
      await expect(controller.findOne('atm1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.findOne.mockRejectedValue(new Error('error'));
      await expect(controller.findOne('atm1')).rejects.toThrow('error');
    });
  });

  describe('update', () => {
    it('should update an ATM', async () => {
      const dto: UpdateAtmDto = { id: 'atm1', name: 'ATM Updated' };
      service.update.mockResolvedValue({ ...mockAtm, ...dto });
      await expect(controller.update('atm1', dto)).resolves.toEqual({
        ...mockAtm,
        ...dto,
      });
      expect(service.update).toHaveBeenCalledWith(dto);
    });
    it('should return undefined if not found', async () => {
      const dto: UpdateAtmDto = { id: 'atm1', name: 'ATM Updated' };
      service.update.mockResolvedValue(undefined);
      await expect(controller.update('atm1', dto)).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      const dto: UpdateAtmDto = { id: 'atm1', name: 'ATM Updated' };
      service.update.mockRejectedValue(new Error('error'));
      await expect(controller.update('atm1', dto)).rejects.toThrow('error');
    });
  });

  describe('remove', () => {
    it('should remove an ATM', async () => {
      service.remove.mockResolvedValue(mockAtm);
      await expect(controller.remove('atm1')).resolves.toBe(mockAtm);
      expect(service.remove).toHaveBeenCalledWith('atm1');
    });
    it('should return undefined if not found', async () => {
      service.remove.mockResolvedValue(undefined);
      await expect(controller.remove('atm1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.remove.mockRejectedValue(new Error('error'));
      await expect(controller.remove('atm1')).rejects.toThrow('error');
    });
  });

  describe('withdraw', () => {
    it('should withdraw money', async () => {
      const dto: WithdrawAtmDto = {
        cardId: 'card1',
        atmId: 'atm1',
        amount: 100,
        pin: '1234',
      };
      const result = {
        message: 'Withdrawal successful',
        withdrawn: 100,
        commission: 1,
        newBalance: 900,
      };
      service.withdraw.mockResolvedValue(result);
      await expect(controller.withdraw(dto)).resolves.toBe(result);
      expect(service.withdraw).toHaveBeenCalledWith(dto);
    });
    it('should throw if service throws', async () => {
      const dto: WithdrawAtmDto = {
        cardId: 'card1',
        atmId: 'atm1',
        amount: 100,
        pin: '1234',
      };
      service.withdraw.mockRejectedValue(new Error('error'));
      await expect(controller.withdraw(dto)).rejects.toThrow('error');
    });
  });

  describe('deposit', () => {
    it('should deposit money', async () => {
      const dto: DepositAtmDto = {
        cardId: 'card1',
        atmId: 'atm1',
        amount: 100,
        pin: '1234',
      };
      const result = {
        message: 'Deposit successful',
        deposited: 100,
        newBalance: 1100,
      };
      service.deposit.mockResolvedValue(result);
      await expect(controller.deposit(dto)).resolves.toBe(result);
      expect(service.deposit).toHaveBeenCalledWith(dto);
    });
    it('should throw if service throws', async () => {
      const dto: DepositAtmDto = {
        cardId: 'card1',
        atmId: 'atm1',
        amount: 100,
        pin: '1234',
      };
      service.deposit.mockRejectedValue(new Error('error'));
      await expect(controller.deposit(dto)).rejects.toThrow('error');
    });
  });
});
