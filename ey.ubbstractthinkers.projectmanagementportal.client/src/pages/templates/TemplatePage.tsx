import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
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
import type { CustomField } from "@models/CustomField";
import {
  deleteCustomField,
  getCustomFieldsByTemplateId,
  saveCustomField,
} from "@services/CustomFieldClient";
import {
  Date,
  getCustomFieldTypeFromValue,
  getCustomFieldTypeValue,
  Text,
  type CustomFieldType,
} from "@models/CustomFieldType";
import AlertDialog from "../../components/AlertDialog";

interface TemplatePageProps {
  open: boolean;
}

const TemplatePage = (props: TemplatePageProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [templateStages, setTemplateStages] = useState<Stage[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stageUids, setStageUids] = useState<string[]>([]);
  const { templateId } = useParams();

  const [newFieldName, setNewFieldName] = useState<string>("");
  const [newFieldDescription, setNewFieldDescription] = useState<string>("");
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>(Text);
  const [newFieldVisibleOn, setNewFieldVisibleOn] = useState<string[]>([]);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null); // New state for the field to delete

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

          const templateStages = stages.filter((stage) =>
            template.stageUids.includes(stage.uid),
          );
          setTemplateStages(templateStages);

          const fields = await getCustomFieldsByTemplateId(templateId);
          setCustomFields(fields);
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

  const handleAddCustomField = async (e: FormEvent) => {
    e.preventDefault();

    const newCustomField: CustomField = {
      name: newFieldName,
      description: newFieldDescription,
      type: getCustomFieldTypeValue(newFieldType),
      templateId: templateId!,
      visibleOnStageIds: newFieldVisibleOn,
      customFieldValue: null,
    };

    try {
      await saveCustomField(newCustomField);

      setCustomFields([...customFields, newCustomField]);
      showSnackbar("Custom field added successfuly", "success");
      setNewFieldName("");
      setNewFieldDescription("");
      setNewFieldType(Text);
      setNewFieldVisibleOn([]);
    } catch (error) {
      console.error(error);

      showSnackbar(handleApiError(error), "error");
    }
  };

  const handleDeleteCustomFields = async () => {
    setIsDialogOpen(false);

    try {
      await deleteCustomField(fieldToDelete!);

      setCustomFields(
        customFields.filter((customField) => customField.uid !== fieldToDelete),
      );
      showSnackbar("Custom field deleted successfuly", "success");
    } catch (error) {
      console.error(error);

      showSnackbar(handleApiError(error), "error");
    }
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
        const templateStages = stages.filter((stage) =>
          stageUids.includes(stage.uid),
        );
        setTemplateStages(templateStages);

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
          {templateId && (
            <Box className={styles.customFieldsContainer}>
              <Typography
                variant="h5"
                gutterBottom
                className={styles.customFieldsTypography}
              >
                Custom Fields
              </Typography>
              <Grid container spacing={2}>
                {customFields.map((field) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field.uid!}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 2, boxShadow: 1 }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {field.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {field.description || "No Description"}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption">
                          Type:{" "}
                          <strong>
                            {getCustomFieldTypeFromValue(Number(field.type))}
                          </strong>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setFieldToDelete(field.uid!);
                            setIsDialogOpen(true);
                          }}
                          disabled={!field.uid}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                    <AlertDialog
                      open={isDialogOpen}
                      title="Delete confirmation"
                      description={`Are you sure you want to delete this custom field?`}
                      handleCancel={() => {
                        setIsDialogOpen(false);
                        setFieldToDelete(null);
                      }}
                      handleConfirm={() => handleDeleteCustomFields()}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box
                component="form"
                onSubmit={handleAddCustomField}
                className={styles.addCustomFieldForm}
              >
                <Typography variant="h6" gutterBottom>
                  Add New Field
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Field Name"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Field Description"
                      value={newFieldDescription}
                      onChange={(e) => setNewFieldDescription(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel id="field-type-label">Field Type</InputLabel>
                      <Select
                        labelId="field-type-label"
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                      >
                        <MenuItem value={Text}>Text</MenuItem>
                        <MenuItem value={Date}>Date</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl
                      className={styles.addTemplateMultipleSelect}
                      fullWidth
                    >
                      <InputLabel id="visible-on-label">
                        Visible On Stages
                      </InputLabel>
                      <Select
                        labelId="visible-on-label"
                        multiple
                        value={newFieldVisibleOn}
                        onChange={(event) => {
                          const value = event.target.value;
                          setNewFieldVisibleOn(
                            typeof value === "string"
                              ? value.split(",")
                              : value,
                          );
                        }}
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
                        {templateStages.map((stage) => (
                          <MenuItem key={stage.uid} value={stage.uid}>
                            {stage.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button variant="contained" type="submit" color="primary">
                      Add Field
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
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
