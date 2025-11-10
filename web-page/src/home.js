// import { useState, useEffect } from "react";
// import { makeStyles, withStyles } from "@material-ui/core/styles";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import Avatar from "@material-ui/core/Avatar";
// import Container from "@material-ui/core/Container";
// import React from "react";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
// import tomatoImg from "./tomato.jpg";
// import bgImg from "./bg.png";
// import { DropzoneArea } from 'material-ui-dropzone';
// import { common } from '@material-ui/core/colors';
// import Clear from '@material-ui/icons/Clear';




// const ColorButton = withStyles((theme) => ({
//   root: {
//     color: theme.palette.getContrastText(common.white),
//     backgroundColor: common.white,
//     '&:hover': {
//       backgroundColor: '#ffffff7a',
//     },
//   },
// }))(Button);
// const axios = require("axios").default;

// const useStyles = makeStyles((theme) => ({
//   grow: {
//     flexGrow: 1,
//   },
//   clearButton: {
//     width: "-webkit-fill-available",
//     borderRadius: "15px",
//     padding: "15px 22px",
//     color: "#000000a6",
//     fontSize: "20px",
//     fontWeight: 900,
//   },
//   root: {
//     maxWidth: 345,
//     flexGrow: 1,
//   },
//   media: {
//     height: 400,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     margin: 'auto',
//     maxWidth: 500,
//   },
//   gridContainer: {
//     justifyContent: "center",
//     padding: "1em 1em 0 1em",
//   },
//   mainContainer: {
//     backgroundImage: `url(${bgImg})`,
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     backgroundSize: 'cover',
//     height: "93vh",
//     marginTop: "8px",
//   },
//   imageCard: {
//     margin: "auto",
//     maxWidth: 400,
//     height: 500,
//     backgroundColor: 'transparent',
//     boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
//     borderRadius: '15px',
//   },
//   imageCardEmpty: {
//     height: 'auto',
//   },
//   noImage: {
//     margin: "auto",
//     width: 400,
//     height: "400 !important",
//   },
//   input: {
//     display: 'none',
//   },
//   uploadIcon: {
//     background: 'white',
//   },
//   tableContainer: {
//     backgroundColor: 'transparent !important',
//     boxShadow: 'none !important',
//   },
//   table: {
//     backgroundColor: 'transparent !important',
//   },
//   tableHead: {
//     backgroundColor: 'transparent !important',
//   },
//   tableRow: {
//     backgroundColor: 'transparent !important',
//   },
//   tableCell: {
//     fontSize: '20px',
//     backgroundColor: 'transparent !important',
//     borderColor: 'transparent !important',
//     color: '#000000a6 !important',
//     fontWeight: 'bolder',
//     padding: '1px 24px 1px 16px',
//   },
//   tableCell1: {
//     fontSize: '14px',
//     backgroundColor: 'transparent !important',
//     borderColor: 'transparent !important',
//     color: '#000000a6 !important',
//     fontWeight: 'bolder',
//     padding: '1px 24px 1px 16px',
//   },
//   tableBody: {
//     backgroundColor: 'transparent !important',
//   },
//   text: {
//     color: 'white !important',
//     textAlign: 'center',
//   },
//   buttonGrid: {
//     maxWidth: "416px",
//     width: "100%",
//   },
//   detail: {
//     backgroundColor: 'white',
//     display: 'flex',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   appbar: {
//     background: '#be6a77',
//     boxShadow: 'none',
//     color: 'white'
//   },
//   loader: {
//     color: '#be6a77 !important',
//   }
// }));

// export const ImageUpload = () => {
//   const classes = useStyles();
//   const [selectedFile, setSelectedFile] = useState();
//   const [preview, setPreview] = useState();
//   const [data, setData] = useState();
//   const [image, setImage] = useState(false);
//   const [isLoading, setIsloading] = useState(false);
//   let confidence = 0;

//   const sendFile = async () => {
//     if (image) {
//       let formData = new FormData();
//       formData.append("file", selectedFile);
//       let res = await axios({
//         method: "post",
//         url: process.env.REACT_APP_API_URL,
//         data: formData,
//       });
//       if (res.status === 200) {
//         setData(res.data);
//       }
//       setIsloading(false);
//     }
//   }

//   const clearData = () => {
//     setData(null);
//     setImage(false);
//     setSelectedFile(null);
//     setPreview(null);
//   };

//   useEffect(() => {
//     if (!selectedFile) {
//       setPreview(undefined);
//       return;
//     }
//     const objectUrl = URL.createObjectURL(selectedFile);
//     setPreview(objectUrl);
//   }, [selectedFile]);

//   useEffect(() => {
//     if (!preview) {
//       return;
//     }
//     setIsloading(true);
//     sendFile();
//   }, [preview]);

//   const onSelectFile = (files) => {
//     if (!files || files.length === 0) {
//       setSelectedFile(undefined);
//       setImage(false);
//       setData(undefined);
//       return;
//     }
//     setSelectedFile(files[0]);
//     setData(undefined);
//     setImage(true);
//   };

//   if (data) {
//     confidence = (parseFloat(data.pred_conf) * 100).toFixed(2);
//   }

//   return (
//     <React.Fragment>
//       <AppBar position="static" className={classes.appbar}>
//         <Toolbar>
//           <Typography className={classes.title} variant="h6" noWrap>
//             Tomato Disease Detection
//           </Typography>
//           <div className={classes.grow} />
//           <Avatar src={tomatoImg}></Avatar>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
//         <Grid
//           className={classes.gridContainer}
//           container
//           direction="row"
//           justifyContent="center"
//           alignItems="center"
//           spacing={2}
//         >
//           <Grid item xs={12}>
//             <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
//               {image && <CardActionArea>
//                 <CardMedia
//                   className={classes.media}
//                   image={preview}
//                   component="image"
//                   title="Tomato leaf"
//                 />
//               </CardActionArea>
//               }
//               {!image && <CardContent className={classes.content}>
//                 <DropzoneArea
//                   acceptedFiles={['image/*']}
//                   dropzoneText={"Drag and drop an image of a tomato leaf"}
//                   onChange={onSelectFile}
//                 />
//               </CardContent>}
//               {data && <CardContent className={classes.detail}>
//                 <TableContainer component={Paper} className={classes.tableContainer}>
//                   <Table className={classes.table} size="small" aria-label="simple table">
//                     <TableHead className={classes.tableHead}>
//                       <TableRow className={classes.tableRow}>
//                         <TableCell className={classes.tableCell1}>Label:</TableCell>
//                         <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody className={classes.tableBody}>
//                       <TableRow className={classes.tableRow}>
//                         <TableCell component="th" scope="row" className={classes.tableCell}>
//                           {data.pred_class}
//                         </TableCell>
//                         <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </CardContent>}
//               {isLoading && <CardContent className={classes.detail}>
//                 <CircularProgress color="secondary" className={classes.loader} />
//                 <Typography className={classes.title} variant="h6" noWrap>
//                   Processing
//                 </Typography>
//               </CardContent>}
//             </Card>
//           </Grid>
//           {data &&
//             <Grid item className={classes.buttonGrid} >

//               <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
//                 Clear
//               </ColorButton>
//             </Grid>}
//         </Grid >
//       </Container >
//     </React.Fragment >
//   );
// };




import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Paper,
  CardActionArea,
  CardMedia,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from "@material-ui/core";
import tomatoImg from "./tomato.jpg";
import bgImg from "./bg.png";
import { DropzoneArea } from "material-ui-dropzone";
import { common } from "@material-ui/core/colors";
import Clear from "@material-ui/icons/Clear";
import axios from "axios";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    "&:hover": { backgroundColor: "#ffffff7a" },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  clearButton: {
    width: "100%",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  mainContainer: {
    backgroundImage: `url(${bgImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "93vh",
    marginTop: "8px",
  },
  gridContainer: { justifyContent: "center", padding: "1em" },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: "auto",
    backgroundColor: "transparent",
    boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%) !important",
    borderRadius: "15px",
  },
  media: { height: 400 },
  appbar: {
    background: "#be6a77",
    boxShadow: "none",
    color: "white",
  },
  loader: { color: "#be6a77 !important" },
  tableCell: {
    fontSize: "18px",
    color: "#000000a6 !important",
    fontWeight: "bolder",
    backgroundColor: "transparent !important",
  },
  detail: {
    backgroundColor: "rgba(149, 133, 133, 1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonGrid: { maxWidth: "416px", width: "100%" },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://localhost:8000/predict";

  // ✅ Upload and get prediction
  const sendFile = useCallback(async () => {
    if (image && selectedFile) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 20000,
        });

        if (res.status === 200) {
          console.log("🧩 Prediction Response:", res.data);
          setData(res.data);
        } else {
          alert("Prediction failed. Check backend logs.");
        }
      } catch (error) {
        console.error("Prediction Error:", error);
        alert("Prediction failed. Check backend server or model endpoint.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [image, selectedFile]);

  // ✅ Clear results
  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  // ✅ Image preview
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // ✅ Send image when ready
  useEffect(() => {
    if (preview) sendFile();
  }, [preview, sendFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      clearData();
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  const getPredClass = () =>
    data?.pred_class || data?.predicted_class || data?.predClass || "Unknown";

  // const getConfidenceValue = () => {
  //   const v =
  //     data?.pred_conf ??
  //     data?.confidence ??
  //     data?.pred_confidence ??
  //     data?.score ??
  //     null;
  //   if (v == null) return 0;
  //   const num = Number(v);
  //   return Number.isNaN(num) ? 0 : num;
  // };

  // const confidenceDisplay = (getConfidenceValue() * 100).toFixed(2);

  // ✅ Remedy Renderer
  const renderRemedyContent = () => {
    if (!data?.remedy) {
      return (
        <Typography variant="body2" style={{ color: "white", marginTop: "1em" }}>
          Remedy information not available.
        </Typography>
      );
    }

    const remedy = data.remedy;

    return (
      <div style={{ marginTop: "1.5em", color: "white", textAlign: "left" }}>
        {remedy.title && <Typography variant="h6">{remedy.title}</Typography>}
        {remedy.short_description && (
          <Typography variant="body1" paragraph>
            {remedy.short_description}
          </Typography>
        )}

        {remedy.symptoms && (
          <>
            <Typography variant="subtitle1">
              <strong>Symptoms:</strong>
            </Typography>
            <ul>{remedy.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </>
        )}

        {remedy.treatment_steps && (
          <>
            <Typography variant="subtitle1">
              <strong>Treatment Steps:</strong>
            </Typography>
            <ul>
              {remedy.treatment_steps.map((step, i) => (
                <li key={i}>
                  <Typography variant="body2">
                    <strong>{step.step}. </strong>
                    {step.action} — {step.details}
                  </Typography>
                </li>
              ))}
            </ul>
          </>
        )}

        {remedy.prevention && (
          <>
            <Typography variant="subtitle1">
              <strong>Prevention:</strong>
            </Typography>
            <ul>{remedy.prevention.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </>
        )}

        {remedy.warning && (
          <Typography
            variant="body2"
            style={{ color: "#ffb3b3", marginTop: "1em" }}
          >
            ⚠️ {remedy.warning}
          </Typography>
        )}

        {remedy.external_resources && (
          <>
            <Typography variant="subtitle1">
              <strong>External Resources:</strong>
            </Typography>
            <ul>
              {remedy.external_resources.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#9ad9ff" }}
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Tomato Disease Detection
          </Typography>
          <div className={classes.grow} />
          <Avatar src={tomatoImg}></Avatar>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={false}
        className={classes.mainContainer}
        disableGutters
      >
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={classes.imageCard}>
              {image && !isLoading && preview && (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="img"
                    title="Tomato leaf"
                  />
                </CardActionArea>
              )}

              {!image && !isLoading && (
                <CardContent>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    dropzoneText={"Drag and drop a tomato leaf image here"}
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}

              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress
                    color="secondary"
                    className={classes.loader}
                  />
                  <Typography variant="h6">Processing...</Typography>
                </CardContent>
              )}

              {data && !isLoading && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            Disease
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableCell}
                          >
                            
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            {getPredClass()}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableCell}
                          >
                            
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {renderRemedyContent()}
                </CardContent>
              )}
            </Card>
          </Grid>

          {data && !isLoading && (
            <Grid item className={classes.buttonGrid}>
              <ColorButton
                variant="contained"
                className={classes.clearButton}
                color="primary"
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
              >
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};
