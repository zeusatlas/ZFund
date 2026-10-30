process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'zfund_test_db';
process.env.PAYMENT_PROVIDER = 'robspay';
process.env.ROBSPAY_API_KEY = 'test_robspay_api_key_123456';
process.env.ROBSPAY_MERCHANT_ID = 'ZEU889626';
process.env.SMS_PROVIDER = 'mock';
process.env.REDIS_ENABLED = 'false';
process.env.LOG_LEVEL = 'fatal'; // Silent logs during test execution
