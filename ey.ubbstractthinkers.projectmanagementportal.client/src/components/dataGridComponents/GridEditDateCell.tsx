import {
  useGridApiContext,
  type GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import type { ProjectTask } from "@models/ProjectTask";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function GridEditDateCell(
  props: GridRenderEditCellParams<ProjectTask, Dayjs | null, string>,
) {
  const apiRef = useGridApiContext();

  const handleChange = (newValue: Dayjs | null) => {
    apiRef.current.setEditCellValue({
      id: props.id,
      field: props.field,
      value: newValue,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <DatePicker
        value={props.value}
        onChange={handleChange}
        slotProps={{
          textField: {
            variant: "standard",
            fullWidth: true,
            sx: {
              padding: "0 9px",
              justifyContent: "center",
            },
            InputProps: {
              disableUnderline: true,
              sx: { fontSize: "inherit" },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default GridEditDateCell;
