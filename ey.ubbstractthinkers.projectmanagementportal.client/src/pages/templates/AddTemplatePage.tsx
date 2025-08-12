import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import styles from "./AddTemplatePage.module.css";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { SnackbarSeverity } from "@models/SnackbarSeverity";
import type { Stage } from "@models/Stage";
import { getStages } from "@services/StageClient";
import { handleApiError } from "@services/ErrorHandler";
import { ExecuteStageName } from "../../utils/AppConstants";
import type { Template } from "@models/Template";
import { saveTemplate } from "@services/TemplateClient";

interface AddTemplatePageProps {
  open: boolean;
}

const AddTemplatePage = (props: AddTemplatePageProps) => {
  const [stages, setStages] = useState<Stage[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stageUids, setStageUids] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const stageDictionary = useMemo(() => {
    return Object.fromEntries(stages.map((x) => [x.uid, x.name]));
  }, [stages]);

  useEffect(() => {
    setIsLoading(true);

    const fetchStages = async () => {
      try {
        const stages = await getStages();

        const executeStage = stages.find((x) => x.name === ExecuteStageName);
        setStageUids([executeStage!.uid]);

        setStages(stages);
      } catch (error) {
        setErrorMessage(handleApiError(error));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStages();
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof stageUids>) => {
    const value = event.target.value;

    setStageUids(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (stageUids.length === 0) {
      setErrorMessage("Stages can't be empty.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      return;
    }

    const formatedTemplate: Template = {
      name,
      description,
      stageUids,
    };

    setIsSaving(true);

    try {
      await saveTemplate(formatedTemplate);

      setSuccessMessage("Template added successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(handleApiError(error));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      className={`${styles.addTemplateContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.addTemplateHeader}>
        Add Template
      </Typography>
      {isLoading ? (
        <Box className={styles.templateMessageBox}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            component="form"
            onSubmit={handleSubmit}
            className={styles.addTemplateForm}
          >
            <Grid container spacing={2}>
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
              <FormControl className={styles.addTemplateMultipleSelect}>
                <InputLabel id="stages-multiple-chip-label">Stages</InputLabel>
                <Select
                  labelId="stages-multiple-chip-label"
                  id="stages-multiple-chip"
                  multiple
                  value={stageUids}
                  onChange={handleChange}
                  input={
                    <OutlinedInput
                      id="stages-select-multiple-chip"
                      label="Stages"
                    />
                  }
                  renderValue={(selected) => (
                    <Box className={styles.addTemplateChip}>
                      {selected.map((stageUid) => (
                        <Chip
                          key={stageUid}
                          label={stageDictionary[stageUid]}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {stages.map((stage) => (
                    <MenuItem
                      key={stage.uid}
                      value={stage.uid}
                      disabled={stage.name === ExecuteStageName}
                    >
                      {stage.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={isSaving}
                  className={styles.addTemplateSubmitButton}
                >
                  {isSaving ? <CircularProgress /> : "Save"}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {successMessage || errorMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default AddTemplatePage;
