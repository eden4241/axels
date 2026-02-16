import { ObjectId } from 'bson';

export const availableSellerSorts = ['createdAt', 'updatedat', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMemberSorts = ['createdAt', 'updatedat', 'memberLikes', 'memberViews'];

export const shapeIntoMongooseObject = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
}