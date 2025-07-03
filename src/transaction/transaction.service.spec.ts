import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { CardService } from 'src/card/card.service';
import { AccountRepository } from 'src/account/account.repository';
import { BankService } from 'src/bank/bank.service';
import { TransactionType, Currency } from '@prisma/client';
import { TransactionEntity } from './entities/transaction.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CardEntity } from 'src/card/entities/card.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let cardService: jest.Mocked<CardService>;
  let accountRepository: jest.Mocked<AccountRepository>;
  let bankService: jest.Mocked<BankService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByAccountId: jest.fn(),
          },
        },
        { provide: CardService, useValue: { validateCardAndPin: jest.fn() } },
        {
          provide: AccountRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
          },
        },
        { provide: BankService, useValue: { calculateCommission: jest.fn() } },
      ],
    }).compile();
    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(TransactionRepository);
    cardService = module.get(CardService);
    accountRepository = module.get(AccountRepository);
    bankService = module.get(BankService);
  });

  describe('CRUD', () => {
    it('should call create on repository', () => {
      const dto = {
        accountId: 'acc1',
        amount: 100,
        type: TransactionType.DEPOSIT,
        currency: Currency.EUR,
      };
      const created: TransactionEntity = {
        id: 'tx1',
        accountId: 'acc1',
        amount: 100,
        type: TransactionType.DEPOSIT,
        currency: Currency.EUR,
        createdAt: new Date(),
        description: 'desc',
        cardId: 'card1',
      };
      transactionRepository.create.mockResolvedValue(created);
      expect(service.create(dto)).resolves.toBe(created);
      expect(transactionRepository.create).toHaveBeenCalledWith(dto);
    });
    it('should call findAll on repository', () => {
      const txs: TransactionEntity[] = [
        {
          id: 'tx1',
          accountId: 'acc1',
          amount: 100,
          type: TransactionType.DEPOSIT,
          currency: Currency.EUR,
          createdAt: new Date(),
          description: 'desc',
          cardId: 'card1',
        },
      ];
      transactionRepository.findAll.mockResolvedValue(txs);
      expect(service.findAll()).resolves.toEqual(txs);
      expect(transactionRepository.findAll).toHaveBeenCalled();
    });
    it('should call findOne on repository', () => {
      const tx: TransactionEntity = {
        id: 'tx1',
        accountId: 'acc1',
        amount: 100,
        type: TransactionType.DEPOSIT,
        currency: Currency.EUR,
        createdAt: new Date(),
        description: 'desc',
        cardId: 'card1',
      };
      transactionRepository.findOne.mockResolvedValue(tx);
      expect(service.findOne('tx1')).resolves.toBe(tx);
      expect(transactionRepository.findOne).toHaveBeenCalledWith('tx1');
    });
    it('should call update on repository', () => {
      const dto = { id: 'tx1', amount: 200 };
      const updated: TransactionEntity = {
        id: 'tx1',
        accountId: 'acc1',
        amount: 200,
        type: TransactionType.DEPOSIT,
        currency: Currency.EUR,
        createdAt: new Date(),
        description: 'desc',
        cardId: 'card1',
      };
      transactionRepository.update.mockResolvedValue(updated);
      expect(service.update('tx1', dto)).resolves.toBe(updated);
      expect(transactionRepository.update).toHaveBeenCalledWith(dto);
    });
    it('should call remove on repository', () => {
      const removed: TransactionEntity = {
        id: 'tx1',
        accountId: 'acc1',
        amount: 100,
        type: TransactionType.DEPOSIT,
        currency: Currency.EUR,
        createdAt: new Date(),
        description: 'desc',
        cardId: 'card1',
      };
      transactionRepository.remove.mockResolvedValue(removed);
      expect(service.remove('tx1')).resolves.toBe(removed);
      expect(transactionRepository.remove).toHaveBeenCalledWith('tx1');
    });
  });

  describe('findByAccountId', () => {
    it('should call findByAccountId on repository', () => {
      const txs: TransactionEntity[] = [
        {
          id: 'tx1',
          accountId: 'acc1',
          amount: 100,
          type: TransactionType.DEPOSIT,
          currency: Currency.EUR,
          createdAt: new Date(),
          description: 'desc',
          cardId: 'card1',
        },
      ];
      transactionRepository.findByAccountId.mockResolvedValue(txs);
      expect(service.findByAccountId('acc1')).resolves.toEqual(txs);
      expect(transactionRepository.findByAccountId).toHaveBeenCalledWith(
        'acc1',
      );
    });
  });

  describe('transfer', () => {
    const baseCard: CardEntity = {
      id: 'card1',
      accountId: 'acc1',
      cardNumber: '123',
      cardholderName: 'Test',
      expirationDate: new Date(),
      cvv: 123,
      pin: 'hash',
      isActivated: true,
      type: 'DEBIT',
      withdrawalLimit: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
    };
    const fromAccount: AccountEntity = {
      id: 'acc1',
      iban: 'ES123',
      balance: 1000,
      currency: Currency.EUR,
      createdAt: new Date(),
      updatedAt: new Date(),
      cards: [],
      transactions: [],
      bankId: 'bank1',
    };
    const toAccount: AccountEntity = {
      id: 'acc2',
      iban: 'ES124',
      balance: 500,
      currency: Currency.EUR,
      createdAt: new Date(),
      updatedAt: new Date(),
      cards: [],
      transactions: [],
      bankId: 'bank2',
    };
    const transferDto = {
      cardId: 'card1',
      pin: '1234',
      fromAccountId: 'acc1',
      toIban: 'ES124',
      amount: 100,
    };

    it('should transfer successfully within same bank', async () => {
      cardService.validateCardAndPin.mockResolvedValue(baseCard);
      accountRepository.findOne.mockResolvedValueOnce({
        ...fromAccount,
        bankId: fromAccount.bankId!,
      });
      accountRepository.findAll.mockResolvedValue([
        { ...fromAccount, bankId: fromAccount.bankId! },
        { ...toAccount, bankId: toAccount.bankId! },
      ]);
      const txMock: TransactionEntity = {
        id: 'tx1',
        accountId: 'acc1',
        amount: 100,
        type: TransactionType.TRANSFER_SENT,
        currency: Currency.EUR,
        createdAt: new Date(),
        description: 'desc',
        cardId: 'card1',
      };
      transactionRepository.create.mockResolvedValue(txMock);
      const accMock: AccountEntity = {
        ...fromAccount,
        bankId: fromAccount.bankId!,
      };
      accountRepository.update.mockResolvedValue(accMock as any);
      const result = await service.transfer({
        ...transferDto,
        toIban: 'ES124',
      });
      expect(result.message).toBe('Transfer successful');
      expect(result.commission).toBe(0);
      expect(accountRepository.update).toHaveBeenCalledWith({
        id: 'acc1',
        balance: 900,
      });
      expect(accountRepository.update).toHaveBeenCalledWith({
        id: 'acc2',
        balance: 600,
      });
    });
    it('should transfer with commission if to another bank', async () => {
      cardService.validateCardAndPin.mockResolvedValue(baseCard);
      accountRepository.findOne.mockResolvedValueOnce({
        ...fromAccount,
        bankId: fromAccount.bankId!,
      });
      accountRepository.findAll.mockResolvedValue([
        { ...fromAccount, bankId: fromAccount.bankId! },
        { ...toAccount, bankId: toAccount.bankId! },
      ]);
      bankService.calculateCommission.mockResolvedValue(10);
      const txMock: TransactionEntity = {
        id: 'tx1',
        accountId: 'acc1',
        amount: 100,
        type: TransactionType.TRANSFER_SENT,
        currency: Currency.EUR,
        createdAt: new Date(),
        description: 'desc',
        cardId: 'card1',
      };
      transactionRepository.create.mockResolvedValue(txMock);
      const accMock: AccountEntity = {
        ...fromAccount,
        bankId: fromAccount.bankId!,
      };
      accountRepository.update.mockResolvedValue(accMock as any);
      const result = await service.transfer({
        ...transferDto,
        toIban: 'ES124',
      });
      expect(result.commission).toBe(10);
      expect(accountRepository.update).toHaveBeenCalledWith({
        id: 'acc1',
        balance: 890,
      });
    });
    it('should throw if card is not associated with source account', async () => {
      cardService.validateCardAndPin.mockResolvedValue({
        ...baseCard,
        accountId: 'other',
      });
      await expect(service.transfer(transferDto)).rejects.toThrow(
        'Card is not associated with the source account',
      );
    });
    it('should throw if source account not found', async () => {
      cardService.validateCardAndPin.mockResolvedValue(baseCard);
      accountRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.transfer(transferDto)).rejects.toThrow(
        'Source account not found',
      );
    });
    it('should throw if invalid IBAN format', async () => {
      cardService.validateCardAndPin.mockResolvedValue(baseCard);
      accountRepository.findOne.mockResolvedValueOnce({
        ...fromAccount,
        bankId: fromAccount.bankId!,
      });
      await expect(
        service.transfer({ ...transferDto, toIban: 'BADIBAN' }),
      ).rejects.toThrow('Invalid destination IBAN format');
    });
    it('should throw if destination account not found', async () => {
      cardService.validateCardAndPin.mockResolvedValue(baseCard);
      accountRepository.findOne.mockResolvedValueOnce({
        ...fromAccount,
        bankId: fromAccount.bankId!,
      });
      accountRepository.findAll.mockResolvedValue([
        { ...fromAccount, bankId: fromAccount.bankId! },
      ]);
      await expect(service.transfer(transferDto)).rejects.toThrow(
        'Destination account not found',
      );
    });
    it('should throw if insufficient funds', async () => {
      cardService.validateCardAndPin.mockResolvedValue(baseCard);
      accountRepository.findOne.mockResolvedValueOnce({
        ...fromAccount,
        balance: 50,
        bankId: fromAccount.bankId!,
      });
      accountRepository.findAll.mockResolvedValue([
        { ...fromAccount, bankId: fromAccount.bankId! },
        { ...toAccount, bankId: toAccount.bankId! },
      ]);
      await expect(service.transfer(transferDto)).rejects.toThrow(
        'Insufficient funds',
      );
    });
  });
});
