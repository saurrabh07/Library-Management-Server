import jwt from 'jsonwebtoken';
import users from '../data/data.js'

function login(req, res) {

  const { username, password } = req.body;
  
  // check user exist in data or not
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.json({ message: 'Invalid username or password' });
  }
  const userRole = user.role ;

  // generating the jwt token 
  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_PASSWORD);

  res.json({ token , userRole} );
}

export { login };
  