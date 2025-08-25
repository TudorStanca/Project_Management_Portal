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
import styles from "./ProjectStakeholdersPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";
import { DefaultUser, type User } from "@models/Auth";
import { useEffect, useMemo, useState } from "react";
import { DefaultProject, type Project } from "@models/Project";
import { getUser, getUsers } from "@services/AuthClient";
import { handleApiError } from "@services/ErrorHandler";
import {
  addStakeholders,
  deleteStakeholders,
  getProject,
} from "@services/ProjectClient";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddCircleOutline } from "@mui/icons-material";
import StageStepper from "../../../components/stepper/StageStepper";
import BoxContent from "../../../components/layout/background/BoxContent";
import useSnackbar from "../../../hooks/useSnackbar";
import CustomSnackbar from "../../../components/snackbar/CustomSnackbar";
import UserAvatar from "../../../components/avatar/UserAvatar";
import AlertDialog from "../../../components/AlertDialog";

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

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedStakeholderIds, setSelectedStakeholderIds] = useState<
    string[]
  >([]);
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

      showSnackbar("Stakeholders deleted successfully", "success");
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
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

      showSnackbar("Stakeholders added successfully", "success");
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
      pageName={`${project.name}'s Stakeholders`}
      className={styles.projectBoxContent}
    >
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
                        <UserAvatar user={stakeholder} />
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
          {users.length === 0 ? (
            <Typography>
              There are no more stakeholders available to add
            </Typography>
          ) : (
            <FormControl className={styles.formControl}>
              <InputLabel id="stakeholders-multiple-chip-label">
                Stakeholders
              </InputLabel>
              <Select
                labelId="stakeholders-multiple-chip-label"
                id="stakeholders-multiple-chip"
                multiple
                value={selectedUserIds}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    id="stakeholders-select-multiple-chip"
                    label="Stakeholders"
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
                      className={styles.projectStakeholdersEmailTypography}
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
            <Button onClick={handleCloseDialog} color="primary">
              Ok
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleAddUsers}
                color="primary"
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
        description="Are you sure you want to delete the selected stakeholders?"
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

export default ProjectStakeholdersPage;
