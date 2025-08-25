import type { User } from "@models/Auth";
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useGridApiContext, type GridRenderCellParams } from "@mui/x-data-grid";
import styles from "./GridEditResourceCell.module.css";
import { useState } from "react";
import UserAvatar from "../avatar/UserAvatar";

interface GridEditResourceCell extends GridRenderCellParams {
  resources: User[];
}

const GridEditResourceCell = (props: GridEditResourceCell) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    props.value ? props.value : "",
  );
  const apiRef = useGridApiContext();

  const handleChange = async (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    await apiRef.current.setEditCellValue({
      id: props.id,
      field: props.field,
      value: newValue,
    });
  };

  return (
    <FormControl required className={styles.formControl}>
      <Select
        id="resource_select"
        value={selectedValue}
        onChange={handleChange}
        className={styles.gridEditResourceCellSelect}
      >
        <MenuItem value="">No resource selected</MenuItem>
        {props.resources.map((user) => (
          <MenuItem key={user.id} value={user.id!}>
            <UserAvatar user={user} />
            <span className={styles.spanEmail}>{user.email}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GridEditResourceCell;
