export interface QueryObj {
    query?: any;
}

export interface UpdateObj {
    query: any;
    payload: any;
}

export interface RPGRulesDatabase<T> {
    active: boolean;
    en: T;
    pt: T;
}
