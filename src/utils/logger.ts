type Level = 'info' | 'warn' | 'error';

type Context = Record<string, unknown>;

function log(level: Level, message: string, context?: Context): void {
  if (__DEV__) {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    if (context) {
      fn(`[${level.toUpperCase()}] ${message}`, context);
    } else {
      fn(`[${level.toUpperCase()}] ${message}`);
    }
    return;
  }

  // Production: structured JSON — never include passwords, tokens, or PII beyond user ID
  const entry = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  });

  if (level === 'error') {
    console.error(entry);
  } else if (level === 'warn') {
    console.warn(entry);
  } else {
    console.log(entry);
  }
}

export const logger = {
  info: (message: string, context?: Context) => log('info', message, context),
  warn: (message: string, context?: Context) => log('warn', message, context),
  error: (message: string, context?: Context) => log('error', message, context),
};
