import { Schema } from 'mongoose';
import { CommentGroup, CommentStatus } from '../libs/enums/comment.enum';

const CommentSchema = new Schema(
	{
		commentStatus: {
			type: String,
			enum: CommentStatus,
			default: CommentStatus.ACTIVE,
		},

		commentGroup: {
			type: String,
			enum: CommentGroup,
			required: true,
		},

		commentContent: {
			type: String,
			required: true,
		},

		commentRefId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true, collection: 'comments' },
);

// Bir xil member bir xil ref ga faqat bitta xuddi shu content bilan comment yozadi.
// commentContent o'zgarsa yangi comment yozish mumkin.
// Eski index (commentGroup_1_commentRefId_1_memberId_1) bo'lsa MongoDB da o'chiring:
//   db.comments.dropIndex("commentGroup_1_commentRefId_1_memberId_1")
CommentSchema.index(
	{ commentGroup: 1, commentRefId: 1, memberId: 1, commentContent: 1 },
	{ unique: true },
);

export default CommentSchema;
