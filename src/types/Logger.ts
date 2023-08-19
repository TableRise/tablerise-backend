type ContextType = 'info' | 'warn' | 'error';
export type Logger = (context: ContextType, message: string) => void;
