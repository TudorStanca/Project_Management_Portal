import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProjectPage.module.css";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  deleteProject,
  hasPendingApprovalRequestOpen,
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
import StageStepper from "../../../components/stepper/StageStepper";
import { DefaultUser, type User } from "@models/Auth";
import { getUser } from "@services/AuthClient";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { advanceToNextStage } from "@services/ProjectClient";
import { DefaultTemplate, type Template } from "@models/Template";
import { getTemplate } from "@services/TemplateClient";
import BoxContent from "../../../components/layout/background/BoxContent";
import useSnackbar from "../../../hooks/useSnackbar";
import CustomSnackbar from "../../../components/snackbar/CustomSnackbar";
import type { CustomField } from "@models/CustomField";
import {
  getCustomFieldsByProjectId,
  saveCustomFieldValue,
} from "@services/CustomFieldClient";
import { getCustomFieldTypeFromValue, Text } from "@models/CustomFieldType";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
  const [isPendingRequestOpen, setIsPendingRequestOpen] =
    useState<boolean>(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const [loggedUser, setLoggedUser] = useState<User>(DefaultUser);

  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [project, setProject] = useState<Project>(DefaultProject);
  const [template, setTemplate] = useState<Template>(DefaultTemplate);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldEdits, setCustomFieldEdits] = useState<
    { customFieldId: string; value: unknown }[]
  >([]);

  const { projectId } = useParams();

  const isCustomFieldChanged = customFieldEdits.length > 0;

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

  const handleProjectSnackbarClose = () => {
    handleSnackbarClose();

    if (isProjectDeleted) {
      navigate("/projects");
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchProject = async () => {
      try {
        const [project, user, isOpen, fields] = await Promise.all([
          getProject(projectId!),
          getUser(),
          hasPendingApprovalRequestOpen(projectId!),
          getCustomFieldsByProjectId(projectId!),
        ]);

        setProject(project);
        setLoggedUser(user);
        setIsPendingRequestOpen(isOpen);
        setCustomFields(fields);

        const template = await getTemplate(project.templateUid);
        setTemplate(template);

        setName(project.name);
        setDescription(project.description);
        setStartDate(convertToDayjsOrNull(project.startDate));
        setEndDate(convertToDayjsOrNull(project.endDate));
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleCustomFieldChange = (fieldId: string, value: unknown) => {
    setCustomFieldEdits((prev) =>
      prev.find((f) => f.customFieldId === fieldId)
        ? prev.map((f) => (f.customFieldId === fieldId ? { ...f, value } : f))
        : [...prev, { customFieldId: fieldId, value }],
    );

    setCustomFields((prev) =>
      prev.map((f) =>
        f.uid === fieldId
          ? {
              ...f,
              customFieldValue: {
                projectId: projectId!,
                customFieldId: fieldId,
                value,
              },
            }
          : f,
      ),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!startDate) {
      showSnackbar(handleApiError("Start Date is required."), "error");

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

      if (isCustomFieldChanged) {
        await saveCustomFieldValue(
          projectId!,
          customFieldEdits.map((f) => ({
            projectId: projectId!,
            customFieldId: f.customFieldId,
            value: f.value,
          })),
        );
      }

      showSnackbar("Project updated successfully", "success");

      setCustomFieldEdits([]);
      setProject(formattedProject);
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDialogOpen(false);
    setIdDeleting(true);

    try {
      await deleteProject(projectId!);

      showSnackbar("Project deleted successfully", "success");
      setIsProjectDeleted(true);
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    } finally {
      setIdDeleting(false);
    }
  };

  const handleAdvanceToNextStage = async () => {
    try {
      await advanceToNextStage(projectId!);

      showSnackbar("Approval Request was sent successfuly", "success");
      setIsPendingRequestOpen(true);
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    }
  };

  return (
    <BoxContent
      isOpen={props.open}
      pageName={project.name}
      className={styles.projectBoxContent}
    >
      <ProjectNavBar projectUid={projectId!} activeLink="overview" />

      {isLoading ? (
        <Box className={styles.projectMessageBox}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StageStepper project={project} />

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

              {customFields.map((field) => (
                <Grid key={field.uid} size={{ xs: 16, sm: 6 }}>
                  {getCustomFieldTypeFromValue(Number(field.type)) === Text ? (
                    <TextField
                      label={field.name}
                      variant="outlined"
                      value={field.customFieldValue?.value ?? ""}
                      multiline
                      rows={4}
                      className={styles.projectAttribute}
                      onChange={(e) =>
                        handleCustomFieldChange(field.uid!, e.target.value)
                      }
                    />
                  ) : (
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="en"
                    >
                      <DatePicker
                        label={field.name}
                        value={
                          field.customFieldValue?.value
                            ? dayjs(field.customFieldValue.value as string)
                            : null
                        }
                        onChange={(date) =>
                          handleCustomFieldChange(
                            field.uid!,
                            date ? date.format("YYYY-MM-DD") : null,
                          )
                        }
                        className={styles.projectAttribute}
                      />
                    </LocalizationProvider>
                  )}
                </Grid>
              ))}
            </Grid>

            <Box className={styles.projectButtonsBox}>
              <Grid className={styles.projectAdvancePageButtonGrid}>
                <Button
                  variant="outlined"
                  disabled={
                    loggedUser.id !== project.ownerId ||
                    isPendingRequestOpen ||
                    project.currentStageUid ===
                      template.stageUids.at(template.stageUids.length - 1)
                  }
                  className={styles.projectFormButton}
                  startIcon={<ArrowForwardIosIcon className={styles.icon} />}
                  onClick={handleAdvanceToNextStage}
                >
                  Advance Stage
                </Button>
              </Grid>
              <Grid
                container
                spacing={1}
                justifyContent="flex-end"
                className={styles.projectFormButtons}
              >
                <Grid size={{ xs: 6 }}>
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={
                      (!isFormChanged && !isCustomFieldChanged) || isUpdating
                    }
                    startIcon={<UpdateOutlinedIcon className={styles.icon} />}
                    className={styles.projectFormButton}
                  >
                    {isUpdating ? <CircularProgress /> : "Update"}
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    disabled={isDeleting}
                    startIcon={<DeleteOutlineIcon className={styles.icon} />}
                    className={styles.projectFormButton}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    {isDeleting ? <CircularProgress /> : "Delete"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <AlertDialog
              open={isDialogOpen}
              title="Delete confirmation"
              description={`Are you sure you want to delete this project ${project.name}?`}
              handleCancel={() => setIsDialogOpen(false)}
              handleConfirm={handleDelete}
            />
          </Box>
        </>
      )}

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleProjectSnackbarClose}
      />
    </BoxContent>
  );
};

export default ProjectPage;
