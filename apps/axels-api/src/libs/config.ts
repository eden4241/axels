import { ObjectId } from 'bson';

export const shapeIntoMongooseObject = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
}