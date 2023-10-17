import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import { Badge, Box, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import MyTab from "../../components/MyTab";
import TabPanel from "../../components/TabPanel";
import { useAppSelector } from "../../hooks/useAppSelector";
import useTitle from "../../hooks/useTitle";
import { Role } from "../../types/user";
import { selectCurrentRole } from "../auth/authSlice";
import Chat from "../chat/Chat";
import ListingsList from "../listings/mylistings/ListingsList";
import FavoritesList from "../listings/favorites/FavoritesList";
import { useGetNotificationsQuery } from "../notifications/notificationsApiSlice";
import AgentTours from "../tours/agent/AgentTours";
import RenterTours from "../tours/renter/RenterTours";

const RentalManager = () => {
  useTitle("Manage rentals");
  const [searchParams, setSearchParams] = useSearchParams();

  const role = useAppSelector(selectCurrentRole);

  const [tabValue, setTabValue] = useState<string>(
    searchParams.get("t") || "tours"
  );

  const {
    data: notifications,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000 * 2, //in ms
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true, //in secs
  });

  //switch tabs and clear tour notifications
  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    //update query string
    setSearchParams({ t: tabValue });
    //change tab
    setTabValue(tabValue);
  };

  return (
    <Box py={4}>
      <Box sx={{ borderBottom: 1, borderColor: "dull.light" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          textColor="primary"
          indicatorColor="primary"
          //variant="fullWidth"
          //centered
          // variant="scrollable"
          // centered  //center tabs
          // variant="scrollable"
          // scrollButtons="auto" //left and right scroll buttons are automatically presented on desktop and hidden on mobile.(based on viewport width)
          // scrollButtons={true}//Present scroll buttons always regardless of the viewport width on desktop
          //allowScrollButtonsMobile//Present scroll buttons always regardless of the viewport width on mobile
          //scrollButtons={false}//Prevent scroll buttons
        >
          <MyTab
            label={
              <Box sx={{ display: "flex", px: 2 }}>
                <Badge
                  badgeContent={notifications?.tours?.length || 0}
                  max={999} //default: 99
                  color="warning"
                  // overlap="circular"
                  //anchorOrigin={{ vertical: 'top',horizontal: 'right',}}//move the badge to any corner
                  // showZero
                >
                  <CalendarMonthIcon />
                  <Typography pl={1}>Tours</Typography>
                </Badge>
              </Box>
            }
            value="tours"
          />

          <MyTab
            label={
              <Box sx={{ display: "flex", px: 2 }}>
                <Badge
                  badgeContent={notifications?.inbox?.length || 0}
                  max={999} //default: 99
                  color="warning"
                  // overlap="circular"
                  //anchorOrigin={{ vertical: 'top',horizontal: 'right',}}//move the badge to any corner
                >
                  <ChatOutlinedIcon />
                  <Typography pl={1}>Inbox</Typography>
                </Badge>
              </Box>
            }
            value="inbox"
          />

          <MyTab
            //   icon={<MapsHomeWorkIcon />}
            //   iconPosition="start"
            label={
              <Box sx={{ display: "flex" }}>
                <FavoriteBorderOutlinedIcon />
                <Typography pl={1}>Favorites</Typography>
              </Box>
            }
            value="favorites"
          />

          <MyTab
            //   icon={<MapsHomeWorkIcon />}
            //   iconPosition="start"
            label={
              <Box sx={{ display: "flex" }}>
                <HomeWorkOutlinedIcon />
                <Typography pl={1}>Listings</Typography>
              </Box>
            }
            value="listings"
          />
        </Tabs>
      </Box>

      <Box>
        {/* ---------------------- -------------------------*/}

        {/* --------------------------------------------- */}
        <TabPanel value={tabValue} index="tours">
          {role === Role.Agent ? (
            <AgentTours notifications={notifications!} />
          ) : (
            <RenterTours notifications={notifications!} />
          )}
        </TabPanel>

        {/* --------------------------------------------- */}
        <TabPanel value={tabValue} index="inbox">
          <Chat notifications={notifications!} />
        </TabPanel>

        <TabPanel value={tabValue} index="favorites">
          <FavoritesList />
        </TabPanel>

        <TabPanel value={tabValue} index="listings">
          <ListingsList />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default RentalManager;
