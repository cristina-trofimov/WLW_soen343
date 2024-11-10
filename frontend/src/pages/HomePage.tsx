import './Homepage.css';
import React, { useState } from 'react'
import { Alert, Button } from '@mantine/core'
import axiosClient from '../axiosClient'
import { Customer } from '../interface/customer'

import TrackDelivery from '../components/TrackDelivery';


const HomePage = () => {


    return (
        // <div id={"trackingPackage"}>
        //     <div className={"grid-container"}>
        //         <div className={"column"} id={"column-left"}>
        //             <p id={"title"}>TRACK YOUR PACKAGE</p>
        //             <div id={"searchArea"}>
        //                 <input placeholder={"Enter Tracking Number"}/>
        //                 <button id={"searchButton"}>
        //                     <img src={"./Search icon.png"} height={"40px"} id={"searchImage"}/>
        //                 </button>
        //             </div>
        //         </div>
        //         <div className={"column"}>
        //             <img src={"./HomepagePhoto.png"} height={"55%"} />
        //         </div>
        //     </div>
        //     <p id={"importantInfo"}>WORLDWIDE : KEEPING YOUR WORLD CONNECTED</p>
        // </div>

        <div>
            Welcome to HomePage
            <TrackDelivery />
        </div>

    )
}

export default HomePage