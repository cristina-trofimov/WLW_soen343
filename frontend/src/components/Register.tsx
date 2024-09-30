import { useState } from 'react'
import axiosClient from '../axiosClient';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerCustomer = async () => {
    console.log(email)
    console.log(password)

    const response = await axiosClient.post('http://127.0.0.1:5000/register', { email, password })

    console.log(response)
  }

  return (
    <div>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" onClick={() => registerCustomer()}>Continue</button>
      </form>

    </div>
  )
}

export default Register