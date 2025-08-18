import type { ApprovalRequest } from "@models/ApprovalRequest";
import {
  Box,
  Button,
  CircularProgress,
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
import {
  getApprovalRequestsForUser,
  updateApprovalRequests,
} from "@services/ApprovalClient";
import { getUser } from "@services/AuthClient";
import { handleApiError } from "@services/ErrorHandler";
import { useEffect, useMemo, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ApprovalsPage.module.css";
import {
  Approved,
  getApprovalStatusFromValue,
  Pending,
  Rejected,
} from "@models/ApprovalStatus";
import BoxContent from "../../components/layout/background/BoxContent";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";

interface ApprovalsPageProps {
  open: boolean;
}

const ApprovalsPage = (props: ApprovalsPageProps) => {
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const pendingApprovalRequests = useMemo(() => {
    return approvalRequests.filter(
      (approvalRequest) =>
        getApprovalStatusFromValue(Number(approvalRequest.status)) === Pending,
    );
  }, [approvalRequests]);

  const finishedApprovalRequests = useMemo(() => {
    return approvalRequests.filter(
      (approvalRequest) =>
        getApprovalStatusFromValue(Number(approvalRequest.status)) !== Pending,
    );
  }, [approvalRequests]);

  useEffect(() => {
    setIsLoading(true);

    const fetchAll = async () => {
      try {
        const fetchedUser = await getUser();
        const fetchedApprovalRequests = await getApprovalRequestsForUser(
          fetchedUser.id!,
        );

        setApprovalRequests(fetchedApprovalRequests);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleApproveClick = async (uid: string) => {
    try {
      await updateApprovalRequests(uid, Approved);

      setApprovalRequests(
        approvalRequests.filter(
          (approvalRequest) => approvalRequest.uid !== uid,
        ),
      );
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    }
  };

  const handleRejectClick = async (uid: string) => {
    try {
      await updateApprovalRequests(uid, Rejected);

      setApprovalRequests(
        approvalRequests.filter(
          (approvalRequest) => approvalRequest.uid !== uid,
        ),
      );
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    }
  };

  const formatFriendlyDate = (isoDate: Date | null) => {
    if (isoDate == null) {
      return "";
    }

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <BoxContent isOpen={props.open} pageName="Approvals">
      {isLoading ? (
        <Box className={styles.approvalsMessageBox}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className={styles.approvalsSection}>
            <Typography variant="h4" className={styles.approvalsTitle}>
              Pending Approval Requests
            </Typography>
            {pendingApprovalRequests.length === 0 ? (
              <Box className={styles.approvalsMessageBox}>
                <Typography variant="h4">
                  No pending approvals requests to show
                </Typography>
              </Box>
            ) : (
              <TableContainer
                component={Paper}
                className={styles.approvalsTable}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Name</TableCell>
                      <TableCell>Stage From</TableCell>
                      <TableCell>Stage To</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingApprovalRequests
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((request) => (
                        <TableRow key={request.uid}>
                          <TableCell>{request.projectName}</TableCell>
                          <TableCell>{request.stageFromName}</TableCell>
                          <TableCell>{request.stageToName}</TableCell>
                          <TableCell>
                            {formatFriendlyDate(request.createdAt)}
                          </TableCell>
                          <TableCell>{request.createdByUserEmail}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleApproveClick(request.uid)}
                              startIcon={<CheckIcon />}
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleRejectClick(request.uid)}
                              startIcon={<CloseIcon />}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={pendingApprovalRequests.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </div>

          <div className={styles.approvalsSection}>
            <Typography variant="h4" className={styles.approvalsTitle}>
              Finished Approval Requests
            </Typography>
            {finishedApprovalRequests.length === 0 ? (
              <Box className={styles.approvalsMessageBox}>
                <Typography variant="h4">
                  No finished approvals requests to show
                </Typography>
              </Box>
            ) : (
              <TableContainer
                component={Paper}
                className={styles.approvalsTable}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Name</TableCell>
                      <TableCell>Stage From</TableCell>
                      <TableCell>Stage To</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Modified At</TableCell>
                      <TableCell>Modified By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {finishedApprovalRequests
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((request) => (
                        <TableRow key={request.uid}>
                          <TableCell>{request.projectName}</TableCell>
                          <TableCell>{request.stageFromName}</TableCell>
                          <TableCell>{request.stageToName}</TableCell>
                          <TableCell>
                            {getApprovalStatusFromValue(Number(request.status))}
                          </TableCell>
                          <TableCell>
                            {formatFriendlyDate(request.createdAt)}
                          </TableCell>
                          <TableCell>
                            {formatFriendlyDate(request.modifiedAt)}
                          </TableCell>
                          <TableCell>{request.modifiedByUserEmail}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={finishedApprovalRequests.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </div>
        </>
      )}

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </BoxContent>
  );
};

export default ApprovalsPage;
