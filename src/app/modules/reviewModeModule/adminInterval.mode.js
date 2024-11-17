import mongoose from 'mongoose';

const adminIntervalSchema = new mongoose.Schema({
  intervalSettings: {
    type: [Number],
    default: [1, 3, 7, 14, 20, 25, 30], 
  },
}, {
    timestamps: true
});

const AdminInterval = mongoose.model('adminInterval', adminIntervalSchema);

export default AdminInterval;
