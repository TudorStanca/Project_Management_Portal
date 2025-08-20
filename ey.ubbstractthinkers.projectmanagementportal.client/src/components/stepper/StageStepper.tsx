import CloseIcon from "@mui/icons-material/Close"; // close
import CoPresentIcon from "@mui/icons-material/CoPresent"; // plan
import SlideshowIcon from "@mui/icons-material/Slideshow"; // execute
import MonitorIcon from "@mui/icons-material/Monitor"; // monitor
import FlutterDashIcon from "@mui/icons-material/FlutterDash"; // initiate
import { useEffect, useState } from "react";
import type { Stage } from "@models/Stage";
import { getStages } from "@services/StageClient";
import { handleApiError } from "@services/ErrorHandler";
import type { SnackbarSeverity } from "@models/SnackbarSeverity";
import {
  Alert,
  Snackbar,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  type StepConnectorProps,
  type StepIconProps,
} from "@mui/material";
import type { Project } from "@models/Project";
import { getTemplate } from "@services/TemplateClient";
import styles from "./StageStepper.module.css";

interface StageStepperProps {
  project: Project;
}

const ColorlibConnector = (props: StepConnectorProps) => (
  <StepConnector
    {...props}
    sx={{
      //source: https://mui.com/material-ui/react-stepper/
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundImage:
            "linear-gradient( 95deg, #8994e1 0%, #5b2287 50%, #8994e1 100%)",
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundImage:
            "linear-gradient( 95deg, #8994e1 0%, #5b2287 50%, #8994e1 100%)",
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: "#eaeaf0",
        borderRadius: 1,
      },
    }}
  />
);

const ColorlibStepIcon = (props: StepIconProps) => {
  const { active, completed, icon } = props;

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <FlutterDashIcon />,
    2: <CoPresentIcon />,
    3: <SlideshowIcon />,
    4: <MonitorIcon />,
    5: <CloseIcon />,
  };

  return (
    <div
      className={`${styles.colorlibStepIcon} ${active ? styles.active : ""} ${completed ? styles.completed : ""}`}
    >
      {icons[String(icon)]}
    </div>
  );
};

const StageStepper = (props: StageStepperProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  useEffect(() => {
    const fetchAll = async () => {
      if (!props.project.templateUid) {
        return;
      }

      try {
        const [fetchedStages, fetchedTemplate] = await Promise.all([
          getStages(),
          getTemplate(props.project.templateUid),
        ]);

        const filtered = fetchedStages.filter((stage) =>
          fetchedTemplate.stageUids.includes(stage.uid),
        );

        setStages(filtered);
      } catch (error) {
        console.error(error);

        setErrorMessage(handleApiError(error));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchAll();
  }, [props.project.templateUid]);

  const currentStageIndex = stages.findIndex(
    (stage) => stage.uid === props.project.currentStageUid,
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={currentStageIndex >= 0 ? currentStageIndex : 0}
        connector={<ColorlibConnector />}
        className={styles.stepper}
      >
        {stages.map((stage) => (
          <Step key={stage.uid}>
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
              icon={stage.orderNumber}
            >
              {stage.name}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StageStepper;
