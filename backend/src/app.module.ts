import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 100,
    }),

    AuthModule,
    ProductsModule,
    OnboardingModule,
    HealthModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: CacheInterceptor }],
})
export class AppModule {}
