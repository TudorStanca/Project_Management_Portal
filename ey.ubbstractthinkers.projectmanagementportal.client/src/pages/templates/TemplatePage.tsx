import {
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
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import styles from "./TemplatePage.module.css";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Stage } from "@models/Stage";
import { getStages } from "@services/StageClient";
import { handleApiError } from "@services/ErrorHandler";
import { ExecuteStageName } from "../../utils/AppConstants";
import type { Template } from "@models/Template";
import {
  getTemplate,
  saveTemplate,
  updateTemplate,
} from "@services/TemplateClient";
import { useParams } from "react-router-dom";
import BoxContent from "../../components/layout/background/BoxContent";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";

interface TemplatePageProps {
  open: boolean;
}

const TemplatePage = (props: TemplatePageProps) => {
  const [stages, setStages] = useState<Stage[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stageUids, setStageUids] = useState<string[]>([]);
  const { templateId } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const stageDictionary = useMemo(() => {
    return Object.fromEntries(stages.map((x) => [x.uid, x.name]));
  }, [stages]);

  useEffect(() => {
    setIsLoading(true);

    const fetchAll = async () => {
      try {
        const stages = await getStages();

        const executeStage = stages.find((x) => x.name === ExecuteStageName);
        setStageUids([executeStage!.uid]);

        setStages(stages);

        if (templateId) {
          const template = await getTemplate(templateId);

          setName(template.name);
          setDescription(template.description);
          setStageUids(template.stageUids);
        }
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [templateId]);

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

    if (stageUids.length === 0) {
      showSnackbar("Stages can't be empty.", "error");

      return;
    }

    const formatedTemplate: Template = {
      name,
      description,
      stageUids,
    };

    setIsSaving(true);

    try {
      if (templateId) {
        await updateTemplate(templateId, formatedTemplate);
        showSnackbar("Template updated successfully.", "success");
      } else {
        await saveTemplate(formatedTemplate);
        showSnackbar("Template added successfully.", "success");
      }
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BoxContent isOpen={props.open} pageName="Template">
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

export default TemplatePage;
