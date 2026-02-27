import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Follower, Followers, Following, Followings } from '../../libs/dto/follow/follow';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';
import { T } from '../../libs/types/common';
import { lookupAuthMemberFollowed, lookupAuthMemberLiked, lookupFollowerData, lookupFollowingData } from '../../libs/config';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel('Follow') private readonly followModel: Model<Follower | Following>,
        private readonly memberService: MemberService,
    ) { }

    public async subscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
        if (followerId.toString() === followingId.toString()) {
            throw new InternalServerErrorException(Message.SELF_SUBSCRIPTION_DENIED);
        }

        const targetMember = await this.memberService.getMember(null, followingId);
        if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        // Agar allaqachon follow qilingan bo'lsa, xato o'rniga mavjud follow ni qaytaramiz (idempotent subscribe)
        const existing = await this.followModel
            .findOne({ followerId: followerId, followingId: followingId })
            .exec();
        if (existing) {
            return existing as Follower;
        }

        const result = await this.registerSubscription(followerId, followingId);

        await this.memberService.memberStatsEditor({ _id: followerId, targetKey: 'memberFollowings', modifier: 1 });
        await this.memberService.memberStatsEditor({ _id: followingId, targetKey: 'memberFollowers', modifier: 1 });

        return result;
    }

    private async registerSubscription(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
        try {
            return await this.followModel.create({
                followerId: followerId,
                followingId: followingId
            });
        } catch (err) {
            console.log('Error, Service model:', err);

            // unique index (followingId, followerId) bo'yicha dublicate bo'lsa – allaqachon subscribe qilingan
            if (err?.code === 11000) {
                const existing = await this.followModel
                    .findOne({ followerId: followerId, followingId: followingId })
                    .exec();
                if (existing) {
                    return existing as Follower;
                }
            }

            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }

    public async unsubscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
        const targetMember = await this.memberService.getMember(null, followingId);
        if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const result = await this.followModel.findOneAndDelete({
            followingId: followingId,
            followerId: followerId,
        }).exec();
        if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        await this.memberService.memberStatsEditor({ _id: followerId, targetKey: 'memberFollowings', modifier: -1 });
        await this.memberService.memberStatsEditor({ _id: followingId, targetKey: 'memberFollowers', modifier: -1 });

        return result;
    }

    public async getMemberFollowings(memberId: ObjectId, input: FollowInquiry): Promise<Followings> {
        const { page, limit, search } = input;
        if (!search?.followerId) throw new InternalServerErrorException(Message.BAD_REQUEST);
        const match: T = { followerId: search?.followerId };
        console.log('match:', match);

        const result = await this.followModel.aggregate([
            { $match: match },
            { $sort: { createdAt: Direction.DESC } },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        lookupAuthMemberLiked(memberId, "$followingId"),
                        lookupAuthMemberFollowed({ followerId: memberId, followingId: "$followingId" }),
                        lookupFollowingData,
                        { $unwind: '$followingData' }
                    ],
                    metaCounter: [{ $count: 'total' }],
                }
            },
        ]).exec();

        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    public async getMemberFollowers(memberId: ObjectId, input: FollowInquiry): Promise<Followers> {
        const { page, limit, search } = input;
        if (!search?.followingId) throw new InternalServerErrorException(Message.BAD_REQUEST);

        const match: T = { followingId: search?.followingId };
        console.log('match:', match);

        const result = await this.followModel.aggregate([
            { $match: match },
            { $sort: { createdAt: Direction.DESC } },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        lookupAuthMemberLiked(memberId, "$followerId"),
                        // meFollowed: auth user (memberId) ushbu follower'ni follow qilganmi?
                        lookupAuthMemberFollowed({ followerId: memberId, followingId: "$followerId" }),
                        lookupFollowerData,
                        { $unwind: '$followerData' }
                    ],
                    metaCounter: [{ $count: 'total' }],
                }
            },
        ]).exec();
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0];
    }
}
