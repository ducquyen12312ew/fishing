import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface ICoinHistory extends Document {
  campaignId: Types.ObjectId
  type: 'deposit' | 'win' | 'lose' | 'adjustment' | 'refund'
  amount: number
  note?: string
  createdAt: Date
}

const CoinHistorySchema = new Schema<ICoinHistory>({
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  type:       { type: String, enum: ['deposit', 'win', 'lose', 'adjustment', 'refund'], required: true },
  amount:     { type: Number, required: true },
  note:       { type: String },
  createdAt:  { type: Date, default: Date.now },
})

const CoinHistory: Model<ICoinHistory> =
  mongoose.models.CoinHistory ?? mongoose.model<ICoinHistory>('CoinHistory', CoinHistorySchema)

export default CoinHistory
