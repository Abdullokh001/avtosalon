import winston from 'winston';
import MongoDB from 'winston-mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Logger yaratish
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    
    // Barcha loglar uchun file
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      format: customFormat
    }),
    
    // Faqat error loglar
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      format: customFormat
    }),
    
    // Faqat warning loglar
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/warning.log'),
      level: 'warn',
      format: customFormat
    })
  ]
});

// MongoDB transport qo'shish (async)
const initMongoTransport = async () => {
  try {
    if (process.env.MONGO_URI) {
      logger.add(new MongoDB.MongoDB({
        db: process.env.MONGO_URI,
        collection: 'logs',
        level: 'info',
        options: {
          useUnifiedTopology: true
        },
        storeHost: true,
        capped: true,
        cappedSize: 10000000, // 10MB
        metaKey: 'meta'
      }));
      
      logger.info('MongoDB transport qo\'shildi');
    }
  } catch (error) {
    logger.error('MongoDB transport qo\'shishda xato', { error: error.message });
  }
};

// MongoDB transport'ni keyinroq qo'shamiz
setTimeout(() => initMongoTransport(), 1000);

export default logger;
