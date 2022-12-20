import type { UserService } from "./user-service";
import { DatabasePool, sql } from "slonik";

export class PsqlUserService implements UserService {
  constructor(private readonly pool: DatabasePool) {}

  async ping(): Promise<string> {
    await this.pool.query(sql.unsafe`SELECT 1 as data`);
    return "OK";
  }
}