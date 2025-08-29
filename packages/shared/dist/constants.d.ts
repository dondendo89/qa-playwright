import { PlanLimits, SubscriptionPlan } from './types';
export declare const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits>;
export declare const PLAN_PRICES: {
    starter: number;
    pro: number;
    business: number;
};
export declare const DEFAULT_SCENARIO_CONFIG: {
    timeout: number;
    maxLinksToCheck: number;
    viewport: {
        width: number;
        height: number;
    };
    userAgent: string;
};
export declare const DEFAULT_EMAIL_TEMPLATE = "alert";
export declare const DEFAULT_EMAIL_SUBJECT = "Scenario Failed: {scenarioName}";
export declare const DEFAULT_WORKER_CONCURRENCY = 2;
export declare const SCHEDULER_POLL_INTERVAL = 30000;
export declare const DEFAULT_RETENTION_DAYS = 90;
export declare const RATE_LIMIT_MAX = 100;
export declare const RATE_LIMIT_WINDOW: number;
