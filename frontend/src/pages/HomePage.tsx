import './Homepage.css';

const HomePage = () => {
    return (
            <div id={"trackingPackage"}>
                <div className={"grid-container"}>
                    <div className={"column"} id={"column-left"}>
                        <p id={"importantInfo"}>TRACK YOUR PACKAGE</p>
                        <div id={"searchArea"}>
                            <input placeholder={"Enter Tracking Number"}/>
                            <button id={"searchButton"}>
                                <img src={"./public/Search icon.png"} height={"40px"} id={"searchImage"}/>
                            </button>
                        </div>
                    </div>
                    <div className={"column"}>
                        <img src={"./public/HomepagePhoto.png"} height={"55%"} />
                    </div>
                </div>
                <p id={"importantInfo"}>WORLDWIDE : KEEPING YOUR WORLD CONNECTED</p>
            </div>
    )
}

export default HomePage