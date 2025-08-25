import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import styles from "./TemplatesPage.module.css";
import { useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@services/ErrorHandler";
import { getTemplates } from "@services/TemplateClient";
import type { Template } from "@models/Template";
import { truncateDescription } from "../../utils/StringFunctions";
import BoxContent from "../../components/layout/background/BoxContent";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";

interface TemplatesPageProps {
  open: boolean;
}

const TemplatesPage = (props: TemplatesPageProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  useEffect(() => {
    setIsLoading(true);

    const fetchTemplates = async () => {
      try {
        const templates = await getTemplates();

        setTemplates(templates);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <BoxContent isOpen={props.open} pageName="Templates">
      {isLoading ? (
        <Box className={styles.templatesMessageBox}>
          <CircularProgress />
        </Box>
      ) : templates.length === 0 ? (
        <Box className={styles.templatesMessageBox}>
          <Typography variant="h4" className={styles.projectsMessageTypography}>
            No templates to show
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          size={{ xs: 12, sm: 6, md: 3 }}
          spacing={3}
          className={styles.templatesList}
        >
          {templates.map((template) => (
            <div className={styles.templatesCardWrapper} key={template.uid}>
              <div className={styles.templatesCardGlowWrapper}>
                <Card
                  className={styles.templatesCard}
                  onClick={() => navigate(`/templates/${template.uid}`)}
                >
                  <CardContent className={styles.templatesCardContent}>
                    <Typography
                      variant="h5"
                      className={styles.templatesCardHeader}
                    >
                      {template.name}
                    </Typography>
                    <hr className={styles.templatesCardBreakLine} />
                    <Box className={styles.templatesCardBoxContent}>
                      <Typography variant="body2">
                        About:{" "}
                        {template.description && template.description.length > 0
                          ? truncateDescription(template.description)
                          : "Nothing to show"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </Grid>
      )}
      <Button
        variant="outlined"
        startIcon={<AddCircleOutline className={styles.projectsAddIcon} />}
        className={styles.projectsAddButton}
        onClick={() => navigate("/add-template")}
      >
        Add
      </Button>

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </BoxContent>
  );
};

export default TemplatesPage;
