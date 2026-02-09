import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { OnboardingRecord } from './onboarding.types';

@Injectable()
export class OnboardingService {
  private readonly store = new Map<string, OnboardingRecord>();

  create(dto: CreateOnboardingDto, requestedBy: string) {
    const onboardingId = randomUUID();

    const record: OnboardingRecord = {
      onboardingId,
      status: 'REQUESTED',
      fullName: dto.fullName,
      documentNumber: dto.documentNumber,
      email: dto.email,
      initialAmount: dto.initialAmount,
      requestedAt: new Date().toISOString(),
      requestedBy,
    };

    this.store.set(onboardingId, record);

    return { onboardingId, status: record.status };
  }

  getAll() {
    return Array.from(this.store.values());
  }
}
