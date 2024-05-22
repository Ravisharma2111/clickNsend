// import React, { useState } from "react";
// import {
//   Container,
//   Typography,
//   Grid,
//   TextField,
//   Button,
//   Card,
//   Breadcrumbs,
//   CardContent,
//   Stack,
//   Box,
// } from "@mui/material";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import Link from "next/link";
// import * as Yup from "yup";
// import OTPVerification  from '../subscription/OTPVerification'
// import axiosInstance from "@/utils/axios";
// import { useAuthContext } from "@/auth/useAuthContext";

// import Header from "@/layout/primaryWeb/header";
// import Footer from "@/layout/primaryWeb/footer";

// const CardPaymentForm = ({ paymentDetails, setShowPayment }) => {
//   console.log("object", paymentDetails, setShowPayment);
//   const { user } = useAuthContext();
//   console.log(" const { user } = useAuthContext();", user);
//   // Define Yup validation schema
//   const validationSchema = Yup.object().shape({
//     cardNumber: Yup.string().required("Card Number is required"),
//     expiryDate: Yup.string().required("Expiration Date is required"),
//     cvCode: Yup.string().required("CVC Code is required"),
//     cardOwner: Yup.string().required("Card Owner is required"),
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//   });

//   const [cardNumber, setCardNumber] = useState("");
//   const [formValues, setFormValues] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     nameOnCard: "",
//     email: "company@mailinator.com",
//     expMonth: "", // Initialize expMonth
//   expYear: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [showOTP, setShowOTP] = useState(false); // State to control the display of OTPVerification

//   const handleChange = (e) => {
//     setFormErrors({}); // Clear any existing errors

//     let { name, value } = e.target;

//     if (name === "expiryDate") {
//       // Remove all non-digit characters except for the slash
//       value = value.replace(/[^0-9/]/g, "");

//       // Only add slash if the length is 2 and the last character isn't already a slash
//       if (value.length === 2 && value.indexOf("/") === -1) {
//         value = value + "/";
//       } else if (value.length > 2) {
//         // Ensure the slash is properly placed at position 3
//         value =
//           value.substring(0, 2) +
//           "/" +
//           value.substring(2).replace(/[^\d]/g, "");
//       }

//       // Handling deletion of the slash
//       if (
//         value.length === 3 &&
//         e.nativeEvent.inputType === "deleteContentBackward"
//       ) {
//         // Remove the slash if the user hits backspace at position 3
//         value = value.slice(0, -1);
//       }
//      // Extract month and year
//      const [month, year] = value.split("/");
//      // Update separate state variables for month and year
//      setFormValues({
//        ...formValues,
//        [name]: value,
//        expMonth: month,
//        expYear: year || "", // Ensure expYear is not empty
//      });
//     }
//     if (name === "cvv") {
//       value = value.replace(/\D/g, "").slice(0, 3); // Remove non-digits and limit length
//     }
//     if (name === "cardNumber") {
//       // Allow numeric values and spaces
//       value = value.replace(/\D/g, "");

//       // Insert spaces after every 4 digits
//       value = value.match(/.{1,4}/g)?.join(" ") || "";

//       // Limit to 19 characters to account for spaces (16 digits + 3 spaces)
//       value = value.slice(0, 19);
//     }
//     setFormValues({ ...formValues, [name]: value });
//   };
//   // const luhnCheck = (num) => {
//   //   let arr = (num + "")
//   //     .split("")
//   //     .reverse()
//   //     .map((x) => parseInt(x));
//   //   let lastDigit = arr.splice(0, 1)[0];
//   //   let sum = arr.reduce(
//   //     (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
//   //     0
//   //   );
//   //   sum += lastDigit;
//   //   return sum % 10 === 0;
//   // };

//   const validate = (values) => {
//     const errors = {};
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
//     const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
//     const cardNumberContinuous = values.cardNumber.replace(/\s/g, "");
//     if (!values.cardNumber) {
//         errors.cardNumber = 'Card number is required!';
//       } else if (cardNumberContinuous.length !== 16) {
//         errors.cardNumber = 'Card number must be 16 digits!';
//       }
//       // else if  (!luhnCheck(cardNumberContinuous)) {
//       //   errors.cardNumber = 'Invalid card number!';
//       // }
//     if (!values.cardNumber) {
//       errors.cardNumber = "Card number is required!";
//     }
//     if (!values.expiryDate) {
//       errors.expiryDate = "Expiry date is required!";
//     } else {
//       const [expMonth, expYear] = values.expiryDate
//         .split("/")
//         .map((num) => parseInt(num, 10));
//       if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
//         errors.expiryDate = "Invalid month!";
//       } else if (
//         expYear < currentYear ||
//         (expYear === currentYear && expMonth < currentMonth)
//       ) {
//         errors.expiryDate = "Card has expired!";
//       }
//     }
//     if (!values.cvv) {
//       errors.cvv = "CVV is required!";
//     } else if (values.cvv.length < 3 || values.cvv.length > 3) {
//       errors.cvv = "CVV must be 3 digits!";
//     }
//     if (!values.nameOnCard) {
//       errors.nameOnCard = "Name on card is required!";
//     }
//     return errors;
//   };

//   console.log(user)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validate(formValues);
//     if (Object.keys(errors).length === 0) {
//       const [expMonth, expYear] = formValues.expiryDate.split("/");

//     const initialValues = {
//       user_id: user?.id  , // Adjust according to your logic
//       email:user?.email  , // Add other initial values here
//       // plan_id: user?.plan?.plan_id,
//       plan_id: 15,
//       number: formValues?.cardNumber,
//       exp_month:expMonth,
//       exp_year: expYear,
//       cvc:  formValues?.cvv,
//       name: formValues?.nameOnCard
//     };

//     try {
//       const response =  await axiosInstance.post(`api/auth/payment/purchase-plan/${user?.id}`, initialValues)
//     if (response?.status === 200) {
//       console.log(response);

//       // Optionally, you can handle success response here
//     }
//   }catch (error) {
//     if (error.response) {
//       const { data } = error.response;
//       setFormErrors(data.errors);
//     } else {
//       console.error("An error occurred:", error.message);
//     }
//   }
// } else {
//   // If there are errors, set them in the formErrors state
//   setFormErrors(errors);
// }

//     // const errors = validate(formValues);
//     // console.log('errorrr',errors);
//     // if (Object.keys(errors).length === 0) {
//     //   console.log(formValues);
//     //   // Process payment here
//     //   alert("Payment processing...");
//     // //   setShowOTP(true);
//     // } else {
//     //   setFormErrors(errors);
//     //   console.log('object');
//     // }
//   };

//   if (showOTP) {
//     return <OTPVerification setShowOTPVerification={setShowOTP} />;
//   }
//   return (
//     <Card sx={{ paddingBottom: "120px" }}>
//       <Box
//         sx={{
//           position: "relative",
//           overflow: "hidden",
//           width: "100%",
//           height: { lg: "350px", md: "350px", sm: "100%", xs: "100%" },
//           backgroundImage: `url("/banner/banner.png")`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "right center",
//           zIndex: 5,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//           // "&::before": {
//           //   content: '""',
//           //   backgroundImage:
//           //     "linear-gradient(to left, rgba(77,39,63,0) 0%, #463b46 160%)",
//           //   position: "absolute",
//           //   top: 0,
//           //   left: 0,
//           //   bottom: 0,
//           //   right: 0,
//           //   zIndex: 7,
//           // },
//         }}
//       >
//         <Stack
//           className="Subscritption_box_stack_responsive"
//           sx={{ zIndex: 8, position: "absolute", left: "8em", top: "7em" }}
//         ></Stack>
//         <CardContent
//           className="dashboard_subscription_box_stack_responsive"
//           sx={{
//             paddingTop: {
//               lg: "6rem!important",
//               md: "6rem!important",
//               sm: "6rem!important",
//               xs: "3rem!important",
//             },
//             paddingBottom: {
//               lg: "4rem!important",
//               md: "4rem!important",
//               sm: "2rem!important",
//               xs: "2rem!important",
//             },
//             position: "relative",
//             zIndex: 9,
//           }}
//         >
//           {/* <CardContentOverlay> */}
//           <Stack spacing={4}>
//             <Typography
//               gutterBottom
//               fontSize={44}
//               component="h2"
//               fontWeight={600}
//               color="white"
//               variant="h2"
//             >
//               {paymentDetails.name}
//             </Typography>
//             {/* <Typography variant="body1" component="p" color="common.white">
//               Choose the right plan made for you
//             </Typography> */}
//           </Stack>
//         </CardContent>
//       </Box>

//       <Container maxWidth="md">
//         <Typography
//           variant="h4"
//           align="center"
//           gutterBottom
//           style={{ marginBottom: "2rem", color: "#333", paddingTop: "25px" }}
//         >
//           Pay with card
//         </Typography>
//         <Card
//           variant="outlined"
//           style={{
//             boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//             borderRadius: "16px",
//           }}
//         >
//           <CardContent>
//             <Box
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//               mb={2}
//             >
//               <CreditCardIcon fontSize="large" style={{ color: "#ff7533" }} />
//               {/* <AccountBalanceIcon fontSize="large" style={{ color: "#ff7533" }} /> */}
//             </Box>

//             <form onSubmit={handleSubmit} Validate>
//               <Grid container spacing={2}>
//                 {/* <Grid
//                       item
//                       xs={12}
//                       container
//                       justifyContent="center"
//                       alignItems="center"
//                     >
//                       <Typography variant="h6" gutterBottom>
//                         Selected Plan Amount:{paymentDetails.price}
//                       </Typography>
//                     </Grid> */}

//                 <Grid item xs={12}>
//                   <TextField
//                     label="Card Number"
//                     variant="outlined"
//                     fullWidth
//                     name="cardNumber"
//                     InputProps={{
//                       startAdornment: (
//                         <CreditCardIcon style={{ marginRight: "10px" }} />
//                       ),
//                       inputMode: "numeric",
//                       pattern: "[0-9]*",
//                     }}
//                     value={formValues?.cardNumber}
//                     onChange={handleChange}
//                     error={!!formErrors?.cardNumber}
//                     helperText={formErrors?.cardNumber}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Expiry Date (MM/YY)"
//                     variant="outlined"
//                     fullWidth
//                     name="expiryDate"
//                     value={formValues?.expiryDate}
//                     onChange={handleChange}
//                     error={!!formErrors?.expiryDate}
//                     helperText={formErrors?.expiryDate}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="CVV"
//                     variant="outlined"
//                     fullWidth
//                     name="cvv"
//                     value={formValues?.cvv}
//                     onChange={handleChange}
//                     error={!!formErrors?.cvv}
//                     helperText={formErrors?.cvv}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Name on Card"
//                     variant="outlined"
//                     fullWidth
//                     name="nameOnCard"
//                     value={formValues?.nameOnCard}
//                     onChange={handleChange}
//                     error={!!formErrors?.nameOnCard}
//                     helperText={formErrors?.nameOnCard || " "}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     style={{
//                       backgroundColor: "#ff7533",
//                       color: "white",
//                       borderRadius: "8px",
//                     }}
//                     fullWidth
//                     // onClick={() => handlePaymentCheckout(elem)}
//                   >
//                     {/* {isSubmitting
//                           ? "Processing..."
//                           :` */}
//                           Get Started with ${paymentDetails.price}
//                   </Button>
//                 </Grid>
//                 <Button fullWidth  variant="text" onClick={() => setShowPayment(false)}>
//                   Back to Plans
//                 </Button>
//               </Grid>
//             </form>
//           </CardContent>
//         </Card>
//       </Container>
//     </Card>
//   );
// };

// export default CardPaymentForm;






// import React, { useState } from "react";
// import { Router, useRouter } from "next/router";
// import {
//   Container,
//   Typography,
//   Grid,
//   TextField,
//   Button,
//   Card,
//   Breadcrumbs,
//   CardContent,
//   Stack,
//   Box,
//   Snackbar,
// } from "@mui/material";
// import MuiAlert from "@mui/material/Alert";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import Link from "next/link";
// import * as Yup from "yup";
// import OTPVerification from "../subscription/OTPVerification";
// import axiosInstance from "@/utils/axios";
// import { useAuthContext } from "@/auth/useAuthContext";

// import Header from "@/layout/primaryWeb/header";
// import Footer from "@/layout/primaryWeb/footer";
// import { Route } from "@mui/icons-material";

// const CardPaymentForm = ({ paymentDetails, setShowPayment }) => {
//   console.log("object", paymentDetails, setShowPayment);
//   const { user } = useAuthContext();
//   console.log(" const { user } = useAuthContext();", user);
//   // Define Yup validation schema
//   const validationSchema = Yup.object().shape({
//     cardNumber: Yup.string().required("Card Number is required"),
//     expiryDate: Yup.string().required("Expiration Date is required"),
//     cvCode: Yup.string().required("CVC Code is required"),
//     cardOwner: Yup.string().required("Card Owner is required"),
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//   });

//   // Inside your component function
//   const [openSnackbar, setOpenSnackbar] = useState(false);

//   const [cardNumber, setCardNumber] = useState("");
//   const [formValues, setFormValues] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     nameOnCard: "",
//     email: "company@mailinator.com",
//     expMonth: "", // Initialize expMonth
//     expYear: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [showOTP, setShowOTP] = useState(false); // State to control the display of OTPVerification

//   const handleChange = (e) => {
//     setFormErrors({}); // Clear any existing errors

//     let { name, value } = e.target;

//     if (name === "expiryDate") {
//       // Remove all non-digit characters except for the slash
//       value = value.replace(/[^0-9/]/g, "");

//       // Only add slash if the length is 2 and the last character isn't already a slash
//       if (value.length === 2 && value.indexOf("/") === -1) {
//         value = value + "/";
//       } else if (value.length > 2) {
//         // Ensure the slash is properly placed at position 3
//         value =
//           value.substring(0, 2) +
//           "/" +
//           value.substring(2).replace(/[^\d]/g, "");
//       }

//       // Handling deletion of the slash
//       if (
//         value.length === 3 &&
//         e.nativeEvent.inputType === "deleteContentBackward"
//       ) {
//         // Remove the slash if the user hits backspace at position 3
//         value = value.slice(0, -1);
//       }
//       // Extract month and year
//       const [month, year] = value.split("/");
//       // Update separate state variables for month and year
//       setFormValues({
//         ...formValues,
//         [name]: value,
//         expMonth: month,
//         expYear: year || "", // Ensure expYear is not empty
//       });
//     }
//     if (name === "cvv") {
//       value = value.replace(/\D/g, "").slice(0, 3); // Remove non-digits and limit length
//     }
//     if (name === "cardNumber") {
//       // Allow numeric values and spaces
//       value = value.replace(/\D/g, "");

//       // Insert spaces after every 4 digits
//       value = value.match(/.{1,4}/g)?.join(" ") || "";

//       // Limit to 19 characters to account for spaces (16 digits + 3 spaces)
//       value = value.slice(0, 19);
//     }
//     setFormValues({ ...formValues, [name]: value });
//   };
//   // const luhnCheck = (num) => {
//   //   let arr = (num + "")
//   //     .split("")
//   //     .reverse()
//   //     .map((x) => parseInt(x));
//   //   let lastDigit = arr.splice(0, 1)[0];
//   //   let sum = arr.reduce(
//   //     (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
//   //     0
//   //   );
//   //   sum += lastDigit;
//   //   return sum % 10 === 0;
//   // };

//   const validate = (values) => {
//     const errors = {};
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
//     const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
//     const cardNumberContinuous = values.cardNumber.replace(/\s/g, "");
//     if (!values.cardNumber) {
//       errors.cardNumber = "Card number is required!";
//     } else if (cardNumberContinuous.length !== 16) {
//       errors.cardNumber = "Card number must be 16 digits!";
//     }
//     // else if  (!luhnCheck(cardNumberContinuous)) {
//     //   errors.cardNumber = 'Invalid card number!';
//     // }
//     if (!values.cardNumber) {
//       errors.cardNumber = "Card number is required!";
//     }
//     if (!values.expiryDate) {
//       errors.expiryDate = "Expiry date is required!";
//     } else {
//       const [expMonth, expYear] = values.expiryDate
//         .split("/")
//         .map((num) => parseInt(num, 10));
//       if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
//         errors.expiryDate = "Invalid month!";
//       } else if (
//         expYear < currentYear ||
//         (expYear === currentYear && expMonth < currentMonth)
//       ) {
//         errors.expiryDate = "Card has expired!";
//       }
//     }
//     if (!values.cvv) {
//       errors.cvv = "CVV is required!";
//     } else if (values.cvv.length < 3 || values.cvv.length > 3) {
//       errors.cvv = "CVV must be 3 digits!";
//     }
//     if (!values.nameOnCard) {
//       errors.nameOnCard = "Name on card is required!";
//     }
//     return errors;
//   };

//   console.log(user);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validate(formValues);
//     if (Object.keys(errors).length === 0) {
//       const [expMonth, expYear] = formValues.expiryDate.split("/");

//       const initialValues = {
//         user_id: user?.id, // Adjust according to your logic
//         email: user?.email, // Add other initial values here
//         // plan_id: user?.plan?.plan_id,
//         plan_id: 15,
//         number: formValues?.cardNumber,
//         exp_month: expMonth,
//         exp_year: expYear,
//         cvc: formValues?.cvv,
//         name: formValues?.nameOnCard,
//       };

//       try {
//         const response = await axiosInstance.post(
//           `api/auth/payment/purchase-plan/${user?.id}`,
//           initialValues
//         );
//         if (response?.status === 200) {
//           console.log(response);
//           // Optionally, you can handle success response here
//           setOpenSnackbar(true);
//           // Redirect to the subscription page
//          //window.location.href = '/dashboard/company/subscription';
//          Router.push('/dashboard/company/subscription')
//         }
//       } catch (error) {
//         if (error.response) {
//           const { data } = error.response;
//           setFormErrors(data.errors);
//         } else {
//           console.error("An error occurred:", error.message);
//         }
//       }
//     }

//     // const errors = validate(formValues);
//     // console.log('errorrr',errors);
//     // if (Object.keys(errors).length === 0) {
//     //   console.log(formValues);
//     //   // Process payment here
//     //   alert("Payment processing...");
//     // //   setShowOTP(true);
//     // } else {
//     //   setFormErrors(errors);
//     //   console.log('object');
//     // }
//   };

//   if (showOTP) {
//     return <OTPVerification setShowOTPVerification={setShowOTP} />;
//   }
//   return (
//     <Card sx={{ paddingBottom: "120px" }}>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={() => setOpenSnackbar(false)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         style={{ top: '100px' }}
//       >
//         <MuiAlert
//           elevation={6}
//           variant="filled"
//           onClose={() => setOpenSnackbar(false)}
//           severity="success"
//         >
//           Purchase plan successful!!
//         </MuiAlert>
//       </Snackbar>


//       <Box
//         sx={{
//           position: "relative",
//           overflow: "hidden",
//           width: "100%",
//           height: { lg: "350px", md: "350px", sm: "100%", xs: "100%" },
//           backgroundImage: `url("/banner/banner.png")`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "right center",
//           zIndex: 5,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//           // "&::before": {
//           //   content: '""',
//           //   backgroundImage:
//           //     "linear-gradient(to left, rgba(77,39,63,0) 0%, #463b46 160%)",
//           //   position: "absolute",
//           //   top: 0,
//           //   left: 0,
//           //   bottom: 0,
//           //   right: 0,
//           //   zIndex: 7,
//           // },
//         }}
//       >
//         <Stack
//           className="Subscritption_box_stack_responsive"
//           sx={{ zIndex: 8, position: "absolute", left: "8em", top: "7em" }}
//         ></Stack>
//         <CardContent
//           className="dashboard_subscription_box_stack_responsive"
//           sx={{
//             paddingTop: {
//               lg: "6rem!important",
//               md: "6rem!important",
//               sm: "6rem!important",
//               xs: "3rem!important",
//             },
//             paddingBottom: {
//               lg: "4rem!important",
//               md: "4rem!important",
//               sm: "2rem!important",
//               xs: "2rem!important",
//             },
//             position: "relative",
//             zIndex: 9,
//           }}
//         >
//           {/* <CardContentOverlay> */}
//           <Stack spacing={4}>
//             <Typography
//               gutterBottom
//               fontSize={44}
//               component="h2"
//               fontWeight={600}
//               color="white"
//               variant="h2"
//             >
//               {paymentDetails.name}
//             </Typography>
//             {/* <Typography variant="body1" component="p" color="common.white">
//               Choose the right plan made for you
//             </Typography> */}
//           </Stack>
//         </CardContent>
//       </Box>

//       <Container maxWidth="md">
//         <Typography
//           variant="h4"
//           align="center"
//           gutterBottom
//           style={{ marginBottom: "2rem", color: "#333", paddingTop: "25px" }}
//         >
//           Pay with card
//         </Typography>
//         <Card
//           variant="outlined"
//           style={{
//             boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//             borderRadius: "16px",
//           }}
//         >
//           <CardContent>
//             <Box
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//               mb={2}
//             >
//               <CreditCardIcon fontSize="large" style={{ color: "#ff7533" }} />
//               {/* <AccountBalanceIcon fontSize="large" style={{ color: "#ff7533" }} /> */}
//             </Box>

//             <form onSubmit={handleSubmit} Validate>
//               <Grid container spacing={2}>
//                 {/* <Grid
//                       item
//                       xs={12}
//                       container
//                       justifyContent="center"
//                       alignItems="center"
//                     >
//                       <Typography variant="h6" gutterBottom>
//                         Selected Plan Amount:{paymentDetails.price}
//                       </Typography>
//                     </Grid> */}

//                 <Grid item xs={12}>
//                   <TextField
//                     label="Card Number"
//                     variant="outlined"
//                     fullWidth
//                     name="cardNumber"
//                     InputProps={{
//                       startAdornment: (
//                         <CreditCardIcon style={{ marginRight: "10px" }} />
//                       ),
//                       inputMode: "numeric",
//                       pattern: "[0-9]*",
//                     }}
//                     value={formValues?.cardNumber}
//                     onChange={handleChange}
//                     error={!!formErrors?.cardNumber}
//                     helperText={formErrors?.cardNumber}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Expiry Date (MM/YY)"
//                     variant="outlined"
//                     fullWidth
//                     name="expiryDate"
//                     value={formValues?.expiryDate}
//                     onChange={handleChange}
//                     error={!!formErrors?.expiryDate}
//                     helperText={formErrors?.expiryDate}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="CVV"
//                     variant="outlined"
//                     fullWidth
//                     name="cvv"
//                     value={formValues?.cvv}
//                     onChange={handleChange}
//                     error={!!formErrors?.cvv}
//                     helperText={formErrors?.cvv}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Name on Card"
//                     variant="outlined"
//                     fullWidth
//                     name="nameOnCard"
//                     value={formValues?.nameOnCard}
//                     onChange={handleChange}
//                     error={!!formErrors?.nameOnCard}
//                     helperText={formErrors?.nameOnCard || " "}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     style={{
//                       backgroundColor: "#ff7533",
//                       color: "white",
//                       borderRadius: "8px",
//                     }}
//                     fullWidth
//                     // onClick={() => handlePaymentCheckout(elem)}
//                   >
//                     {/* {isSubmitting
//                           ? "Processing..."
//                           :` */}
//                     Get Started with ${paymentDetails.price}
//                   </Button>
//                 </Grid>
//                 <Button
//                   fullWidth
//                   variant="text"
//                   onClick={() => setShowPayment(false)}
//                 >
//                   Back to Plans
//                 </Button>
//               </Grid>
//             </form>
//           </CardContent>
//         </Card>
//       </Container>
//     </Card>
//   );
// };

// export default CardPaymentForm;






import React, { useState } from "react";
import { Router, useRouter } from "next/router";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Breadcrumbs,
  CardContent,
  Stack,
  Box,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Formik, Form, Field, ErrorMessage } from "formik";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Link from "next/link";
import * as Yup from "yup";
import OTPVerification from "../subscription/OTPVerification";
import axiosInstance from "@/utils/axios";
import { useAuthContext } from "@/auth/useAuthContext";

import Header from "@/layout/primaryWeb/header";
import Footer from "@/layout/primaryWeb/footer";
import { Route } from "@mui/icons-material";

const CardPaymentForm = ({ paymentDetails, setShowPayment }) => {
  console.log("object", paymentDetails, setShowPayment);
  const { user } = useAuthContext();
  console.log(" const { user } = useAuthContext();", user);
  // Define Yup validation schema
  const validationSchema = Yup.object().shape({
    cardNumber: Yup.string().required("Card Number is required"),
    expiryDate: Yup.string().required("Expiration Date is required"),
    cvCode: Yup.string().required("CVC Code is required"),
    cardOwner: Yup.string().required("Card Owner is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Inside your component function
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [formValues, setFormValues] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    email: "company@mailinator.com",
    expMonth: "", // Initialize expMonth
    expYear: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false); // State to control the display of OTPVerification

  const handleChange = (e) => {
    setFormErrors({}); // Clear any existing errors

    let { name, value } = e.target;

    if (name === "expiryDate") {
      // Remove all non-digit characters except for the slash
      value = value.replace(/[^0-9/]/g, "");

      // Only add slash if the length is 2 and the last character isn't already a slash
      if (value.length === 2 && value.indexOf("/") === -1) {
        value = value + "/";
      } else if (value.length > 2) {
        // Ensure the slash is properly placed at position 3
        value =
          value.substring(0, 2) +
          "/" +
          value.substring(2).replace(/[^\d]/g, "");
      }

      // Handling deletion of the slash
      if (
        value.length === 3 &&
        e.nativeEvent.inputType === "deleteContentBackward"
      ) {
        // Remove the slash if the user hits backspace at position 3
        value = value.slice(0, -1);
      }
      // Extract month and year
      const [month, year] = value.split("/");
      // Update separate state variables for month and year
      setFormValues({
        ...formValues,
        [name]: value,
        expMonth: month,
        expYear: year || "", // Ensure expYear is not empty
      });
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3); // Remove non-digits and limit length
    }
    if (name === "cardNumber") {
      // Allow numeric values and spaces
      value = value.replace(/\D/g, "");

      // Insert spaces after every 4 digits
      value = value.match(/.{1,4}/g)?.join(" ") || "";

      // Limit to 19 characters to account for spaces (16 digits + 3 spaces)
      value = value.slice(0, 19);
    }
    setFormValues({ ...formValues, [name]: value });
  };
  // const luhnCheck = (num) => {
  //   let arr = (num + "")
  //     .split("")
  //     .reverse()
  //     .map((x) => parseInt(x));
  //   let lastDigit = arr.splice(0, 1)[0];
  //   let sum = arr.reduce(
  //     (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
  //     0
  //   );
  //   sum += lastDigit;
  //   return sum % 10 === 0;
  // };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
    const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
    const cardNumberContinuous = values.cardNumber.replace(/\s/g, "");
    if (!values.cardNumber) {
      errors.cardNumber = "Card number is required!";
    } else if (cardNumberContinuous.length !== 16) {
      errors.cardNumber = "Card number must be 16 digits!";
    }
    // else if  (!luhnCheck(cardNumberContinuous)) {
    //   errors.cardNumber = 'Invalid card number!';
    // }
    if (!values.cardNumber) {
      errors.cardNumber = "Card number is required!";
    }
    if (!values.expiryDate) {
      errors.expiryDate = "Expiry date is required!";
    } else {
      const [expMonth, expYear] = values.expiryDate
        .split("/")
        .map((num) => parseInt(num, 10));
      if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
        errors.expiryDate = "Invalid month!";
      } else if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        errors.expiryDate = "Card has expired!";
      }
    }
    if (!values.cvv) {
      errors.cvv = "CVV is required!";
    } else if (values.cvv.length < 3 || values.cvv.length > 3) {
      errors.cvv = "CVV must be 3 digits!";
    }
    if (!values.nameOnCard) {
      errors.nameOnCard = "Name on card is required!";
    }
    return errors;
  };

  console.log(user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    if (Object.keys(errors).length === 0) {
      const [expMonth, expYear] = formValues.expiryDate.split("/");

      const initialValues = {
        user_id: user?.id, // Adjust according to your logic
        email: user?.email, // Add other initial values here
        // plan_id: user?.plan?.plan_id,
        plan_id: 15,
        number: formValues?.cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: formValues?.cvv,
        name: formValues?.nameOnCard,
      };

      try {
        const response = await axiosInstance.post(
          `api/auth/payment/purchase-plan/${user?.id}`,
          initialValues
        );
        if (response?.status === 200) {
          console.log(response);
          // Optionally, you can handle success response here
          setOpenSnackbar(true);
          // Redirect to the subscription page
         window.location.href = '/dashboard/company/subscription';
        //  Router.push('/dashboard/company/subscription')
        }
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          setFormErrors(data.errors);
        } else {
          console.error("An error occurred:", error.message);
        }
      }
    }

    // const errors = validate(formValues);
    // console.log('errorrr',errors);
    // if (Object.keys(errors).length === 0) {
    //   console.log(formValues);
    //   // Process payment here
    //   alert("Payment processing...");
    // //   setShowOTP(true);
    // } else {
    //   setFormErrors(errors);
    //   console.log('object');
    // }
  };

  if (showOTP) {
    return <OTPVerification setShowOTPVerification={setShowOTP} />;
  }
  return (
    <Card sx={{ paddingBottom: "120px" }}>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ top: '100px' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity="success"
        >
          Purchase plan successful!!
        </MuiAlert>
      </Snackbar>


      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: { lg: "350px", md: "350px", sm: "100%", xs: "100%" },
          backgroundImage: `url("/banner/banner.png")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          zIndex: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center", 
          textAlign: "center",
          // "&::before": {
          //   content: '""',
          //   backgroundImage:
          //     "linear-gradient(to left, rgba(77,39,63,0) 0%, #463b46 160%)",
          //   position: "absolute",
          //   top: 0,
          //   left: 0,
          //   bottom: 0,
          //   right: 0,
          //   zIndex: 7,
          // },
        }}
      >
        <Stack
          className="Subscritption_box_stack_responsive"
          sx={{ zIndex: 8, position: "absolute", left: "8em", top: "7em" }}
        ></Stack>
        <CardContent
          className="dashboard_subscription_box_stack_responsive"
          sx={{
            paddingTop: {
              lg: "6rem!important",
              md: "6rem!important",
              sm: "6rem!important",
              xs: "3rem!important",
            },
            paddingBottom: {
              lg: "4rem!important",
              md: "4rem!important",
              sm: "2rem!important",
              xs: "2rem!important",
            },
            position: "relative",
            zIndex: 9,
          }}
        >
          {/* <CardContentOverlay> */}
          <Stack spacing={4}>
            <Typography
              gutterBottom
              fontSize={44}
              component="h2"
              fontWeight={600}
              color="white"
              variant="h2"
            >
              {paymentDetails.name}
            </Typography>
            {/* <Typography variant="body1" component="p" color="common.white">
              Choose the right plan made for you
            </Typography> */}
          </Stack>
        </CardContent>
      </Box>

      <Container maxWidth="md">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ marginBottom: "2rem", color: "#333", paddingTop: "25px" }}
        >
          Pay with card
        </Typography>
        <Card
          variant="outlined"
          style={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <CreditCardIcon fontSize="large" style={{ color: "#ff7533" }} />
              {/* <AccountBalanceIcon fontSize="large" style={{ color: "#ff7533" }} /> */}
            </Box>

            <form onSubmit={handleSubmit} Validate>
              <Grid container spacing={2}>
                {/* <Grid
                      item
                      xs={12}
                      container
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography variant="h6" gutterBottom>
                        Selected Plan Amount:{paymentDetails.price}
                      </Typography>
                    </Grid> */}

                <Grid item xs={12}>
                  <TextField
                    label="Card Number"
                    variant="outlined"
                    fullWidth
                    name="cardNumber"
                    InputProps={{
                      startAdornment: (
                        <CreditCardIcon style={{ marginRight: "10px" }} />
                      ),
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    value={formValues?.cardNumber}
                    onChange={handleChange}
                    error={!!formErrors?.cardNumber}
                    helperText={formErrors?.cardNumber}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Expiry Date (MM/YY)"
                    variant="outlined"
                    fullWidth
                    name="expiryDate"
                    value={formValues?.expiryDate}
                    onChange={handleChange}
                    error={!!formErrors?.expiryDate}
                    helperText={formErrors?.expiryDate}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="CVV"
                    variant="outlined"
                    fullWidth
                    name="cvv"
                    value={formValues?.cvv}
                    onChange={handleChange}
                    error={!!formErrors?.cvv}
                    helperText={formErrors?.cvv}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Name on Card"
                    variant="outlined"
                    fullWidth
                    name="nameOnCard"
                    value={formValues?.nameOnCard}
                    onChange={handleChange}
                    error={!!formErrors?.nameOnCard}
                    helperText={formErrors?.nameOnCard || " "}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      backgroundColor: "#ff7533",
                      color: "white",
                      borderRadius: "8px",
                    }}
                    fullWidth
                    // onClick={() => handlePaymentCheckout(elem)}
                  >
                    {/* {isSubmitting
                          ? "Processing..."
                          :` */}
                    Get Started with ${paymentDetails.price}
                  </Button>
                </Grid>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setShowPayment(false)}
                >
                  Back to Plans
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Card>
  );
};

export default CardPaymentForm;




