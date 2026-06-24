const timestamp = () => new Date().toISOString();

const logger = {
  info: (msg: string, ...args: any[]) => console.log(`[${timestamp()}] INFO:`, msg, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[${timestamp()}] ERROR:`, msg, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[${timestamp()}] WARN:`, msg, ...args),
};

export default logger;
