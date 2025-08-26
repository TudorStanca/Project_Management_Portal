import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./AddProjectPage.module.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { saveProject } from "@services/ProjectClient";
import { handleApiError } from "@services/ErrorHandler";
import type { Project } from "@models/Project";
import type { User } from "@models/Auth";
import { getUser, getUsers } from "@services/AuthClient";
import type { Template } from "@models/Template";
import { getTemplates } from "@services/TemplateClient";
import { useNavigate } from "react-router-dom";
import BoxContent from "../../components/layout/background/BoxContent";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";
import UserAvatar from "../../components/avatar/UserAvatar";
import { AddCircleOutline } from "@mui/icons-material";

interface ProjectFormProps {
  open: boolean;
}

const AddProjectPage = (props: ProjectFormProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [ownerId, setOwnerId] = useState<string>("");
  const [templateUid, setTemplateUid] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    setOwnerId(event.target.value);
  };

  const handleTemplateChange = (event: SelectChangeEvent) => {
    setTemplateUid(event.target.value);
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!startDate) {
      showSnackbar("Start Date is required.", "error");

      return;
    }

    const formattedProject: Project = {
      name,
      description,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      ownerId: ownerId,
      stakeholderIds: [],
      resourceIds: [],
      templateUid,
    };

    setIsSaving(true);

    try {
      await saveProject(formattedProject);

      showSnackbar("Project added successfully", "success");
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    } finally {
      setIsSaving(false);
    }

    setName("");
    setDescription("");
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [users, loggedUser, templates] = await Promise.all([
          getUsers(),
          getUser(),
          getTemplates(),
        ]);

        setUsers(users);
        setOwnerId(loggedUser.id!);
        setTemplates(templates);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BoxContent isOpen={props.open} pageName="Add Project">
      {isLoading ? (
        <Box className={styles.addProjectMessageBox}>
          <CircularProgress />
        </Box>
      ) : templates.length === 0 ? (
        <Box className={styles.addProjectNoTemplateBox}>
          <Typography
            variant="h4"
            className={styles.addProjectMessageTypography}
          >
            There are no templates available, add one.
          </Typography>
          <Button
            variant="outlined"
            className={styles.button}
            startIcon={<AddCircleOutline className={styles.icon} />}
            onClick={() => navigate("/add-template")}
          >
            Add Template
          </Button>
        </Box>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              className={styles.addProjectGridContainer}
            >
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={name}
                  onChange={handleChangeName}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={description}
                  onChange={handleChangeDescription}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid
                container
                spacing={2}
                className={styles.addProjectGridDateContainer}
              >
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en"
                  >
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
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
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <FormControl required>
                <InputLabel id="owner_select_label">Project Owner</InputLabel>
                <Select
                  labelId="owner_select_label"
                  id="owner_select"
                  value={ownerId}
                  label="Project Owner"
                  onChange={handleChange}
                  className={styles.addProjectOwnerSelect}
                >
                  {users.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id!}
                      className={styles.addProjectOwnerSelectMenuItem}
                    >
                      <UserAvatar user={user} />
                      <span className={styles.addProjectSpanEmail}>
                        {user.email}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl required>
                <InputLabel id="template_select_label">
                  Project Template
                </InputLabel>
                <Select
                  labelId="template_select_label"
                  id="template_select"
                  value={templateUid}
                  label="Template Owner"
                  onChange={handleTemplateChange}
                  className={styles.addProjectTemplateSelect}
                >
                  {templates.map((template) => (
                    <MenuItem
                      key={template.uid}
                      value={template.uid!}
                      className={styles.addProjectTemplateSelectMenuItem}
                    >
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid size={{ xs: 12 }} container>
                <Grid size={{ xs: 1 }}>
                  <Button
                    variant="outlined"
                    type="submit"
                    disabled={isSaving}
                    className={styles.button}
                    startIcon={<AddCircleOutline className={styles.icon} />}
                  >
                    {isSaving ? <CircularProgress /> : "Save"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>

          <CustomSnackbar
            isOpen={isSnackbarOpen}
            message={message}
            snackbarSeverity={snackbarSeverity}
            handleSnackbarClose={handleSnackbarClose}
          />
        </>
      )}
    </BoxContent>
  );
};

export default AddProjectPage;
