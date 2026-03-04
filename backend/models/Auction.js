const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, default: 0 },
    highestBidder: {
        name: { type: String },
        email: { type: String }
    },
    bids: [{
        bidderName: String,
        amount: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['active', 'ended', 'scheduled', 'pending', 'rejected'],
        default: 'pending'
    },
    artistName: { type: String },
    artistContact: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Auction', AuctionSchema);
