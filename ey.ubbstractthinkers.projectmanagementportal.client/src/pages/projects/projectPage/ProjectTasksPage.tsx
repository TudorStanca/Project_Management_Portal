import { Box, CircularProgress, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import styles from "./ProjectTasksPage.module.css";
import ProjectNavBar from "../../../components/layout/projectNavBar/ProjectNavBar";
import { useEffect, useMemo, useState } from "react";
import StageStepper from "../../../components/stepper/StageStepper";
import { DefaultProject, type Project } from "@models/Project";
import { getProject, getTasksForProject } from "@services/ProjectClient";
import { handleApiError } from "@services/ErrorHandler";
import { type ProjectTask } from "@models/ProjectTask";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  type GridColDef,
  type GridEventListener,
  type GridRenderCellParams,
  type GridRowId,
  type GridRowModesModel,
} from "@mui/x-data-grid";
import GridCellExpand from "../../../components/dataGridComponents/GridCellExpand";
import {
  Blocked,
  Done,
  getTaskStatusValue,
  InProgress,
  NotStarted,
  type TaskStatus,
} from "@models/TaskStatus";
import type { Dayjs } from "dayjs";
import {
  formatDayjsToJsonString,
  formatDayjsToString,
} from "../../../utils/DateFunctions";
import { getUsers } from "@services/AuthClient";
import { type User } from "@models/Auth";
import RenderAvatar from "../../../components/dataGridComponents/RenderAvatar";
import GridEditDateCell from "../../../components/dataGridComponents/GridEditDateCell";
import dayjs from "dayjs";
import GridEditResourceCell from "../../../components/dataGridComponents/GridEditResourceCell";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import GridToolbarEdit from "../../../components/dataGridComponents/GridToolbarEdit";
import GridEditStatusCell from "../../../components/dataGridComponents/GridEditStatusCell";
import { deleteTask, saveTask, updateTask } from "@services/TaskClient";
import CustomSnackbar from "../../../components/snackbar/CustomSnackbar";
import useSnackbar from "../../../hooks/useSnackbar";
import BoxContent from "../../../components/layout/background/BoxContent";

interface ProjectTasksPageProps {
  open: boolean;
}

export interface DataGridRow extends ProjectTask {
  isNew: boolean;
}

const ProjectTasksPage = (props: ProjectTasksPageProps) => {
  const { projectId } = useParams();

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [project, setProject] = useState<Project>(DefaultProject);
  const [rows, setRows] = useState<DataGridRow[]>([]);
  const [resources, setResources] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const resourceMapper: { [id: string]: User } = useMemo(() => {
    return Object.fromEntries(resources.map((x) => [x.id, x]));
  }, [resources]);

  useEffect(() => {
    setIsLoading(true);

    const fetchAll = async () => {
      try {
        const [project, tasks, users] = await Promise.all([
          getProject(projectId!),
          getTasksForProject(projectId!),
          getUsers(),
        ]);

        setProject(project);
        setRows(
          tasks.map((x) => {
            return { ...x, isNew: false } as DataGridRow;
          }),
        );

        const filteredResources = users.filter((x) =>
          project.resourceIds.includes(x.id!),
        );
        setResources([...filteredResources]);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [projectId]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await deleteTask(id as string);

      showSnackbar("Task deleted successfully.", "success");
      setRows(rows.filter((row) => row.uid !== id));
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.uid === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.uid !== id));
    }
  };

  const processRowUpdate = async (newRow: DataGridRow) => {
    const rowTask: ProjectTask = {
      uid: newRow.uid,
      name: newRow.name,
      description: newRow.description ?? "",
      startDate: formatDayjsToJsonString(newRow.startDate),
      endDate: newRow.endDate ? formatDayjsToJsonString(newRow.endDate) : null,
      status: newRow.status,
      projectUid: projectId!,
      resourceId: newRow.resourceId === "" ? null : newRow.resourceId,
    } as ProjectTask;

    if (newRow.isNew) {
      const { uid: _, ...taskWithoutId } = rowTask;
      const savedTask = await saveTask(taskWithoutId);
      const newId = savedTask.uid;

      showSnackbar("Task added successfully.", "success");

      const updatedRow = {
        ...newRow,
        uid: newId,
        isNew: false,
      } as DataGridRow;
      setRows(rows.map((row) => (row.uid === newRow.uid ? updatedRow : row)));

      return updatedRow;
    }

    await updateTask(rowTask);

    showSnackbar("Task updated successfully.", "success");

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.uid === newRow.uid ? updatedRow : row)));

    return updatedRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    showSnackbar(handleApiError(error), "error");
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const renderCellExpand = (
    params: GridRenderCellParams<ProjectTask, string>,
  ) => {
    return (
      <GridCellExpand
        value={params.value || ""}
        width={params.colDef.computedWidth}
      />
    );
  };

  const renderCellResourceAvatar = (params: GridRenderCellParams) => {
    if (params.value === null || params.value === "") {
      return "";
    }

    const user = resourceMapper[params.value as string];

    return (
      <Tooltip title={user.email}>
        <span className={styles.resourceCellSpan}>
          <RenderAvatar value={user} />
        </span>
      </Tooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      type: "string",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderCell: renderCellExpand,
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderCell: renderCellExpand,
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      flex: 1,
      minWidth: 150,
      renderEditCell: (params) => {
        return (
          <GridEditStatusCell
            {...params}
            options={[NotStarted, InProgress, Done, Blocked]}
          />
        );
      },
      editable: true,
      valueFormatter: (value: TaskStatus) => value && getTaskStatusValue(value),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      minWidth: 150,
      renderEditCell: (params) => {
        return <GridEditDateCell {...params} />;
      },
      editable: true,
      valueGetter: (value: Dayjs | string) => {
        if (typeof value === "string") {
          return dayjs(value);
        }

        return value;
      },
      valueFormatter: (value: Dayjs) => {
        if (value) {
          return formatDayjsToString(value);
        }
        return "";
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      minWidth: 150,
      renderEditCell: (params) => {
        return <GridEditDateCell {...params} />;
      },
      editable: true,
      valueGetter: (value: Dayjs | string) => {
        if (typeof value === "string") {
          return dayjs(value);
        }

        return value;
      },
      valueFormatter: (value: Dayjs) => {
        if (value) {
          return formatDayjsToString(value);
        }
        return "";
      },
    },
    {
      field: "resourceId",
      headerName: "Assigned Resource",
      display: "flex",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellResourceAvatar,
      renderEditCell: (params) => {
        return <GridEditResourceCell {...params} resources={resources} />;
      },
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 150,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  return (
    <BoxContent
      isOpen={props.open}
      pageName={`${project.name}'s Tasks`}
      className={styles.projectBoxContent}
    >
      <ProjectNavBar projectUid={projectId!} activeLink="tasks"></ProjectNavBar>
      {isLoading ? (
        <Box className={styles.projectsMessageBox}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StageStepper project={project} />
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row: DataGridRow) => row.uid!}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            className={styles.projectTasksDataGridContainer}
            slots={{ toolbar: GridToolbarEdit }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            showToolbar
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
          />
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

export default ProjectTasksPage;
