import User from "../models/user-model.js"

export const workOrderValidationSchema = {
  title: {
    exists: { errorMessage: "title field is required" },
    notEmpty: { errorMessage: "title cannot be empty" },
    isString: { errorMessage: "title must be a string" },
    trim: true,
  },

  equipment: {
    exists: { errorMessage: "equipment field is required" },
    notEmpty: { errorMessage: "equipment cannot be empty" },
    isMongoId: { errorMessage: "equipment must be a valid Mongo ID" },
  },

  priority: {
    exists: { errorMessage: "priority field is required" },
    notEmpty: { errorMessage: "priority cannot be empty" },
    isIn: {
      options: [["Low", "Medium", "High"]],
      errorMessage: "priority must be one of: Low, Medium, High",
    },
  },

  status: {
    optional: true,
    isIn: {
      options: [["Open", "In Progress", "Closed"]],
      errorMessage: "status must be one of: Open, In Progress, Closed",
    },
  },

  assignedTo: {
    optional: true,
    isMongoId: { errorMessage: "assignedTo must be a valid Mongo ID" },
    custom: {
      options: async (value) => {
        if (!value) return true
        const user = await User.findById(value)
        if (!user) {
          throw new Error("assignedTo must be a valid user")
        }
        if (user.role !== "Technician") {
          throw new Error("assignedTo must be a Technician")
        }
        return true
      },
    },
  },

  description: {
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true,
  },

  dueDate: {
    exists: { errorMessage: "dueDate field is required" },
    notEmpty: { errorMessage: "dueDate cannot be empty" },
    isISO8601: { errorMessage: "dueDate must be a valid date" },
    toDate: true,
    custom: {
      options: (value) => {
        if (new Date(value) < new Date()) {
          throw new Error("dueDate cannot be in the past")
        }
        return true
      },
    },
  },
}
