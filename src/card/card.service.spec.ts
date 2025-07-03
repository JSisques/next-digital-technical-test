import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { CardRepository } from './card.repository';
import * as bcrypt from 'bcrypt';
import { CardType } from '@prisma/client';

jest.mock('bcrypt');

const mockCardRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CardService', () => {
  let service: CardService;

  beforeEach(async () => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockReset();
    (bcrypt.compare as jest.Mock).mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        { provide: CardRepository, useValue: mockCardRepository },
      ],
    }).compile();
    service = module.get<CardService>(CardService);
  });

  describe('CRUD', () => {
    it('should call create on repository', () => {
      const dto = {
        cardNumber: '4532015112830366',
        cardholderName: 'John Doe',
        expirationDate: new Date('2025-12-31'),
        cvv: 123,
        pin: '1234',
        isActivated: false,
        type: CardType.DEBIT,
        withdrawalLimit: 1000,
        accountId: 'acc1',
      };
      mockCardRepository.create.mockResolvedValue('created');
      expect(service.create(dto)).resolves.toBe('created');
      expect(mockCardRepository.create).toHaveBeenCalledWith(dto);
    });
    it('should call findAll on repository', () => {
      mockCardRepository.findAll.mockResolvedValue(['card1']);
      expect(service.findAll()).resolves.toEqual(['card1']);
      expect(mockCardRepository.findAll).toHaveBeenCalled();
    });
    it('should call findOne on repository', () => {
      mockCardRepository.findOne.mockResolvedValue('card1');
      expect(service.findOne('id')).resolves.toBe('card1');
      expect(mockCardRepository.findOne).toHaveBeenCalledWith('id');
    });
    it('should call update on repository', () => {
      const dto = { id: 'id', withdrawalLimit: 2000 };
      mockCardRepository.update.mockResolvedValue('updated');
      expect(service.update(dto)).resolves.toBe('updated');
      expect(mockCardRepository.update).toHaveBeenCalledWith(dto);
    });
    it('should call remove on repository', () => {
      mockCardRepository.remove.mockResolvedValue('removed');
      expect(service.remove('id')).resolves.toBe('removed');
      expect(mockCardRepository.remove).toHaveBeenCalledWith('id');
    });
  });

  describe('activate', () => {
    it('should hash pin and update card as activated', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPin');
      mockCardRepository.update.mockResolvedValue('activated');
      const result = await service.activate('card1', '1234');
      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
      expect(mockCardRepository.update).toHaveBeenCalledWith({
        id: 'card1',
        isActivated: true,
        pin: 'hashedPin',
      });
      expect(result).toBe('activated');
    });
  });

  describe('changePin', () => {
    it('should throw if card not found', async () => {
      mockCardRepository.findOne.mockResolvedValue(null);
      await expect(service.changePin('card1', '1111', '2222')).rejects.toThrow(
        'Card not found',
      );
    });
    it('should throw if old pin is incorrect', async () => {
      mockCardRepository.findOne.mockResolvedValue({
        id: 'card1',
        pin: 'hashedPin',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.changePin('card1', '1111', '2222')).rejects.toThrow(
        'Current PIN is incorrect',
      );
    });
    it('should hash new pin and update card if old pin is correct', async () => {
      mockCardRepository.findOne.mockResolvedValue({
        id: 'card1',
        pin: 'hashedPin',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPin');
      mockCardRepository.update.mockResolvedValue('updated');
      const result = await service.changePin('card1', '1111', '2222');
      expect(bcrypt.compare).toHaveBeenCalledWith('1111', 'hashedPin');
      expect(bcrypt.hash).toHaveBeenCalledWith('2222', 10);
      expect(mockCardRepository.update).toHaveBeenCalledWith({
        id: 'card1',
        pin: 'newHashedPin',
      });
      expect(result).toBe('updated');
    });
  });

  describe('validateCardAndPin', () => {
    const card = { id: 'card1', pin: 'hashedPin', isActivated: true };
    it('should throw if card not found', async () => {
      mockCardRepository.findOne.mockResolvedValue(null);
      await expect(service.validateCardAndPin('card1', '1111')).rejects.toThrow(
        'Card not found',
      );
    });
    it('should throw if card is not activated', async () => {
      mockCardRepository.findOne.mockResolvedValue({
        ...card,
        isActivated: false,
      });
      await expect(service.validateCardAndPin('card1', '1111')).rejects.toThrow(
        'Card is not activated',
      );
    });
    it('should throw if pin is invalid', async () => {
      mockCardRepository.findOne.mockResolvedValue(card);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.validateCardAndPin('card1', '1111')).rejects.toThrow(
        'Invalid PIN',
      );
    });
    it('should return card if pin is valid and card is activated', async () => {
      mockCardRepository.findOne.mockResolvedValue(card);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validateCardAndPin('card1', '1111');
      expect(result).toBe(card);
    });
  });
});
