import React, { useState } from 'react'
import { Button } from '@mantine/core'
import axiosClient from '../axiosClient'
import { Customer } from '../interface/customer'


const HomePage = () => {

    const [user, setUser] = useState<Customer>()

    const getCurrentUser = async () => {
        try {
            const response = await axiosClient.get('/current_user')
            console.log(response.data)
            setUser(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <><div>Welcome to HomePage</div>
            <Button onClick={getCurrentUser}>Me</Button>
            {user && <div>{user.email}</div>}

        </>

    )
}

export default HomePage