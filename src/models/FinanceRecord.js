const mongoose = require("mongoose");

const financeRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["income", "expense"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete flag
    },
  },
  { timestamps: true }
);

// Exclude soft-deleted records by default
financeRecordSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// Index for common query patterns
financeRecordSchema.index({ type: 1, date: -1 });
financeRecordSchema.index({ category: 1 });
financeRecordSchema.index({ createdBy: 1 });

module.exports = mongoose.model("FinanceRecord", financeRecordSchema);
