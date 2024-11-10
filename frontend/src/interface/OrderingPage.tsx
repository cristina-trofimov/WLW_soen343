import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Box, Timeline } from "@mantine/core";

const OrderingPage = () => {
  const location = useLocation();
  const timelineData: { [key: string]: { title: string }[] } = {
    "/order2/place": [{ title: "Place Order" }],
    "/order2/payment": [{ title: "Payment" }],
    "/order2/confirmation": [{ title: "Confirmation" }],
  };
  const [currentTimelineData, setCurrentTimelineData] = useState( timelineData["/order2/place"] );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    setCurrentTimelineData(timelineData[path] || []);
    const paths = Object.keys(timelineData);
    const index = paths.indexOf(path);
    setActiveIndex(index !== -1 ? index : 0);
  }, [location]);

  return (
    <Box style={{ display: "flex", height: "100vh" }}>
      <Box style={{ width: "33%", padding: "20px" }}>
        <Timeline active={activeIndex} bulletSize={24} lineWidth={2} align="right" >
          {Object.entries(timelineData).map(([path, items], index) => (
            <Timeline.Item
              key={path}
              title={items[0].title}
              color={index <= activeIndex ? "#ccd5ae" : "rgba(201, 201, 201, 1)"}
              bullet={
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", 
                    backgroundColor: index <= activeIndex ? "#8f957a" : "rgba(201, 201, 201, 1)",
                }} /> }
            />
          ))}
        </Timeline>
        <nav>
          <ul>
            <li>
              <Link to="place">Place Order</Link>
            </li>
            <li>
              <Link to="payment">Payment</Link>
            </li>
            {/* <li><Link to="confirmation">Confirmation</Link></li> */}
          </ul>
        </nav>
      </Box>
      <Box style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default OrderingPage;
