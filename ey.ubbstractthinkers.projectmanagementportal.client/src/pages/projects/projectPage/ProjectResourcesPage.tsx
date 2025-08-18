import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import styles from "./ProjectResourcesPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";
import { useEffect, useState } from "react";
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
import LetterAvatar from "../../../components/avatar/LetterAvatar";
import DeleteIcon from "@mui/icons-material/Delete";
import StageStepper from "../../../components/stepper/StageStepper";
import BoxContent from "../../../components/layout/background/BoxContent";
import useSnackbar from "../../../hooks/useSnackbar";
import CustomSnackbar from "../../../components/snackbar/CustomSnackbar";

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
        console.error(error);

        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [projectId]);

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
      console.error(error);

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
      console.error(error);

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
                color="primary"
                onClick={handleDeleteClick}
                disabled={
                  selectedResourceIds.length === 0 ||
                  loggedUser.id !== project.ownerId
                }
                startIcon={<DeleteIcon />}
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
                        {resource.photo ? (
                          <Avatar
                            alt={resource.firstName + " " + resource.lastName}
                            src={`user.photo instanceof Blob ? URL.createObjectURL(user.photo) : undefined`}
                          />
                        ) : (
                          <LetterAvatar
                            firstName={resource.firstName!}
                            lastName={resource.lastName!}
                          />
                        )}
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
          {users.map((user) => (
            <Box
              key={user.id}
              display="flex"
              alignItems="center"
              className={styles.projectResourcesDialogBox}
            >
              <Checkbox
                checked={selectedUserIds.indexOf(user.id!) > -1}
                onChange={() => {
                  setSelectedUserIds((prev) =>
                    prev.includes(user.id!)
                      ? prev.filter((id) => id !== user.id)
                      : [...prev, user.id!],
                  );
                }}
              />
              <div className={styles.projectResourcesAvatarDiv}>
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
              <Typography className={styles.projectResourcesEmailTypography}>
                {user.email}
              </Typography>
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddUsers} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the selected resources?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
