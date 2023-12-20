type ContextType = 'info' | 'warn' | 'error' | 'test';
export type Logger = (context: ContextType, message: string) => void;
