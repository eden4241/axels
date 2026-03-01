import { Schema } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";


const OrderSchema = new Schema(
    {
        orderTotal: {
            type: Number,
            required: true,
        },

        orderDelivery: {
            type: Number,
            required: true,
        },
        
        orderStatus: {
            type: String,
            enum: OrderStatus,
            required: true,
        },

        memberId: {
            type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

        orderItems: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product' },
            itemQuantity: { type: Number, required: true },
            itemPrice: { type: Number, required: true },
          }]
	},
	{ timestamps: true, collection: 'orders' },
);

export default OrderSchema;