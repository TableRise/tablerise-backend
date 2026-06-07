export {};

declare module '@tablerise/database-management/dist/src/interfaces/User' {
    interface GameInfo {
        campaignsCreatedAmount?: number;
        bannedFromCampaigns?: string[];
    }

    interface Friends {
        status?: 'pending' | 'active';
    }
}

declare module '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e' {
    export interface Background {
        name: string;
        description: string;
    }

    export interface Armor {
        name: string;
        description: string;
    }

    export interface God {
        name: string;
        description: string;
    }

    export interface Item {
        name: string;
        description: string;
    }

    export interface MagicItem {
        name: string;
        description: string;
    }

    export interface Monster {
        name: string;
        description: string;
    }

    export interface Realm {
        name: string;
        description: string;
    }

    export interface Weapon {
        name: string;
        description: string;
    }

    export interface Wiki {
        title: string;
        description: string;
    }
}
