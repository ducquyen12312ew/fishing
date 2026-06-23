import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICampaign extends Document {
  name: string
  initialCoins: number
  currentCoins: number
  totalWin: number
  totalLose: number
  isActive: boolean
  createdAt: Date
}

const CampaignSchema = new Schema<ICampaign>({
  name:         { type: String, required: true },
  initialCoins: { type: Number, required: true },
  currentCoins: { type: Number, required: true },
  totalWin:     { type: Number, default: 0 },
  totalLose:    { type: Number, default: 0 },
  isActive:     { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
})

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ?? mongoose.model<ICampaign>('Campaign', CampaignSchema)

export default Campaign
