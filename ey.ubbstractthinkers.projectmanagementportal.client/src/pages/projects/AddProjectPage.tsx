import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./AddProjectPage.module.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { saveProject } from "../../services/ProjectClient";
import { handleApiError } from "../../services/ErrorHandler";
import type { Project } from "../../models/Project";
import type { SnackbarSeverity } from "../../models/SnackbarSeverity";
import type { User } from "../../models/Auth";
import { getUsers } from "../../services/AuthClient";
import LetterAvatar from "../../components/avatar/LetterAvatar";

interface ProjectFormProps {
  open: boolean;
}

const AddProjectPage = (props: ProjectFormProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [ownerId, setOwnerId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const handleChange = (event: SelectChangeEvent) => {
    setOwnerId(event.target.value);
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
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!startDate) {
      setIsLoading(false);
      setErrorMessage("Start Date is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      return;
    }

    const formattedProject: Project = {
      name,
      description,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      ownerId: ownerId;
    };

    try {
      await saveProject(formattedProject);

      setSuccessMessage("Project added successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);

      setErrorMessage(handleApiError(error));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }

    setName("");
    setDescription("");
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users: User[] = await getUsers();

        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      className={`${styles.addProjectContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.addProjectHeader}>
        Add Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} className={styles.addProjectGridContainer}>
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
              sx={{ minWidth: 170 }}
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id ?? ""}
                  sx={{ minWidth: 250, display: "flex" }}
                >
                  <div className={styles.addProjectAvatarDiv}>
                    {user.photo ? (
                      <Avatar
                        alt={user.firstName + " " + user.lastName}
                        src={`user.photo instanceof Blob ? URL.createObjectURL(user.photo) : undefined`}
                      />
                    ) : (
                      <LetterAvatar
                        firstName={user.firstName ? user.firstName : ""}
                        lastName={user.lastName ? user.lastName : ""}
                      />
                    )}
                  </div>
                  <span className={styles.addProjectSpanEmail}>
                    {user.email}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid size={{ xs: 12, sm: 6 }} justifyContent="flex-start">
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              className={styles.addProjectSubmitButton}
            >
              {isLoading ? <CircularProgress /> : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbarOpen}
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

export default AddProjectPage;
