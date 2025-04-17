const allowedRoles = ['Standard User', 'Organizer', 'System Admin'];

const validateRole = async (req, res, next) => {
    const { role } = req.body;  

    if (!role || !allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' }); // Properly format the response
    }

    next(); 
};

const authoriseOnly = (allowedRoles) => {
  return (req, res, next) => {
      console.log('req.user:', req.user);
      if (!req.user) {
          return res.status(401).json({ message: "Unauthorized: User not authenticated" });
      }
      const userRole = req.user.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
          return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
      }
      next();
  };
};

module.exports = {
    validateRole,
    authoriseOnly,
}