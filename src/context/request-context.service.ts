import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";

export interface RequestStore {
  correlationId: string;
  userId?: string;
}

@Injectable()
export class RequestContextService {
  private readonly als = new AsyncLocalStorage<RequestStore>();

  run(store: RequestStore, callback: () => void): void {
    this.als.run(store, callback)
  }

  getStore(): RequestStore | undefined {
    return this.als.getStore();
  }

  get correlationId(): string | undefined {
    return this.als.getStore()?.correlationId;
  }
}