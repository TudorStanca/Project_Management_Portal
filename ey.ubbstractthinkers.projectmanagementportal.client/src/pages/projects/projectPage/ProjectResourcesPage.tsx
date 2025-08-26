import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import styles from "./ProjectResourcesPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";
import { useEffect, useMemo, useState } from "react";
import { DefaultUser, type User } from "@models/Auth";
import { DefaultProject, type Project } from "@models/Project";
import {
  addResources,
  deleteResources,
  getProject,
} from "@services/ProjectClient";
import { getUser, getUsers } from "@services/AuthClient";
import { handleApiError } from "@services/ErrorHandler";
import { AddCircleOutline } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StageStepper from "../../../components/stepper/StageStepper";
import BoxContent from "../../../components/layout/background/BoxContent";
import useSnackbar from "../../../hooks/useSnackbar";
import CustomSnackbar from "../../../components/snackbar/CustomSnackbar";
import UserAvatar from "../../../components/avatar/UserAvatar";
import AlertDialog from "../../../components/AlertDialog";

interface ProjectResourcesPageProps {
  open: boolean;
}

const ProjectResourcesPage = (props: ProjectResourcesPageProps) => {
  const { projectId } = useParams();

  const [resources, setResources] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loggedUser, setLoggedUser] = useState<User>(DefaultUser);
  const [project, setProject] = useState<Project>(DefaultProject);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  const userDictionary = useMemo(() => {
    return Object.fromEntries(users.map((x) => [x.id, x.email]));
  }, [users]);

  useEffect(() => {
    setIsLoading(true);

    const fetchAll = async () => {
      try {
        const [users, project, user] = await Promise.all([
          getUsers(),
          getProject(projectId!),
          getUser(),
        ]);

        setProject(project);
        setLoggedUser(user);

        const projectResourceIds = project.resourceIds;
        const filteredResources = users.filter((user) =>
          projectResourceIds.includes(user.id!),
        );
        setResources(filteredResources);

        const filteredUsers = users.filter(
          (user) => !projectResourceIds.includes(user.id!),
        );
        setUsers(filteredUsers);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [projectId]);

  const handleChange = (event: SelectChangeEvent<typeof selectedUserIds>) => {
    const value = event.target.value;

    setSelectedUserIds(typeof value === "string" ? value.split(",") : value);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = resources.map((resource) => resource.id!);
      setSelectedResourceIds(newSelecteds);

      return;
    }

    setSelectedResourceIds([]);
  };

  const handleClick = (id: string) => {
    setSelectedResourceIds(
      selectedResourceIds.includes(id)
        ? selectedResourceIds.filter(
            (selectedResourceId) => selectedResourceId !== id,
          )
        : [...selectedResourceIds, id],
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteResources(projectId!, selectedResourceIds);

      setResources((prevResources) =>
        prevResources.filter(
          (resource) => !selectedResourceIds.includes(resource.id!),
        ),
      );
      setUsers((prevUsers) => [
        ...prevUsers,
        ...resources.filter((resource) =>
          selectedResourceIds.includes(resource.id!),
        ),
      ]);

      showSnackbar("Resources deleted successfully", "success");
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    }

    setSelectedResourceIds([]);
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedUserIds([]);
  };

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false);
    await handleDeleteSelected();
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const handleAddUsers = async () => {
    try {
      await addResources(projectId!, selectedUserIds);

      const addedUsers = users.filter((user) =>
        selectedUserIds.includes(user.id!),
      );
      setResources((prevResources) => [...prevResources, ...addedUsers]);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUserIds.includes(user.id!)),
      );

      showSnackbar("Resources added successfully", "success");
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    }

    setSelectedUserIds([]);
    setOpenAddDialog(false);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <BoxContent
      isOpen={props.open}
      pageName={`${project.name}'s Resources`}
      className={styles.projectBoxContent}
    >
      <ProjectNavBar projectUid={projectId!} activeLink="resources" />
      {isLoading ? (
        <Box className={styles.projectsMessageBox}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StageStepper project={project} />

          <TableContainer
            component={Paper}
            className={styles.projectResourcesTableContainer}
          >
            <Box className={styles.projectResourcesButtonsBox}>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutline />}
                className={styles.projectResourcesAddButton}
                disabled={loggedUser.id !== project.ownerId}
                onClick={handleAddClick}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                className={styles.projectResourcesAddButton}
                onClick={handleDeleteClick}
                disabled={
                  selectedResourceIds.length === 0 ||
                  loggedUser.id !== project.ownerId
                }
                startIcon={<DeleteOutlineIcon className={styles.icon} />}
              >
                Delete
              </Button>
            </Box>

            <Table className={styles.projectResourcesTable}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedResourceIds.length > 0 &&
                        selectedResourceIds.length < resources.length
                      }
                      checked={
                        resources.length > 0 &&
                        selectedResourceIds.length === resources.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((resource) => (
                    <TableRow
                      key={resource.id}
                      hover
                      onClick={() => handleClick(resource.id!)}
                      role="checkbox"
                      aria-checked={selectedResourceIds.includes(resource.id!)}
                      selected={selectedResourceIds.includes(resource.id!)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedResourceIds.includes(resource.id!)}
                          onChange={() => handleClick(resource.id!)}
                        />
                      </TableCell>
                      <TableCell>
                        <UserAvatar user={resource} />
                      </TableCell>
                      <TableCell>{resource.email}</TableCell>
                      <TableCell>{resource.firstName}</TableCell>
                      <TableCell>{resource.lastName}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={resources.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}

      <Dialog open={openAddDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Resources</DialogTitle>
        <DialogContent>
          {users.length === 0 ? (
            <Typography>
              There are no more resourses available to add
            </Typography>
          ) : (
            <FormControl className={styles.formControl}>
              <InputLabel id="resources-multiple-chip-label">
                Resources
              </InputLabel>
              <Select
                labelId="resources-multiple-chip-label"
                id="resources-multiple-chip"
                multiple
                value={selectedUserIds}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    id="resources-select-multiple-chip"
                    label="Resources"
                  />
                }
                renderValue={(selected) => (
                  <Box className={styles.chip}>
                    {selected.map((userId) => (
                      <Chip key={userId} label={userDictionary[userId]} />
                    ))}
                  </Box>
                )}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id!}>
                    <Checkbox
                      checked={selectedUserIds.indexOf(user.id!) > -1}
                    />
                    <UserAvatar user={user} />
                    <Typography
                      className={styles.projectResourcesEmailTypography}
                    >
                      {user.email}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>

        <DialogActions>
          {users.length === 0 ? (
            <Button onClick={handleCloseDialog}>Ok</Button>
          ) : (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleAddUsers}
                disabled={selectedUserIds.length === 0}
              >
                Add
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <AlertDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete the selected resources?"
        open={openConfirmDialog}
        handleCancel={handleCancelDelete}
        handleConfirm={handleConfirmDelete}
      />

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </BoxContent>
  );
};

export default ProjectResourcesPage;
