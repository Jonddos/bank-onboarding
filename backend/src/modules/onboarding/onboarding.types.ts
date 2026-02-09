export type OnboardingStatus = 'REQUESTED';

export type OnboardingRecord = {
  onboardingId: string;
  status: OnboardingStatus;
  fullName: string;
  documentNumber: string;
  email: string;
  initialAmount: number;
  requestedAt: string;
  requestedBy: string;
};
