import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IBet extends Document {
  campaignId: Types.ObjectId
  sportEmoji: string
  name: string
  amount: number
  odds: number
  fishImage: string
  status: 'pending' | 'won' | 'lost'
  createdAt: Date
  resolvedAt?: Date
}

const BetSchema = new Schema<IBet>({
  campaignId:  { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  sportEmoji:  { type: String, required: true },
  name:        { type: String, required: true },
  amount:      { type: Number, required: true },
  odds:        { type: Number, required: true },
  fishImage:   { type: String, required: true },
  status:      { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
  createdAt:   { type: Date, default: Date.now },
  resolvedAt:  { type: Date },
})

const Bet: Model<IBet> =
  mongoose.models.Bet ?? mongoose.model<IBet>('Bet', BetSchema)

export default Bet
