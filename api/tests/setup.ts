process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'zfund_test_db';
process.env.PAYSTACK_SECRET_KEY = 'sk_test_mock_paystack_secret_key_123456';
process.env.PAYSTACK_WEBHOOK_SECRET = 'sk_test_mock_paystack_secret_key_123456';
process.env.SMS_PROVIDER = 'mock';
process.env.REDIS_ENABLED = 'false';
process.env.LOG_LEVEL = 'fatal'; // Silent logs during test execution
