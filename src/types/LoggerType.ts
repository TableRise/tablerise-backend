type ContextType = 'success' | 'warn' | 'error';
export type LoggerType = (context: ContextType, message: string) => void;
