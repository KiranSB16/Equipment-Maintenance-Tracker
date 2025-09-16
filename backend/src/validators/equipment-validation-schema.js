export const equipmentValidationSchema = {
  name: {
    exists: {
      errorMessage: "name field is required",
    },
    notEmpty: {
      errorMessage: "name cannot be empty",
    },
    trim: true,
  },

  type: {
    exists: {
      errorMessage: "type field is required",
    },
    notEmpty: {
      errorMessage: "type cannot be empty",
    },
    isString: {
      errorMessage: "type must be a string",
    },
    trim: true,
  },

  status: {
    exists: {
      errorMessage: "status field is required",
    },
    notEmpty: {
      errorMessage: "status cannot be empty",
    },
    isIn: {
      options: [["Operational", "Under maintenance", "Out of service"]],
      errorMessage:
        "status must be one of: Operational, Under maintenance, Out of service",
    },
    trim: true,
  },

  lastMaintenanceDate: {
    exists: {
      errorMessage: "lastMaintenanceDate field is required",
    },
    notEmpty: {
      errorMessage: "lastMaintenanceDate cannot be empty",
    },
    isISO8601: {
      errorMessage: "lastMaintenanceDate must be a valid date",
    },
    toDate: true,
  },

  nextMaintenanceDate: {
    exists: {
      errorMessage: "nextMaintenanceDate field is required",
    },
    notEmpty: {
      errorMessage: "nextMaintenanceDate cannot be empty",
    },
    isISO8601: {
      errorMessage: "nextMaintenanceDate must be a valid date",
    },
    toDate: true,
    custom: {
      options: (value, { req }) => {
        if (
          req.body.lastMaintenanceDate &&
          new Date(value) <= new Date(req.body.lastMaintenanceDate)
        ) {
          throw new Error(
            "nextMaintenanceDate must be after lastMaintenanceDate"
          )
        }
        return true
      },
    },
  },
}
