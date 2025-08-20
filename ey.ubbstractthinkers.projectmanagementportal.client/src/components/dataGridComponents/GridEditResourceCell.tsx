import type { User } from "@models/Auth";
import {
  Avatar,
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useGridApiContext, type GridRenderCellParams } from "@mui/x-data-grid";
import styles from "./GridEditResourceCell.module.css";
import LetterAvatar from "../../components/avatar/LetterAvatar";
import { useState } from "react";

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
      >
        <MenuItem value="">No resource selected</MenuItem>
        {props.resources.map((user) => (
          <MenuItem key={user.id} value={user.id!}>
            <div className={styles.addProjectAvatarDiv}>
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
            <span className={styles.addProjectSpanEmail}>{user.email}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GridEditResourceCell;
