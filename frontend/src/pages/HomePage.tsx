import './Homepage.css';

import TrackDelivery from '../components/TrackDelivery';


const HomePage = () => {
    return (

        <div id={"trackingPackage"}>
            <div className={"grid-container"}>
                <div className={"column"} id={"column-left"}>
                    <TrackDelivery />
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