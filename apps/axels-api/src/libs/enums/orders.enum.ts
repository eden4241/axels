import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PAUSE = "PAUSE",
  PROCESS = "PROCESS",
  DELETE = "DELETE",
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
