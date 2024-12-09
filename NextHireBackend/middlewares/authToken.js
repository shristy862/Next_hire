import jwt from'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); 

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Ensure the 'source' field is 'login'
    if (!decoded || decoded.source !== 'login') {
      return res.status(401).json({ message: 'Unauthorized. Token not issued from login.' });
    }

    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Error verifying token:', error); 
    res.status(400).json({ message: 'Invalid Token.' });
  }
};
