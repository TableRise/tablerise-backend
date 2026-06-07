import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { Friends, UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export type FriendStatus = 'pending' | 'active';

export function ensureUserDetailCollections(userDetails: UserDetail): UserDetail {
    const detail = userDetails as UserDetail & {
        messages?: UserDetail['messages'];
        gallery?: UserDetail['gallery'];
        friends?: UserDetail['friends'];
    };

    detail.messages = Array.isArray(detail.messages) ? detail.messages : [];
    detail.gallery = Array.isArray(detail.gallery) ? detail.gallery : [];
    detail.friends = Array.isArray(detail.friends) ? detail.friends : [];

    return userDetails;
}

export function appendGalleryImage(userDetails: UserDetail, image: ImageObject): UserDetail {
    ensureUserDetailCollections(userDetails);
    userDetails.gallery.push(image);
    return userDetails;
}

export function getFriendStatus(friend: Friends): FriendStatus {
    return (friend.status ?? 'active') as FriendStatus;
}
