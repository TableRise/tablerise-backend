type ContextType = 'info' | 'warn' | 'error';
export type LoggerType = (context: ContextType, message: string) => void;
