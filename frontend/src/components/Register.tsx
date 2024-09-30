import { useState } from 'react'
import axiosClient from '../axiosClient';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerCustomer = async () => {
    console.log(email)
    console.log(password)

    const response = await axiosClient.post('/register', { email, password })

    if(response.status === 201) {
      alert("Registered successfully")
    }
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