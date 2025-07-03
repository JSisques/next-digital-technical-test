import { Test, TestingModule } from '@nestjs/testing';
import { AtmService } from './atm.service';
import { AtmRepository } from './atm.repository';
import { CardService } from 'src/card/card.service';
import { AccountRepository } from 'src/account/account.repository';
import { TransactionRepository } from 'src/transaction/transaction.repository';
import { BankRepository } from 'src/bank/bank.repository';
import { BankService } from 'src/bank/bank.service';
import { CardType, TransactionType } from '@prisma/client';

const mockAtmRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
const mockCardService = {
  validateCardAndPin: jest.fn(),
};
const mockAccountRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
};
const mockTransactionRepository = {
  create: jest.fn(),
};
const mockBankRepository = {};
const mockBankService = {
  calculateCommission: jest.fn(),
};

describe('AtmService', () => {
  let service: AtmService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtmService,
        { provide: AtmRepository, useValue: mockAtmRepository },
        { provide: CardService, useValue: mockCardService },
        { provide: AccountRepository, useValue: mockAccountRepository },
        { provide: TransactionRepository, useValue: mockTransactionRepository },
        { provide: BankRepository, useValue: mockBankRepository },
        { provide: BankService, useValue: mockBankService },
      ],
    }).compile();
    service = module.get<AtmService>(AtmService);
  });

  describe('CRUD', () => {
    it('should call create on repository', () => {
      const dto = { name: 'ATM1', bankId: 'bank1' };
      mockAtmRepository.create.mockResolvedValue('created');
      expect(service.create(dto)).resolves.toBe('created');
      expect(mockAtmRepository.create).toHaveBeenCalledWith(dto);
    });
    it('should call findAll on repository', () => {
      mockAtmRepository.findAll.mockResolvedValue(['atm1']);
      expect(service.findAll()).resolves.toEqual(['atm1']);
      expect(mockAtmRepository.findAll).toHaveBeenCalled();
    });
    it('should call findOne on repository', () => {
      mockAtmRepository.findOne.mockResolvedValue('atm1');
      expect(service.findOne('id')).resolves.toBe('atm1');
      expect(mockAtmRepository.findOne).toHaveBeenCalledWith('id');
    });
    it('should call update on repository', () => {
      const dto = { id: 'id', name: 'ATM1' };
      mockAtmRepository.update.mockResolvedValue('updated');
      expect(service.update(dto)).resolves.toBe('updated');
      expect(mockAtmRepository.update).toHaveBeenCalledWith(dto);
    });
    it('should call remove on repository', () => {
      mockAtmRepository.remove.mockResolvedValue('removed');
      expect(service.remove('id')).resolves.toBe('removed');
      expect(mockAtmRepository.remove).toHaveBeenCalledWith('id');
    });
  });

  describe('withdraw', () => {
    const baseCard = {
      id: 'card1',
      accountId: 'acc1',
      type: CardType.DEBIT,
      withdrawalLimit: 1000,
    };
    const baseAccount = {
      id: 'acc1',
      balance: 500,
      currency: 'EUR',
      bankId: 'bank1',
    };
    const baseAtm = { id: 'atm1', bankId: 'bank1' };
    const withdrawDto = {
      cardId: 'card1',
      atmId: 'atm1',
      pin: '1234',
      amount: 100,
    };

    it('should withdraw successfully with debit card, no commission', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue(baseAtm);
      mockBankService.calculateCommission.mockResolvedValue(0);
      mockTransactionRepository.create.mockResolvedValue({});
      mockAccountRepository.update.mockResolvedValue({});
      const result = await service.withdraw(withdrawDto);
      expect(result).toEqual({
        message: 'Withdrawal successful',
        withdrawn: 100,
        commission: 0,
        newBalance: 400,
      });
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: TransactionType.WITHDRAWAL }),
      );
      expect(mockAccountRepository.update).toHaveBeenCalledWith({
        id: 'acc1',
        balance: 400,
      });
    });

    it('should withdraw with commission if ATM is from another bank', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue({
        ...baseAtm,
        bankId: 'bank2',
      });
      mockBankService.calculateCommission.mockResolvedValue(5);
      mockTransactionRepository.create.mockResolvedValue({});
      mockAccountRepository.update.mockResolvedValue({});
      const result = await service.withdraw(withdrawDto);
      expect(result.commission).toBe(5);
      expect(result.newBalance).toBe(395);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: TransactionType.FEE }),
      );
    });

    it('should throw if card not valid', async () => {
      mockCardService.validateCardAndPin.mockRejectedValue(
        new Error('Invalid card'),
      );
      await expect(service.withdraw(withdrawDto)).rejects.toThrow(
        'Invalid card',
      );
    });
    it('should throw if account not found', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(null);
      await expect(service.withdraw(withdrawDto)).rejects.toThrow(
        'Associated account not found',
      );
    });
    it('should throw if ATM not found', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue(null);
      await expect(service.withdraw(withdrawDto)).rejects.toThrow(
        'ATM not found',
      );
    });
    it('should throw if insufficient funds (debit)', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue({
        ...baseAccount,
        balance: 50,
      });
      mockAtmRepository.findOne.mockResolvedValue(baseAtm);
      await expect(
        service.withdraw({ ...withdrawDto, amount: 100 }),
      ).rejects.toThrow('Insufficient funds');
    });
    it('should throw if withdrawal amount exceeds card limit', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue(baseAtm);
      await expect(
        service.withdraw({ ...withdrawDto, amount: 2000 }),
      ).rejects.toThrow('Withdrawal amount exceeds card limit');
    });
    it('should throw if unsupported card type', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue({
        ...baseCard,
        type: 'OTHER',
      });
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue(baseAtm);
      await expect(service.withdraw(withdrawDto)).rejects.toThrow(
        'Unsupported card type',
      );
    });
    it('should withdraw with credit card if within limit', async () => {
      const creditCard = {
        ...baseCard,
        type: CardType.CREDIT,
        withdrawalLimit: 1000,
      };
      const creditAccount = { ...baseAccount, balance: -200 };
      mockCardService.validateCardAndPin.mockResolvedValue(creditCard);
      mockAccountRepository.findOne.mockResolvedValue(creditAccount);
      mockAtmRepository.findOne.mockResolvedValue(baseAtm);
      mockBankService.calculateCommission.mockResolvedValue(0);
      mockTransactionRepository.create.mockResolvedValue({});
      mockAccountRepository.update.mockResolvedValue({});
      const result = await service.withdraw({ ...withdrawDto, amount: 700 });
      expect(result.newBalance).toBe(-900);
    });
    it('should throw if credit limit exceeded', async () => {
      const creditCard = {
        ...baseCard,
        type: CardType.CREDIT,
        withdrawalLimit: 1000,
      };
      const creditAccount = { ...baseAccount, balance: -900 };
      mockCardService.validateCardAndPin.mockResolvedValue(creditCard);
      mockAccountRepository.findOne.mockResolvedValue(creditAccount);
      mockAtmRepository.findOne.mockResolvedValue(baseAtm);
      await expect(
        service.withdraw({ ...withdrawDto, amount: 200 }),
      ).rejects.toThrow('Credit limit exceeded');
    });
  });

  describe('deposit', () => {
    const baseCard = { id: 'card1', accountId: 'acc1' };
    const baseAccount = {
      id: 'acc1',
      balance: 500,
      currency: 'EUR',
      bankId: 'bank1',
    };
    const baseAtm = { id: 'atm1', bankId: 'bank1' };
    const depositDto = {
      cardId: 'card1',
      atmId: 'atm1',
      pin: '1234',
      amount: 100,
    };

    it('should deposit successfully if ATM is from same bank', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue(baseAtm);
      mockTransactionRepository.create.mockResolvedValue({});
      mockAccountRepository.update.mockResolvedValue({});
      const result = await service.deposit(depositDto);
      expect(result).toEqual({
        message: 'Deposit successful',
        deposited: 100,
        newBalance: 600,
      });
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: TransactionType.DEPOSIT }),
      );
      expect(mockAccountRepository.update).toHaveBeenCalledWith({
        id: 'acc1',
        balance: 600,
      });
    });
    it('should throw if card not valid', async () => {
      mockCardService.validateCardAndPin.mockRejectedValue(
        new Error('Invalid card'),
      );
      await expect(service.deposit(depositDto)).rejects.toThrow('Invalid card');
    });
    it('should throw if account not found', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(null);
      await expect(service.deposit(depositDto)).rejects.toThrow(
        'Associated account not found',
      );
    });
    it('should throw if ATM not found', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue(null);
      await expect(service.deposit(depositDto)).rejects.toThrow(
        'ATM not found',
      );
    });
    it('should throw if ATM is from another bank', async () => {
      mockCardService.validateCardAndPin.mockResolvedValue(baseCard);
      mockAccountRepository.findOne.mockResolvedValue(baseAccount);
      mockAtmRepository.findOne.mockResolvedValue({
        ...baseAtm,
        bankId: 'bank2',
      });
      await expect(service.deposit(depositDto)).rejects.toThrow(
        'Deposits are only allowed at ATMs of the same bank',
      );
    });
  });
});
