import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Helper to parse boolean strings correctly (z.coerce.boolean parses any non-empty string like "false" as true)
const booleanEnv = (defaultValue: boolean = false) =>
  z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") return defaultValue;
      if (typeof val === "boolean") return val;
      return val.toLowerCase() === "true" || val === "1";
    });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(2077),
  API_BASE_URL: z.string().default("http://localhost:2077"),
  API_PREFIX: z.string().default("/api/v1"),

  // PostgreSQL
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("zfund_db"),
  DB_SSL: booleanEnv(false),
  TYPEORM_SYNCHRONIZE: booleanEnv(true),
  TYPEORM_LOGGING: booleanEnv(false),

  // Redis
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(""),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_ENABLED: booleanEnv(false),
  REDIS_KEY_PREFIX: z.string().default("zfund:"),

  // Auth & JWT
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  ARGON2_MEMORY_COST: z.coerce.number().default(65536),
  ARGON2_TIME_COST: z.coerce.number().default(3),
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: booleanEnv(false),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),

  // Public URL of the web app, used in SMS links
  FRONTEND_URL: z.string().default("http://localhost:3000"),

  // Phone number for the seeded super admin (needed to sign in with an SMS code)
  SEED_ADMIN_PHONE: z.string().optional().default(""),

  // CORS
  CORS_ORIGIN: z.string().default("*"),
  CORS_HANDLED_BY_PROXY: booleanEnv(false),

  // NALO USSD
  NALO_USER_ID: z.string().default("ZEUS2028"),
  NALO_DEFAULT_CODE: z.string().default("*920*969#"),
  NALO_MAX_MESSAGE_LENGTH: z.coerce.number().default(160),

  // Payment Provider Configuration
  PAYMENT_PROVIDER: z.enum(["robspay", "paystack"]).default("robspay"),

  // RobsPay
  ROBSPAY_API_URL: z
    .string()
    .default("https://robspay.robsamtechnologies.com/apis/v1/collect-payment"),
  ROBSPAY_MERCHANT_ID: z.string().default("ZEU889626"),
  ROBSPAY_MERCHANT_NAME: z.string().default("Zeus Atlas Ltd"),
  ROBSPAY_API_KEY: z
    .string()
    .default(
      "239d7edb7e27c718f0f662eb5779f26930c74cd909d95113b886349802b1579b"
    ),
  ROBSPAY_CALLBACK_URL: z.string().optional().default(""),

  // Paystack (legacy / optional fallback)
  PAYSTACK_SECRET_KEY: z.string().optional().default(""),
  PAYSTACK_PUBLIC_KEY: z.string().optional().default(""),
  PAYSTACK_BASE_URL: z.string().default("https://api.paystack.co"),

  // SMS
  SMS_PROVIDER: z
    .enum(["mock", "mnotify", "arkesel", "nalo"])
    .default("mnotify"),
  SMS_API_KEY: z.string().optional().default(""),
  SMS_SENDER_ID: z.string().default("RaiseFunds"),
  SMS_API_URL: z.string().default("https://api.mnotify.com/api/sms/quick"),

  // Email (SMTP) - used for the website contact form notifications
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: booleanEnv(false),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  MAIL_FROM: z.string().optional().default(""),
  CONTACT_TO_EMAIL: z.string().email().default("support@zeusatlasltd.com"),

  // Storage
  UPLOAD_DIR: z.string().default("storage/documents"),
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  ALLOWED_FILE_TYPES: z
    .string()
    .default("image/jpeg,image/png,image/webp,application/pdf"),

  // Logger
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),
});

export type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid environment variables configuration:");
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error("Invalid environment configuration");
  }

  // Safety rule: In production, enforce that TYPEORM_SYNCHRONIZE is not accidentally turned on without explicit intention
  if (
    result.data.NODE_ENV === "production" &&
    result.data.TYPEORM_SYNCHRONIZE
  ) {
    console.warn(
      "WARNING: TYPEORM_SYNCHRONIZE is enabled in PRODUCTION environment. Ensure this is intentional and schema changes are audited."
    );
  }

  return result.data;
}

export const env = validateEnv();
