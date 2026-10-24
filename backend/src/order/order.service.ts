import { BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { FilmsRepository } from '../films/films.repository';
import { CreateOrderDto, OrderedTicketDto, OrderResponse, TicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const items: OrderedTicketDto[] = [];

    for (const ticket of dto.tickets) {
      await this.bookSeat(ticket);
      items.push({ ...ticket, id: uuid() });
    }

    return { total: items.length, items };
  }

  private async bookSeat(ticket: TicketDto): Promise<void> {
    const film = await this.filmsRepository.findFilmBySession(ticket.session);
    if (!film) {
      throw new NotFoundException(`Сеанс ${ticket.session} не найден`);
    }

    const session = film.schedule.find((s) => s.id === ticket.session);
    const isSeatInRange =
      ticket.row >= 1 &&
      ticket.row <= session.rows &&
      ticket.seat >= 1 &&
      ticket.seat <= session.seats;

    if (!isSeatInRange) {
      throw new BadRequestException(
        `Место ${ticket.row}:${ticket.seat} вне зала: рядов ${session.rows}, мест ${session.seats}`,
      );
    }

    const seat = `${ticket.row}:${ticket.seat}`;
    if (session.taken.includes(seat)) {
      throw new ConflictException(`Место ${seat} на сеансе ${ticket.session} уже занято`);
    }

    await this.filmsRepository.addTaken(ticket.session, ticket.row, ticket.seat);
  }
}
