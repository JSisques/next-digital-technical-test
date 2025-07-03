import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardType } from '@prisma/client';

const mockCard = {
  id: 'card1',
  cardNumber: '4532015112830366',
  cardholderName: 'John Doe',
  expirationDate: new Date('2025-12-31'),
  cvv: 123,
  pin: '1234',
  isActivated: false,
  type: CardType.DEBIT,
  withdrawalLimit: 1000,
  accountId: 'acc1',
  createdAt: new Date(),
  updatedAt: new Date(),
  transactions: [],
};

function withoutPin(card: any) {
  if (card && typeof card === 'object' && 'pin' in card) {
    const { pin, ...rest } = card;
    return rest;
  }
  return card;
}

describe('CardController', () => {
  let controller: CardController;
  let service: jest.Mocked<CardService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            activate: jest.fn(),
            changePin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get(CardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a card and not return pin', async () => {
      const dto: CreateCardDto = { ...mockCard, pin: '1234' };
      service.create.mockResolvedValue(mockCard);
      await expect(controller.create(dto)).resolves.toEqual(
        withoutPin(mockCard),
      );
      expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('should throw if service throws', async () => {
      const dto: CreateCardDto = { ...mockCard, pin: '1234' };
      service.create.mockRejectedValue(new Error('error'));
      await expect(controller.create(dto)).rejects.toThrow('error');
    });
  });

  describe('findAll', () => {
    it('should return all cards without pin', async () => {
      service.findAll.mockResolvedValue([mockCard]);
      await expect(controller.findAll()).resolves.toEqual([
        withoutPin(mockCard),
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should throw if service throws', async () => {
      service.findAll.mockRejectedValue(new Error('error'));
      await expect(controller.findAll()).rejects.toThrow('error');
    });
  });

  describe('findOne', () => {
    it('should return a card by id without pin', async () => {
      service.findOne.mockResolvedValue(mockCard);
      await expect(controller.findOne('card1')).resolves.toEqual(
        withoutPin(mockCard),
      );
      expect(service.findOne).toHaveBeenCalledWith('card1');
    });
    it('should return undefined if not found', async () => {
      service.findOne.mockResolvedValue(undefined);
      await expect(controller.findOne('card1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.findOne.mockRejectedValue(new Error('error'));
      await expect(controller.findOne('card1')).rejects.toThrow('error');
    });
  });

  describe('update', () => {
    it('should update a card and not return pin', async () => {
      const dto: UpdateCardDto = { id: 'card1', withdrawalLimit: 2000 };
      service.update.mockResolvedValue({ ...mockCard, ...dto });
      await expect(controller.update('card1', dto)).resolves.toEqual(
        withoutPin({ ...mockCard, ...dto }),
      );
      expect(service.update).toHaveBeenCalledWith(dto);
    });
    it('should return undefined if not found', async () => {
      const dto: UpdateCardDto = { id: 'card1', withdrawalLimit: 2000 };
      service.update.mockResolvedValue(undefined);
      await expect(controller.update('card1', dto)).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      const dto: UpdateCardDto = { id: 'card1', withdrawalLimit: 2000 };
      service.update.mockRejectedValue(new Error('error'));
      await expect(controller.update('card1', dto)).rejects.toThrow('error');
    });
  });

  describe('remove', () => {
    it('should remove a card and not return pin', async () => {
      service.remove.mockResolvedValue(mockCard);
      await expect(controller.remove('card1')).resolves.toEqual(
        withoutPin(mockCard),
      );
      expect(service.remove).toHaveBeenCalledWith('card1');
    });
    it('should return undefined if not found', async () => {
      service.remove.mockResolvedValue(undefined);
      await expect(controller.remove('card1')).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.remove.mockRejectedValue(new Error('error'));
      await expect(controller.remove('card1')).rejects.toThrow('error');
    });
  });

  describe('activate', () => {
    it('should activate a card and not return pin', async () => {
      service.activate.mockResolvedValue({ ...mockCard, isActivated: true });
      await expect(controller.activate('card1', '1234')).resolves.toEqual(
        withoutPin({ ...mockCard, isActivated: true }),
      );
      expect(service.activate).toHaveBeenCalledWith('card1', '1234');
    });
    it('should return undefined if not found', async () => {
      service.activate.mockResolvedValue(undefined);
      await expect(
        controller.activate('card1', '1234'),
      ).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.activate.mockRejectedValue(new Error('error'));
      await expect(controller.activate('card1', '1234')).rejects.toThrow(
        'error',
      );
    });
  });

  describe('changePin', () => {
    it('should change pin and not return pin', async () => {
      service.changePin.mockResolvedValue({ ...mockCard, pin: '5678' });
      await expect(
        controller.changePin('card1', '1234', '5678'),
      ).resolves.toEqual(withoutPin({ ...mockCard, pin: '5678' }));
      expect(service.changePin).toHaveBeenCalledWith('card1', '1234', '5678');
    });
    it('should return undefined if not found', async () => {
      service.changePin.mockResolvedValue(undefined);
      await expect(
        controller.changePin('card1', '1234', '5678'),
      ).resolves.toBeUndefined();
    });
    it('should throw if service throws', async () => {
      service.changePin.mockRejectedValue(new Error('error'));
      await expect(
        controller.changePin('card1', '1234', '5678'),
      ).rejects.toThrow('error');
    });
  });
});
