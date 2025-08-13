import {
  Alert,
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
  Snackbar,
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
import styles from "./ProjectStakeholdersPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";
import { DefaultUser, type User } from "@models/Auth";
import { useEffect, useState } from "react";
import { DefaultProject, type Project } from "@models/Project";
import { getUser, getUsers } from "@services/AuthClient";
import type { SnackbarSeverity } from "@models/SnackbarSeverity";
import { handleApiError } from "@services/ErrorHandler";
import {
  addStakeholders,
  deleteStakeholders,
  getProject,
} from "@services/ProjectClient";
import LetterAvatar from "../../../components/avatar/LetterAvatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddCircleOutline } from "@mui/icons-material";
import StageStepper from "../../../components/stepper/StageStepper";

interface ProjectStakeholdersPageProps {
  open: boolean;
}

const ProjectStakeholdersPage = (props: ProjectStakeholdersPageProps) => {
  const { projectId } = useParams();

  const [stakeholders, setStakeholders] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loggedUser, setLoggedUser] = useState<User>(DefaultUser);
  const [project, setProject] = useState<Project>(DefaultProject);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedStakeholderIds, setSelectedStakeholderIds] = useState<
    string[]
  >([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
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

        const projectStakeholderIds = project.stakeholderIds;
        const filteredStakeholders = users.filter((user) =>
          projectStakeholderIds.includes(user.id!),
        );
        setStakeholders(filteredStakeholders);

        const filteredUsers = users.filter(
          (user) =>
            !projectStakeholderIds.includes(user.id!) &&
            user.id != project.ownerId,
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error(error);

        setErrorMessage(handleApiError(error));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [projectId]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = stakeholders.map((stakeholder) => stakeholder.id!);
      setSelectedStakeholderIds(newSelecteds);

      return;
    }

    setSelectedStakeholderIds([]);
  };

  const handleClick = (id: string) => {
    setSelectedStakeholderIds(
      selectedStakeholderIds.includes(id)
        ? selectedStakeholderIds.filter(
            (selectedStakeholderId) => selectedStakeholderId !== id,
          )
        : [...selectedStakeholderIds, id],
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteStakeholders(projectId!, selectedStakeholderIds);

      setSuccessMessage("Stakeholders deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setStakeholders((prevStakeholders) =>
        prevStakeholders.filter(
          (stakeholder) => !selectedStakeholderIds.includes(stakeholder.id!),
        ),
      );
      setUsers((prevUsers) => [
        ...prevUsers,
        ...stakeholders.filter((stakeholder) =>
          selectedStakeholderIds.includes(stakeholder.id!),
        ),
      ]);
    } catch (error) {
      console.error(error);

      setErrorMessage(handleApiError(error));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setSelectedStakeholderIds([]);
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
      await addStakeholders(projectId!, selectedUserIds);

      setSuccessMessage("Stakeholders added successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      const addedUsers = users.filter((user) =>
        selectedUserIds.includes(user.id!),
      );
      setStakeholders((prevStakeholders) => [
        ...prevStakeholders,
        ...addedUsers,
      ]);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUserIds.includes(user.id!)),
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(handleApiError(error));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
    <Box
      className={`${styles.projectStakeholdersContent} ${props.open ? styles.open : ""}`}
    >
      <Typography variant="h2" className={styles.projectStakeholdersHeader}>
        Stakeholders
      </Typography>
      <ProjectNavBar projectUid={projectId!} activeLink="stakeholders" />
      {isLoading ? (
        <Box className={styles.projectsMessageBox}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StageStepper project={project} />

          <TableContainer
            component={Paper}
            className={styles.projectStakeholdersTableContainer}
          >
            <Box className={styles.projectStakeholdersButtonsBox}>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutline />}
                className={styles.projectStakeholdersAddButton}
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
                  selectedStakeholderIds.length === 0 ||
                  loggedUser.id !== project.ownerId
                }
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>

            <Table className={styles.projectStakeholdersTable}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedStakeholderIds.length > 0 &&
                        selectedStakeholderIds.length < stakeholders.length
                      }
                      checked={
                        stakeholders.length > 0 &&
                        selectedStakeholderIds.length === stakeholders.length
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
                {stakeholders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((stakeholder) => (
                    <TableRow
                      key={stakeholder.id}
                      hover
                      onClick={() => handleClick(stakeholder.id!)}
                      role="checkbox"
                      aria-checked={selectedStakeholderIds.includes(
                        stakeholder.id!,
                      )}
                      selected={selectedStakeholderIds.includes(
                        stakeholder.id!,
                      )}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedStakeholderIds.includes(
                            stakeholder.id!,
                          )}
                          onChange={() => handleClick(stakeholder.id!)}
                        />
                      </TableCell>
                      <TableCell>
                        {stakeholder.photo ? (
                          <Avatar
                            alt={
                              stakeholder.firstName + " " + stakeholder.lastName
                            }
                            src={`user.photo instanceof Blob ? URL.createObjectURL(user.photo) : undefined`}
                          />
                        ) : (
                          <LetterAvatar
                            firstName={stakeholder.firstName!}
                            lastName={stakeholder.lastName!}
                          />
                        )}
                      </TableCell>
                      <TableCell>{stakeholder.email}</TableCell>
                      <TableCell>{stakeholder.firstName}</TableCell>
                      <TableCell>{stakeholder.lastName}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={stakeholders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}
      <Dialog open={openAddDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Stakeholders</DialogTitle>
        <DialogContent>
          {users.map((user) => (
            <Box
              key={user.id}
              display="flex"
              alignItems="center"
              className={styles.projectStakeholdersDialogBox}
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
              <div className={styles.projectStakeholdersAvatarDiv}>
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
              <Typography className={styles.projectStakeholdersEmailTypography}>
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
            Are you sure you want to delete the selected stakeholders?
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

export default ProjectStakeholdersPage;
