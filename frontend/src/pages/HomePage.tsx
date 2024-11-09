import './Homepage.css';
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
            <div id={"trackingPackage"}>
                <div className={"grid-container"}>
                    <div className={"column"} id={"column-left"}>
                        <p id={"title"}>TRACK YOUR PACKAGE</p>
                        <div id={"searchArea"}>
                            <input placeholder={"Enter Tracking Number"}/>
                            <button id={"searchButton"}>
                                <img src={"./Search icon.png"} height={"40px"} id={"searchImage"}/>
                            </button>
                        </div>
                    </div>
                    <div className={"column"}>
                        <img src={"./HomepagePhoto.png"} height={"55%"} />
                    </div>
                </div>
                <p id={"importantInfo"}>WORLDWIDE : KEEPING YOUR WORLD CONNECTED</p>
            </div>
    )
}

export default HomePage