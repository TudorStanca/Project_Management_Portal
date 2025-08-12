import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProjectPage.module.css";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  deleteProject,
  getProject,
  updateProject,
} from "@services/ProjectClient";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DefaultProject, type Project } from "@models/Project";
import { handleApiError } from "@services/ErrorHandler";
import AlertDialog from "../../../components/AlertDialog";
import type { SnackbarSeverity } from "@models/SnackbarSeverity";

interface ProjectPageProps {
  open: boolean;
}

const convertToDayjsOrNull = (date: Dayjs | string | null): Dayjs | null => {
  return date ? dayjs(date) : null;
};

const ProjectPage = (props: ProjectPageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIdDeleting] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isProjectDeleted, setIsProjectDeleted] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [project, setProject] = useState<Project>(DefaultProject);

  const navigate = useNavigate();

  const { projectId } = useParams();

  const isFormChanged =
    name !== project.name ||
    description !== project.description ||
    startDate?.format("YYYY-MM-DD") !== project.startDate ||
    (endDate ? endDate.format("YYYY-MM-DD") : null) !== project.endDate;

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchProject = async () => {
      try {
        const project = await getProject(projectId!);
        setProject(project);

        setName(project.name);
        setDescription(project.description);
        setStartDate(convertToDayjsOrNull(project.startDate));
        setEndDate(convertToDayjsOrNull(project.endDate));
      } catch (error) {
        setErrorMessage(handleApiError(error));
        setSnackbarSeverity("error");
        setIsSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!startDate) {
      setErrorMessage("Start Date is required");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);

      return;
    }

    const formattedProject: Project = {
      uid: projectId,
      name,
      description: description ?? "",
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      ownerId: project.ownerId,
      stakeholderIds: project.stakeholderIds,
      resourceIds: project.resourceIds,
      templateUid: project.templateUid,
      currentStageUid: project.currentStageUid,
    };

    setIsUpdating(true);

    try {
      await updateProject(formattedProject);

      setSuccessMessage("Project updated successfully");
      setSnackbarSeverity("success");
      setIsSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(handleApiError(error));
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsUpdating(false);
    }

    setProject(formattedProject);
  };

  const handleDelete = async () => {
    setIsDialogOpen(false);
    setIdDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteProject(projectId!);

      setSuccessMessage("Project deleted successfully");
      setSnackbarSeverity("success");
      setIsSnackbarOpen(true);
      setIsProjectDeleted(true);
    } catch (error) {
      console.error(error);

      setErrorMessage(handleApiError(error));
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIdDeleting(false);
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);

    if (isProjectDeleted) {
      navigate("/projects");
    }
  };

  return (
    <Box
      className={`${styles.projectContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.projectHeader}>
        Project
      </Typography>
      <ProjectNavBar projectUid={projectId!} activeLink="overview" />

      {isLoading ? (
        <Box className={styles.projectMessageBox}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          className={styles.projectForm}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={handleChangeName}
                className={styles.projectAttribute}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Description"
                variant="outlined"
                value={description}
                onChange={handleChangeDescription}
                className={styles.projectAttribute}
                multiline
                rows={4}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en"
              >
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className={styles.projectAttribute}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en"
              >
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className={styles.projectAttribute}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            justifyContent="flex-end"
            className={styles.projectFormButtons}
          >
            <Grid size={{ xs: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isFormChanged || isUpdating}
                className={styles.projectFormButton}
              >
                {isUpdating ? <CircularProgress /> : "Update"}
              </Button>
            </Grid>
            <Grid size={{ xs: 1 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={isDeleting}
                className={styles.projectFormButton}
                onClick={() => setIsDialogOpen(true)}
              >
                {isDeleting ? <CircularProgress /> : "Delete"}
              </Button>
            </Grid>
          </Grid>
          <AlertDialog
            open={isDialogOpen}
            title="Delete confirmation"
            description={`Are you sure you want to delete this project ${project.name}?`}
            handleCancel={() => setIsDialogOpen(false)}
            handleConfirm={handleDelete}
          />
        </Box>
      )}

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectPage;
