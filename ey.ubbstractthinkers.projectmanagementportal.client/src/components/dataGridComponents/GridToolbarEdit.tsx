import Tooltip from "@mui/material/Tooltip";
import {
  type GridRowModesModel,
  type GridSlotProps,
  GridRowModes,
  ToolbarButton,
  Toolbar,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DefaultTask } from "@models/ProjectTask";
import type { DataGridRow } from "../../pages/projects/projectPage/ProjectTasksPage";
import { v4 as uuidv4 } from "uuid";
import type { Dispatch, SetStateAction } from "react";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: Dispatch<SetStateAction<DataGridRow[]>>;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

const GridToolbarEdit = (props: GridSlotProps["toolbar"]) => {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuidv4();
    setRows((oldRows) => [
      ...oldRows,
      { uid: id, ...DefaultTask, isNew: true } as DataGridRow,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  return (
    <Toolbar>
      <Tooltip title="Add record">
        <ToolbarButton onClick={handleClick}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
};

export default GridToolbarEdit;
