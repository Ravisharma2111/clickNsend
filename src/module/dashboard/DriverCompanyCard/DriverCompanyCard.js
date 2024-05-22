
import { useAuthContext } from "@/auth/useAuthContext";
import Iconify from "@/components/iconify/Iconify";
import { getCompanyDashboard } from "@/redux/slices/job/company";
import { useDispatch, useSelector } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const DashboardCard = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.companyJob);
  const [subscription, setSubscription] = useState([]);

  // API FETCH LIST
  const fetchdata = async (type = "company") => {
    try {
      const statusShowPlan = 1 ;
      const response = await axiosInstance.get(
        `/api/auth/master/plan/list/${type}/${statusShowPlan}`
      );
      if (response.status === 200) {
        const subscriptionData = response.data.view_data.find(
          (sub) => sub.default === 1
        );
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  useEffect(() => {
    fetchdata();
    dispatch(getCompanyDashboard({ user_id: user?.id }));
  }, [dispatch, user?.id]);

  return (
    <React.Fragment>
      <Box sx={{ mt: 4 }}>
        <Grid className="dashboard_box_grid_responsive" container spacing={2}>
          <Grid item md={3}>
            <Card
              sx={{
                backgroundColor:
                  router.pathname === "/dashboard/company/driver/list"
                    ? "#145365"
                    : "#145365",
                border: "1px solid #145365",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => router.push("/dashboard/company/driver/list")}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  spacing={0}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      backgroundColor:
                        router.pathname === "/dashboard/company/driver/list"
                          ? "#246678"
                          : "#246678",
                    }}
                    height="80px"
                    p={2}
                    width="80px"
                    borderRadius="50%"
                    component="div"
                  >
                    <Iconify icon="basil:bag-solid" width={48} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={300}>
                      Job List
                    </Typography>
                    <Typography variant="h4" textAlign="center">
                      {dashboard?.drivers}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3}>
            <Card
              sx={{
                backgroundColor:
                  router.pathname === "/dashboard/company/job_history"
                    ? "#FD9B3D"
                    : "#FD9B3D",
                border: "1px solid #FD9B3D",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => router.push("/dashboard/company/job_history")}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={0}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        router.pathname === "/dashboard/company/job_history"
                          ? "#ffa54e"
                          : "#ffa54e",
                    }}
                    height="80px"
                    p={2}
                    width="80px"
                    borderRadius="50%"
                    component="div"
                  >
                    <Iconify icon="ri:history-fill" width={48} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={300}>
                      JOB HISTORY
                    </Typography>
                    <Typography variant="h4" textAlign="center">
                      {dashboard?.history}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3}>
            <Card
              sx={{
                backgroundColor:
                  router.pathname === "/dashboard/company/active_jobs"
                    ? "#FD9B3D"
                    : "#FD9B3D",
                border: "1px solid #FD9B3D",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => router.push("/dashboard/company/active_jobs")}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={0}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        router.pathname === "/dashboard/company/job_post"
                          ? "#ffa54e"
                          : "#ffa54e",
                    }}
                    height="80px"
                    p={2}
                    width="80px"
                    borderRadius="50%"
                    component="div"
                  >
                    <Iconify icon="solar:user-linear" width={48} />
                  </Box>
                  <Box>
                    <Typography fontSize={16} fontWeight={300}>
                      ACTIVE JOBS
                    </Typography>
                    <Typography variant="h5" textAlign="center">
                      {dashboard?.active}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
 
            <Grid item md={3}>
              <Card
                sx={{
                  backgroundColor:
                    router.pathname === "/dashboard/company/subscription"
                      ? "#FECA3C"
                      : "#FECA3C",
                  border: "1px solid #FECA3C",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/dashboard/company/subscription")}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    spacing={0}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        backgroundColor:
                          router.pathname === "/dashboard/company/subscription"
                            ? "#ffd768"
                            : "#ffd768",
                      }}
                      height="80px"
                      p={2}
                      width="80px"
                      borderRadius="50%"
                      component="div"
                    >
                      <Iconify
                        icon="material-symbols:subscriptions-outline"
                        width={48}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={300}>
                        Subscription   
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
        


        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default DashboardCard;
