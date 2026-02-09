import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PRODUCTS, Product } from './products.data';

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  private ttlMs = 60_000;

  async findAll(): Promise<Product[]> {
    const key = 'products:all';
    const cached = await this.cache.get<Product[]>(key);
    if (cached) return cached;


    await this.cache.set(key, PRODUCTS, this.ttlMs);
    return PRODUCTS;
  }

  async findById(id: string): Promise<Product> {
    const key = `products:${id}`;
    const cached = await this.cache.get<Product>(key);
    if (cached) return cached;

    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) throw new NotFoundException('Producto no encontrado');

    await this.cache.set(key, product, this.ttlMs);
    return product;
  }
}
