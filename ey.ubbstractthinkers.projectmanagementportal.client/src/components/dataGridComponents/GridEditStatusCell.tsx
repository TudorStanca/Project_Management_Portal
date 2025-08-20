import { getTaskStatusValue, type TaskStatus } from "@models/TaskStatus";
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useGridApiContext, type GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import styles from "./GridEditStatusCell.module.css";

interface GridEditStatusProps extends GridRenderCellParams {
  options: TaskStatus[];
}

const GridEditStatusCell = (props: GridEditStatusProps) => {
  const apiRef = useGridApiContext();
  const [selectedValue, setSelectedValue] = useState<TaskStatus>(
    props.value ? props.value : "",
  );

  const handleChange = (event: SelectChangeEvent<TaskStatus>) => {
    const newValue = Number(event.target.value) as TaskStatus;
    setSelectedValue(newValue);

    apiRef.current.setEditCellValue({
      id: props.id,
      field: props.field,
      value: newValue,
    });
  };

  return (
    <FormControl required className={styles.formControl}>
      <Select
        id="status_select"
        value={selectedValue}
        onChange={handleChange}
        className={styles.statusSelect}
      >
        {props.options.map((status) => (
          <MenuItem key={status} value={status}>
            {getTaskStatusValue(status)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GridEditStatusCell;
