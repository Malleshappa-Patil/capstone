import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Card,
  CardContent,
  CardMedia,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Chip,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Clear from "@material-ui/icons/Clear";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";
import { common } from "@material-ui/core/colors";
import tomatoImg from "./tomato.jpg";
import bgImg from "./bg.avif";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: "#be6a77",
    "&:hover": { backgroundColor: "#a35763" },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  appbar: {
    background: "#be6a77",
    boxShadow: "none",
  },
  mainContainer: {
    backgroundImage: `url(${bgImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "93vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(2),
  },
  uploadCard: {
    width: "50%",
    minWidth: 380,
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    backgroundColor: "#ffffff",
  },
  uploadHeader: {
    textAlign: "center",
    color: "#6b3540",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  tipsRow: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  resultWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
    maxWidth: "900px",
    marginTop: "2em",
  },
  imageContainer: {
  width: "450px",
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",   // ensures the image is centered vertically
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  overflow: "hidden",
  objectFit: "contain",   // ✅ ensures full image visibility if applied to img tag directly
  },
  media: {
    width: "100%",
    height: 400,
    objectFit: "cover",
  },
  remediesContainer: {
    width: "100%",
    backgroundColor: "#fff",
    color: "#000",
    marginTop: "1.5em",
    borderRadius: "16px",
    padding: "2em",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },
  loaderSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "70vh",
  },
  tableCell: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#000",
  },
  clearButton: {
    marginTop: theme.spacing(3),
    width: "200px",
    borderRadius: "12px",
    fontWeight: 700,
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const remedyRef = useRef(null);

  const API_URL = "http://localhost:8000/predict";

  const sendFile = useCallback(async () => {
    if (selectedFile) {
      let isMounted = true;
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (isMounted && res.status === 200) {
          setData(res.data);
          setTimeout(() => remedyRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
        }
      } catch (error) {
        console.error("Prediction Error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
      return () => {
        isMounted = false;
      };
    }
  }, [selectedFile]);

  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setImageUploaded(false);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setImageUploaded(true);
    sendFile();
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, sendFile]);

  const onSelectFile = (files) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const getPredClass = () => data?.pred_class || "Unknown";
  const confidenceDisplay = ((data?.pred_conf || 0) * 100).toFixed(2);

  const renderSection = (title, content, icon = "") => {
    if (!content) return null;

    if (Array.isArray(content)) {
      return (
        <details className="remedy-block" open>
          <summary>
            {icon} {title}
          </summary>
          <ul className="remedy-list">
            {content.map((item, i) => (
              <li key={i}>
                {typeof item === "object"
                  ? Object.entries(item)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" | ")
                  : item}
              </li>
            ))}
          </ul>
        </details>
      );
    }

    return (
      <details className="remedy-block" open>
        <summary>
          {icon} {title}
        </summary>
        <Typography variant="body2">{content}</Typography>
      </details>
    );
  };

  const renderRemedyContent = () => {
    const r = data?.remedy;
    if (!r) return null;

    return (
      <>
        <Typography variant="h5" gutterBottom>
          Remedies
        </Typography>
        {renderSection("🌿 Symptoms", r.symptoms)}
        {renderSection("🧬 Causes", r.causes)}
        {renderSection("💊 Treatment Steps", r.treatment_steps)}
        {renderSection("🛡️ Prevention", r.prevention)}
        {renderSection("🌱 Organic Solutions", r.organic_solutions)}
        {renderSection("🧪 Chemical Solutions", r.chemical_solutions)}

        {r.estimated_recovery_time && (
          <Typography variant="body2" style={{ marginTop: "1em" }}>
            ⏱️ <strong>Estimated Recovery Time:</strong> {r.estimated_recovery_time}
          </Typography>
        )}
        {r.severity_level && (
          <Typography variant="body2">
            ⚠️ <strong>Severity Level:</strong> {r.severity_level}
          </Typography>
        )}
        {r.warning && (
          <Typography variant="body2" style={{ color: "#d9534f", marginTop: "1em" }}>
            ⚠️ {r.warning}
          </Typography>
        )}
      </>
    );
  };

  return (
    <>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6">Tomato Disease Detection</Typography>
          <div style={{ flexGrow: 1 }} />
          <Avatar src={tomatoImg} />
        </Toolbar>
      </AppBar>

      <Container className={classes.mainContainer}>
        {!imageUploaded && !isLoading && !data && (
          <Card className={classes.uploadCard}>
            <CardContent>
              <Typography variant="h6" className={classes.uploadHeader}>
                Upload a Tomato Leaf Image
              </Typography>
              <div className={classes.tipsRow}>
                <Chip size="small" label="JPG/PNG" />
                <Chip size="small" label="Max 5 MB" />
                <Chip size="small" label="1 image only" />
              </div>
              <DropzoneArea
                acceptedFiles={["image/*"]}
                filesLimit={1}
                maxFileSize={5 * 1024 * 1024}
                showAlerts={["error"]}
                dropzoneClass={"upload-area"}
                onChange={onSelectFile}
              />
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className={classes.loaderSection}>
            <CircularProgress color="secondary" />
            <Typography variant="h6" style={{ marginTop: "1em" }}>
              Processing...
            </Typography>
          </div>
        )}

        {data && !isLoading && (
          <div className={classes.resultWrapper} ref={remedyRef}>
            {/* Image Section */}
            <div className={classes.imageContainer}>
              <CardMedia 
                component="img" 
                image={preview} 
                alt="Tomato Leaf" 
                className={classes.media} />
            </div>

            {/* Remedies Section */}
            <div className={classes.remediesContainer}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableCell}>Disease</TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        Confidence
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.tableCell}>
                        <Tooltip title="Predicted class from the model">
                          <span>{getPredClass()}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {confidenceDisplay}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {renderRemedyContent()}

              <ColorButton
                variant="contained"
                color="primary"
                onClick={clearData}
                className={classes.clearButton}
                startIcon={<Clear />}
              >
                Clear
              </ColorButton>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};
